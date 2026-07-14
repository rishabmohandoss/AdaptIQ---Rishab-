// === ADAPTIQ METRICS MATH === //
// Pure functions shared by the sensor/scoring engines (index.html) and the
// Node unit tests (tests/metrics.test.js). No DOM, no browser APIs.

const MetricsMath = {

  clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },

  median(arr) {
    if (!arr || arr.length === 0) return 0;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  },

  percentile(arr, p) {
    if (!arr || arr.length === 0) return 0;
    const s = [...arr].sort((a, b) => a - b);
    const idx = MetricsMath.clamp((p / 100) * (s.length - 1), 0, s.length - 1);
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    return s[lo] + (s[hi] - s[lo]) * (idx - lo);
  },

  // ── Speech rate ──
  // WPM over time actually spent speaking (not wall-clock), so pauses between
  // answers don't read as "slow speech". Returns null until there is enough
  // speaking time to be meaningful.
  computeWpm(totalWords, speakingSecs) {
    if (!totalWords || speakingSecs < 5) return null;
    return totalWords / (speakingSecs / 60);
  },

  // Banded deviation: 0 inside the comfortable range, growing penalty outside.
  // null wpm (not enough data) is not penalised.
  rateDeviation(wpm, lo = 110, hi = 160) {
    if (wpm == null) return 0;
    if (wpm >= lo && wpm <= hi) return 0;
    const dev = wpm < lo ? (lo - wpm) / lo : (wpm - hi) / hi;
    return MetricsMath.clamp(Math.round(dev * 100), 0, 100);
  },

  // ── Pitch (true f0 via normalised autocorrelation) ──
  // Returns fundamental frequency in Hz, or null when the frame is too quiet
  // or not periodic enough (unvoiced/noise).
  autocorrelatePitch(buf, sampleRate, minHz = 70, maxHz = 350) {
    const n = buf.length;
    if (n < 256) return null;

    let energy = 0;
    for (let i = 0; i < n; i++) energy += buf[i] * buf[i];
    if (Math.sqrt(energy / n) < 0.01) return null; // too quiet to be voiced

    const minLag = Math.max(1, Math.floor(sampleRate / maxHz));
    const maxLag = Math.min(n - 1, Math.floor(sampleRate / minHz));
    if (minLag >= maxLag) return null;

    // Hann window tapers the frame edges before autocorrelation. Raw frame
    // boundaries are an abrupt discontinuity that otherwise leaks into the
    // correlation sum and destabilizes the winning lag frame-to-frame,
    // showing up as noise in PVS. Applied only here — the loudness gate
    // above intentionally uses the unwindowed buffer.
    const windowed = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const w = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
      windowed[i] = buf[i] * w;
    }

    const corrs = new Float64Array(maxLag + 2);
    let bestCorr = 0, bestLag = -1;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let num = 0, d1 = 0, d2 = 0;
      for (let i = 0; i < n - lag; i++) {
        num += windowed[i] * windowed[i + lag];
        d1  += windowed[i] * windowed[i];
        d2  += windowed[i + lag] * windowed[i + lag];
      }
      const c = num / Math.sqrt(d1 * d2 + 1e-12);
      corrs[lag] = c;
      if (c > bestCorr) { bestCorr = c; bestLag = lag; }
    }
    if (bestCorr < 0.5 || bestLag < 0) return null; // not periodic — unvoiced or noise

    // Octave correction: if an integer fraction of the winning lag correlates
    // (almost) as well, the winner was a subharmonic — take the shorter lag.
    let lag = bestLag;
    for (let k = 4; k >= 2; k--) {
      const cand = Math.round(bestLag / k);
      if (cand >= minLag && corrs[cand] >= bestCorr * 0.99) { lag = cand; break; }
    }

    // Parabolic interpolation around the peak for sub-sample lag precision
    const c0 = lag > minLag ? corrs[lag - 1] : corrs[lag];
    const c1 = corrs[lag];
    const c2 = lag < maxLag ? corrs[lag + 1] : corrs[lag];
    const denom = c0 - 2 * c1 + c2;
    const shift = denom !== 0 ? 0.5 * (c0 - c2) / denom : 0;
    return sampleRate / (lag + (Math.abs(shift) < 1 ? shift : 0));
  },

  // Coefficient of variation of voiced-frame f0 samples, as a 0-100 score.
  // ~0-8 monotone, ~10-25 natural speech, higher = large pitch swings.
  pitchVariability(f0Samples) {
    if (!f0Samples || f0Samples.length < 5) return 0;
    const mean = f0Samples.reduce((a, b) => a + b, 0) / f0Samples.length;
    if (mean <= 0) return 0;
    const sd = Math.sqrt(f0Samples.reduce((s, v) => s + (v - mean) ** 2, 0) / f0Samples.length);
    return MetricsMath.clamp(Math.round((sd / mean) * 100), 0, 100);
  },

  // ── Adaptive thresholds (continuously recalibrated, not first-N-samples) ──
  // Silence threshold from the 10th percentile of recent RMS (≈ ambient floor),
  // so talking during the first seconds no longer poisons the calibration.
  adaptiveSilenceThreshold(rmsSamples) {
    if (!rmsSamples || rmsSamples.length < 3) return 0.01;
    const floor = MetricsMath.percentile(rmsSamples, 10);
    return MetricsMath.clamp(floor * 2.5, 0.005, 0.02);
  },

  // Per-user blink threshold from the median open-eye EAR
  // (fixed 0.23 fails for narrow eyes, glasses, low light).
  adaptiveEarThreshold(openEyeEars) {
    if (!openEyeEars || openEyeEars.length < 20) return 0.23;
    return MetricsMath.clamp(0.72 * MetricsMath.median(openEyeEars), 0.15, 0.30);
  },

  // ── Gaze / head-pose compensation ──
  // Gaze direction ≈ head yaw + eye-in-head. The iris ratio only measures
  // eye-in-head, so a user who turns their head while keeping their eyes on
  // screen (eyes counter-rotate) used to read as "looking away".
  // noseDelta is the normalised nose position minus its calibration baseline;
  // k converts head rotation to equivalent iris-ratio units.
  compensateGaze(irisDelta, noseDelta, k = 0.6) {
    const correction = MetricsMath.clamp(k * (noseDelta || 0), -0.2, 0.2);
    return irisDelta + correction;
  },

  // ── Overall score ──
  // speechClarity may be null (speech recognition unavailable, e.g. Firefox);
  // the remaining weights are renormalised instead of awarding a free 100.
  overallScore({ eyeContact = 0, headStability = 0, vocalConfidence = 0, speechClarity = null }) {
    const parts = [
      [eyeContact,      0.25],
      [headStability,   0.20],
      [vocalConfidence, 0.25],
    ];
    if (speechClarity != null) parts.push([speechClarity, 0.30]);
    const wSum = parts.reduce((s, [, w]) => s + w, 0);
    const overall = MetricsMath.clamp(
      parts.reduce((s, [v, w]) => s + v * w, 0) / wSum, 0, 100);
    return { overall, grade: MetricsMath.gradeFor(overall) };
  },

  gradeFor(overall) {
    if (overall >= 85) return 'A';
    if (overall >= 70) return 'B';
    if (overall >= 55) return 'C';
    if (overall >= 40) return 'D';
    return 'F';
  },
};

if (typeof window !== 'undefined') window.MetricsMath = MetricsMath;
if (typeof module !== 'undefined' && module.exports) module.exports = MetricsMath;
