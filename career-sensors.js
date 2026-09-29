// === ADAPTIQ SENSORS MODULE === //

// ─── SignalBuffer ────────────────────────────────────────────────────────────
class SignalBuffer {
  constructor(windowSize = 60) {
    this._size = windowSize;
    this._buf = [];
  }

  push(value) {
    this._buf.push(value);
    if (this._buf.length > this._size) this._buf.shift();
  }

  values() { return [...this._buf]; }

  mean() {
    if (!this._buf.length) return 0;
    return this._buf.reduce((a, b) => a + b, 0) / this._buf.length;
  }

  stddev() {
    if (this._buf.length < 2) return 0;
    const m = this.mean();
    const variance = this._buf.reduce((sum, v) => sum + (v - m) ** 2, 0) / this._buf.length;
    return Math.sqrt(variance);
  }

  zScore(currentValue) {
    const sd = this.stddev();
    if (sd === 0) return 0;
    return (currentValue - this.mean()) / sd;
  }
}

window.SignalBuffer = SignalBuffer;

// ─── FaceEngine ──────────────────────────────────────────────────────────────
const FaceEngine = (() => {
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

  let videoEl = null;
  let running = false;
  let rafId = null;
  let latest = {};

  const etBuf  = new SignalBuffer(60);
  const hpdBuf = new SignalBuffer(60);
  const braBuf = new SignalBuffer(60);

  let blinkCount = 0;
  let blinkTimestamps = [];
  let earBelow = 0;
  // Blink threshold adapts to the user's own open-eye EAR (glasses, narrow
  // eyes, and lighting shift the absolute EAR; a fixed 0.23 misfires)
  let earThreshold = 0.23;
  let openEyeEars = [];
  const BLINK_MIN_FRAMES = 2;
  let pitchBaseline = null;
  let pitchSamples = [];
  let sessionStartTime = null;

  function dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  function eyeAspectRatio(pts) {
    const vertical1 = dist(pts[1], pts[5]);
    const vertical2 = dist(pts[2], pts[4]);
    const horizontal = dist(pts[0], pts[3]);
    return (vertical1 + vertical2) / (2 * horizontal);
  }

  function computeET(expressions) {
    // Only negative emotions signal tension — happy/surprised are not stress indicators
    const raw = Math.min(100, ((expressions?.angry ?? 0) + (expressions?.fearful ?? 0) +
                               (expressions?.disgusted ?? 0) + (expressions?.sad ?? 0)) * 100);
    etBuf.push(raw);
    return Math.round(etBuf.mean());
  }

  function computeHPD(landmarks) {
    try {
      const pts = landmarks.positions;
      const noseTip   = pts[30];
      const leftEdge  = pts[0];
      const rightEdge = pts[16];

      const noseToLeft  = dist(noseTip, leftEdge);
      const noseToRight = dist(noseTip, rightEdge);
      const yawRatio = noseToLeft / (noseToRight + 1e-6);
      const yaw = Math.abs(yawRatio - 1) * 100;

      const leftEye  = pts[36];
      const rightEye = pts[45];
      const eyeMidY  = (leftEye.y + rightEye.y) / 2;
      const eyeSpan  = dist(leftEye, rightEye);
      const rawPitch = (noseTip.y - eyeMidY) / (eyeSpan + 1e-6) * 100;

      // Calibrate pitch baseline from first 30 frames so neutral pose reads 0.
      // Median, not mean — robust to the user moving during the first seconds.
      if (pitchSamples.length < 30) {
        pitchSamples.push(rawPitch);
        pitchBaseline = window.MetricsMath.median(pitchSamples);
      }
      const pitch = Math.abs(rawPitch - (pitchBaseline ?? rawPitch));

      const raw = Math.min(100, Math.sqrt(yaw ** 2 + pitch ** 2));
      hpdBuf.push(raw);
      return Math.round(hpdBuf.mean());
    } catch {
      return 0;
    }
  }

  function computeBRA(landmarks) {
    try {
      const pts = landmarks.positions;
      const leftEyePts  = [pts[36], pts[37], pts[38], pts[39], pts[40], pts[41]];
      const rightEyePts = [pts[42], pts[43], pts[44], pts[45], pts[46], pts[47]];
      const ear = (eyeAspectRatio(leftEyePts) + eyeAspectRatio(rightEyePts)) / 2;

      if (ear < earThreshold) {
        earBelow++;
      } else {
        if (earBelow >= BLINK_MIN_FRAMES) {
          blinkTimestamps.push(Date.now());
        }
        earBelow = 0;
        // Track open-eye EAR distribution and adapt the blink threshold to it
        openEyeEars.push(ear);
        if (openEyeEars.length > 120) openEyeEars.shift();
        earThreshold = window.MetricsMath.adaptiveEarThreshold(openEyeEars);
      }

      const now = Date.now();
      blinkTimestamps = blinkTimestamps.filter(t => now - t < 60000);

      // Normalize by elapsed time so BRA doesn't spike for the first 60s of a session
      const elapsedSecs = sessionStartTime ? (now - sessionStartTime) / 1000 : 60;
      const windowSecs  = Math.min(60, Math.max(elapsedSecs, 10));
      const blinksPerMin = (blinkTimestamps.length / windowSecs) * 60;

      const raw = Math.min(100, Math.abs(blinksPerMin - 17) / 17 * 100);
      braBuf.push(raw);
      return Math.round(braBuf.mean());
    } catch {
      return 0;
    }
  }

  const zero = () => ({ et: 0, hpd: 0, bra: 0, landmarks: null, expressions: null, bbox: null });

  async function init(video) {
    videoEl = video;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    Bus.emit('models:loaded', {});
  }

  function _loop() {
    if (!running) return;
    rafId = requestAnimationFrame(async () => {
      try {
        const detection = await faceapi
          .detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (!detection) {
          latest = zero();
          Bus.emit('signal:face', latest);
        } else {
          const et  = computeET(detection.expressions);
          const hpd = computeHPD(detection.landmarks);
          const bra = computeBRA(detection.landmarks);
          const bbox = detection.detection.box;
          latest = { et, hpd, bra, landmarks: detection.landmarks, expressions: detection.expressions, bbox };
          Bus.emit('signal:face', latest);
        }
      } catch (err) {
        console.warn('[FaceEngine] frame error:', err);
      }
      _loop();
    });
  }

  function start() { running = true; sessionStartTime = Date.now(); pitchBaseline = null; pitchSamples = []; _loop(); }
  function stop()  { running = false; if (rafId) cancelAnimationFrame(rafId); }
  function getLatest() { return latest; }

  return { init, start, stop, getLatest };
})();

window.FaceEngine = FaceEngine;

// ─── GazeEngine ──────────────────────────────────────────────────────────────
const GazeEngine = (() => {
  let faceMesh = null;
  let videoEl  = null;
  let loopId   = null;
  let running  = false;
  let latest   = { gds: 0, osr: 0, x: 0, y: 0 };

  let baseline     = null;
  let calibrating  = false;
  let calibSamples = [];
  let calibMap     = [];
  let calibScaleX  = null;
  let calibScaleY  = null;
  let calibrationCallback = null;

  const xBuf = new SignalBuffer(30);
  const yBuf = new SignalBuffer(30);
  const gazeHistory = [];

  // 1D Kalman filter — smooths MediaPipe iris-landmark micro-jitter before
  // it reaches GDS, so GDS reflects real gaze drift rather than tracking noise.
  function makeKalman1D(processNoise = 0.01, measurementNoise = 4) {
    let estimate = null;
    let covariance = 1;
    return function filter(measurement) {
      if (estimate === null) { estimate = measurement; return estimate; }
      covariance += processNoise;
      const gain = covariance / (covariance + measurementNoise);
      estimate += gain * (measurement - estimate);
      covariance *= (1 - gain);
      return estimate;
    };
  }
  let kalmanX = makeKalman1D();
  let kalmanY = makeKalman1D();

  const L_IRIS = 468, R_IRIS = 473;
  const L_OUTER = 33,  L_INNER = 133, L_TOP = 159, L_BOT = 145;
  const R_INNER = 362, R_OUTER = 263, R_TOP = 386, R_BOT = 374;
  // Head-pose reference landmarks for gaze compensation
  const NOSE_TIP = 1, FACE_L = 234, FACE_R = 454, FOREHEAD = 10, CHIN = 152;

  let headCalibSamples = []; // head ratios collected during calibration

  function _irisRatio(lm) {
    const lx = (lm[L_IRIS].x - lm[L_OUTER].x) / (lm[L_INNER].x - lm[L_OUTER].x + 1e-6);
    const ly = (lm[L_IRIS].y - lm[L_TOP].y)   / (lm[L_BOT].y   - lm[L_TOP].y   + 1e-6);
    const rx = (lm[R_IRIS].x - lm[R_INNER].x) / (lm[R_OUTER].x - lm[R_INNER].x + 1e-6);
    const ry = (lm[R_IRIS].y - lm[R_TOP].y)   / (lm[R_BOT].y   - lm[R_TOP].y   + 1e-6);
    return { avgX: (lx + rx) / 2, avgY: (ly + ry) / 2 };
  }

  // Normalised nose position within the face box: 0.5/0.5 when facing the
  // camera; moves with head yaw (x) and pitch (y).
  function _headRatio(lm) {
    const hx = (lm[NOSE_TIP].x - lm[FACE_L].x)   / (lm[FACE_R].x - lm[FACE_L].x   + 1e-6);
    const hy = (lm[NOSE_TIP].y - lm[FOREHEAD].y) / (lm[CHIN].y   - lm[FOREHEAD].y + 1e-6);
    return { x: hx, y: hy };
  }

  function _irisToScreen(iris, head) {
    if (!baseline) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const MM = window.MetricsMath;
    // Gaze ≈ head rotation + eye-in-head: when the head turns but the eyes
    // counter-rotate to stay on screen, the two cancel instead of reading as
    // "looking away".
    const headDx = (head && baseline.headX != null) ? head.x - baseline.headX : 0;
    const headDy = (head && baseline.headY != null) ? head.y - baseline.headY : 0;
    const dx = MM.compensateGaze(iris.avgX - baseline.avgX, headDx, 0.6);
    const dy = MM.compensateGaze(iris.avgY - baseline.avgY, headDy, 0.4);
    const scX = calibScaleX ?? (window.innerWidth  / 0.3);
    const scY = calibScaleY ?? (window.innerHeight / 0.3);
    const sx = window.innerWidth  / 2 + dx * scX;
    const sy = window.innerHeight / 2 + dy * scY;
    return {
      x: Math.max(0, Math.min(window.innerWidth,  sx)),
      y: Math.max(0, Math.min(window.innerHeight, sy)),
    };
  }

  function _onResults(results) {
    if (!results.multiFaceLandmarks?.length) return;
    const lm = results.multiFaceLandmarks[0];
    if (!lm[L_IRIS] || !lm[R_IRIS]) return;

    const iris = _irisRatio(lm);
    const head = _headRatio(lm);

    if (calibrating) {
      headCalibSamples.push(head);
      if (calibrationCallback) calibrationCallback(iris);
      else calibSamples.push(iris);
      return;
    }

    if (!running || !baseline) return; // no real calibration baseline — skip tracking

    const raw = _irisToScreen(iris, head);
    const x = kalmanX(raw.x);
    const y = kalmanY(raw.y);
    xBuf.push(x);
    yBuf.push(y);

    const diag = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    const gds  = Math.min(100,
      Math.sqrt(xBuf.stddev() ** 2 + yBuf.stddev() ** 2) / diag * 100
    );

    gazeHistory.push({ x, y });
    if (gazeHistory.length > 60) gazeHistory.shift();

    const mX = window.innerWidth  * 0.2;
    const mY = window.innerHeight * 0.2;
    const outside = gazeHistory.filter(p =>
      p.x < mX || p.x > window.innerWidth  - mX ||
      p.y < mY || p.y > window.innerHeight - mY
    ).length;
    const osr = (outside / gazeHistory.length) * 100;

    latest = { gds: Math.round(gds), osr: Math.round(osr), x, y };
    Bus.emit('signal:gaze', latest);
  }

  async function init(video) {
    videoEl = video;

    if (typeof FaceMesh === 'undefined') {
      console.warn('[GazeEngine] MediaPipe FaceMesh not loaded — gaze disabled');
      return;
    }

    faceMesh = new FaceMesh({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(_onResults);
    await faceMesh.initialize();

    loopId = setInterval(async () => {
      if (videoEl.readyState >= 2) {
        try { await faceMesh.send({ image: videoEl }); }
        catch (e) { console.warn('[GazeEngine] send error:', e); }
      }
    }, 100);
  }

  // Multi-point gaze calibration with a full-screen overlay.
  // Dots span the full viewport so scale estimation is accurate.
  // screenFracPoints: [{x,y}] as viewport fractions (0–1).
  function startMultiPointCalibration(screenFracPoints) {
    return new Promise((resolve) => {
      calibrating = true;
      calibMap    = [];
      headCalibSamples = [];
      kalmanX = makeKalman1D();
      kalmanY = makeKalman1D();
      let pointIndex  = 0;
      let rawHistory  = [];   // last SMOOTH_N raw iris frames for smoothing
      let stableSamples = []; // smoothed frames accumulated during fixation

      const SMOOTH_N         = 5;    // rolling average window for noise reduction
      const STABILITY_THRESH = 0.04; // per-axis tolerance after smoothing (~2× natural tremor)
      const REQUIRED_STABLE  = 15;   // ~1.5s at 10fps before point advances

      // ── Full-screen overlay ──
      const CIRC = 2 * Math.PI * 22;
      const svgNS = 'http://www.w3.org/2000/svg';

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9998;background:rgba(5,8,16,0.96);pointer-events:none;
      `;

      const ring = document.createElement('div');
      ring.style.cssText = `
        position:absolute;width:54px;height:54px;margin:-27px 0 0 -27px;
        border-radius:50%;border:1px solid rgba(0,229,255,0.18);
      `;

      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width','54'); svg.setAttribute('height','54');
      svg.style.cssText = `position:absolute;width:54px;height:54px;margin:-27px 0 0 -27px;
        transform:rotate(-90deg);`;
      const arc = document.createElementNS(svgNS, 'circle');
      arc.setAttribute('cx','27'); arc.setAttribute('cy','27'); arc.setAttribute('r','22');
      arc.setAttribute('fill','none'); arc.setAttribute('stroke','#00e5ff');
      arc.setAttribute('stroke-width','2.5');
      arc.setAttribute('stroke-dasharray', CIRC);
      arc.setAttribute('stroke-dashoffset', CIRC);
      svg.appendChild(arc);

      const dot = document.createElement('div');
      dot.style.cssText = `
        position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;
        border-radius:50%;background:#00e5ff;
        box-shadow:0 0 14px #00e5ff,0 0 28px rgba(0,229,255,0.4);
        transition:left 0.45s cubic-bezier(.4,0,.2,1),top 0.45s cubic-bezier(.4,0,.2,1);
      `;

      const lbl = document.createElement('p');
      lbl.style.cssText = `
        position:fixed;bottom:12%;left:50%;transform:translateX(-50%);
        color:#e4e4e7;font-family:monospace;font-size:1rem;text-align:center;
        text-shadow:0 0 8px rgba(0,229,255,0.4);pointer-events:none;
      `;
      lbl.textContent = 'Look at the dot — hold still until the ring fills';

      const ctr = document.createElement('p');
      ctr.style.cssText = `
        position:fixed;bottom:calc(12% - 26px);left:50%;transform:translateX(-50%);
        color:#6b7280;font-family:monospace;font-size:0.82rem;pointer-events:none;
      `;
      ctr.textContent = `Point 1 / ${screenFracPoints.length}`;

      overlay.append(ring, svg, dot, lbl, ctr);
      document.body.appendChild(overlay);

      function moveDot(frac) {
        const x = frac.x * window.innerWidth;
        const y = frac.y * window.innerHeight;
        [dot, ring, svg].forEach(el => {
          el.style.left = x + 'px';
          el.style.top  = y + 'px';
        });
        arc.setAttribute('stroke-dashoffset', CIRC);
      }
      moveDot(screenFracPoints[0]);

      function finish() {
        calibrating = false;
        calibrationCallback = null;
        clearTimeout(timeoutId);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        _buildCalibration();
        _applyHeadBaseline();
        Bus.emit('calibration:complete', { type: 'gaze' });
        resolve(calibMap);
      }

      // 30s safety timeout in case camera is off or face never detected
      const timeoutId = setTimeout(finish, 30000);

      calibrationCallback = (iris) => {
        // Smooth with rolling average to suppress sub-pixel landmark jitter
        rawHistory.push(iris);
        if (rawHistory.length > SMOOTH_N) rawHistory.shift();
        const smoothed = {
          avgX: rawHistory.reduce((s, v) => s + v.avgX, 0) / rawHistory.length,
          avgY: rawHistory.reduce((s, v) => s + v.avgY, 0) / rawHistory.length,
        };

        // Compare smoothed to mean of stable buffer (not consecutive frames)
        let isStable = true;
        if (stableSamples.length > 0) {
          const mX = stableSamples.reduce((s, v) => s + v.avgX, 0) / stableSamples.length;
          const mY = stableSamples.reduce((s, v) => s + v.avgY, 0) / stableSamples.length;
          isStable = Math.abs(smoothed.avgX - mX) < STABILITY_THRESH &&
                     Math.abs(smoothed.avgY - mY) < STABILITY_THRESH;
        }

        if (isStable) {
          stableSamples.push(smoothed);
        } else {
          stableSamples = [];
          rawHistory    = [];
        }

        const progress = Math.min(1, stableSamples.length / REQUIRED_STABLE);
        arc.setAttribute('stroke-dashoffset', CIRC * (1 - progress));
        // Change arc colour near completion
        arc.setAttribute('stroke', progress > 0.85 ? '#00ff88' : '#00e5ff');
        Bus.emit('gaze:calibration:progress', { pointIndex, progress });

        if (stableSamples.length >= REQUIRED_STABLE) {
          const avgX = stableSamples.reduce((s, v) => s + v.avgX, 0) / stableSamples.length;
          const avgY = stableSamples.reduce((s, v) => s + v.avgY, 0) / stableSamples.length;
          calibMap.push({ iris: { avgX, avgY }, screen: screenFracPoints[pointIndex] });
          stableSamples = [];
          rawHistory    = [];
          pointIndex++;

          if (pointIndex >= screenFracPoints.length) {
            finish();
          } else {
            Bus.emit('gaze:calibration:next', { pointIndex });
            ctr.textContent = `Point ${pointIndex + 1} / ${screenFracPoints.length}`;
            arc.setAttribute('stroke', '#00e5ff');
            // Brief pause (dot transition animation) before activating next point
            setTimeout(() => moveDot(screenFracPoints[pointIndex]), 450);
          }
        }
      };
    });
  }

  // Build baseline + calibrated scale from collected points.
  // Scale is only accepted when within 30%–300% of the default (sanity guard).
  // Median head ratio from calibration — becomes the "facing the camera" reference
  function _applyHeadBaseline() {
    if (!baseline || headCalibSamples.length < 5) return;
    const MM = window.MetricsMath;
    baseline.headX = MM.median(headCalibSamples.map(s => s.x));
    baseline.headY = MM.median(headCalibSamples.map(s => s.y));
  }

  function _buildCalibration() {
    if (!calibMap.length) { baseline = null; return; }

    // Use point nearest screen center as baseline ("straight ahead")
    const centerPt = calibMap.reduce((best, p) => {
      const d  = Math.abs(p.screen.x - 0.5) + Math.abs(p.screen.y - 0.5);
      const bd = Math.abs(best.screen.x - 0.5) + Math.abs(best.screen.y - 0.5);
      return d < bd ? p : best;
    }, calibMap[0]);
    baseline = centerPt.iris;

    if (calibMap.length < 3) return; // not enough points for scale estimation

    const xScales = [], yScales = [];
    calibMap.forEach(p => {
      const idx = p.iris.avgX - baseline.avgX;
      const idy = p.iris.avgY - baseline.avgY;
      const sdx = (p.screen.x - 0.5) * window.innerWidth;
      const sdy = (p.screen.y - 0.5) * window.innerHeight;
      if (Math.abs(idx) > 0.005) xScales.push(sdx / idx);
      if (Math.abs(idy) > 0.005) yScales.push(sdy / idy);
    });

    const defX = window.innerWidth  / 0.3;
    const defY = window.innerHeight / 0.3;

    if (xScales.length) {
      const c = xScales.reduce((a, b) => a + b) / xScales.length;
      if (c > defX * 0.3 && c < defX * 3) calibScaleX = c;
    }
    if (yScales.length) {
      const c = yScales.reduce((a, b) => a + b) / yScales.length;
      if (c > defY * 0.3 && c < defY * 3) calibScaleY = c;
    }
  }

  function startCalibration() {
    return new Promise((resolve) => {
      calibrating = true;
      calibSamples = [];
      headCalibSamples = [];
      calibrationCallback = null;
      kalmanX = makeKalman1D();
      kalmanY = makeKalman1D();
      setTimeout(() => {
        calibrating = false;
        if (calibSamples.length > 5) {
          baseline = {
            avgX: calibSamples.reduce((s, v) => s + v.avgX, 0) / calibSamples.length,
            avgY: calibSamples.reduce((s, v) => s + v.avgY, 0) / calibSamples.length,
          };
        } else {
          baseline = null; // Missing calibration must never be reported as measured gaze.
        }
        _applyHeadBaseline();
        Bus.emit('calibration:complete', { type: 'gaze' });
        resolve();
      }, 2000);
    });
  }

  function start() { running = true; }
  function pause() { running = false; }
  function stop()  {
    running = false;
    if (loopId) { clearInterval(loopId); loopId = null; }
  }
  function getLatest() { return latest; }

  function dispose() { stop(); if (faceMesh) { faceMesh.close(); faceMesh = null; } }
  return { init, startCalibration, startMultiPointCalibration, start, stop, pause, dispose, getLatest, hasCalibration: () => Boolean(baseline) };
})();

window.GazeEngine = GazeEngine;

// ─── AudioEngine ─────────────────────────────────────────────────────────────
const AudioEngine = (() => {
  let audioCtx = null;
  let analyser = null;
  let meydaAnalyzer = null;
  let recognition = null;
  let intervalId = null;
  let running = false;

  // Structured transcript: [{ timestamp, speaker, text, wpm }], one entry per
  // finalized speech-recognition result — replaces a single concatenated string
  // so downstream consumers (session report, live coach) get per-utterance timing.
  let transcript = [];
  let lastFinalTime = null;
  let wordTimestamps = [];

  const rmsBuf       = new SignalBuffer(30);
  const silenceWindows = [];

  let silenceThreshold = 0.01;
  let rmsHistory = [];        // rolling RMS samples for continuous threshold calibration
  let f0Samples = [];         // rolling voiced-frame fundamental frequencies (true pitch)
  let speakingWindows = [];   // rolling 60s of { speaking, time } for speaking-time WPM
  let srSupported = false;    // Web Speech API availability (false on Firefox)

  let latestFeatures = { rms: 0, spectralCentroid: 0 };
  let latest = { ves: 0, pvs: 0, silr: 0, sr: 0, wpm: null, transcript: '' };

  function _rmsFromAnalyser() {
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    const sum = buf.reduce((s, v) => s + v * v, 0);
    return Math.sqrt(sum / buf.length);
  }

  function _setupSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { srSupported = false; return; }
    srSupported = true;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const now = Date.now();
          const text = t.trim();
          const words = text.split(/\s+/).filter(Boolean).length;
          const elapsedSec = lastFinalTime ? Math.max(1, (now - lastFinalTime) / 1000) : Math.max(1, words / 2.25);
          const wpm = Math.round(words / (elapsedSec / 60));
          transcript.push({ timestamp: now, speaker: 'user', text, wpm });
          lastFinalTime = now;
          wordTimestamps.push({ words, time: now });
        }
      }
    };
    recognition.onerror = (e) => console.warn('[AudioEngine] SR error:', e.error);
    recognition.onend  = () => { if (running) recognition.start(); };
  }

  async function init(mediaStream) {
    // Use provided stream or request audio-only (for backward compatibility with test harness)
    const stream = mediaStream || (await navigator.mediaDevices.getUserMedia({ audio: true, video: false }));
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    try {
      meydaAnalyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioCtx,
        source,
        bufferSize: 2048,
        featureExtractors: ['rms', 'spectralCentroid', 'zcr'],
        callback: (features) => { latestFeatures = features; },
      });
    } catch (err) {
      console.warn('[AudioEngine] Meyda init failed, using fallback RMS:', err);
    }

    _setupSpeechRecognition();
  }

  function _computeSignals() {
    try {
      const MM = window.MetricsMath;
      const rms = (meydaAnalyzer && latestFeatures?.rms != null)
        ? latestFeatures.rms
        : _rmsFromAnalyser();

      rmsBuf.push(rms);

      // VES: upward spikes only — sudden quiet is not a vocal stress indicator
      const ves = Math.min(100, Math.max(0, rmsBuf.zScore(rms)) * 25);

      // Silence threshold: continuously recalibrated from the ambient floor
      // (10th percentile of recent RMS) — robust to the user talking at start.
      rmsHistory.push(rms);
      if (rmsHistory.length > 60) rmsHistory.shift(); // last 2 minutes
      silenceThreshold = MM.adaptiveSilenceThreshold(rmsHistory);

      const speaking = rms >= silenceThreshold;
      silenceWindows.push(!speaking);
      if (silenceWindows.length > 8) silenceWindows.shift(); // 8×2s = 16s window
      const silr = (silenceWindows.filter(Boolean).length / silenceWindows.length) * 100;

      // PVS: true pitch variability — f0 via autocorrelation on voiced frames
      // (replaces spectral centroid CV, which measured brightness, not pitch)
      if (speaking && analyser) {
        const buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);
        const f0 = MM.autocorrelatePitch(buf, audioCtx.sampleRate);
        if (f0 != null) {
          f0Samples.push(f0);
          if (f0Samples.length > 40) f0Samples.shift();
        }
      }
      const pvs = MM.pitchVariability(f0Samples);

      // SR: WPM over time actually spent SPEAKING, judged against a 110–160
      // comfortable band (pauses no longer read as slow speech; fast and slow
      // are penalised independently). Returns 0 until enough data exists.
      const now = Date.now();
      speakingWindows.push({ speaking, time: now });
      speakingWindows = speakingWindows.filter(e => now - e.time < 60000);
      const speakingSecs = speakingWindows.filter(e => e.speaking).length * 2;

      wordTimestamps = wordTimestamps.filter(e => now - e.time < 60000);
      const totalWords = wordTimestamps.reduce((s, e) => s + e.words, 0);
      const wpm = MM.computeWpm(totalWords, speakingSecs);
      const sr = srSupported ? MM.rateDeviation(wpm) : 0;

      latest = {
        ves: Math.round(ves),
        pvs: Math.round(pvs),
        silr: Math.round(silr),
        sr: Math.round(sr),
        wpm: wpm != null ? Math.round(wpm) : null,
        transcript: _flatTranscript(),
      };
      Bus.emit('signal:audio', latest);
    } catch (err) {
      console.warn('[AudioEngine] compute error:', err);
    }
  }

  function start() {
    running = true;
    if (meydaAnalyzer) meydaAnalyzer.start();
    if (recognition) { try { recognition.start(); } catch {} }
    intervalId = setInterval(_computeSignals, 2000);
  }

  function stop() {
    running = false;
    if (meydaAnalyzer) try { meydaAnalyzer.stop(); } catch {}
    if (recognition)   try { recognition.stop();   } catch {}
    if (intervalId)    clearInterval(intervalId);
  }

  function _flatTranscript() { return transcript.map(s => s.text).join(' '); }

  function getLatest()    { return latest; }
  function getTranscript(){ return _flatTranscript(); }
  function getTranscriptSegments() { return [...transcript]; }
  function hasSpeechRecognition() { return srSupported; }

  function reset() {
    transcript = [];
    lastFinalTime = null;
    wordTimestamps = [];
    silenceWindows.length = 0;
    rmsHistory = [];
    f0Samples = [];
    speakingWindows = [];
    silenceThreshold = 0.01;
  }

  function dispose() { stop(); if (audioCtx) { audioCtx.close(); audioCtx = null; } }
  return { init, start, stop, reset, dispose, getLatest, getTranscript, getTranscriptSegments, hasSpeechRecognition };
})();

window.AudioEngine = AudioEngine;

// ─── SensorManager ───────────────────────────────────────────────────────────
window.SensorManager = {
  async init(videoElement, mediaStream) {
    await FaceEngine.init(videoElement);
    await GazeEngine.init(videoElement);
    await AudioEngine.init(mediaStream);
  },
  startCalibration() { return GazeEngine.startCalibration(); },
  startMultiPointCalibration(pts) { return GazeEngine.startMultiPointCalibration(pts); },
  start() { FaceEngine.start(); GazeEngine.start(); AudioEngine.start(); },
  stop()  { FaceEngine.stop();  GazeEngine.pause();  AudioEngine.stop();  },
  dispose() { FaceEngine.stop(); GazeEngine.dispose(); AudioEngine.dispose(); },
};
  
