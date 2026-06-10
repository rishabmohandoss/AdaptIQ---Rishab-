// === ADAPTIQ METRICS VERIFICATION SUITE ===
// Runs with plain `node tests/metrics.test.js` — no dependencies.
// Tests the REAL production code: metrics-math.js is required directly, and
// the QuestionManager / InterviewScorecard blocks are extracted verbatim from
// index.html and executed in a sandboxed VM.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MM = require('../metrics-math.js');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}\n      ${e.message}`); }
}

// ───────────────────────────────────────────────────────────────
console.log('\n[1] Pitch detection (autocorrelation) — replaces fake "pitch" from spectral centroid');

function sine(freq, sampleRate = 48000, n = 2048, amp = 0.3) {
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = amp * Math.sin(2 * Math.PI * freq * i / sampleRate);
  return buf;
}

test('detects 150 Hz tone within 5%', () => {
  const f0 = MM.autocorrelatePitch(sine(150), 48000);
  assert(f0 !== null && Math.abs(f0 - 150) / 150 < 0.05, `got ${f0}`);
});

test('detects 220 Hz tone within 5%', () => {
  const f0 = MM.autocorrelatePitch(sine(220), 48000);
  assert(f0 !== null && Math.abs(f0 - 220) / 220 < 0.05, `got ${f0}`);
});

test('avoids octave error (does not report 75 Hz for a 150 Hz tone)', () => {
  const f0 = MM.autocorrelatePitch(sine(150), 48000);
  assert(f0 > 120, `got ${f0} — subharmonic picked`);
});

test('returns null for white noise (unvoiced)', () => {
  const buf = new Float32Array(2048);
  let seed = 42; // deterministic LCG noise
  for (let i = 0; i < 2048; i++) { seed = (seed * 1103515245 + 12345) % 2147483648; buf[i] = (seed / 2147483648 - 0.5) * 0.4; }
  assert.strictEqual(MM.autocorrelatePitch(buf, 48000), null);
});

test('returns null for silence', () => {
  assert.strictEqual(MM.autocorrelatePitch(new Float32Array(2048), 48000), null);
});

test('pitch variability: monotone < natural < erratic', () => {
  const monotone = Array(20).fill(120);                                   // robotic
  const natural  = Array.from({ length: 20 }, (_, i) => 120 + 18 * Math.sin(i)); // normal prosody
  const erratic  = Array.from({ length: 20 }, (_, i) => i % 2 ? 90 : 250);       // wild swings
  const m = MM.pitchVariability(monotone), n = MM.pitchVariability(natural), e = MM.pitchVariability(erratic);
  assert(m < n && n < e, `monotone=${m} natural=${n} erratic=${e}`);
  assert.strictEqual(m, 0);
});

// ───────────────────────────────────────────────────────────────
console.log('\n[2] Speech rate — pauses no longer punished as "slow speech"');

test('thinking pause after a good answer is NOT penalised', () => {
  // 50 words spoken in 20s of actual speaking (=150 WPM), then 40s of silence.
  // Old formula: |50-135|/135*100 = 63% penalty. New: 150 WPM is in band → 0.
  const wpm = MM.computeWpm(50, 20);
  assert(Math.abs(wpm - 150) < 1, `wpm=${wpm}`);
  assert.strictEqual(MM.rateDeviation(wpm), 0);
});

test('genuinely slow speech IS penalised', () => {
  const wpm = MM.computeWpm(20, 30); // 40 WPM
  assert(MM.rateDeviation(wpm) > 50, `dev=${MM.rateDeviation(wpm)}`);
});

test('racing speech IS penalised', () => {
  const wpm = MM.computeWpm(120, 30); // 240 WPM
  assert(MM.rateDeviation(wpm) >= 50, `dev=${MM.rateDeviation(wpm)}`);
});

test('comfortable band (110–160 WPM) scores zero deviation', () => {
  for (const wpm of [110, 135, 160]) assert.strictEqual(MM.rateDeviation(wpm), 0, `wpm=${wpm}`);
});

test('no data → no penalty (null wpm)', () => {
  assert.strictEqual(MM.computeWpm(0, 60), null);
  assert.strictEqual(MM.computeWpm(10, 3), null); // <5s speaking = insufficient
  assert.strictEqual(MM.rateDeviation(null), 0);
});

// ───────────────────────────────────────────────────────────────
console.log('\n[3] Adaptive calibration — talking at session start no longer poisons baselines');

test('silence threshold tracks ambient floor even when user talks from second 0', () => {
  // 70% speech windows (RMS .15-.25), 30% ambient (.004) — old code calibrated
  // from the FIRST 5 samples which here are all speech.
  const samples = [];
  for (let i = 0; i < 60; i++) samples.push(i % 10 < 7 ? 0.15 + (i % 3) * 0.05 : 0.004);
  const th = MM.adaptiveSilenceThreshold(samples);
  assert(th >= 0.005 && th <= 0.02, `threshold=${th} escaped clamps`);
  assert(th < 0.15, 'speech would be classified as silence');
  assert(th > 0.004, 'ambient noise would be classified as speech');
});

test('blink threshold adapts to narrow eyes (low open EAR)', () => {
  const narrowEyes = Array(50).fill(0.22); // open-eye EAR below the old fixed 0.23!
  const th = MM.adaptiveEarThreshold(narrowEyes);
  assert(th < 0.22, `threshold=${th} — every open-eye frame would count as a blink`);
  assert(Math.abs(th - 0.72 * 0.22) < 1e-9);
});

test('blink threshold adapts to wide eyes', () => {
  const wideEyes = Array(50).fill(0.38);
  const th = MM.adaptiveEarThreshold(wideEyes);
  assert(th > 0.23, `threshold=${th} — half-blinks would be missed`);
});

test('blink threshold stays at default until enough data, and clamps', () => {
  assert.strictEqual(MM.adaptiveEarThreshold([0.3, 0.3]), 0.23);
  assert.strictEqual(MM.adaptiveEarThreshold(Array(50).fill(0.05)), 0.15);
  assert.strictEqual(MM.adaptiveEarThreshold(Array(50).fill(0.9)), 0.30);
});

// ───────────────────────────────────────────────────────────────
console.log('\n[4] Gaze head-pose compensation — head turn with eyes on screen ≠ looking away');

test('head turns, eyes counter-rotate to stay on screen → reads as ON screen', () => {
  // Head yaw shifts nose ratio by -0.1; fixating eyes counter-rotate the iris
  // by ≈ k*0.1 the other way. Compensated gaze ≈ 0 (centre).
  const irisDelta = +0.06;   // eyes rotated right-in-head to hold the screen
  const noseDelta = -0.1;    // head turned left
  const out = MM.compensateGaze(irisDelta, noseDelta, 0.6);
  assert(Math.abs(out) < Math.abs(irisDelta), `|${out}| should shrink vs |${irisDelta}|`);
});

test('head turns AND eyes follow (truly looking away) → still reads as OFF screen', () => {
  const irisDelta = 0;       // eyes centred in head
  const noseDelta = -0.15;   // head turned away
  const out = MM.compensateGaze(irisDelta, noseDelta, 0.6);
  assert(Math.abs(out) > 0.05, `compensated=${out} — look-away was erased`);
});

test('correction is clamped (extreme head pose cannot explode coordinates)', () => {
  assert(Math.abs(MM.compensateGaze(0, 10, 0.6)) <= 0.2);
});

// ───────────────────────────────────────────────────────────────
console.log('\n[5] Overall score — Firefox "free perfect Speech Clarity" hole closed');

test('null clarity is excluded and weights renormalised (NOT treated as 100)', () => {
  const base = { eyeContact: 60, headStability: 60, vocalConfidence: 60 };
  const withNull = MM.overallScore({ ...base, speechClarity: null });
  assert.strictEqual(Math.round(withNull.overall), 60, `got ${withNull.overall}`);
  // Old behaviour was effectively clarity=100 → 0.25*60+0.20*60+0.25*60+0.30*100 = 72
  const oldBug = MM.overallScore({ ...base, speechClarity: 100 });
  assert(withNull.overall < oldBug.overall, 'null must not score like a perfect 100');
});

test('with clarity present, weights match the original formula', () => {
  const { overall } = MM.overallScore({ eyeContact: 80, headStability: 70, vocalConfidence: 60, speechClarity: 90 });
  assert(Math.abs(overall - (80 * .25 + 70 * .20 + 60 * .25 + 90 * .30)) < 1e-9);
});

test('grade boundaries', () => {
  assert.strictEqual(MM.gradeFor(85), 'A');
  assert.strictEqual(MM.gradeFor(84.9), 'B');
  assert.strictEqual(MM.gradeFor(55), 'C');
  assert.strictEqual(MM.gradeFor(40), 'D');
  assert.strictEqual(MM.gradeFor(39), 'F');
});

// ───────────────────────────────────────────────────────────────
console.log('\n[6] QuestionManager (real code from index.html) — arrow-key desync bug');

function makeBus() {
  const events = [];
  const handlers = {};
  return {
    events,
    on(name, fn) { (handlers[name] = handlers[name] || []).push(fn); },
    off() {},
    emit(name, data) { events.push({ name, data }); (handlers[name] || []).forEach(fn => fn(data)); },
  };
}

function fakeEl() {
  return {
    textContent: '', disabled: false, innerHTML: '',
    addEventListener() {}, classList: { contains: () => true, add() {}, remove() {} },
  };
}

function loadQuestionManager(Bus) {
  const m = html.match(/window\.QuestionManager = \(\(\) => \{[\s\S]*?\}\)\(\);/);
  assert(m, 'QuestionManager block not found in index.html');
  const docListeners = {};
  const sandbox = {
    window: {}, Bus, console,
    document: {
      getElementById: () => fakeEl(),
      addEventListener: (name, fn) => { docListeners[name] = fn; },
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(m[0], sandbox);
  return { qm: sandbox.window.QuestionManager, docListeners };
}

test('next() emits question:changed with the new index', () => {
  const Bus = makeBus();
  const { qm } = loadQuestionManager(Bus);
  qm.init();
  qm.next();
  const ev = Bus.events.filter(e => e.name === 'question:changed').pop();
  assert(ev && ev.data.index === 1, JSON.stringify(ev));
});

test('ARROW-KEY navigation also emits question:changed (the desync bug)', () => {
  const Bus = makeBus();
  const { qm, docListeners } = loadQuestionManager(Bus);
  qm.init();
  assert(docListeners.keydown, 'keydown handler not registered');
  docListeners.keydown({ key: 'ArrowRight', target: { tagName: 'DIV' } });
  docListeners.keydown({ key: 'ArrowRight', target: { tagName: 'DIV' } });
  const ev = Bus.events.filter(e => e.name === 'question:changed').pop();
  assert(ev && ev.data.index === 2, `expected index 2, got ${JSON.stringify(ev)}`);
});

test('setQuestions() resets index and announces it', () => {
  const Bus = makeBus();
  const { qm } = loadQuestionManager(Bus);
  qm.init();
  qm.next(); qm.next();
  qm.setQuestions([{ cat: 'X', q: 'one?' }, { cat: 'X', q: 'two?' }]);
  const ev = Bus.events.filter(e => e.name === 'question:changed').pop();
  assert(ev && ev.data.index === 0, JSON.stringify(ev));
  assert.strictEqual(qm.total, 2);
});

// ───────────────────────────────────────────────────────────────
console.log('\n[7] InterviewScorecard (real code from index.html) — end-to-end score path');

function loadScorecard(Bus, srAvailable) {
  const m = html.match(/const InterviewScorecard = \(\(\) => \{[\s\S]*?\nwindow\.InterviewScorecard = InterviewScorecard;/);
  assert(m, 'InterviewScorecard block not found in index.html');
  const sandbox = {
    Bus, console,
    setInterval: () => 0, clearInterval: () => {},
    window: {
      MetricsMath: MM,
      AudioEngine: { hasSpeechRecognition: () => srAvailable },
      AnomalyDetector: { isCalibrating: false },
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(m[0], sandbox);
  return sandbox.window.InterviewScorecard;
}

test('Chrome path: clarity is a real number, weighted into overall', () => {
  const Bus = makeBus();
  const sc = loadScorecard(Bus, true);
  sc.init();
  for (let i = 0; i < 10; i++) Bus.emit('signal:update', { osr: 10, hpd: 20 }); // good eye contact
  Bus.emit('signal:audio', { pvs: 10, silr: 0, sr: 0, transcript: 'tell me about your team project experience' });
  const s = sc.getScores();
  assert.strictEqual(s.eyeContact, 100);
  assert.strictEqual(s.headStability, 80);
  assert(typeof s.speechClarity === 'number' && s.speechClarity === 100, `clarity=${s.speechClarity}`);
  const expected = MM.overallScore(s).overall;
  assert(Math.abs(s.overall - expected) < 1e-9);
});

test('Firefox path: clarity is null and overall does NOT get a free 100', () => {
  const Bus = makeBus();
  const sc = loadScorecard(Bus, false);
  sc.init();
  for (let i = 0; i < 10; i++) Bus.emit('signal:update', { osr: 50, hpd: 40 }); // mediocre
  Bus.emit('signal:audio', { pvs: 20, silr: 50, sr: 0, transcript: '' });
  const s = sc.getScores();
  assert.strictEqual(s.speechClarity, null);
  // eye=0 (osr 50 ≥ 30), head=60, vocal=100-6-35=59 → overall=(0*.25+60*.20+59*.25)/0.70 ≈ 38.2
  assert(Math.abs(s.overall - (60 * .20 + 59 * .25) / 0.70) < 0.01, `overall=${s.overall}`);
  // The old bug scored this as 0*.25+60*.20+59*.25+100*.30 = 56.75 (D→C jump)
  assert(s.overall < 56, 'free-100 bug has regressed');
});

test('filler words ("um, like") reduce clarity', () => {
  const Bus = makeBus();
  const sc = loadScorecard(Bus, true);
  sc.init();
  Bus.emit('signal:update', { osr: 0, hpd: 0 });
  Bus.emit('signal:audio', { pvs: 0, silr: 0, sr: 0, transcript: 'um so like I basically worked on um a project' });
  const s = sc.getScores();
  assert(s.speechClarity < 100, `clarity=${s.speechClarity} ignored fillers`);
});

// ───────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}\n${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
