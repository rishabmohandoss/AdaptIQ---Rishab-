# AdaptIQ — Changelog

All notable changes to this project are documented here, newest first.
Each entry maps to a git commit and lists what changed, why, and which files were affected.

---

## [2026-07-14] 10-Phase Architectural Overhaul

A sequential 10-phase refactor spanning profile configuration, theming, layout,
signal processing, transcript handling, reporting, on-demand AI help, markdown
rendering, a technical code sandbox, and resume-driven personalization. Each
phase was implemented, verified (existing 27-test suite kept passing
throughout, plus targeted smoke tests per phase), and committed independently.

### Phase 1 — Weakness-Based Profile Factory
**Commit:** `ec9bc43`
- Replaced the hardcoded `SPECIAL_NEEDS_TUTOR` profile with `ProfileConfig.build(weaknessesArray)`, a factory composing a `WEAKNESS_CATALOG` (stuttering, eye_contact, distraction, speaking_too_fast, anxiety) onto a base profile.
- Each weakness tightens specific `signal_z` (z-score) bounds or `val_thresholds` and layers in its own interventions; `AnomalyDetector.checkCondition()` now resolves thresholds per-signal instead of one global z.
- Legacy profile-card IDs (adhd/anxiety/asd/special_needs) still resolve via a compatibility map — no UI changes required yet.
- Files: `integration/brain.js`, `index.html` (inline brain-module copy).

### Phase 2 — Dynamic Light/Dark Theming
**Commit:** `df63c48`
- Added a full `html[data-theme="light"]` token set alongside the existing dark `:root`.
- Introduced `--overlay-rgb` (`255,255,255` dark / `0,0,0` light) and routed ~97 `rgba(255,255,255,X)` opacity utilities through it in one mechanical pass.
- Added `--invert-bg`/`--invert-fg` for filled CTA controls and `--on-accent` for text on saturated accent fills, so both stay legible/high-contrast across themes.
- Added a theme toggle (synced across landing/in-session topbars, persisted via `localStorage`, applied pre-paint to avoid a flash of the wrong theme).
- `drawFaceOverlay`/`updateScoreRing` in `ui.js` now read colors from computed CSS variables instead of hardcoded hex.
- Files: `index.html`, `ui.js`.

### Phase 3 — Resizable Video/Question Layout + Canvas Resize Sync
**Commit:** `ea47acf`
- Wrapped `.video-area`/`.question-bar` in a `.dash-main` CSS Grid container with three toggleable states: Split (default), Focus (video shrinks, question grows/scrolls), PiP (video detaches into a floating corner box via `position:fixed`).
- Added a `ResizeObserver` (`initCanvasResizeSync`) bound to the video panel that immediately recalculates and redraws the face-mesh overlay on any resize, instead of waiting for the next tracking frame.
- Files: `index.html`, `ui.js`.

### Phase 4 — Kalman-Filtered Gaze + Hann-Windowed Pitch Autocorrelation
**Commit:** `9273f82`
- Added a 1D Kalman filter to `GazeEngine`'s screen-space x/y gaze coordinates before they feed the GDS buffers, smoothing MediaPipe iris-landmark micro-jitter.
- Applied a Hann window to the PCM frame in `autocorrelatePitch` before the autocorrelation sums (not before the loudness gate), stabilizing PVS.
- Files: `perception/sensors.js`, `index.html` (inline copy), `metrics-math.js`.

### Phase 5 — Structured Live Transcript Buffering
**Commit:** `1732a77`
- Replaced `AudioEngine`'s single concatenated `fullTranscript` string with a structured `transcript` array (`[{ timestamp, speaker, text, wpm }]`).
- Added `getTranscriptSegments()`; `getTranscript()` still returns the flattened string for existing consumers.
- `SessionManager.endSession()` now packages `transcript_segments` alongside the existing flat transcript.
- Files: `perception/sensors.js`, `index.html` (inline copy), `integration/brain.js`.

### Phase 6 — Hybrid Final Report Engine
**Commit:** `2a918d6`
- Added `METRIC_TEMPLATES`: deterministic, pre-authored feedback banded by score for each biometric metric — no LLM, no token cost, works without an API key.
- Fixed a real gap: the old LLM call judged "the answer" using only numeric biometric snapshots, never seeing what was said. Added `segmentsForQuestion()` (attributes Phase 5 transcript segments to a question by time range) and rewired the prompt so Claude judges actual answer content while delivery stays deterministic.
- Files: `ui.js`.

### Phase 7 — Context-Aware On-Demand AI Help Agent
**Commit:** `e192d7c`
- Added a Help button; `ui.js` stays decoupled from `brain.js`/`sensors.js` and only emits `Bus.emit('help:requested', ...)`.
- `InterventionDispatcher` gathers context (last 60s transcript, CES, active profile) and calls `ClaudeClient.generate()`.
- Fixed a Phase-1-introduced gap: `ClaudeClient`'s system-prompt lookup still keyed off the now-dead `special_needs` id. Added `systemPromptFor(profile)`, building a tailored prompt from `profile.weaknesses`.
- Files: `index.html`, `integration/brain.js`, `ui.js`.

### Phase 8 — Client-Side Markdown Parser
**Commit:** `1884f4b`
- Added `renderMarkdown()` to `ui.js`: escapes HTML first, then converts headers/bullets/bold/italic markdown to proper tags.
- Applied to the coach panel and session-debrief summary insights, which previously rendered raw LLM markdown as literal characters.
- Added "do not use markdown formatting" constraints to the relevant Anthropic system prompts.
- Files: `index.html`, `integration/brain.js`, `ui.js`.

### Phase 9 — HackerRank-Protocol Technical Sandbox (UI + plumbing; backend stubbed)
**Commit:** `bf317cd`
- Added a Monaco Editor code-sandbox panel, shown automatically when the active question's category is `'Technical'`.
- `submitCode()` posts to `/api/sandbox/execute`; since no real backend exists (Firebase Functions doesn't suit arbitrary code execution), it fails gracefully with a clear message. Wired `Bus.emit('sandbox:result', ...)` and a `requestType: 'sandbox_feedback'` LLM branch for when real infra exists.
- Files: `index.html`, `integration/brain.js`, `ui.js`.

### Phase 10 — Agentic Resume Vectorization
**Commit:** `f3f1352`
- Added `resume-worker.js`: a background Web Worker extracting structured entities (languages, frameworks, estimated tenure) from resume text off the main thread.
- Wired into the resume-upload handler with a synchronous fallback for `file://` contexts where classic Workers can throw.
- `claudeGenerate()`'s prompt now uses the structured metadata to target technical questions at the candidate's actual stack and calibrate question depth to experience level.
- Files: `index.html`, `resume-worker.js` (new).

### Final Deployment Check
- No main-thread blocking operations introduced; Phase 10 moved resume entity extraction off the main thread.
- Audited all `Bus.emit`/`Bus.on` pairs — every event added across the 10 phases has a matched listener. Found two pre-existing gaps predating this work (`gaze:calibration:next`/`gaze:calibration:progress` emitted with no listener; `claude:ready`/`claude:error` listened for but never emitted) — left as-is, outside this scope.
- `config.js` (gitignored, never committed) still contains a real Anthropic key loaded client-side — pre-existing, already documented in-file with the production hardening path (route through a server proxy).

---

## [2026-04-26] Demo Mode for Live Hackathon Demo
**Commit:** `b74c9e3`

### What Changed
- Added `⚡ DEMO MODE` checkbox on the profile selection screen
- When enabled (`window.DEMO_MODE = true`), the following happen at runtime with no code changes:
  - Baseline calibration window: **30 s → 5 s** (flags start firing much sooner)
  - Flag onset durations shortened by ~60–80%:

    | Flag | Normal | Demo |
    |------|--------|------|
    | GAZE_ERRATIC | 3 s | 1 s |
    | GAZE_LOST | 5 s | 1.5 s |
    | ATTENTION_DROP | 10 s | 2 s |
    | STRESS_DETECTED | 5 s | 1.5 s |
    | FOCUS_DRIFT | 8 s | 2 s |
    | SPEECH_PANIC | 3 s | 1 s |
    | PROLONGED_SILENCE | 15 s | 3 s |
    | OVERCONFIDENT_PACE | 10 s | 2 s |

  - Intervention cooldown: **15–20 s → 5 s** (Claude can respond more often)

### Why
Needed a way to reliably trigger all interventions during a live demo without waiting 10–15 s per flag. All changes are runtime-only — production behavior is unaffected when the toggle is off.

### Files Modified
- `index.html` — `DEMO_FLAG_DURATION` object, calibration window check, flag onset check, cooldown check, APP INIT toggle wiring

### Demo Cheat Sheet

| Action | Signal affected | Flag triggered |
|--------|----------------|----------------|
| Look away from camera | OSR ↑ | GAZE_LOST |
| Move eyes erratically | GDS ↑ | GAZE_ERRATIC |
| Look sideways + tilt head | GDS + HPD ↑ | FOCUS_DRIFT |
| Frown / look worried | ET ↑ | STRESS_DETECTED (+ loud voice) |
| Stay silent 3 s | SilR ↑ | PROLONGED_SILENCE → Claude responds |
| Speak very fast | SR ↑ | OVERCONFIDENT_PACE |
| Raise voice suddenly | VES ↑ | STRESS_DETECTED (+ frown) |
| Everything at once | CES drops | ATTENTION_DROP |

---

## [2026-04-26] Signal Accuracy Overhaul
**Commit:** `a8c45ef`

### What Changed
Six biometric signal formulas were corrected after auditing what each sensor was actually computing vs. what it should measure.

| Signal | Bug | Fix |
|--------|-----|-----|
| **ET** (Emotional Tension) | `(1 - neutral) * 100` — happy/surprised faces counted as tension | Sum of angry + fearful + disgusted + sad only |
| **HPD** (Head Pose Deviation) | Nose is anatomically below eyes, giving pitch=40–60 at neutral. headStability was stuck at ~40% | 30-frame self-calibrating pitch baseline; neutral pose now reads 0 |
| **BRA** (Blink Rate Anomaly) | Raw blink count compared to 17 bpm target without time normalization — 5 blinks in 5 s showed BRA=94 | Normalize blink count by elapsed session time; capped at 60 s window |
| **VES** (Vocal Energy Spike) | `Math.abs(z-score)` — sudden silence triggered a "spike" same as a shout | Only positive z-scores: `Math.max(0, z)` |
| **SilR** (Silence Ratio) | Hardcoded threshold `rms < 0.01` — failed on noisy mics or quiet rooms | 5-sample ambient RMS calibration at session start; threshold = `max(0.005, ambient × 3)` |
| **SR** (Speech Rate) | `Math.abs(0 - 135) / 135 * 100 = 100` before first word spoken | Returns 0 when `totalWords === 0` |

### Why
All 6 signals were producing misleading values from the first second of every session, making the entire flag/intervention pipeline unreliable before any real behavior occurred.

### Files Modified
- `perception/sensors.js` — source of truth for standalone sensor test harness
- `index.html` — inline copy of sensor logic (kept in sync)

---

## [2026-04-26] Metrics and Scorecard Fixes
**Commit:** `8d10662`

### What Changed

**InterviewScorecard initialization**
- Was: only initialized when `profileId === 'interview_coach'`
- Fix: always initialized for all profiles; scorecard panel now updates live for adhd/anxiety/asd cards too

**Calibration guard on eye contact**
- Was: InterviewScorecard counted `signal:update` frames during the 30 s baseline calibration window, inflating eye contact score
- Fix: `if (window.AnomalyDetector?.isCalibrating) return;` guard added to scorecard update handler

**CES alert thresholds raised**
- Was: `ces_alert_level: 40` (special_needs) and `35` (interview/language) — unreachable in practice since realistic CES floors at 50–60
- Fix: raised to `65` and `63` respectively; ATTENTION_DROP now actually fires

**vocalConfidence formula corrected**
- Was: `100 - pvs * 1.0 - silr * 0.5` — high PVS (expressive speech) unfairly penalized confident speakers
- Fix: `100 - pvs * 0.3 - silr * 0.7` — silence is the primary penalty; vocal variation is mildly weighted

**AudioEngine.reset() added to sensors.js**
- Added to the standalone perception/sensors.js file so test harness can call it directly

### Why
The scorecard was showing zeros for all profiles because it was never initialized. The ATTENTION_DROP flag never fired because the CES threshold was set below any realistic minimum. Together these two issues made the most visible demo metrics non-functional.

### Files Modified
- `index.html` — scorecard init, calibration guard, CES thresholds, vocal formula

---

## [2026-04-26] Critical Bug Fixes — Sensors, Permissions, API
**Commit:** `6355c1a`

### What Changed

**Gaze calibration never ran**
- `SensorManager.startCalibration()` was never called in APP INIT
- GazeEngine defaulted iris baseline to `{ avgX: 0.5, avgY: 0.5 }` → gaze tracking was completely inaccurate
- Fix: added `await SensorManager.startCalibration()` after `SensorManager.start()` in APP INIT

**Duplicate camera/audio permission dialogs**
- `ui.js` called `getUserMedia({ video: true, audio: false })`
- `sensors.js` AudioEngine called `getUserMedia({ audio: true, video: false })`
- Browser showed two separate permission prompts
- Fix: single consolidated `getUserMedia({ video: {...}, audio: true })` call in APP INIT; shared `mediaStream` passed to both `SensorManager.init()` and `AudioEngine.init()`

**No error feedback on permission denial**
- If user denied camera/mic, code logged a warning but continued; UI showed "No Face Detected" forever
- Fix: `NotAllowedError` caught explicitly; user-friendly message posted to event log

**ClaudeClient SSE timeout too aggressive**
- 3-second fallback fired before slow network responses could arrive
- Fix: timeout extended to 15 s; fallback only triggers if `receivedFirstChunk === false` (no data at all received)

**Audio transcript leaked between sessions**
- `fullTranscript` module variable accumulated across sessions; session 2 included session 1's words
- Fix: `AudioEngine.reset()` called at start of each session in APP INIT

**MediaPipe FaceMesh CDN was wrong**
- `index.html` was loading WebGazer; `sensors.js` expected MediaPipe FaceMesh (`window.FaceMesh`)
- `GazeEngine._init()` silently returned early — gaze was completely disabled
- Fix: removed WebGazer CDN tag; added correct MediaPipe FaceMesh CDN

**API key removed from source**
- Hardcoded `sk-ant-api03-...` key was blocked by GitHub secret scanning
- Fix: key field is now blank; users paste their own key into the UI input before starting

**Issue audit documents created**
- `ISSUES_FOUND.md` — 16 issues documented with severity and reproduction steps
- `FIXES_APPLIED.md` — detailed log of what was fixed, how, and test checklist

### Files Modified
- `index.html` — APP INIT consolidated permissions, gaze calibration call, error handling, timeout, reset
- `perception/sensors.js` — `AudioEngine.init()` accepts optional `mediaStream`; `reset()` added
- `ui.js` — `initVideoFeed()` made idempotent (checks `!video.srcObject` before requesting camera)

---

## [2026-04-26] Brain Integration Test Harness
**Commit:** `766e241`

### What Changed
- Added `integration/brain.js` — standalone Brain module (AnomalyDetector, InterventionDispatcher, ProfileConfig, ClaudeClient, InterviewScorecard)
- Added `integration/test.html` — interactive test harness with sliders to emit mock signals and observe flags/interventions without needing real sensors
- Inlined brain module into `index.html` for production use

### Files Modified
- `integration/brain.js` (new)
- `integration/test.html` (new)
- `index.html`

---

## [2026-04-26] Sensor Test Harness
**Commits:** `35c0a35`, `f7432b3`

### What Changed
- Added `perception/sensors.js` — standalone Sensors module (FaceEngine, GazeEngine, AudioEngine, SensorManager)
- Added `perception/test.html` — interactive test harness to verify all 9 signal values update from real camera/mic

### Files Modified
- `perception/sensors.js` (new)
- `perception/test.html` (new)

---

## [2026-04-26] Repository Structure Setup
**Commits:** `90b6eba`, `6faffef`, `fb8764b`

### What Changed
- Moved frontend files from `frontend/` subfolder to project root
- Renamed `frontend/index.html` → `index.html`, `frontend/ui.js` → `ui.js`
- Added `projectplan.md` with architecture overview and task breakdown
- Added team member profile files: `Sneh.md`, `Aagam.md`, `mayukha.md`, `Rishab.md`

### Files Modified
- `index.html`, `ui.js` (moved from `frontend/`)
- `projectplan.md` (new)

---

## [2026-04-26] Initial Project Upload
**Commits:** `49bc659`, `8fa0188`, `a232d19`, `83c27f8`, `134999e`

### What Changed
- Initial upload of AdaptIQ codebase
- Core files: `index.html` (app shell + brain modules), `ui.js` (UI layer), `integration/brain.js`, `perception/sensors.js`
- Assets: face-api model weights, CSS, icons
- GitHub Pages deployment target: `https://mayukha-arn.github.io/claude-hackathon/`

---

## How to Update This File

When making a change:
1. Add a new section at the **top** of the changelog (above the previous newest entry)
2. Use this format:
   ```
   ## [YYYY-MM-DD] Short description of the change
   **Commit:** `<hash>`

   ### What Changed
   - bullet points

   ### Why
   one paragraph

   ### Files Modified
   - list of files
   ```
3. Commit `CHANGELOG.md` together with the change files in the same commit
