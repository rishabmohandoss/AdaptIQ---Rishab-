# AI Code Feed — AdaptIQ Project

**Generated:** Tue Jul 14 18:46:24 EDT 2026

**Purpose:** Consolidated codebase for LLM analysis


## About This Document

This file concatenates every source and documentation file in the AdaptIQ
repository into a single Markdown document, so the entire codebase can be
pasted into an LLM's context window in one shot — no repo access, cloning,
or file-by-file uploads required. Each section below is headed `## File:
<path>` followed by that file's full, current contents in a fenced code
block with a language hint matching its extension.

**Regenerating this file:** re-run this process any time the tracked files
change — it is a point-in-time snapshot, not a live view, and will drift out
of sync with the repo otherwise. `CHANGELOG.md` (included below) is the
authoritative history of *why* things changed; this file is just *what the
code currently is*.

**Secrets:** any real API key or credential found in the source files below
has been replaced with `****` before inclusion. Check any file before
pasting elsewhere if you've added new secrets since this was generated —
this masking is applied by the generation step, not automatically enforced
by git or a pre-commit hook.

---

## File: README.md

```text
# AdaptIQ — Adaptive Learning Intelligence

> 🏆 **1st Place — Claude NJIT Hackathon 2026**

**[🚀 Live Demo](https://adapt-iq-dun.vercel.app/)**

AdaptIQ is a real-time, multimodal AI assistant that analyzes your body language, facial expressions, and voice during mock interview sessions to provide adaptive, empathetic support. It detects when you're confused, disengaged, or overwhelmed — and responds with intelligent interventions tailored to your cognitive profile.

Built for the **Economic Empowerment and Education** track, AdaptIQ is designed to level the playing field for neurodivergent job seekers. 1 in 5 Americans are neurodivergent, yet standard virtual interview formats rarely account for how differently people process and communicate information.

---

## Demo

> **No install needed** — runs entirely in the browser.  
> Visit **[adapt-iq-dun.vercel.app](https://adapt-iq-dun.vercel.app/)**, allow camera/mic access, select a cognitive profile, and start a mock session.

---

## What It Does

AdaptIQ runs a continuous **Perceive → Process → Act** loop:

1. **Perceives** — captures webcam and microphone input, extracting facial landmarks, eye gaze, head pose, and audio features locally on your device
2. **Processes** — sends semantic metadata (not raw video) to Claude via API for reasoning about your current state
3. **Acts** — delivers real-time interventions, adjusts support style, and surfaces live feedback on a dashboard

---

## Features

- 🎭 **Multimodal perception** — face mesh tracking, eye gaze estimation, head pose analysis, blink rate, and audio processing
- 🧠 **Claude-powered reasoning** — interprets your biometric state and decides on empathetic, context-aware interventions
- 👤 **Three cognitive profiles** — tailored modes for ADHD, Anxiety, and ASD with different intervention styles and sensitivity thresholds
- 📊 **Live biometric dashboard** — real-time metrics including Gaze Deviation Score, Head Pose Drift, Vocal Energy Spread, Speech Rate, and more
- 🎯 **Session scoring** — end-of-session breakdown across Eye Contact, Head Stability, Vocal Confidence, and Speech Clarity with an overall grade
- 🔔 **Smart interventions** — non-intrusive overlay cards triggered when anomalies are detected (e.g. frantic eye movement, long silences)
- 🔒 **Privacy-first** — only semantic metadata is sent to the cloud; raw video never leaves your device

---

## Cognitive Profiles

| Profile | Focus | Intervention Style |
|---|---|---|
| **ADHD** | Attention & engagement | High-energy, frequent micro-breaks, gamification cues |
| **Anxiety** | Calm & regulation | Breathing prompts, reduced visual noise, reassuring check-ins |
| **ASD** | Structure & predictability | Consistent pacing, explicit transitions, clear progress markers |

---

## Metrics Tracked

**Biometric Signals**
- Gaze Deviation Score (GDS)
- Head Pose Drift (HPD)
- Blink Rate Analysis (BRA)
- Vocal Energy Spread (VES)
- Speech Rate (SR)

**Derived Scores**
- Off-Screen Ratio (OSR)
- Engagement Time (ET)
- Cognitive Engine Score (CES)
- Silence/Latency Ratio (SILR)
- Pitch Variance Score (PVS)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Face & Gaze Tracking | MediaPipe Face Mesh, face-api.js |
| Audio Analysis | Meyda.js (real-time audio features) |
| AI Reasoning | Claude Sonnet (Anthropic API) |
| Frontend | Vanilla HTML/CSS/JS, Chart.js |
| Hosting | Vercel |

---

## Project Structure

```
├── frontend/         # UI components and dashboard
├── perception/       # Face mesh, gaze, and audio processing
├── integration/      # API orchestration and Claude integration
├── demo/             # Demo assets
├── PRD-details/      # Product requirements and design docs
├── index.html        # Main AdaptIQ dashboard
└── projectplan.md    # Architecture and implementation roadmap
```

---

## Getting Started

### Prerequisites
- A modern browser (Chrome recommended)
- Webcam and microphone
- Anthropic API key

### Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/adaptiq.git
cd adaptiq

# Serve with any static server
npx serve .
```

Then open `http://localhost:3000`.

---

## How It Works

All sensor data is abstracted into a lightweight JSON state before being sent to Claude:

```json
{
  "gazeDeviation": 2.3,
  "headPoseDrift": 12.5,
  "blinkRate": 4,
  "speechRate": 85,
  "offScreenRatio": 0.3,
  "profile": "adhd"
}
```

Claude interprets this state and returns either a natural language intervention or triggers a UI action — like pausing the session or surfacing a breathing prompt.

**Target latency: < 500ms end-to-end.**

---

## Built By

Built at the **Claude NJIT Hackathon 2026** — themed around social impact inspired by Anthropic CEO Dario Amodei's essay *Machines of Loving Grace*.

- [Sneh Bhatt](https://www.linkedin.com/in/sneh-bhatt-/)
- [Aagam Ambavi](https://www.linkedin.com/in/aagam-ambavi/)
- [Mayukha Ajeesh Ramsha Nath](https://www.linkedin.com/in/mayukha-ar/)
- [Rishab Mohandoss](https://www.linkedin.com/in/rishab-mohandoss/)

---

## License

MIT
```

## File: projectplan.md

```text
# Project: AI-Powered Empathy Assistant

## Overview
This document outlines the conceptual framework and implementation strategy for a real-time, multimodal AI assistant capable of analyzing body language and voice to provide adaptive support for users in contexts such as education, interview preparation, and professional development.

---

## 1. Naming Options

| Category | Suggestions |
| :--- | :--- |
| **Adaptability & Movement** | Kinesis, Pivot, Flux, Adapt |
| **Insight & Empathy** | Resonance, EmpathOS, Sentia, Mirror |
| **Support & Growth** | Catalyst, Bridge, Ally, MentorCore |
| **Modern Tech** | Verve, Node, Lumen, Echo |

---

## 2. Implementation Strategy

### High-Level Architecture
The system operates on a **Perceive → Process → Act** loop. To maintain low latency, processing must be distributed, with heavy feature extraction handled at the edge (on the user's device) and reasoning handled by the LLM.



### Technical Stack
* **Video Processing:** MediaPipe (for skeletal/pose tracking and Face Mesh) and OpenCV.
* **Audio Processing:** `faster-whisper` (for local, real-time transcription).
* **The Brain (LLM):** Claude 3.5 Sonnet (via API) or a local model like Llama 3 (for privacy-sensitive deployments).
* **Orchestration:** FastAPI with WebSockets for bidirectional, low-latency streaming.
* **TTS (Text-to-Speech):** ElevenLabs or Kokoro (chosen for low latency).

### Data Pipeline
1. **Perception Layer (Client):** The system captures raw streams and converts them into semantic metadata (e.g., body posture, facial expression, and transcript text).
2. **Reasoning Layer (The Brain):** The LLM receives this abstracted JSON state (e.g., `{"posture": "slumped", "expression": "confused"}`) rather than raw video frames.
3. **Actuation Layer:** The LLM generates a response or triggers UI changes via Function Calling (e.g., changing visual elements on screen or adjusting the teaching tone).

---

## 3. Implementation Roadmap

### Step 1: Feature Extraction
* Build a local script using OpenCV/MediaPipe to monitor user posture and track eye gaze.
* Implement local transcription using Whisper to convert audio to text instantly.

### Step 2: The Logic Loop
* Create a JSON schema that represents the "User State."
* Develop a system prompt for the LLM that interprets the JSON state and decides on an appropriate, empathetic intervention.

### Step 3: Closing the Loop
* Connect the LLM output to a Text-to-Speech engine.
* Implement UI-based feedback (e.g., dynamic visual prompts or changes in teaching style).

---

## 4. Critical Considerations

* **Latency is the Enemy:** Prioritize edge processing. Never send raw video frames to the LLM. The "uncanny valley" of voice interaction is often caused by processing delays; keeping the loop under 500ms is the goal.
* **Privacy:** Keep all raw data local. Only share semantic metadata with the cloud/LLM. Ensure the user knows they are being analyzed and provide a "kill switch" for the camera/mic.
* **Model Selection:** Use models with robust Function Calling capabilities. This allows the AI to "act" (e.g., trigger a screen highlight) rather than just "speak," which is vital for an interactive assistant.
```

## File: CHANGELOG.md

```text
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
```

## File: config.example.js

```javascript
// === ADAPTIQ RUNTIME CONFIG ===
// Server-side configuration. The UI never asks the user for any of this.
//
// claudeApiKey: enables AI coach responses and question generation.
// SECURITY NOTE: anything placed here is downloadable by every visitor.
// For a real production deployment, leave this empty and route Claude calls
// through a server proxy (e.g. a Firebase Cloud Function) that holds the key.
window.ADAPTIQ_CONFIG = {
  claudeApiKey: "",
};
```

## File: config.js

```javascript
// === ADAPTIQ RUNTIME CONFIG ===
// Server-side configuration. The UI never asks the user for any of this.
//
// claudeApiKey: enables AI coach responses and question generation.
// SECURITY NOTE: anything placed here is downloadable by every visitor.
// For a real production deployment, leave this empty and route Claude calls
// through a server proxy (e.g. a Firebase Cloud Function) that holds the key.
window.ADAPTIQ_CONFIG = {
  claudeApiKey: "****",
};
```

## File: firebase.json

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      ".firebaserc",
      ".git",
      ".gitignore",
      ".claude",
      "*.md",
      "demo/**",
      "frontend/**",
      "integration/**",
      "perception/**",
      "PRD-details/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## File: metrics-math.js

```javascript
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
```

## File: resume-worker.js

```javascript
// === ADAPTIQ RESUME WORKER === //
// Runs off the main thread: given already-extracted resume plain text
// (pdf.js/mammoth do the PDF/DOCX parsing on the main thread, since pdf.js
// already dispatches its own heavy lifting to its internal worker), this
// scans for known languages/frameworks and estimates tenure — CPU-bound
// dictionary/regex work that would otherwise add latency to the setup screen.

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML',
  'CSS', 'Shell', 'Bash', 'Perl', 'Objective-C', 'Dart', 'Elixir', 'Haskell',
];

const FRAMEWORKS = [
  'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django',
  'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Rails', 'Laravel', '.NET',
  'ASP.NET', 'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas',
  'NumPy', 'Redux', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Jenkins',
  'Terraform', 'Webpack', 'jQuery', 'Bootstrap', 'Tailwind', 'Svelte',
  'Flutter', 'Unity',
];

function findMatches(text, dictionary) {
  const found = new Set();
  dictionary.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i');
    if (re.test(text)) found.add(term);
  });
  return [...found];
}

function estimateTenureYears(text) {
  // Explicit mentions ("5+ years experience")
  let years = 0;
  const explicit = text.match(/(\d+(?:\.\d+)?)\+?\s*years?/gi) || [];
  explicit.forEach(m => {
    const n = parseFloat(m);
    if (!isNaN(n) && n < 50) years = Math.max(years, n);
  });

  // Date-range durations in work history ("2019 - 2022", "2019-Present")
  const ranges = text.match(/(19|20)\d{2}\s*[-–—]\s*((19|20)\d{2}|present|current)/gi) || [];
  let rangeTotal = 0;
  const now = new Date().getFullYear();
  ranges.forEach(r => {
    const parts = r.match(/(19|20)\d{2}|present|current/gi) || [];
    const start = parseInt(parts[0], 10);
    const end = /present|current/i.test(parts[1]) ? now : parseInt(parts[1], 10);
    if (!isNaN(start) && !isNaN(end) && end >= start) rangeTotal += (end - start);
  });

  return Math.round(Math.max(years, rangeTotal) * 10) / 10;
}

function extractResumeEntities(text) {
  return {
    languages: findMatches(text, LANGUAGES),
    frameworks: findMatches(text, FRAMEWORKS),
    tenureYears: estimateTenureYears(text),
  };
}

self.onmessage = (e) => {
  const { text } = e.data || {};
  self.postMessage(text ? extractResumeEntities(text) : { languages: [], frameworks: [], tenureYears: 0 });
};
```

## File: ui.js

```javascript
/**
 * AdaptIQ — UI Module (ui.js)
 * Owns: screen transitions, chart rendering, overlay management,
 *       metric updates, event log, calibration animation, session timer.
 *
 * Depends on: Bus (global), Chart.js (CDN)
 * Does NOT depend on sensors.js or brain.js — communicates via Bus events.
 */

window.AdaptIQ_UI = (() => {
  'use strict';

  // ============================================================
  // THEME
  // ============================================================
  // Reads a CSS custom property's live computed value so Canvas 2D drawing
  // (which can't use var() directly) stays in sync with the active theme.
  function getThemeVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  // ============================================================
  // STATE
  // ============================================================
  const state = {
    currentScreen: 'profile',
    profile: null,
    sessionStart: null,
    sessionTimerInterval: null,
    engagementTimerInterval: null,
    sessionSeconds: 0,
    engagedSeconds: 0,
    lastFaceTime: 0,
    scores: { eyeContact: 0, headStability: 0, vocalConfidence: 0, speechClarity: 0, overall: 0, grade: '—' },
    metrics: { gds: 0, osr: 0, hpd: 0, et: 0, ves: 0, pvs: 0, silr: 0, sr: 0, bra: 0, ces: 0 },
    faceDetected: false,
    calibrationStages: { face: 'pending', gaze: 'pending', audio: 'pending' },
    flags: [],
    flagTimers: [],
    intervention: { active: false, timer: null, progressTimer: null },
    orb: { severity: 'blue', lastUpdate: 0, hideTimer: null },
    eventLog: [],
    charts: {},
    sparkBuffers: { gds: [], hpd: [], ves: [], ces: [], silr: [] },
    maxSparkPoints: 40,
    mode: 'simple',
    gazeLastRenderTime: 0,
    // New: per-question tracking
    questionIndex: 0,
    questionSnapshots: Array.from({ length: 30 }, () => ({
      eyeContact: 0, headStability: 0, vocalConfidence: 0, speechClarity: 0, samples: 0, claritySamples: 0
    })),
    // Timestamp each question became active, so transcript segments (Phase 5)
    // can be sliced by time range and attributed to the right question.
    questionStartTimes: {},
    coachBuffer: '',
  };

  // ============================================================
  // SCREEN MANAGEMENT
  // ============================================================
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${id}`);
    if (target) target.classList.add('active');
    state.currentScreen = id;
  }

  // ============================================================
  // PROFILE SELECTION SCREEN
  // ============================================================
  function initProfileScreen() {
    document.querySelectorAll('.profile-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        state.profile = id;
        document.getElementById('topbar-profile-label').textContent = id.toUpperCase();
        Bus.emit('profile:selected', { id });
        addEventLog('info', `Profile selected: <strong>${id.toUpperCase()}</strong>`);
        showScreen('setup');
      });
    });
  }

  // ============================================================
  // SESSION MANAGEMENT
  // ============================================================
  function startSession() {
    state.sessionStart = Date.now();
    state.sessionSeconds = 0;
    state.engagedSeconds = 0;
    state.lastFaceTime = 0;
    initDashboard();

    // Show "Warming up…" pill and auto-dismiss after 8s
    const warmupPill = document.getElementById('warmup-pill');
    if (warmupPill) {
      warmupPill.style.opacity = '1';
      setTimeout(() => { warmupPill.style.opacity = '0'; }, 8000);
    }

    state.sessionTimerInterval = setInterval(() => {
      state.sessionSeconds++;
      updateTimer();
    }, 1000);

    // Engagement Time: count seconds where a face was actively detected
    state.engagementTimerInterval = setInterval(() => {
      if (state.lastFaceTime && Date.now() - state.lastFaceTime < 2000) {
        state.engagedSeconds++;
        updateMetricValue('metric-et', state.engagedSeconds, 0);
      }
    }, 1000);

    addEventLog('info', `Session started · Profile: <strong>${(state.profile || 'default').toUpperCase()}</strong>`);
  }

  function updateTimer() {
    const el = document.getElementById('session-timer');
    if (!el) return;
    const m = String(Math.floor(state.sessionSeconds / 60)).padStart(2, '0');
    const s = String(state.sessionSeconds % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
  }

  function formatTime() {
    const m = String(Math.floor(state.sessionSeconds / 60)).padStart(2, '0');
    const s = String(state.sessionSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function endSession() {
    clearInterval(state.sessionTimerInterval);
    clearInterval(state.engagementTimerInterval);

    // Build summary from current scores
    showSummary({
      eyeContact:      state.scores.eyeContact,
      headStability:   state.scores.headStability,
      vocalConfidence: state.scores.vocalConfidence,
      speechClarity:   state.scores.speechClarity,
      overall:         state.scores.overall,
      grade:           state.scores.grade,
    });
  }

  // ============================================================
  // DASHBOARD INIT
  // ============================================================
  function initDashboard() {
    initSparklines();
    initScoreRing();
    initVideoFeed();

    // End session wired in app init; also wire here for safety
    document.getElementById('btn-end-session')?.addEventListener('click', () => {
      Bus.emit('session:end', {});
      endSession();
    });

    // Mic toggle
    const btnMic = document.getElementById('btn-mic-toggle');
    if (btnMic) {
      btnMic.addEventListener('click', () => {
        const icon = document.getElementById('mic-icon');
        const muted = btnMic.classList.toggle('muted');
        if (icon) icon.className = muted ? 'ti ti-microphone-off' : 'ti ti-microphone';
        // Mute/unmute the media stream if available
        const video = document.getElementById('video-feed');
        if (video && video.srcObject) {
          video.srcObject.getAudioTracks().forEach(t => { t.enabled = !muted; });
        }
      });
    }

    // Camera toggle
    const btnCam = document.getElementById('btn-cam-toggle');
    if (btnCam) {
      btnCam.addEventListener('click', () => {
        const icon = document.getElementById('cam-icon');
        const hidden = btnCam.classList.toggle('muted');
        if (icon) icon.className = hidden ? 'ti ti-video-off' : 'ti ti-video';
        const video = document.getElementById('video-feed');
        if (video && video.srcObject) {
          video.srcObject.getVideoTracks().forEach(t => { t.enabled = !hidden; });
        }
        if (video) video.style.opacity = hidden ? '0' : '1';
      });
    }

    // Track question index for per-question snapshots. QuestionManager emits
    // this on EVERY navigation path (buttons, arrow keys, programmatic reset),
    // so the snapshot index can no longer desync from the displayed question.
    if (typeof Bus !== 'undefined') {
      Bus.on('question:changed', ({ index }) => {
        state.questionIndex = Math.max(0, Math.min(state.questionSnapshots.length - 1, index || 0));
        if (state.questionStartTimes[state.questionIndex] === undefined) {
          state.questionStartTimes[state.questionIndex] = Date.now();
        }
      });
    }

    // Mode toggle pill buttons (legacy)
    const btnSimple = document.getElementById('mode-btn-simple');
    const btnTech   = document.getElementById('mode-btn-technical');
    if (btnSimple) btnSimple.addEventListener('click', () => setMode('simple'));
    if (btnTech)   btnTech.addEventListener('click',   () => setMode('technical'));

    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
      modeToggle.addEventListener('change', (e) => {
        setMode(e.target.checked ? 'technical' : 'simple');
      });
    }

    const apiKeyInput = document.getElementById('api-key-input');
    const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    updateSensorDot('ai', apiKey ? 'active' : 'inactive',
      apiKey ? 'AI ready' : 'AI offline — enter API key');

    initPanelToggles();
    initCameraViewModes();
    initLayoutModes();
    initCanvasResizeSync();
    initHelpButton();
    initCodeSandbox();
    setMode('simple');
  }

  // ============================================================
  // PANEL TOGGLE LOGIC
  // ============================================================
  function initPanelToggles() {
    const panelMap = {
      coach:   { btn: 'btn-coach',   panel: 'panel-coach' },
      score:   { btn: 'btn-score',   panel: 'panel-score' },
      signals: { btn: 'btn-signals', panel: 'panel-signals' },
      code:    { btn: 'btn-code',    panel: 'panel-code' },
    };

    function closeAll() {
      Object.values(panelMap).forEach(({ btn, panel }) => {
        document.getElementById(panel)?.classList.remove('visible');
        document.getElementById(btn)?.classList.remove('active');
      });
    }

    Object.entries(panelMap).forEach(([key, { btn, panel }]) => {
      const btnEl   = document.getElementById(btn);
      const panelEl = document.getElementById(panel);
      if (!btnEl || !panelEl) return;

      btnEl.addEventListener('click', () => {
        const isOpen = panelEl.classList.contains('visible');
        closeAll();
        if (!isOpen) {
          panelEl.classList.add('visible');
          btnEl.classList.add('active');
          if (key === 'code') initMonacoEditor();
        }
      });

      // Close button inside panel
      panelEl.querySelector('.overlay-panel-close')?.addEventListener('click', closeAll);
    });
  }

  // ============================================================
  // CODE SANDBOX (technical questions — Monaco editor, Phase 9)
  // ============================================================
  let monacoEditorInstance = null;

  // Loaded lazily on first open — Monaco is heavy and most sessions never
  // hit a technical question.
  function initMonacoEditor() {
    if (monacoEditorInstance || typeof require === 'undefined' || !require.config) return;

    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
    require(['vs/editor/editor.main'], () => {
      const container = document.getElementById('monaco-editor-container');
      if (!container || monacoEditorInstance) return;
      monacoEditorInstance = monaco.editor.create(container, {
        value: '// Write your solution here\n',
        language: 'javascript',
        theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'vs' : 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 13,
      });

      document.getElementById('code-language-select')?.addEventListener('change', (e) => {
        monaco.editor.setModelLanguage(monacoEditorInstance.getModel(), e.target.value);
      });
    });
  }

  // Shows/hides the Code panel toggle based on whether the active question
  // is a technical/coding question, and auto-opens the panel when arriving
  // on one so the editor is immediately visible.
  function updateCodePanelVisibility(qData) {
    const btn = document.getElementById('btn-code');
    if (!btn) return;
    const isTechnical = qData && qData.cat === 'Technical';
    btn.style.display = isTechnical ? '' : 'none';
    if (isTechnical) {
      document.getElementById('panel-code')?.classList.add('visible');
      btn.classList.add('active');
      initMonacoEditor();
    } else {
      document.getElementById('panel-code')?.classList.remove('visible');
      btn.classList.remove('active');
    }
  }

  // Sends the current editor contents to a server-side execution sandbox.
  // No backend exists yet (Firebase Functions doesn't suit arbitrary code
  // execution) — this is the wired submission path, ready to point at real
  // infra. It fails gracefully with a clear message rather than a silent
  // console error, and the result shape it expects
  // ({ passed, total, timeComplexity, spaceComplexity }) is what a future
  // backend should return so renderSandboxResult() needs no changes.
  async function submitCode() {
    const resultsEl = document.getElementById('code-results');
    const submitBtn = document.getElementById('btn-submit-code');
    if (!resultsEl || !monacoEditorInstance) return;

    const code     = monacoEditorInstance.getValue();
    const language = document.getElementById('code-language-select')?.value || 'javascript';
    const qm       = window.QuestionManager;
    const qData    = qm ? qm.get(state.questionIndex) : null;

    resultsEl.textContent = 'Submitting…';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const resp = await fetch('/api/sandbox/execute', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code, language, question: qData?.q || '' }),
      });
      if (!resp.ok) throw new Error(`Sandbox returned HTTP ${resp.status}`);
      const result = await resp.json();
      renderSandboxResult(result);
      if (typeof Bus !== 'undefined') Bus.emit('sandbox:result', result);
    } catch (err) {
      console.warn('[Sandbox] execution backend not configured yet:', err.message);
      resultsEl.innerHTML = '<span style="color:var(--red)">⚠ Code execution backend isn\'t configured yet — this editor and submission flow are wired and ready for when it is.</span>';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  function renderSandboxResult(result) {
    const resultsEl = document.getElementById('code-results');
    if (!resultsEl || !result) return;
    const { passed, total, timeComplexity, spaceComplexity } = result;
    const passColor = passed === total ? 'var(--green)' : 'var(--yellow)';
    resultsEl.innerHTML =
      `<span style="color:${passColor}">${passed}/${total} tests passed</span>` +
      (timeComplexity ? ` · O(${timeComplexity}) time` : '') +
      (spaceComplexity ? ` · O(${spaceComplexity}) space` : '');
  }

  function initCodeSandbox() {
    document.getElementById('btn-submit-code')?.addEventListener('click', submitCode);
    if (typeof Bus !== 'undefined') {
      Bus.on('question:changed', ({ index }) => {
        const qm = window.QuestionManager;
        const qData = qm ? qm.get(index) : null;
        updateCodePanelVisibility(qData);
      });
    }
  }

  // ============================================================
  // CAMERA VIEW MODES
  // ============================================================
  function initCameraViewModes() {
    const container     = document.getElementById('video-container');
    const btnDefault    = document.getElementById('cam-btn-default');
    const btnMinimized  = document.getElementById('cam-btn-minimized');
    const btnFullscreen = document.getElementById('cam-btn-fullscreen');
    if (!container || !btnDefault) return;

    function setViewMode(mode) {
      container.className = 'video-container' + (mode === 'default' ? '' : ' cam-' + mode);
      [btnDefault, btnMinimized, btnFullscreen].forEach(b => b && b.classList.remove('active'));
      const activeBtn = { default: btnDefault, minimized: btnMinimized, fullscreen: btnFullscreen }[mode];
      if (activeBtn) activeBtn.classList.add('active');

      if (mode !== 'minimized') {
        container.style.cssText = '';
      }
    }

    btnDefault    && btnDefault.addEventListener('click',    () => setViewMode('default'));
    btnMinimized  && btnMinimized.addEventListener('click',  () => setViewMode('minimized'));
    btnFullscreen && btnFullscreen.addEventListener('click', () => setViewMode('fullscreen'));

    // Drag for minimized PiP
    let dragging = false, dragOffX = 0, dragOffY = 0;

    container.addEventListener('mousedown', (e) => {
      if (!container.classList.contains('cam-minimized')) return;
      if (e.target.closest('.cam-mode-toggle')) return;
      dragging = true;
      const rect = container.getBoundingClientRect();
      dragOffX = e.clientX - rect.left;
      dragOffY = e.clientY - rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      container.style.left   = (e.clientX - dragOffX) + 'px';
      container.style.top    = (e.clientY - dragOffY) + 'px';
      container.style.right  = 'auto';
      container.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => { dragging = false; });
  }

  // ============================================================
  // ON-DEMAND HELP
  // ============================================================
  // ui.js stays decoupled from brain.js/sensors.js — it only knows the
  // current question, and emits a Bus event so the integration layer
  // (which already owns AudioEngine/ClaudeClient/the active profile) can
  // gather transcript context and call the LLM.
  function initHelpButton() {
    const btn = document.getElementById('btn-help');
    if (!btn || typeof Bus === 'undefined') return;

    btn.addEventListener('click', () => {
      const qm = window.QuestionManager;
      const qData = qm ? qm.get(state.questionIndex) : null;
      const questionText = qData ? qData.q : (document.getElementById('question-text')?.textContent || '');

      // Surface the coach panel so the response is visible when it arrives
      document.getElementById('panel-coach')?.classList.add('visible');
      document.getElementById('btn-coach')?.classList.add('active');
      document.getElementById('panel-score')?.classList.remove('visible');
      document.getElementById('panel-signals')?.classList.remove('visible');
      document.getElementById('btn-score')?.classList.remove('active');
      document.getElementById('btn-signals')?.classList.remove('active');

      state.coachBuffer = '';
      updateCoachPanel('Thinking…', true);

      Bus.emit('help:requested', { questionText, questionIndex: state.questionIndex });
    });
  }

  // ============================================================
  // RESIZABLE LAYOUT (split / focus / pip)
  // ============================================================
  function initLayoutModes() {
    const dashMain = document.getElementById('dash-main');
    const toggle   = document.getElementById('layout-toggle');
    if (!dashMain || !toggle) return;

    toggle.querySelectorAll('.layout-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const layout = btn.dataset.layout;
        dashMain.classList.remove('layout-split', 'layout-focus', 'layout-pip');
        dashMain.classList.add(`layout-${layout}`);
        toggle.querySelectorAll('.layout-toggle-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });
  }

  // ============================================================
  // CANVAS RESIZE SYNC
  // ============================================================
  // The face-mesh overlay canvas must stay pixel-aligned with the video
  // element even when the grid layout resizes it (split/focus/pip toggle,
  // or any other container resize) — not just on the next tracking frame.
  function initCanvasResizeSync() {
    const videoPanel = document.getElementById('video-panel');
    if (!videoPanel || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      drawFaceOverlay(lastFaceData);
    });
    observer.observe(videoPanel);
  }

  // ============================================================
  // VIDEO FEED
  // ============================================================
  function initVideoFeed() {
    const video = document.getElementById('video-feed');
    if (!video) return;

    // Video stream is now provided by APP INIT (shared with AudioEngine)
    // Only request if not already set (for standalone testing)
    if (!video.srcObject) {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
        .then(stream => {
          video.srcObject = stream;
          updateSensorDot('camera', 'nominal', 'Camera active');
        })
        .catch(err => {
          console.warn('[AdaptIQ UI] Camera access denied:', err);
          updateVideoStatus(false);
          updateSensorDot('camera', 'error', 'Camera denied');
          updateSystemStatus('error', 'Camera access denied — please allow camera permission');
          updateOrb('red', 'Camera Denied', 'Allow camera access in browser settings.');
        });
    } else {
      updateSensorDot('camera', 'nominal', 'Camera active');
    }
  }

  function updateVideoStatus(detected) {
    state.faceDetected = detected;
    updateSensorDot('camera', detected ? 'active' : 'warning',
      detected ? 'Camera — face detected' : 'Camera — no face');
    if (!detected) updateOrb('yellow', 'No Face', 'Move closer or adjust lighting.');
  }

  // ============================================================
  // FACE OVERLAY RENDERING
  // ============================================================
  let lastFaceData = null;

  function drawFaceOverlay(data) {
    const canvas = document.getElementById('face-overlay-canvas');
    const video  = document.getElementById('video-feed');
    if (!canvas || !video) return;

    if (data) lastFaceData = data;

    canvas.width  = video.videoWidth  || canvas.offsetWidth;
    canvas.height = video.videoHeight || canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.mode !== 'technical') return;
    if (!data || !data.bbox) return;

    const { x, y, width, height } = data.bbox;
    const W = canvas.width;
    const H = canvas.height;

    // Scale bbox to canvas size
    const sx = W / (video.videoWidth  || W);
    const sy = H / (video.videoHeight || H);
    const bx = x * sx, by = y * sy, bw = width * sx, bh = height * sy;

    // Overlay draws on top of the live camera feed, not the page chrome, so
    // it uses a dedicated accent var that's intentionally constant across
    // themes (must stay visible against a face, not the app background).
    const accentRgb = getThemeVar('--face-overlay-rgb', '0,229,255');

    // Face bounding box
    ctx.strokeStyle = `rgba(${accentRgb},0.7)`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, bw, bh);

    // Corner accents
    const cs = 12;
    ctx.strokeStyle = `rgb(${accentRgb})`;
    ctx.lineWidth = 2.5;
    [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].forEach(([cx, cy], i) => {
      const dx = i % 2 === 0 ? 1 : -1;
      const dy = i < 2 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cx + dx * cs, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + dy * cs);
      ctx.stroke();
    });

    // Landmarks
    if (data.landmarks && Array.isArray(data.landmarks)) {
      ctx.fillStyle = `rgba(${accentRgb},0.6)`;
      data.landmarks.forEach(pt => {
        ctx.beginPath();
        ctx.arc((pt.x || pt[0]) * sx, (pt.y || pt[1]) * sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Expression label
    if (data.expressions) {
      const top = Object.entries(data.expressions).sort((a, b) => b[1] - a[1])[0];
      if (top && top[1] > 0.4) {
        ctx.fillStyle = `rgba(${accentRgb},0.9)`;
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(top[0].toUpperCase(), bx, by - 6);
      }
    }
  }

  // ============================================================
  // SPARKLINE CHARTS (Chart.js)
  // ============================================================
  function makeSparkline(canvasId, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          borderColor: color,
          borderWidth: 1.5,
          fill: true,
          backgroundColor: hexToRgba(color, 0.08),
          pointRadius: 0,
          tension: 0.4,
        }]
      },
      options: {
        responsive: false,
        animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        elements: { line: { borderCapStyle: 'round' } }
      }
    });
  }

  function hexToRgba(hex, alpha) {
    // Accepts CSS var names or hex
    if (hex.startsWith('var(')) {
      return `rgba(0,229,255,${alpha})`; // fallback
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function initSparklines() {
    state.charts.gds  = makeSparkline('spark-gds',  '#00e5ff');
    state.charts.hpd  = makeSparkline('spark-hpd',  '#ffb700');
    state.charts.ves  = makeSparkline('spark-ves',  '#a855f7');
    state.charts.ces  = makeSparkline('spark-ces',  '#ffb700');
    state.charts.silr = makeSparkline('spark-silr', '#00b4d8');
  }

  function pushSparkData(key, value) {
    const buf = state.sparkBuffers[key];
    if (!buf) return;
    buf.push(value);
    if (buf.length > state.maxSparkPoints) buf.shift();

    const chart = state.charts[key];
    if (!chart) return;
    chart.data.labels = buf.map((_, i) => i);
    chart.data.datasets[0].data = [...buf];
    chart.update('none');
  }

  // ============================================================
  // SCORE RING (Canvas-based donut)
  // ============================================================
  function initScoreRing() {
    updateScoreRing(0, '—');
  }

  function updateScoreRing(overall, grade) {
    const canvas = document.getElementById('score-ring-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = 40, lineW = 7;

    ctx.clearRect(0, 0, W, H);

    // Background track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${getThemeVar('--overlay-rgb', '255,255,255')},0.06)`;
    ctx.lineWidth = lineW;
    ctx.stroke();

    // Progress arc
    const pct = (overall || 0) / 100;
    const start = -Math.PI / 2;
    const end = start + pct * Math.PI * 2;

    const gradeColor = {
      'A': '#00ff88', 'A+': '#00ff88', 'A-': '#00ff88',
      'B': '#00e5ff', 'B+': '#00e5ff', 'B-': '#00e5ff',
      'C': '#ffb700', 'C+': '#ffb700', 'C-': '#ffb700',
      'D': '#ff3d5a', 'F': '#ff3d5a',
    }[grade] || '#00e5ff';

    if (pct > 0) {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, gradeColor);
      grad.addColorStop(1, '#a855f7');

      ctx.beginPath();
      ctx.arc(cx, cy, r, start, end);
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Center values
    document.getElementById('score-overall').textContent = overall > 0 ? Math.round(overall) : '--';
    document.getElementById('score-grade').textContent   = grade || '—';
  }

  // ============================================================
  // METRIC UPDATES
  // ============================================================
  function animateValue(el, value, decimals = 0) {
    if (!el) return;
    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    if (el.dataset.lastVal === formatted) return;
    el.dataset.lastVal = formatted;
    el.classList.remove('value-update');
    void el.offsetWidth; // reflow
    el.classList.add('value-update');
    // Update only the text node, preserving the unit <span>
    const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = formatted;
    else el.firstChild && (el.firstChild.textContent = formatted);
  }

  function setBarWidth(barId, pct) {
    const el = document.getElementById(barId);
    if (el) el.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  function updateSignal(data) {
    const m = state.metrics;
    if (data.gds   !== undefined) { m.gds   = data.gds;   pushSparkData('gds', data.gds); }
    if (data.osr   !== undefined) { m.osr   = data.osr;   }
    if (data.hpd   !== undefined) { m.hpd   = data.hpd;   pushSparkData('hpd', data.hpd); }
    if (data.et    !== undefined) { m.et    = data.et;    }
    if (data.ves   !== undefined) { m.ves   = data.ves;   pushSparkData('ves', data.ves); }
    if (data.pvs   !== undefined) { m.pvs   = data.pvs;   }
    if (data.silr  !== undefined) { m.silr  = data.silr;  pushSparkData('silr', data.silr); }
    if (data.sr    !== undefined) { m.sr    = data.sr;    }
    if (data.bra   !== undefined) { m.bra   = data.bra;   }
    if (data.ces   !== undefined) { m.ces   = data.ces;   pushSparkData('ces', data.ces); }

    renderMetrics();
    renderSignalsPanel();
  }

  function renderSignalsPanel() {
    const m = state.metrics;
    // Eye = 100 - off-screen ratio
    const eyeVal  = Math.round(Math.max(0, 100 - (m.osr || 0)));
    // Calm = 100 - emotional tension
    const calmVal = Math.round(Math.max(0, 100 - (m.et || 0)));
    // Voice = vocal presence (100 - silence ratio). VES was wrong here: it is
    // a spike detector that reads ~0 during normal steady speech.
    const voiceVal = Math.round(Math.max(0, Math.min(100, 100 - (m.silr || 0))));

    function setSignal(id, val) {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = val;
      el.style.color = scoreColor(val);
    }
    setSignal('sig-eye',   eyeVal);
    setSignal('sig-calm',  calmVal);
    setSignal('sig-voice', voiceVal);
  }

  function renderMetrics() {
    const m = state.metrics;

    // Left panel
    updateMetricValue('metric-gds',  m.gds,  2);
    updateMetricValue('metric-hpd',  m.hpd,  1);
    updateMetricValue('metric-bra',  m.bra,  0);
    updateMetricValue('metric-ves',  m.ves,  2);
    updateMetricValue('metric-sr',   m.sr,   0);

    // Right panel
    updateMetricValue('metric-osr',  m.osr,  1);
    // metric-et is Engagement Time — updated by its own 1s interval in startSession, not from signal
    updateMetricValue('metric-ces',  m.ces,  2);
    updateMetricValue('metric-silr', m.silr, 2);
    updateMetricValue('metric-pvs',  m.pvs,  2);

    // Bar fills
    setBarWidth('bar-bra',  (m.bra / 30) * 100);   // norm 0-30 blinks/min
    setBarWidth('bar-sr',   (m.sr  / 200) * 100);  // norm 0-200 wpm
    setBarWidth('bar-osr',  m.osr);
    setBarWidth('bar-pvs',  (m.pvs / 2) * 100);    // norm 0-2
  }

  function updateMetricValue(id, value, decimals) {
    const el = document.getElementById(id);
    if (!el) return;
    const numStr = decimals > 0 ? (+value).toFixed(decimals) : Math.round(+value).toString();
    // Find the text node (before any unit span)
    const nodes = Array.from(el.childNodes);
    const textNode = nodes.find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) {
      if (textNode.textContent !== numStr) {
        textNode.textContent = numStr;
        el.classList.remove('value-update');
        void el.offsetWidth;
        el.classList.add('value-update');
      }
    } else {
      el.textContent = numStr;
    }
  }

  // ============================================================
  // FACE SIGNAL
  // ============================================================
  function handleFaceSignal(data) {
    if (!data) return;
    updateVideoStatus(true);

    // Track when face was last seen — used by the engagement time counter in startSession
    if (data.bbox) state.lastFaceTime = Date.now();
    if (data.hpd !== undefined) {
      updateMetricValue('metric-hpd', data.hpd, 1);
      pushSparkData('hpd', data.hpd);
    }
    if (data.bra !== undefined) {
      updateMetricValue('metric-bra', data.bra, 0);
      setBarWidth('bar-bra', (data.bra / 30) * 100);
    }

    drawFaceOverlay(data);
  }

  // ============================================================
  // GAZE SIGNAL
  // ============================================================
  function handleGazeSignal(data) {
    if (!data) return;
    if (data.gds !== undefined) {
      updateMetricValue('metric-gds', data.gds, 2);
      pushSparkData('gds', data.gds);
    }
    if (data.osr !== undefined) {
      updateMetricValue('metric-osr', data.osr, 1);
      setBarWidth('bar-osr', data.osr);
    }

    // Gaze dot: Technical Mode only, capped at 10fps
    if (state.mode === 'technical') {
      const now = Date.now();
      if (now - state.gazeLastRenderTime >= 100) {
        state.gazeLastRenderTime = now;
        const dot = document.getElementById('gaze-dot');
        if (dot && data.x !== undefined && data.y !== undefined) {
          dot.style.display = 'block';
          dot.style.left = `${data.x}px`;
          dot.style.top  = `${data.y}px`;
        }
      }
    }
  }

  // ============================================================
  // STATUS ORB
  // ============================================================

  const ORB_SEVERITY = { blue: 0, green: 1, yellow: 2, orange: 3, red: 4 };
  const ORB_RATE_MS  = 5000;

  function updateOrb(severity, label, desc) {
    const now = Date.now();
    // Rate-limit: only update if ≥5s since last update OR incoming severity is higher
    const cur = state.orb.severity;
    const isHigher = (ORB_SEVERITY[severity] || 0) > (ORB_SEVERITY[cur] || 0);
    if (!isHigher && now - state.orb.lastUpdate < ORB_RATE_MS) return;

    state.orb.severity  = severity;
    state.orb.lastUpdate = now;

    const orb = document.getElementById('status-orb');
    if (orb) {
      orb.className = `orb-${severity}`;
    }

    // Update card contents (but don't auto-show the card)
    const labelEl = document.getElementById('orb-card-label');
    const descEl  = document.getElementById('orb-card-desc');
    if (labelEl) labelEl.textContent = label || severity;
    if (descEl)  descEl.textContent  = desc  || '';

    // Auto-return to blue (nominal) after 12s if not red
    if (state.orb.hideTimer) clearTimeout(state.orb.hideTimer);
    if (severity !== 'red') {
      state.orb.hideTimer = setTimeout(() => {
        state.orb.severity = 'blue';
        const o = document.getElementById('status-orb');
        if (o) o.className = 'orb-blue';
      }, 12000);
    }

    console.log(`[AdaptIQ Orb:${severity.toUpperCase()}]`, label, desc || '');
  }

  function initOrbClickHandler() {
    const orb  = document.getElementById('status-orb');
    const card = document.getElementById('orb-card');
    const dismissBtn = document.getElementById('orb-card-dismiss');

    if (!orb || !card) return;

    orb.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('hidden');
    });

    dismissBtn && dismissBtn.addEventListener('click', () => {
      card.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!card.classList.contains('hidden') && !card.contains(e.target) && e.target !== orb) {
        card.classList.add('hidden');
      }
    });
  }

  // ============================================================
  // SCORE COLOR HELPER
  // ============================================================
  function scoreColor(val) {
    if (val >= 75) return '#30d158';
    if (val >= 50) return '#ffd60a';
    return '#ff453a';
  }

  // Legacy no-ops kept for any external callers
  function hideIntervention() {}
  function handleFlag(data) {
    if (!data) return;
    const { type, severity = 'low', message } = data;
    const orbSev = severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'yellow';
    updateOrb(orbSev, type || 'Alert', message || '');
  }
  function handleIntervention(data) {
    if (!data) return;
    const ACTION_LABELS = {
      claude_response: 'AI Coach',
      banner:          'Attention',
      focus_object:    'Focus Exercise',
      content_swap:    'Try This',
      break_timer:     'Take a Break',
    };
    const label = ACTION_LABELS[data.action] || 'Intervention';
    const desc  = (data.chunk !== undefined ? '' : data.message) || '';
    updateOrb('orange', label, desc);

    // Feed the Coach panel
    if (data.action === 'claude_response') {
      if (data.chunk !== undefined) {
        state.coachBuffer += data.chunk;
        updateCoachPanel(state.coachBuffer, false);
      }
      if (data.done) {
        if (!state.coachBuffer && data.message) state.coachBuffer = data.message;
        updateCoachPanel(state.coachBuffer, true);
        state.coachBuffer = '';
      }
    } else if (data.message) {
      updateCoachPanel(data.message, true);
    }

    console.log('[AdaptIQ Intervention]', data.action || 'adaptive break');
  }

  // ============================================================
  // MARKDOWN → HTML (lightweight, regex-based)
  // ============================================================
  // LLM responses default to markdown (headers, bullets, bold) even when
  // asked for plain text — this renders it instead of leaking raw
  // #/*/- characters into the UI.
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inlineMarkdown(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>');
  }

  function renderMarkdown(text) {
    if (!text) return '';
    const lines = escapeHtml(text).split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      const listMatch = trimmed.match(/^[*-]\s+(.*)$/);
      const headingMatch = trimmed.match(/^#{1,6}\s+(.*)$/);

      if (listMatch) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${inlineMarkdown(listMatch[1])}</li>`;
        return;
      }
      if (inList) { html += '</ul>'; inList = false; }

      if (headingMatch) {
        html += `<strong>${inlineMarkdown(headingMatch[1])}</strong><br>`;
      } else if (trimmed) {
        html += `${inlineMarkdown(trimmed)}<br>`;
      } else {
        html += '<br>';
      }
    });

    if (inList) html += '</ul>';
    return html;
  }

  function updateCoachPanel(text, final) {
    const el = document.getElementById('coach-tip-text');
    if (!el || !text) return;
    el.innerHTML = renderMarkdown(text) + (final ? '' : ' <span style="opacity:0.5">▌</span>');
  }

  // ============================================================
  // SCORES UPDATE
  // ============================================================
  function handleScoresUpdate(data) {
    if (!data) return;
    const { eyeContact, headStability, vocalConfidence, speechClarity, overall, grade } = data;

    state.scores = { eyeContact, headStability, vocalConfidence, speechClarity, overall, grade };

    updateScoreRing(overall, grade);

    // Legacy hidden breakdown
    const legacyVals = [
      ['score-eye',    'sbar-eye',    eyeContact],
      ['score-head',   'sbar-head',   headStability],
      ['score-vocal',  'sbar-vocal',  vocalConfidence],
      ['score-clarity','sbar-clarity', speechClarity],
    ];
    legacyVals.forEach(([scoreId, barId, val]) => {
      const scoreEl = document.getElementById(scoreId);
      const barEl   = document.getElementById(barId);
      if (scoreEl) scoreEl.textContent = Math.round(val || 0);
      if (barEl)   barEl.style.width = `${Math.min(100, val || 0)}%`;
    });

    // ── Score overlay panel ──
    const panelVals = [
      ['ps-eye',    'psb-eye',    eyeContact],
      ['ps-head',   'psb-head',   headStability],
      ['ps-vocal',  'psb-vocal',  vocalConfidence],
      ['ps-clarity','psb-clarity', speechClarity],
    ];
    panelVals.forEach(([valId, barId, val]) => {
      const valEl = document.getElementById(valId);
      const barEl = document.getElementById(barId);
      if (val == null) {
        // Speech recognition unavailable in this browser — show N/A, not a fake score
        if (valEl) { valEl.textContent = 'N/A'; valEl.style.color = 'rgba(255,255,255,0.3)'; }
        if (barEl) { barEl.style.width = '0%'; }
        return;
      }
      const v = Math.round(val || 0);
      const color = scoreColor(v);
      if (valEl) { valEl.textContent = v; valEl.style.color = color; }
      if (barEl) { barEl.style.width = `${v}%`; barEl.style.background = color; }
    });

    // ── Per-question snapshot (running average) ──
    const qi = state.questionIndex;
    if (qi >= 0 && qi < state.questionSnapshots.length) {
      const snap = state.questionSnapshots[qi];
      snap.samples++;
      const n = snap.samples;
      snap.eyeContact      += ((eyeContact      || 0) - snap.eyeContact)      / n;
      snap.headStability   += ((headStability   || 0) - snap.headStability)   / n;
      snap.vocalConfidence += ((vocalConfidence || 0) - snap.vocalConfidence) / n;
      if (speechClarity != null) {
        snap.claritySamples = (snap.claritySamples || 0) + 1;
        snap.speechClarity += (speechClarity - snap.speechClarity) / snap.claritySamples;
      }
    }

    console.log(`[AdaptIQ Scores] Overall: ${Math.round(overall)}% (${grade})`);
  }

  // ============================================================
  // CALIBRATION COMPLETE
  // ============================================================
  function handleCalibrationComplete(data) {
    // Calibration completes silently in background — dashboard is already showing
  }

  // ============================================================
  // EVENT LOG (dev-only — no longer rendered in the UI)
  // ============================================================
  function addEventLog(type, html) {
    const plain = html.replace(/<[^>]+>/g, '');
    console.log(`[AdaptIQ:${type}]`, plain);
  }

  // ============================================================
  // SESSION SUMMARY
  // ============================================================
  function showSummary(data) {
    showScreen('summary');

    document.getElementById('summary-grade').textContent    = data.grade || '—';
    document.getElementById('summary-subtitle').textContent =
      `Session ended · Profile: ${(state.profile || 'default').toUpperCase()} · Duration: ${formatTime()}`;

    document.getElementById('sum-overall').textContent = data.overall  ? Math.round(data.overall)  : '--';
    document.getElementById('sum-eye').textContent     = data.eyeContact    ? Math.round(data.eyeContact)    : '--';
    document.getElementById('sum-head').textContent    = data.headStability ? Math.round(data.headStability) : '--';
    document.getElementById('sum-vocal').textContent   = data.vocalConfidence ? Math.round(data.vocalConfidence) : '--';

    // Summary actions
    document.getElementById('btn-new-session').addEventListener('click', () => {
      state.profile = null;
      state.sessionSeconds = 0;
      state.questionIndex = 0;
      state.coachBuffer = '';
      state.questionSnapshots = Array.from({ length: 30 }, () => ({
        eyeContact: 0, headStability: 0, vocalConfidence: 0, speechClarity: 0, samples: 0, claritySamples: 0
      }));
      state.questionStartTimes = {};
      state.sparkBuffers = { gds: [], hpd: [], ves: [], ces: [], silr: [] };
      // Reset coach panel
      const coachTip = document.getElementById('coach-tip-text');
      if (coachTip) coachTip.innerHTML = '<em>Listening for cues…</em>';
      showScreen('profile');
    });

    document.getElementById('btn-export').addEventListener('click', exportReport);
  }

  async function exportReport() {
    const btn = document.getElementById('btn-export');
    if (btn) { btn.textContent = 'Generating…'; btn.disabled = true; }
    try {
      await generatePDF();
    } finally {
      if (btn) {
        btn.innerHTML = '<i class="ti ti-download"></i> Download PDF Report';
        btn.disabled = false;
      }
    }
  }

  // ============================================================
  // DETERMINISTIC REPORT TEMPLATES
  // ============================================================
  // Pre-authored feedback bands per metric — biometric commentary is fully
  // deterministic (no LLM, no latency/token cost) so a report is useful even
  // without an API key. The LLM (below) is reserved for judging what the
  // candidate actually SAID, which no biometric threshold can capture.
  const METRIC_TEMPLATES = {
    eyeContact: [
      { min: 80, text: 'Excellent eye contact — you stayed engaged with the camera throughout.' },
      { min: 60, text: 'Good eye contact overall, with some moments looking away.' },
      { min: 40, text: "Eye contact dipped several times — try anchoring back to the camera after checking notes." },
      { min: 0,  text: 'Eye contact was inconsistent — practice holding the camera\'s gaze for longer stretches.' },
    ],
    headStability: [
      { min: 80, text: 'Your head position was steady and composed.' },
      { min: 60, text: 'Mostly stable head position, with occasional movement.' },
      { min: 40, text: 'Noticeable head movement — this can read as distraction or nervousness.' },
      { min: 0,  text: 'Frequent head movement — try to settle into a stable position before answering.' },
    ],
    vocalConfidence: [
      { min: 80, text: 'Your voice carried strong, steady confidence.' },
      { min: 60, text: 'Generally confident vocal tone, with a few wavering moments.' },
      { min: 40, text: 'Your vocal tone showed some hesitation or strain.' },
      { min: 0,  text: 'Vocal confidence was low — pacing and breath control can help here.' },
    ],
    speechClarity: [
      { min: 80, text: 'Speech was clear and well-paced, with minimal filler words.' },
      { min: 60, text: 'Fairly clear speech with occasional filler words or pacing issues.' },
      { min: 40, text: 'Clarity was affected by filler words or speaking rate — slow down and pause more.' },
      { min: 0,  text: 'Speech clarity needs work — reduce filler words and moderate your pace.' },
    ],
  };

  function templateFor(metric, value) {
    const bands = METRIC_TEMPLATES[metric];
    const v = Math.round(value || 0);
    return (bands.find(b => v >= b.min) || bands[bands.length - 1]).text;
  }

  // Deterministic per-question paragraph: the metric furthest from "good"
  // (below 60) is the most actionable, so lead with that; otherwise lead
  // with the strongest metric so the note isn't uniformly generic.
  function deterministicNote(snap) {
    const metrics = ['eyeContact', 'headStability', 'vocalConfidence', 'speechClarity'];
    const weak = metrics.filter(m => (snap[m] || 0) < 60).sort((a, b) => (snap[a] || 0) - (snap[b] || 0));
    const lead = weak.length ? weak[0] : metrics.reduce((best, m) => (snap[m] || 0) > (snap[best] || 0) ? m : best, metrics[0]);
    return templateFor(lead, snap[lead]);
  }

  // Attributes transcript segments (Phase 5's structured array) to a question
  // by time range: from when that question became active until the next one did.
  function segmentsForQuestion(allSegments, qIndex, totalQuestions) {
    const start = state.questionStartTimes[qIndex];
    if (start === undefined) return [];
    let end = Infinity;
    for (let j = qIndex + 1; j < totalQuestions; j++) {
      if (state.questionStartTimes[j] !== undefined) { end = state.questionStartTimes[j]; break; }
    }
    return allSegments.filter(s => s.timestamp >= start && s.timestamp < end);
  }

  // ============================================================
  // PDF GENERATION
  // ============================================================
  async function generatePDF() {
    if (!window.jspdf) {
      console.warn('[PDF] jsPDF not loaded');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });

    const profile  = state.profile || 'default';
    const scores   = state.scores;
    const dateStr  = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const duration = formatTime();
    const pageW    = doc.internal.pageSize.getWidth();
    const pageH    = doc.internal.pageSize.getHeight();
    const margin   = 40;
    const contentW = pageW - margin * 2;
    let y = margin;
    let pageNum = 1;

    function addFooter() {
      const fy = pageH - 20;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, fy - 8, pageW - margin, fy - 8);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text('AdaptIQ — Adaptive Interview Intelligence', margin, fy);
      doc.text(`Page ${pageNum}`, pageW - margin, fy, { align: 'right' });
    }

    function newPage() {
      addFooter();
      doc.addPage();
      pageNum++;
      y = margin;
    }

    function checkBreak(needed) {
      if (y + needed > pageH - 40) newPage();
    }

    // ── Cover ──
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 151, 255);
    doc.text('AdaptIQ', margin, y);
    y += 24;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('Session Report', margin, y);
    y += 14;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${dateStr}  ·  Duration: ${duration}  ·  Profile: ${profile.toUpperCase()}`, margin, y);
    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 16;

    // ── Overall Scores ──
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Overall Scores', margin, y);
    y += 12;

    [
      ['Eye Contact',       scores.eyeContact],
      ['Head Stability',    scores.headStability],
      ['Vocal Confidence',  scores.vocalConfidence],
      ['Clarity',           scores.speechClarity],
    ].forEach(([label, val]) => {
      const v = Math.round(val || 0);
      const rgb = v >= 75 ? [48, 209, 88] : v >= 50 ? [245, 166, 35] : [255, 69, 58];
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(label, margin + 8, y);
      doc.setTextColor(...rgb);
      doc.setFont('helvetica', 'bold');
      doc.text(`${v}`, pageW - margin, y, { align: 'right' });
      y += 8;
    });
    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageW - margin, y);
    y += 16;

    // ── Deterministic biometric commentary (no LLM — always available) ──
    const deterministicNotes = {};
    state.questionSnapshots.forEach((s, i) => {
      if (s.samples > 0) deterministicNotes[i + 1] = deterministicNote(s);
    });

    // ── Qualitative answer-content feedback from Claude ──
    // Biometrics above are 100% deterministic; the LLM is reserved for the
    // one thing a threshold can't judge — what the candidate actually said.
    let contentNotes = {};
    const apiKey = document.getElementById('api-key-input')?.value?.trim();
    const qmForContent = window.QuestionManager;
    const totalForContent = qmForContent ? qmForContent.total : state.questionSnapshots.length;
    const allSegments = window.AudioEngine && AudioEngine.getTranscriptSegments
      ? AudioEngine.getTranscriptSegments()
      : [];

    if (apiKey && allSegments.length > 0) {
      const answers = state.questionSnapshots
        .map((s, i) => {
          if (s.samples === 0) return null;
          const answerText = segmentsForQuestion(allSegments, i, totalForContent).map(seg => seg.text).join(' ').trim();
          return answerText ? { q: i + 1, answer: answerText.slice(0, 800) } : null;
        })
        .filter(Boolean);

      if (answers.length > 0) {
        try {
          const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
              model: 'claude-haiku-4-5',
              max_tokens: 2000,
              messages: [{
                role: 'user',
                content: `You are a supportive interview coach writing a session report for a neurodivergent job seeker (profile: ${profile}). Delivery metrics (eye contact, head stability, vocal confidence, clarity) are scored separately — your job is ONLY to judge the CONTENT of what they said below: did it answer the question, was it specific, was anything missing. Write 1-2 plain-English sentences per question. Be warm and never use jargon or acronyms.${(window.ResumeText || '') ? ` The candidate's resume is provided — where it helps, tie feedback to their real background (projects, jobs, skills) so it's concrete. Resume: "${window.ResumeText.slice(0, 3000)}".` : ''} Return a JSON array where each element has "q" (question number) and "note" fields only. Answers: ${JSON.stringify(answers)}`,
              }],
            }),
          });
          if (resp.ok) {
            const json = await resp.json();
            const text = json.content?.[0]?.text || '';
            const match = text.match(/\[[\s\S]*\]/);
            if (match) {
              JSON.parse(match[0]).forEach(item => { contentNotes[item.q] = item.note; });
            }
          }
        } catch (err) {
          console.warn('[PDF] Claude content notes failed:', err);
        }
      }
    }

    // ── Per-question breakdown ──
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Question-by-question Breakdown', margin, y);
    y += 14;

    const qm = window.QuestionManager;
    const total = qm ? qm.total : state.questionSnapshots.length;

    for (let i = 0; i < total; i++) {
      const snap  = state.questionSnapshots[i];
      if (!snap || snap.samples === 0) continue;

      const qData = qm ? qm.get(i) : null;
      const qText = qData ? `Q${i + 1}. ${qData.q}` : `Question ${i + 1}`;
      const { overall: overallQ, grade } = window.MetricsMath.overallScore({
        eyeContact:      snap.eyeContact,
        headStability:   snap.headStability,
        vocalConfidence: snap.vocalConfidence,
        speechClarity:   (snap.claritySamples || 0) > 0 ? snap.speechClarity : null,
      });

      checkBreak(60);

      // Question text + grade
      const lines = doc.splitTextToSize(qText, contentW - 30);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text(lines, margin, y);
      doc.setTextColor(41, 151, 255);
      doc.text(grade, pageW - margin, y, { align: 'right' });
      y += lines.length * 12 + 4;

      // Tags
      const tags = [];
      if (snap.eyeContact >= 75)     tags.push({ t: '✓ Good eye contact',       c: [48,209,88]  });
      if (snap.headStability >= 75)  tags.push({ t: '✓ Stable head position',    c: [48,209,88]  });
      if (snap.vocalConfidence >= 75)tags.push({ t: '✓ Strong vocal confidence', c: [48,209,88]  });
      if (snap.eyeContact < 50)      tags.push({ t: '⚠ Eye contact needs work',  c: [255,214,10] });
      if (snap.headStability < 50)   tags.push({ t: '⚠ Head movement detected',  c: [255,214,10] });
      if (snap.speechClarity < 50)   tags.push({ t: '✗ Speech clarity low',      c: [255,69,58]  });

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      tags.forEach(({ t, c }) => {
        checkBreak(12);
        doc.setTextColor(...c);
        doc.text(t, margin + 8, y);
        y += 11;
      });

      // Deterministic delivery note (always available, no LLM)
      const deterministic = deterministicNotes[i + 1];
      if (deterministic) {
        checkBreak(20);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        const noteLines = doc.splitTextToSize(deterministic, contentW - 8);
        checkBreak(noteLines.length * 11 + 4);
        doc.text(noteLines, margin + 8, y);
        y += noteLines.length * 11 + 4;
      }

      // LLM content note — judges what was actually said, not delivery
      const content = contentNotes[i + 1];
      if (content) {
        checkBreak(20);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(41, 151, 255);
        const contentLines = doc.splitTextToSize(content, contentW - 8);
        checkBreak(contentLines.length * 11 + 4);
        doc.text(contentLines, margin + 8, y);
        y += contentLines.length * 11 + 4;
      }

      // Separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 10;
    }

    addFooter();
    doc.save(`adaptiq-report-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  // ============================================================
  // DISPLAY MODE
  // ============================================================
  function setMode(mode) {
    state.mode = mode;
    document.body.classList.toggle('mode-simple',    mode === 'simple');
    document.body.classList.toggle('mode-technical', mode === 'technical');

    // Hide gaze dot immediately when switching to simple
    if (mode === 'simple') {
      const dot = document.getElementById('gaze-dot');
      if (dot) dot.style.display = 'none';
    }

    // Pill toggle buttons (new design)
    const btnSimple = document.getElementById('mode-btn-simple');
    const btnTech   = document.getElementById('mode-btn-technical');
    if (btnSimple) btnSimple.classList.toggle('active', mode === 'simple');
    if (btnTech)   btnTech.classList.toggle('active',   mode === 'technical');

    // Legacy hidden checkbox
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) modeToggle.checked = (mode === 'technical');

    // Legacy hidden label spans (kept for any external code)
    const lblSimple    = document.getElementById('mode-label-simple');
    const lblTechnical = document.getElementById('mode-label-technical');
    if (lblSimple)    lblSimple.classList.toggle('active',    mode === 'simple');
    if (lblTechnical) lblTechnical.classList.toggle('active', mode === 'technical');
  }

  // ============================================================
  // SENSOR DOT UPDATES
  // ============================================================
  function updateSensorDot(id, dotState, message) {
    // dotState: 'inactive' | 'nominal' | 'active' | 'warning' | 'error'
    const dot = document.getElementById(`status-dot-${id}`);
    if (!dot) return;
    dot.className = `sensor-dot ${dotState}`;
    const tooltip = dot.querySelector('.sensor-dot-tooltip');
    if (tooltip && message) tooltip.textContent = message;
  }

  function updateSystemStatus(level, message) {
    // Map to sensor dot on the new design
    const stateMap = { nominal: 'nominal', warning: 'warning', error: 'error' };
    const dotState = stateMap[level] || 'inactive';
    const defaultMsg = level === 'nominal' ? 'All systems nominal'
                     : level === 'warning' ? 'Warning — degraded state'
                     : 'Error — check permissions';
    updateSensorDot('system', dotState, message || defaultMsg);

    // Backward compat: legacy status dot (may not exist in new HTML)
    const dot     = document.getElementById('system-status-dot');
    const tooltip = document.getElementById('ssd-tooltip-text');
    if (dot) dot.className = `system-status-dot status-${level}`;
    if (tooltip) tooltip.textContent = message || defaultMsg;
  }

  // ============================================================
  // BUS SUBSCRIPTIONS
  // ============================================================
  function attachBusListeners() {
    Bus.on('signal:update',         updateSignal);
    Bus.on('signal:face',           handleFaceSignal);
    Bus.on('signal:gaze',           handleGazeSignal);
    Bus.on('flag:fired',            handleFlag);
    Bus.on('intervention:trigger',  handleIntervention);
    Bus.on('scores:update',         handleScoresUpdate);
    Bus.on('calibration:complete',  handleCalibrationComplete);
    Bus.on('models:loaded',         () => { /* models ready */ });
    Bus.on('session:end', (data) => {
      if (data && data.summary) showSummary(data.summary);
      else endSession();
    });
    Bus.on('session:debrief', ({ text }) => {
      const insightsEl = document.getElementById('summary-insights');
      if (insightsEl && text) insightsEl.innerHTML = renderMarkdown(text);
    });

    // Sensor dot wiring — camera handled via handleFaceSignal → updateVideoStatus
    Bus.on('signal:audio', (data) => {
      if (data && data.ves !== undefined) {
        updateSensorDot('mic', 'active', 'Microphone active');
      }
    });
    Bus.on('claude:ready', () => {
      updateSensorDot('ai', 'active', 'AI ready');
    });
    Bus.on('claude:error', (err) => {
      updateSensorDot('ai', 'error', err && err.message ? err.message : 'AI error');
      updateOrb('red', 'AI Error', err && err.message ? err.message : 'Claude API error');
    });
  }

  // ============================================================
  // KEYBOARD SHORTCUTS
  // ============================================================
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const card = document.getElementById('orb-card');
        if (card && !card.classList.contains('hidden')) card.classList.add('hidden');
      }
      if (e.key === 'g' && state.currentScreen === 'dashboard' && state.mode === 'technical') {
        const dot = document.getElementById('gaze-dot');
        if (dot) dot.style.display = dot.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // ============================================================
  // PUBLIC INIT
  // ============================================================
  function init() {
    attachBusListeners();
    initProfileScreen();
    initOrbClickHandler();
    initKeyboardShortcuts();
  }

  // Expose a minimal public API for debugging/external use
  return {
    init,
    showScreen,
    startSession,
    addEventLog,
    updateOrb,
    handleFlag,
    handleIntervention,
    updateSignal,
    handleFaceSignal,
    handleGazeSignal,
    handleScoresUpdate,
    handleCalibrationComplete,
    setMode,
    updateSystemStatus,
    updateSensorDot,
  };

})();
```

## File: integration/brain.js

```javascript
// === ADAPTIQ BRAIN MODULE === //

// =========================================================
// 1. PROFILE CONFIG
// =========================================================
const ProfileConfig = (() => {
  // Each weakness contributes signal focus, tighter z-score/value thresholds,
  // and intervention overrides on top of the base profile.
  const WEAKNESS_CATALOG = {
    stuttering: {
      label: 'Stuttering',
      monitored_signals: ['silr', 'sr'],
      signal_z: { sr: 1.3 },
      val_thresholds: { PROLONGED_SILENCE_SILR: 50 },
      interventions: {
        PROLONGED_SILENCE: { action: 'claude_response', message: "Take your time — there's no rush." },
        SPEECH_PANIC:      { action: 'banner', message: "Pause, breathe, and continue whenever you're ready.", color: '#f59e0b', severity: 'medium' },
      },
    },
    eye_contact: {
      label: 'Losing Eye Contact',
      monitored_signals: ['gds', 'osr'],
      signal_z: { gds: 1.3 },
      val_thresholds: { GAZE_LOST_OSR: 65 },
      interventions: {
        GAZE_ERRATIC: { action: 'banner', message: 'Try to keep your eyes on the camera.', color: '#f59e0b', severity: 'medium' },
        GAZE_LOST:    { action: 'banner', message: "Look at the camera — I'm right here.", color: '#ef4444', severity: 'high' },
      },
    },
    distraction: {
      label: 'Distraction',
      monitored_signals: ['gds', 'hpd'],
      signal_z: { gds: 1.5, hpd: 1.5 },
      ces_alert_level: 45,
      interventions: {
        ATTENTION_DROP: { action: 'content_swap', message: "Let's try something different!" },
        FOCUS_DRIFT:    { action: 'focus_object',  message: 'Can you find the shape?', duration: 3000 },
      },
    },
    speaking_too_fast: {
      label: 'Speaking Too Fast',
      monitored_signals: ['sr', 'pvs'],
      val_thresholds: { SPEECH_PANIC_SR: 55, OVERCONFIDENT_PACE_SR: 50 },
      interventions: {
        SPEECH_PANIC:       { action: 'banner', message: "You're speaking very fast. Pause and collect your thoughts.", color: '#ef4444', severity: 'high' },
        OVERCONFIDENT_PACE: { action: 'banner', message: 'Great energy! Try varying your pace for emphasis.', color: '#3b82f6', severity: 'low' },
      },
    },
    anxiety: {
      label: 'Anxiety / Stress',
      monitored_signals: ['et', 'ves', 'pvs'],
      signal_z: { et: 1.5, ves: 1.5 },
      interventions: {
        STRESS_DETECTED: { action: 'break_timer', message: 'Time for a quick break!', duration: 30000 },
      },
    },
  };

  const BASE_INTERVENTIONS = {
    GAZE_ERRATIC:       { action: 'banner',         message: 'Maintain steady eye contact with the camera.', color: '#f59e0b', severity: 'medium' },
    GAZE_LOST:          { action: 'banner',         message: 'Look at the camera.', color: '#ef4444', severity: 'high' },
    ATTENTION_DROP:     { action: 'content_swap',   message: "Let's try something different!" },
    STRESS_DETECTED:    { action: 'banner',         message: "Take a breath. Slow down. You've got this.", color: '#f59e0b', severity: 'medium' },
    FOCUS_DRIFT:        { action: 'claude_response',message: 'Let me rephrase that differently.' },
    PROLONGED_SILENCE:  { action: 'claude_response',message: "You've been quiet — need help?" },
    SPEECH_PANIC:       { action: 'banner',         message: "You're speaking quickly. Take a moment.", color: '#f59e0b', severity: 'medium' },
    OVERCONFIDENT_PACE: { action: 'banner',         message: 'Great energy! Try varying your pace for emphasis.', color: '#3b82f6', severity: 'low' },
  };

  // threshold_z is the default z-score bound; val_thresholds are the default
  // raw-value bounds checked directly against a signal (0-100 scale).
  const DEFAULT_VAL_THRESHOLDS = {
    GAZE_LOST_OSR:          80,
    PROLONGED_SILENCE_SILR: 80,
    SPEECH_PANIC_SR:        70,
    OVERCONFIDENT_PACE_SR:  60,
    OVERCONFIDENT_PACE_PVS: 10,
  };

  function build(weaknesses = []) {
    const ids = weaknesses.map(w => (typeof w === 'string' ? w : w?.id)).filter(Boolean);

    const profile = {
      id: ids.length ? `custom:${ids.join('+')}` : 'custom:general',
      name: ids.length ? ids.map(id => WEAKNESS_CATALOG[id]?.label || id).join(' + ') : 'General',
      threshold_z: 2.0,
      ces_alert_level: 35,
      cooldown_seconds: 15,
      monitored_signals: ['gds', 'osr', 'hpd', 'et', 'ves', 'pvs', 'sr', 'silr', 'bra'],
      signal_z: {},
      val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
      interventions: JSON.parse(JSON.stringify(BASE_INTERVENTIONS)),
      weaknesses: ids,
    };

    ids.forEach(id => {
      const w = WEAKNESS_CATALOG[id];
      if (!w) return;
      if (w.ces_alert_level !== undefined) profile.ces_alert_level = w.ces_alert_level;
      if (w.signal_z) Object.assign(profile.signal_z, w.signal_z);
      if (w.val_thresholds) Object.assign(profile.val_thresholds, w.val_thresholds);
      if (w.interventions) {
        Object.entries(w.interventions).forEach(([flag, iv]) => {
          profile.interventions[flag] = { ...profile.interventions[flag], ...iv };
        });
      }
    });

    return profile;
  }

  // Legacy single-select UI profile IDs map to a starter weakness set until
  // the weakness-picker UI (later phase) replaces the profile-card selector.
  const LEGACY_WEAKNESSES = {
    special_needs: ['distraction', 'eye_contact'],
    adhd:          ['distraction'],
    anxiety:       ['anxiety'],
    asd:           ['eye_contact'],
  };

  const INTERVIEW_COACH = {
    id: 'interview_coach',
    name: 'Interview Coach',
    threshold_z: 2.0,
    ces_alert_level: 35,
    cooldown_seconds: 15,
    monitored_signals: ['gds', 'osr', 'hpd', 'ves', 'pvs', 'sr', 'silr'],
    scored_metrics: true,
    signal_z: {},
    val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
    interventions: {
      GAZE_ERRATIC:        { action: 'banner',         message: 'Maintain steady eye contact with the camera.',              color: '#f59e0b', severity: 'medium' },
      GAZE_LOST:           { action: 'banner',         message: 'Look at the camera — your interviewer is here.',           color: '#ef4444', severity: 'high'   },
      STRESS_DETECTED:     { action: 'banner',         message: "Take a breath. Slow down. You've got this.",               color: '#f59e0b', severity: 'medium' },
      SPEECH_PANIC:        { action: 'banner',         message: "You're speaking very fast. Pause and collect your thoughts.", color: '#ef4444', severity: 'high' },
      PROLONGED_SILENCE:   { action: 'claude_response',message: "Looks like you're thinking — want a hint?"                                                       },
      OVERCONFIDENT_PACE:  { action: 'banner',         message: 'Great energy! Try varying your pace for emphasis.',        color: '#3b82f6', severity: 'low'    },
    },
  };

  const LANGUAGE_TEACHER = {
    id: 'language_teacher',
    name: 'Language Teacher',
    threshold_z: 2.0,
    ces_alert_level: 35,
    cooldown_seconds: 15,
    monitored_signals: ['et', 'pvs', 'silr', 'sr'],
    signal_z: {},
    val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
    interventions: {
      STRESS_DETECTED:   { action: 'content_swap',   message: "Let's simplify this. Try an easier sentence."     },
      FOCUS_DRIFT:       { action: 'claude_response',message: 'Let me rephrase that differently.'                },
      PROLONGED_SILENCE: { action: 'claude_response',message: 'Take your time. Want me to repeat?'               },
      SPEECH_PANIC:      { action: 'banner',         message: 'Slow down — pronunciation is more important than speed.', color: '#f59e0b', severity: 'medium' },
    },
  };

  return {
    WEAKNESS_CATALOG,
    INTERVIEW_COACH,
    LANGUAGE_TEACHER,
    build,
    getById(id) {
      if (id === 'interview_coach')  return INTERVIEW_COACH;
      if (id === 'language_teacher') return LANGUAGE_TEACHER;
      const weaknesses = LEGACY_WEAKNESSES[id];
      return weaknesses ? build(weaknesses) : null;
    },
  };
})();

window.ProfileConfig = ProfileConfig;

// =========================================================
// 2. ANOMALY DETECTOR
// =========================================================
const AnomalyDetector = (() => {
  const SIGNAL_NAMES = ['gds', 'osr', 'hpd', 'et', 'ves', 'pvs', 'silr', 'sr', 'bra'];

  // CES weights — silr intentionally excluded per spec formula
  const CES_W = { gds: 0.20, osr: 0.20, hpd: 0.15, et: 0.10, ves: 0.10, pvs: 0.10, sr: 0.10, bra: 0.05 };

  // Sustained durations before a flag fires (ms)
  const FLAG_DURATION = {
    GAZE_ERRATIC:       3000,
    GAZE_LOST:          5000,
    ATTENTION_DROP:     10000,
    STRESS_DETECTED:    5000,
    FOCUS_DRIFT:        8000,
    SPEECH_PANIC:       3000,
    PROLONGED_SILENCE:  15000,
    OVERCONFIDENT_PACE: 10000,
  };

  const FLAG_SEVERITY = {
    GAZE_ERRATIC:       'medium',
    GAZE_LOST:          'high',
    ATTENTION_DROP:     'high',
    STRESS_DETECTED:    'medium',
    FOCUS_DRIFT:        'low',
    SPEECH_PANIC:       'high',
    PROLONGED_SILENCE:  'medium',
    OVERCONFIDENT_PACE: 'low',
  };

  let buffers = {};
  let latestSignals = {};
  let isCalibrating = true;
  let calibrationStartTime = null;
  let activeProfile = null;
  let detectionInterval = null;
  let flagOnsetTimes = {}; // { flagType: firstSeenTimestamp }

  function clamp(v, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, v)); }

  function makeBuffer() {
    // Lazy-create so we don't crash if SignalBuffer isn't loaded yet
    return (typeof SignalBuffer !== 'undefined') ? new SignalBuffer(60) : null;
  }

  function resetState() {
    buffers = {};
    SIGNAL_NAMES.forEach(n => { buffers[n] = makeBuffer(); });
    latestSignals = {};
    flagOnsetTimes = {};
    isCalibrating = true;
    calibrationStartTime = Date.now();
  }

  function pushToBuffer(name, value) {
    if (!buffers[name]) buffers[name] = makeBuffer();
    if (buffers[name]) buffers[name].push(value);
  }

  function getZ(name) {
    const buf = buffers[name];
    if (!buf) return 0;
    const val = latestSignals[name] || 0;
    return buf.zScore(val);
  }

  function getVal(name) { return latestSignals[name] || 0; }

  function computeCES(s) {
    const raw = Object.keys(CES_W).reduce((sum, k) => sum + (s[k] || 0) * CES_W[k], 0);
    return clamp(100 - raw);
  }

  function zFor(name) {
    return (activeProfile.signal_z && activeProfile.signal_z[name]) || activeProfile.threshold_z;
  }

  function vt(key, fallback) {
    const v = activeProfile.val_thresholds && activeProfile.val_thresholds[key];
    return v !== undefined ? v : fallback;
  }

  function checkCondition(flagType) {
    if (!activeProfile) return false;
    switch (flagType) {
      case 'GAZE_ERRATIC':       return getZ('gds') > zFor('gds');
      case 'GAZE_LOST':          return getVal('osr') > vt('GAZE_LOST_OSR', 80);
      case 'ATTENTION_DROP':     return computeCES(latestSignals) < activeProfile.ces_alert_level;
      case 'STRESS_DETECTED':    return getZ('et') > zFor('et') && (getZ('ves') > zFor('ves') || getZ('pvs') > zFor('pvs'));
      case 'FOCUS_DRIFT':        return getZ('gds') > zFor('gds') * 0.8 && getZ('hpd') > zFor('hpd') * 0.8;
      case 'SPEECH_PANIC':       return getVal('sr') > vt('SPEECH_PANIC_SR', 70) && getZ('ves') > zFor('ves');
      case 'PROLONGED_SILENCE':  return getVal('silr') > vt('PROLONGED_SILENCE_SILR', 80);
      case 'OVERCONFIDENT_PACE': return getVal('sr') > vt('OVERCONFIDENT_PACE_SR', 60) && getVal('pvs') < vt('OVERCONFIDENT_PACE_PVS', 10);
      default:                   return false;
    }
  }

  function detectionCycle() {
    if (!activeProfile) return;

    const now = Date.now();
    const elapsed = now - calibrationStartTime;

    if (isCalibrating) {
      if (elapsed < 8000) {
        Bus.emit('signal:update', { ...latestSignals, ces: 100 });
        return;
      }
      isCalibrating = false;
      Bus.emit('calibration:complete', { type: 'baseline' });
    }

    const ces = computeCES(latestSignals);
    Bus.emit('signal:update', { ...latestSignals, ces });

    // Evaluate every flag that has an intervention in the active profile
    Object.keys(FLAG_DURATION).forEach(flagType => {
      if (!activeProfile.interventions[flagType]) return;

      const triggered = checkCondition(flagType);

      if (triggered) {
        if (!flagOnsetTimes[flagType]) {
          flagOnsetTimes[flagType] = now;
        } else if (now - flagOnsetTimes[flagType] >= FLAG_DURATION[flagType]) {
          // Fire and reset onset so it can re-fire after another sustained window
          delete flagOnsetTimes[flagType];
          Bus.emit('flag:fired', {
            type: flagType,
            severity: FLAG_SEVERITY[flagType],
            timestamp: now,
            message: activeProfile.interventions[flagType]?.message || flagType,
          });
        }
      } else {
        delete flagOnsetTimes[flagType];
      }
    });
  }

  function init(profile) {
    activeProfile = profile;
    resetState();
  }

  function start() {
    if (detectionInterval) clearInterval(detectionInterval);
    detectionInterval = setInterval(() => {
      try { detectionCycle(); } catch (e) { console.error('[AnomalyDetector]', e); }
    }, 100);
  }

  function stop() {
    if (detectionInterval) { clearInterval(detectionInterval); detectionInterval = null; }
  }

  function reset() { stop(); resetState(); }

  function getCES() { return computeCES(latestSignals); }

  // --- Signal subscriptions ---
  Bus.on('signal:face', ({ et, hpd, bra }) => {
    latestSignals.et  = et  || 0;
    latestSignals.hpd = hpd || 0;
    latestSignals.bra = bra || 0;
    pushToBuffer('et',  latestSignals.et);
    pushToBuffer('hpd', latestSignals.hpd);
    pushToBuffer('bra', latestSignals.bra);
  });

  Bus.on('signal:gaze', ({ gds, osr }) => {
    latestSignals.gds = gds || 0;
    latestSignals.osr = osr || 0;
    pushToBuffer('gds', latestSignals.gds);
    pushToBuffer('osr', latestSignals.osr);
  });

  Bus.on('signal:audio', ({ ves, pvs, silr, sr }) => {
    latestSignals.ves  = ves  || 0;
    latestSignals.pvs  = pvs  || 0;
    latestSignals.silr = silr || 0;
    latestSignals.sr   = sr   || 0;
    pushToBuffer('ves',  latestSignals.ves);
    pushToBuffer('pvs',  latestSignals.pvs);
    pushToBuffer('silr', latestSignals.silr);
    pushToBuffer('sr',   latestSignals.sr);
  });

  Bus.on('profile:selected', ({ id, config }) => { init(config); });

  return {
    init, start, stop, reset,
    get isCalibrating() { return isCalibrating; },
    getCES,
  };
})();

window.AnomalyDetector = AnomalyDetector;

// =========================================================
// 3. INTERVENTION DISPATCHER
// =========================================================
const InterventionDispatcher = (() => {
  let lastInterventionTime = 0;
  let interventionLog = [];
  let activeProfile = null;

  function init(profile) {
    activeProfile = profile;
    interventionLog = [];
    lastInterventionTime = 0;
  }

  Bus.on('profile:selected', ({ id, config }) => { init(config); });

  Bus.on('flag:fired', (flag) => {
    if (!activeProfile) return;

    const now = Date.now();
    if (now - lastInterventionTime < activeProfile.cooldown_seconds * 1000) return;

    const intervention = activeProfile.interventions[flag.type];
    if (!intervention) return;

    interventionLog.push({ flag, intervention, timestamp: now });
    lastInterventionTime = now;

    if (intervention.action === 'claude_response') {
      const context = {
        profile: activeProfile,
        signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
        transcript: window.AudioEngine ? AudioEngine.getTranscript() : '',
        flagType: flag.type,
        message: intervention.message,
      };
      window.ClaudeClient?.generate(context);
    } else {
      Bus.emit('intervention:trigger', { ...intervention, profile: activeProfile.id });
    }
  });

  // On-demand help — ui.js stays decoupled from ClaudeClient/AudioEngine and
  // only knows the current question; this listener owns gathering context.
  // Not gated by the intervention cooldown: a manual click is an explicit
  // request, not an anomaly-driven interruption.
  Bus.on('help:requested', ({ questionText } = {}) => {
    if (!activeProfile) return;

    const now = Date.now();
    const allSegments = window.AudioEngine && AudioEngine.getTranscriptSegments
      ? AudioEngine.getTranscriptSegments()
      : [];
    const recentTranscript = allSegments
      .filter(s => now - s.timestamp <= 60000)
      .map(s => s.text)
      .join(' ');

    const context = {
      profile: activeProfile,
      signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
      transcript: recentTranscript,
      requestType: 'help',
      questionText: questionText || '',
      message: "Here's a tip for this question.",
    };
    window.ClaudeClient?.generate(context);
  });

  // Technical-question code sandbox (Phase 9) — once a real backend exists
  // and emits sandbox:result after executing submitted code, this triggers
  // LLM feedback on algorithmic efficiency (not correctness — the sandbox's
  // hidden test cases already judge that deterministically).
  Bus.on('sandbox:result', (result) => {
    if (!activeProfile || !result) return;
    window.ClaudeClient?.generate({
      profile: activeProfile,
      signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
      requestType: 'sandbox_feedback',
      sandboxResult: result,
      message: 'Here\'s feedback on your solution\'s efficiency.',
    });
  });

  return {
    init,
    getLog()  { return [...interventionLog]; },
    reset()   { interventionLog = []; lastInterventionTime = 0; },
  };
})();

window.InterventionDispatcher = InterventionDispatcher;

// =========================================================
// 4. CLAUDE CLIENT
// =========================================================
const ClaudeClient = (() => {
  let apiKey = null;

  const SYSTEM_PROMPTS = {
    interview_coach:  'You are a professional interview coach. Give direct, actionable feedback. Reference specific behaviors (eye contact, pacing, filler words). Keep responses under 3 sentences. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
    language_teacher: 'You are a friendly language teacher. Simplify your vocabulary. If the student is struggling, rephrase or offer an easier alternative. Keep responses under 2 sentences. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
  };

  // Coaching guidance per weakness (Phase 1's ProfileConfig.build) — injected
  // into the system prompt for weakness-based custom profiles so real-time
  // advice targets the user's actual selected pain points.
  const WEAKNESS_COACHING_NOTES = {
    stuttering:        'they may stutter or need extra time to get words out — never rush them, and reassure them that pausing is fine',
    eye_contact:       'they tend to lose eye contact with the camera — gently encourage them to look back at the camera without repeating yourself',
    distraction:       'they are prone to losing focus — help redirect their attention kindly',
    speaking_too_fast: 'they tend to speak too quickly when nervous — encourage a slower, steadier pace',
    anxiety:           'they experience anxiety or stress during interviews — keep your tone calm and reassuring',
  };

  function setApiKey(key) { apiKey = key; }

  function systemPromptFor(profile) {
    const profileId = profile?.id || 'interview_coach';
    if (SYSTEM_PROMPTS[profileId]) return SYSTEM_PROMPTS[profileId];

    const notes = (profile?.weaknesses || []).map(w => WEAKNESS_COACHING_NOTES[w]).filter(Boolean);
    const tailored = notes.length ? ` Keep in mind: ${notes.join('; ')}.` : '';
    return `You are a warm, encouraging interview coach for a neurodivergent job seeker.${tailored} Keep responses under 2-3 sentences and avoid jargon. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.`;
  }

  async function generate(context) {
    const { profile, signals, transcript, flagType, message, requestType, questionText, sandboxResult } = context;
    const systemPrompt = systemPromptFor(profile);
    const userMsg = requestType === 'help'
      ? `The candidate tapped "Help" while answering: "${questionText || ''}". Recent transcript (last 60s): "${(transcript || '').slice(-600)}". Give one brief, encouraging tip to help them answer this specific question well.`
      : requestType === 'sandbox_feedback'
      ? `The candidate submitted a coding solution that passed ${sandboxResult.passed}/${sandboxResult.total} hidden test cases, with time complexity O(${sandboxResult.timeComplexity || '?'}) and space complexity O(${sandboxResult.spaceComplexity || '?'}). Give one brief tip on the algorithmic efficiency of their approach — do not comment on correctness, that's already judged.`
      : `Flag triggered: ${flagType}. CES=${(signals.ces || 0).toFixed(0)}. Transcript: "${(transcript || '').slice(-200)}". Respond briefly and helpfully.`;

    if (!apiKey) {
      Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      return;
    }

    let settled = false;
    const fallback = setTimeout(() => {
      if (!settled) {
        settled = true;
        Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      }
    }, 3000);

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 150,
          stream: true,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });

      if (!resp.ok) {
        clearTimeout(fallback);
        if (!settled) { settled = true; Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true }); }
        return;
      }

      clearTimeout(fallback);
      settled = true;

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split('\n');
        buf = lines.pop(); // keep incomplete line for next chunk

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'content_block_delta' && evt.delta?.text) {
              Bus.emit('intervention:trigger', { action: 'claude_response', chunk: evt.delta.text, done: false });
            }
          } catch { /* malformed SSE — skip */ }
        }
      }

      Bus.emit('intervention:trigger', { action: 'claude_response', chunk: '', done: true });
    } catch (err) {
      console.error('[ClaudeClient] generate error:', err);
      if (!settled) {
        settled = true;
        clearTimeout(fallback);
        Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      }
    }
  }

  async function generateDebrief(sessionData) {
    if (!apiKey) return null;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 400,
          system: 'You are a professional interview coach writing a session debrief. Be constructive, specific, and encouraging. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
          messages: [{
            role: 'user',
            content: `Write a professional debrief for this interview practice session.\n\nSession data:\n${JSON.stringify(sessionData, null, 2)}\n\nInclude: overall performance summary, 2 strengths, 2 areas to improve, and 2 actionable tips.`,
          }],
        }),
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      return json.content?.[0]?.text || null;
    } catch (err) {
      console.error('[ClaudeClient] debrief error:', err);
      return null;
    }
  }

  return { setApiKey, generate, generateDebrief };
})();

window.ClaudeClient = ClaudeClient;

// =========================================================
// 5. INTERVIEW SCORECARD
// =========================================================
const InterviewScorecard = (() => {
  const FILLER_RE = /\b(um|uh|like|you know|basically|actually|literally)\b/gi;

  let totalFrames = 0;
  let framesWithGoodEyeContact = 0;
  let hpdValues = [];
  let fillerCount = 0;
  let wordCount = 0;
  let latestPvs = 0, latestSilr = 0, latestSr = 0;
  let scoreInterval = null;
  let signalUpdateHandler = null;
  let audioHandler = null;

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function reset() {
    totalFrames = 0;
    framesWithGoodEyeContact = 0;
    hpdValues = [];
    fillerCount = 0;
    wordCount = 0;
    latestPvs = 0; latestSilr = 0; latestSr = 0;
  }

  function getScores() {
    const eyeContact    = clamp(totalFrames > 0 ? (framesWithGoodEyeContact / totalFrames) * 100 : 0);
    const avgHpd        = hpdValues.length > 0 ? hpdValues.reduce((a, b) => a + b, 0) / hpdValues.length : 0;
    const headStability = clamp(100 - avgHpd);
    const vocalConfidence = clamp(100 - latestPvs - latestSilr * 0.5);
    const fillerPenalty   = wordCount > 0 ? (fillerCount / wordCount) * 100 : 0;
    const speechClarity   = clamp(100 - latestSr - fillerPenalty);
    const overall         = clamp(eyeContact * 0.25 + headStability * 0.20 + vocalConfidence * 0.25 + speechClarity * 0.30);

    let grade = 'F';
    if (overall >= 85) grade = 'A';
    else if (overall >= 70) grade = 'B';
    else if (overall >= 55) grade = 'C';
    else if (overall >= 40) grade = 'D';

    return { eyeContact, headStability, vocalConfidence, speechClarity, overall, grade };
  }

  function init() {
    reset();

    // Remove stale listeners before adding fresh ones
    if (signalUpdateHandler) Bus.off('signal:update', signalUpdateHandler);
    if (audioHandler) Bus.off('signal:audio', audioHandler);

    signalUpdateHandler = ({ osr, hpd }) => {
      totalFrames++;
      if ((osr || 0) < 30) framesWithGoodEyeContact++;
      if (hpd !== undefined) {
        hpdValues.push(hpd);
        if (hpdValues.length > 300) hpdValues.shift(); // keep ~10s @ 30fps
      }
    };

    audioHandler = ({ pvs, silr, sr, transcript }) => {
      latestPvs  = pvs  || 0;
      latestSilr = silr || 0;
      latestSr   = sr   || 0;
      if (transcript) {
        const matches = transcript.match(FILLER_RE);
        fillerCount = matches ? matches.length : 0;
        wordCount   = transcript.trim().split(/\s+/).filter(Boolean).length;
      }
    };

    Bus.on('signal:update', signalUpdateHandler);
    Bus.on('signal:audio',  audioHandler);

    if (scoreInterval) clearInterval(scoreInterval);
    scoreInterval = setInterval(() => {
      try { Bus.emit('scores:update', getScores()); } catch (e) { console.error('[InterviewScorecard]', e); }
    }, 2000);
  }

  Bus.on('profile:selected', ({ id }) => {
    if (id === 'interview_coach') init();
  });

  return { init, reset, getScores };
})();

window.InterviewScorecard = InterviewScorecard;

// =========================================================
// 6. SESSION MANAGER
// =========================================================
const SessionManager = (() => {
  let sessionStartTime = null;
  let lastSessionData  = null;

  function start() {
    sessionStartTime = Date.now();
    lastSessionData  = null;
  }

  async function endSession() {
    const duration = sessionStartTime ? Date.now() - sessionStartTime : 0;
    const mins     = Math.floor(duration / 60000);
    const secs     = Math.floor((duration % 60000) / 1000);

    const flagLog     = window.InterventionDispatcher ? InterventionDispatcher.getLog() : [];
    const scores      = window.InterviewScorecard    ? InterviewScorecard.getScores()  : null;
    const transcript  = window.AudioEngine           ? AudioEngine.getTranscript()     : '';
    const transcript_segments = window.AudioEngine && AudioEngine.getTranscriptSegments
      ? AudioEngine.getTranscriptSegments()
      : [];
    const ces         = window.AnomalyDetector       ? AnomalyDetector.getCES()        : 0;

    lastSessionData = {
      duration_ms:       duration,
      duration_readable: `${mins}m ${secs}s`,
      ces_final:         ces,
      total_flags:       flagLog.length,
      flag_log:          flagLog,
      scores,
      transcript:        transcript.slice(-2000),
      // Structured per-utterance transcript ({timestamp, speaker, text, wpm})
      // for the LLM report payload — richer than the flat string above.
      transcript_segments,
      exported_at:       new Date().toISOString(),
    };

    Bus.emit('session:end', { summary: lastSessionData });

    // Generate debrief for Interview Coach (non-blocking — fires after session:end)
    if (scores && window.ClaudeClient) {
      ClaudeClient.generateDebrief(lastSessionData).then(debrief => {
        if (debrief) {
          lastSessionData.debrief = debrief;
          Bus.emit('session:debrief', { text: debrief });
        }
      });
    }

    return lastSessionData;
  }

  function getSessionData() { return lastSessionData; }

  return { start, endSession, getSessionData };
})();

window.SessionManager = SessionManager;

// =========================================================
// 7. BRAIN MANAGER — top-level orchestrator
// =========================================================
window.BrainManager = {
  // Accepts either a legacy profile id string or an array of weakness ids
  // (e.g. ['stuttering', 'eye_contact']) built via ProfileConfig.build().
  init(profileIdOrWeaknesses) {
    const isWeaknessArray = Array.isArray(profileIdOrWeaknesses);
    const profile = isWeaknessArray
      ? ProfileConfig.build(profileIdOrWeaknesses)
      : ProfileConfig.getById(profileIdOrWeaknesses);
    if (!profile) { console.error('[BrainManager] Unknown profile:', profileIdOrWeaknesses); return; }

    const id = isWeaknessArray ? profile.id : profileIdOrWeaknesses;
    Bus.emit('profile:selected', { id, config: profile });
    AnomalyDetector.init(profile);
    InterventionDispatcher.init(profile);
    if (id === 'interview_coach') InterviewScorecard.init();
    SessionManager.start();
  },
  start()      { AnomalyDetector.start(); },
  stop()       { AnomalyDetector.stop();  },
  endSession() { return SessionManager.endSession(); },
};
```

## File: perception/sensors.js

```javascript
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

  // z-score of a new incoming value relative to the current buffer
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

  // Smoothing buffers
  const etBuf  = new SignalBuffer(60);
  const hpdBuf = new SignalBuffer(60);
  const braBuf = new SignalBuffer(60);

  // Blink state
  let blinkCount = 0;
  let blinkTimestamps = [];   // rolling 60-second window of blink times
  let earBelow = 0;           // consecutive frames with EAR < threshold
  const EAR_THRESHOLD = 0.21;
  const BLINK_MIN_FRAMES = 2;

  // HPD pitch baseline — calibrated from first 30 detected frames
  let pitchBaseline = null;
  let pitchSamples = [];
  let sessionStartTime = null;

  // Euclidean distance between two landmark points {x, y}
  function dist(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  // Eye Aspect Ratio for one eye (6 landmark indices)
  function eyeAspectRatio(pts) {
    // pts[0]=p1(corner), pts[1]=p2, pts[2]=p3, pts[3]=p4(corner), pts[4]=p5, pts[5]=p6
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
      const yaw = Math.abs(yawRatio - 1) * 100; // 0 = centred

      // Pitch: deviation from anatomical baseline (nose always below eyes)
      const leftEye  = pts[36];
      const rightEye = pts[45];
      const eyeMidY  = (leftEye.y + rightEye.y) / 2;
      const eyeSpan  = dist(leftEye, rightEye);
      const rawPitch = (noseTip.y - eyeMidY) / (eyeSpan + 1e-6) * 100;

      // Calibrate pitch baseline from first 30 frames so neutral pose = 0
      if (pitchSamples.length < 30) {
        pitchSamples.push(rawPitch);
        pitchBaseline = pitchSamples.reduce((a, b) => a + b, 0) / pitchSamples.length;
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

      if (ear < EAR_THRESHOLD) {
        earBelow++;
      } else {
        if (earBelow >= BLINK_MIN_FRAMES) {
          blinkTimestamps.push(Date.now());
        }
        earBelow = 0;
      }

      const now = Date.now();
      blinkTimestamps = blinkTimestamps.filter(t => now - t < 60000);

      // Normalize blink count to per-minute rate based on elapsed time (avoids false spike in first 60s)
      const elapsedSecs = sessionStartTime ? (now - sessionStartTime) / 1000 : 60;
      const windowSecs  = Math.min(60, Math.max(elapsedSecs, 10));
      const blinksPerMin = (blinkTimestamps.length / windowSecs) * 60;

      // BRA: deviation from normal rate ~17 bpm
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
// Uses MediaPipe Face Mesh iris landmarks instead of WebGazer.
// No clicking required — calibration is "look straight ahead for 3 seconds."
const GazeEngine = (() => {
  let faceMesh = null;
  let videoEl  = null;
  let loopId   = null;
  let running  = false;
  let latest   = { gds: 0, osr: 0, x: 0, y: 0 };

  // Calibration: baseline iris position when looking straight at camera
  let baseline     = null;
  let calibrating  = false;
  let calibSamples = [];

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

  // MediaPipe 478-landmark indices (refineLandmarks: true)
  const L_IRIS = 468, R_IRIS = 473;
  const L_OUTER = 33,  L_INNER = 133, L_TOP = 159, L_BOT = 145;
  const R_INNER = 362, R_OUTER = 263, R_TOP = 386, R_BOT = 374;

  // Returns normalised iris position within each eye (0=edge, 0.5=centre, 1=other edge)
  function _irisRatio(lm) {
    const lx = (lm[L_IRIS].x - lm[L_OUTER].x) / (lm[L_INNER].x - lm[L_OUTER].x + 1e-6);
    const ly = (lm[L_IRIS].y - lm[L_TOP].y)   / (lm[L_BOT].y   - lm[L_TOP].y   + 1e-6);
    const rx = (lm[R_IRIS].x - lm[R_INNER].x) / (lm[R_OUTER].x - lm[R_INNER].x + 1e-6);
    const ry = (lm[R_IRIS].y - lm[R_TOP].y)   / (lm[R_BOT].y   - lm[R_TOP].y   + 1e-6);
    return { avgX: (lx + rx) / 2, avgY: (ly + ry) / 2 };
  }

  // Maps iris deviation from baseline to screen pixel coordinates
  function _irisToScreen(iris) {
    if (!baseline) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dx = iris.avgX - baseline.avgX;
    const dy = iris.avgY - baseline.avgY;
    // ±0.15 iris ratio = full half-screen  →  scale = (W/2) / 0.15
    const sx = window.innerWidth  / 2 + dx * (window.innerWidth  / 0.3);
    const sy = window.innerHeight / 2 + dy * (window.innerHeight / 0.3);
    return {
      x: Math.max(0, Math.min(window.innerWidth,  sx)),
      y: Math.max(0, Math.min(window.innerHeight, sy)),
    };
  }

  function _onResults(results) {
    if (!results.multiFaceLandmarks?.length) return;
    const lm = results.multiFaceLandmarks[0];
    if (!lm[L_IRIS] || !lm[R_IRIS]) return; // iris not in this frame

    const iris = _irisRatio(lm);

    if (calibrating) {
      calibSamples.push(iris);
      return;
    }

    if (!running) return;

    const raw = _irisToScreen(iris);
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
      refineLandmarks: true,   // enables iris landmarks 468-477
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(_onResults);

    // Warm up the model
    await faceMesh.initialize();

    // Start a low-frequency loop (10fps is plenty for gaze)
    loopId = setInterval(async () => {
      if (videoEl.readyState >= 2) {
        try { await faceMesh.send({ image: videoEl }); }
        catch (e) { console.warn('[GazeEngine] send error:', e); }
      }
    }, 100);
  }

  function startCalibration() {
    return new Promise((resolve) => {
      calibrating  = true;
      calibSamples = [];
      kalmanX = makeKalman1D();
      kalmanY = makeKalman1D();

      const overlay = document.createElement('div');
      overlay.id = 'gaze-calibration-overlay';
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:9999;background:rgba(10,10,15,0.95);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;
      `;

      const msg = document.createElement('p');
      msg.style.cssText = `color:#e4e4e7;font-size:1.3rem;font-family:sans-serif;text-align:center;`;
      msg.textContent = 'Look at the dot and stay still';

      const dot = document.createElement('div');
      dot.style.cssText = `
        width:28px;height:28px;border-radius:50%;
        background:#00d4ff;box-shadow:0 0 24px #00d4ff;
      `;

      const track = document.createElement('div');
      track.style.cssText = `width:280px;height:6px;background:#2a2a3a;border-radius:3px;overflow:hidden;`;
      const fill = document.createElement('div');
      fill.style.cssText = `height:100%;width:0%;background:#00d4ff;transition:width 0.1s linear;`;
      track.appendChild(fill);

      const sub = document.createElement('p');
      sub.style.cssText = `color:#a1a1aa;font-size:0.9rem;font-family:sans-serif;`;
      sub.textContent = 'Capturing your eye baseline…';

      overlay.append(msg, dot, track, sub);
      document.body.appendChild(overlay);

      const DURATION = 2000;
      const start = Date.now();

      const tick = setInterval(() => {
        const elapsed = Date.now() - start;
        fill.style.width = Math.min(100, elapsed / DURATION * 100) + '%';

        if (elapsed >= DURATION) {
          clearInterval(tick);
          calibrating = false;

          // Average samples as the "looking straight" baseline
          if (calibSamples.length > 5) {
            baseline = {
              avgX: calibSamples.reduce((s, v) => s + v.avgX, 0) / calibSamples.length,
              avgY: calibSamples.reduce((s, v) => s + v.avgY, 0) / calibSamples.length,
            };
          } else {
            baseline = { avgX: 0.5, avgY: 0.5 }; // fallback if no face detected
          }

          document.body.removeChild(overlay);
          Bus.emit('calibration:complete', { type: 'gaze' });
          resolve();
        }
      }, 100);
    });
  }

  function start() { running = true; }
  function stop()  {
    running = false;
    if (loopId) { clearInterval(loopId); loopId = null; }
  }
  function getLatest() { return latest; }

  return { init, startCalibration, start, stop, getLatest };
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
  let wordTimestamps = []; // rolling 60-second window: [{ words, time }]

  // Buffers
  const rmsBuf       = new SignalBuffer(30);
  const centroidBuf  = new SignalBuffer(30);
  const silenceWindows = []; // last 15 windows (true/false for silence)

  // Adaptive silence threshold — calibrated from ambient noise in first 5 windows
  let silenceThreshold = 0.01; // default, overridden after calibration
  let ambientSamples = [];

  let latestFeatures = { rms: 0, spectralCentroid: 0 };
  let latest = { ves: 0, pvs: 0, silr: 0, sr: 0, transcript: '' };

  // Fallback RMS from AnalyserNode when Meyda isn't available
  function _rmsFromAnalyser() {
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    const sum = buf.reduce((s, v) => s + v * v, 0);
    return Math.sqrt(sum / buf.length);
  }

  function _setupSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const now = Date.now();
          const text = t.trim();
          const words = text.split(/\s+/).filter(Boolean).length;
          // Per-utterance WPM: words over elapsed time since the previous
          // finalized segment (first segment falls back to a ~135 WPM
          // estimate since there's no prior segment to measure against).
          const elapsedSec = lastFinalTime ? Math.max(1, (now - lastFinalTime) / 1000) : Math.max(1, words / 2.25);
          const wpm = Math.round(words / (elapsedSec / 60));
          transcript.push({ timestamp: now, speaker: 'user', text, wpm });
          lastFinalTime = now;
          wordTimestamps.push({ words, time: now });
        } else {
          interim += t;
        }
      }
    };
    recognition.onerror = (e) => console.warn('[AudioEngine] SR error:', e.error);
    recognition.onend  = () => { if (running) recognition.start(); }; // auto-restart
  }

  async function init() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
      const rms = (meydaAnalyzer && latestFeatures?.rms != null)
        ? latestFeatures.rms
        : _rmsFromAnalyser();
      const centroid = latestFeatures?.spectralCentroid ?? 0;

      rmsBuf.push(rms);
      centroidBuf.push(centroid);

      // VES: upward spikes in vocal energy only (sudden quiet is not a vocal stress indicator)
      const ves = Math.min(100, Math.max(0, rmsBuf.zScore(rms)) * 25);

      // PVS: coefficient of variation of spectral centroid
      const centroidMean = centroidBuf.mean();
      const pvs = centroidMean > 0
        ? Math.min(100, (centroidBuf.stddev() / centroidMean) * 100)
        : 0;

      // Calibrate silence threshold from first 5 ambient RMS samples (before user speaks)
      if (ambientSamples.length < 5) {
        ambientSamples.push(rms);
        silenceThreshold = Math.max(0.005, ambientSamples.reduce((a,b)=>a+b,0)/ambientSamples.length * 3);
      }

      // SilR: fraction of last 15 windows that were silent
      silenceWindows.push(rms < silenceThreshold);
      if (silenceWindows.length > 15) silenceWindows.shift();
      const silr = (silenceWindows.filter(Boolean).length / silenceWindows.length) * 100;

      // SR: speech rate deviation from optimal 135 WPM
      // Return 0 (no penalty) when no speech data yet — user hasn't spoken, not speaking wrong
      const now = Date.now();
      wordTimestamps = wordTimestamps.filter(e => now - e.time < 60000);
      const totalWords = wordTimestamps.reduce((s, e) => s + e.words, 0);
      const sr = totalWords === 0 ? 0 : Math.min(100, Math.abs(totalWords - 135) / 135 * 100);

      latest = {
        ves: Math.round(ves),
        pvs: Math.round(pvs),
        silr: Math.round(silr),
        sr: Math.round(sr),
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

  function reset() {
    transcript = [];
    lastFinalTime = null;
    wordTimestamps = [];
    silenceWindows.length = 0;
    ambientSamples = [];
    silenceThreshold = 0.01;
  }

  return { init, start, stop, reset, getLatest, getTranscript, getTranscriptSegments };
})();

window.AudioEngine = AudioEngine;

// ─── SensorManager ───────────────────────────────────────────────────────────
window.SensorManager = {
  async init(videoElement) {
    await FaceEngine.init(videoElement);
    await GazeEngine.init(videoElement);
    await AudioEngine.init();
  },
  startCalibration() { return GazeEngine.startCalibration(); },
  start() { FaceEngine.start(); GazeEngine.start(); AudioEngine.start(); },
  stop()  { FaceEngine.stop();  GazeEngine.stop();  AudioEngine.stop();  },
};
```

## File: tests/metrics.test.js

```javascript
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
```

## File: index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AdaptIQ — Adaptive Learning Intelligence</title>

  <!-- Applied before first paint to avoid a flash of the wrong theme -->
  <script>
    (function () {
      try {
        if (localStorage.getItem('adaptiq-theme') === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  </script>

  <!-- CDN Dependencies -->
  <script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/meyda/dist/web/meyda.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Monaco Editor (technical-question code sandbox, Phase 9) -->
  <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

  <!-- Firebase (compat builds — work with plain scripts, no modules needed) -->
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>

  <!-- Resume text extraction: pdf.js for PDFs, mammoth for .docx -->
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js"></script>

  <style>
    /* =============================================
       DESIGN TOKENS
    ============================================= */
    :root {
      /* === COLOR PALETTE (dark theme, default) === */
      --bg-void:    #1c1c1e;
      --bg-panel:   #2c2c2e;
      --bg-surface: #232325;
      --bg-glass:   rgba(20,20,22,0.96);

      --accent:        #2997ff;
      --accent-dim:    rgba(41,151,255,0.15);
      --accent-border: rgba(41,151,255,0.3);

      --green:  #30d158;
      --yellow: #ffd60a;
      --red:    #ff453a;

      --text-primary:   #f5f5f7;
      --text-secondary: rgba(var(--overlay-rgb),0.6);
      --text-muted:     rgba(var(--overlay-rgb),0.3);

      --border:        rgba(var(--overlay-rgb),0.08);
      --border-bright: rgba(var(--overlay-rgb),0.12);

      --font: 'Space Grotesk', -apple-system, sans-serif;

      /* ── Backward-compat aliases ── */
      --bg-deep:       #111111;
      --bg-card:       #2c2c2e;
      --bg-card-hover: #3a3a3c;
      --cyan:          #2997ff;
      --cyan-dim:      rgba(41,151,255,0.15);
      --cyan-glow:     rgba(41,151,255,0.3);
      --accent-glow:   rgba(41,151,255,0.3);
      --amber:         #ffd60a;
      --amber-dim:     rgba(255,214,10,0.15);
      --purple:        #bf5af2;
      --green-dim:     rgba(48,209,88,0.1);
      --red-dim:       rgba(255,69,58,0.12);
      --font-display:  'Space Grotesk', -apple-system, sans-serif;
      --font-mono:     'Space Mono', monospace;
      --radius-sm:     6px;
      --radius:        10px;
      --radius-lg:     16px;
      --transition:    180ms cubic-bezier(0.4,0,0.2,1);
      --transition-slow: 360ms cubic-bezier(0.4,0,0.2,1);

      /* === SEMANTIC THEME TOKENS ===
         --overlay-rgb is the "on-surface" overlay color (white specks of
         opacity for borders/hover-fills/muted text on a dark surface).
         Every rgba(var(--overlay-rgb),X) utility in this file resolves through it
         so a single flip covers the whole app. */
      --overlay-rgb: 255,255,255;
      --bg-primary:  var(--bg-void);
      --surface:     var(--bg-panel);
      --text-main:   var(--text-primary);

      /* "Inverted" CTA controls (filled pill buttons, active step markers) —
         high-contrast against the page background in either theme. */
      --invert-bg: #fff;
      --invert-fg: #1c1c1e;

      /* Text/icons drawn on top of a saturated accent/status color
         (buttons filled with --accent/--red/etc.) — stays white in both
         themes since those fills are dark-saturated either way. */
      --on-accent: #fff;

      /* Face-tracking overlay drawn on top of the live camera feed — stays
         constant across themes (must read against a face, not app chrome). */
      --face-overlay-rgb: 0,229,255;
    }

    html[data-theme="light"] {
      --bg-void:    #f5f5f7;
      --bg-panel:   #ffffff;
      --bg-surface: #f0f0f2;
      --bg-glass:   rgba(255,255,255,0.92);

      --accent-dim:    rgba(41,151,255,0.1);
      --accent-border: rgba(41,151,255,0.25);

      --text-primary:   #1c1c1e;
      --text-secondary: rgba(0,0,0,0.6);
      --text-muted:     rgba(0,0,0,0.35);

      --border:        rgba(0,0,0,0.1);
      --border-bright: rgba(0,0,0,0.16);

      --bg-deep:       #e5e5e7;
      --bg-card:       #ffffff;
      --bg-card-hover: #ececee;
      --cyan-dim:      rgba(41,151,255,0.1);
      --amber-dim:     rgba(255,214,10,0.18);
      --green-dim:     rgba(48,209,88,0.12);
      --red-dim:       rgba(255,69,58,0.14);

      --overlay-rgb: 0,0,0;
      --bg-primary:  var(--bg-void);
      --surface:     var(--bg-panel);
      --text-main:   var(--text-primary);

      --invert-bg: #1c1c1e;
      --invert-fg: #fff;
    }

    /* =============================================
       RESET & BASE
    ============================================= */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 100%; height: 100%;
      overflow: hidden;
      background: var(--bg-void);
      color: var(--text-primary);
      font-family: var(--font-display);
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }

    /* No decorative backgrounds — clean Apple/Tesla aesthetic */
    body::before { display: none; }
    body::after  { display: none; }

    /* =============================================
       SCREEN SYSTEM
    ============================================= */
    .screen {
      position: fixed; inset: 0; z-index: 10;
      display: flex;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-slow);
    }
    .screen.active {
      opacity: 1;
      pointer-events: all;
    }

    /* =============================================
       SHARED COMPONENTS
    ============================================= */

    /* Scanlines removed — clean aesthetic */
    .scanlines { display: none; }

    /* Horizontal line decorations */
    .h-rule {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
      opacity: 0.6;
    }

    /* Status pill */
    .status-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
      border: 1px solid;
    }
    .status-pill.active  { color: var(--green);  border-color: var(--green);  background: var(--green-dim); }
    .status-pill.warn    { color: var(--amber);  border-color: var(--amber);  background: var(--amber-dim); }
    .status-pill.error   { color: var(--red);    border-color: var(--red);    background: var(--red-dim);   }
    .status-pill.idle    { color: var(--text-secondary); border-color: var(--text-muted); background: transparent; }

    .pulse-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: currentColor;
      animation: pulseDot 1.4s ease-in-out infinite;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }

    /* =============================================
       SCREEN 1 — LANDING (spotlight hero)
    ============================================= */
    #screen-profile {
      position: fixed; inset: 0;
      background: var(--bg-void);
      overflow: hidden;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Animated spotlight blobs */
    .spotlight-overlay {
      position: absolute; inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .spotlight-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.08;
    }
    .spotlight-blob--left {
      width: 600px; height: 600px;
      background: radial-gradient(circle, #ffffff, transparent 70%);
      top: 50%; left: 20%;
      transform: translate(-50%, -50%);
      animation: blobLeft 12s ease-in-out infinite alternate;
    }
    .spotlight-blob--mid {
      width: 480px; height: 480px;
      background: radial-gradient(circle, #c0c0c0, transparent 70%);
      top: 25%; left: 55%;
      transform: translate(-50%, -50%);
      animation: blobMid 15s ease-in-out 3s infinite alternate;
    }
    .spotlight-blob--right {
      width: 520px; height: 520px;
      background: radial-gradient(circle, #ffffff, transparent 70%);
      top: 65%; left: 72%;
      transform: translate(-50%, -50%);
      animation: blobRight 18s ease-in-out 5s infinite alternate;
    }
    @keyframes blobLeft {
      0%   { transform: translate(-50%, -50%) rotate(0deg); }
      33%  { transform: translate(-30%, -70%) rotate(15deg); }
      66%  { transform: translate(-70%, -30%) rotate(-15deg); }
      100% { transform: translate(-50%, -50%) rotate(0deg); }
    }
    @keyframes blobMid {
      0%   { transform: translate(-50%, -50%) rotate(-20deg); }
      33%  { transform: translate(-30%, -20%) rotate(0deg); }
      66%  { transform: translate(-70%, -40%) rotate(20deg); }
      100% { transform: translate(-50%, -50%) rotate(-20deg); }
    }
    @keyframes blobRight {
      0%   { transform: translate(-50%, -50%) rotate(10deg); }
      33%  { transform: translate(-80%, -70%) rotate(-10deg); }
      66%  { transform: translate(-40%, -30%) rotate(25deg); }
      100% { transform: translate(-50%, -50%) rotate(10deg); }
    }

    /* Landing content — minimal full-bleed layout */
    .landing-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 28px 36px;
      animation: landingFadeUp 0.8s 0.2s both cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes landingFadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Top bar: logo left, API key box right */
    .landing-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .landing-topbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .landing-logo-mark {
      height: 32px;
      padding: 0 12px;
      background: rgba(var(--overlay-rgb),0.06);
      border: 1px solid rgba(var(--overlay-rgb),0.14);
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 12px; letter-spacing: 0.14em;
      color: var(--text-primary);
      flex-shrink: 0;
    }
    .landing-demo-chip {
      height: 32px; width: 36px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(var(--overlay-rgb),0.14);
      border-radius: 7px;
      cursor: pointer;
      color: rgba(var(--overlay-rgb),0.45);
      font-size: 14px;
      transition: all 180ms;
      user-select: none;
    }
    .landing-demo-chip:hover { border-color: rgba(var(--overlay-rgb),0.3); color: var(--text-primary); }
    .landing-demo-chip input { display: none; }
    .landing-demo-chip:has(input:checked) {
      background: var(--invert-bg);
      color: var(--invert-fg);
      border-color: var(--invert-bg);
    }
    /* Profile / account dropdown */
    .landing-account { position: relative; }
    .landing-account-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 32px;
      padding: 0 12px;
      border: 1px solid rgba(var(--overlay-rgb),0.85);
      border-radius: 4px;
      background: transparent;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 180ms, color 180ms;
    }
    .landing-account-btn:hover,
    .landing-account.open .landing-account-btn {
      background: var(--invert-bg);
      color: var(--invert-fg);
    }
    .landing-account-avatar {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: rgba(var(--overlay-rgb),0.2);
      border: 1px solid currentColor;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px;
      flex-shrink: 0;
    }
    .landing-account-caret { font-size: 8px; opacity: 0.7; }

    .landing-account-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 280px;
      background: rgba(20,20,22,0.97);
      border: 1px solid rgba(var(--overlay-rgb),0.12);
      border-radius: 8px;
      padding: 6px;
      backdrop-filter: blur(16px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      opacity: 0;
      transform: translateY(-6px);
      pointer-events: none;
      transition: opacity 180ms, transform 180ms;
      z-index: 50;
    }
    .landing-account.open .landing-account-menu {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    .landing-account-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
    }
    .landing-account-header-avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: rgba(var(--overlay-rgb),0.08);
      border: 1px solid rgba(var(--overlay-rgb),0.18);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
      color: var(--text-primary);
      flex-shrink: 0;
    }
    .landing-account-name {
      font-size: 13px; font-weight: 600; color: var(--text-primary);
    }
    .landing-account-sub {
      font-size: 9px; font-weight: 500;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.4);
      margin-top: 2px;
    }
    .landing-account-divider {
      height: 1px;
      background: rgba(var(--overlay-rgb),0.08);
      margin: 4px 8px;
    }
    .landing-account-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: transparent;
      border-radius: 5px;
      color: rgba(var(--overlay-rgb),0.7);
      font-family: inherit;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-align: left;
      cursor: pointer;
      transition: background 140ms, color 140ms;
    }
    .landing-account-item:hover {
      background: rgba(var(--overlay-rgb),0.07);
      color: var(--text-primary);
    }
    .landing-account-item .value {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.4);
    }
    .landing-account-apikey {
      padding: 8px 12px 12px;
    }
    .landing-account-apikey-label {
      font-size: 9px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.4);
      margin-bottom: 6px;
    }
    .landing-api-input {
      width: 100%;
      background: rgba(var(--overlay-rgb),0.05);
      border: 1px solid rgba(var(--overlay-rgb),0.12);
      border-radius: 5px;
      padding: 8px 10px;
      outline: none;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 11px;
      letter-spacing: 0.04em;
      transition: border-color 180ms;
    }
    .landing-api-input:focus { border-color: rgba(var(--overlay-rgb),0.3); }
    .landing-api-input::placeholder { color: rgba(var(--overlay-rgb),0.25); }

    /* Split layout: job description left, mode cards right */
    .landing-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      flex: 1;
      min-height: 0;
      padding-top: 40px;
      max-width: 1240px;
      width: 100%;
      margin: 0 auto;
    }
    .landing-left,
    .landing-right {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .landing-wordmark {
      font-size: clamp(2.4rem, 4vw, 3.4rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      line-height: 1;
    }
    .landing-tagline {
      margin-top: 10px;
      color: rgba(var(--overlay-rgb),0.35);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }

    .landing-section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.4);
      margin: 32px 0 12px;
    }
    .landing-right .landing-section-label { margin-top: 0; }

    .landing-jd-input {
      flex: 1;
      min-height: 140px;
      resize: none;
      background: rgba(var(--overlay-rgb),0.035);
      border: 1px solid rgba(var(--overlay-rgb),0.07);
      border-radius: 6px;
      padding: 16px 18px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 13px;
      line-height: 1.6;
      outline: none;
      transition: border-color 180ms, background 180ms;
    }
    .landing-jd-input:focus {
      border-color: rgba(var(--overlay-rgb),0.25);
      background: rgba(var(--overlay-rgb),0.05);
    }
    .landing-jd-input::placeholder { color: rgba(var(--overlay-rgb),0.25); }

    /* Resume upload dropzone */
    .landing-resume-zone {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 14px;
      padding: 14px 18px;
      border: 1px dashed rgba(var(--overlay-rgb),0.2);
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 180ms, background 180ms;
    }
    .landing-resume-zone:hover {
      border-color: rgba(var(--overlay-rgb),0.45);
      background: rgba(var(--overlay-rgb),0.03);
    }
    .landing-resume-zone input { display: none; }
    .landing-resume-text {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.55);
    }
    .landing-resume-zone.has-file .landing-resume-text { color: var(--text-primary); }
    .landing-resume-btn {
      flex-shrink: 0;
      padding: 7px 14px;
      border: 1px solid rgba(var(--overlay-rgb),0.85);
      border-radius: 4px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-primary);
    }

    /* Profile cards — stacked numbered rows */
    .landing-profiles {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      min-height: 0;
    }
    .profile-card {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      min-height: 88px;
      padding: 20px 24px;
      background: rgba(var(--overlay-rgb),0.035);
      border: 1px solid rgba(var(--overlay-rgb),0.07);
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      backdrop-filter: blur(8px);
      overflow: hidden;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
    }
    .profile-card:hover {
      background: rgba(var(--overlay-rgb),0.07);
      border-color: rgba(var(--overlay-rgb),0.16);
      transform: translateX(4px);
    }
    .profile-card:active { transform: scale(0.99); }

    .profile-card-number {
      width: 72px;
      flex-shrink: 0;
      font-size: clamp(2.2rem, 3.4vw, 3rem);
      font-weight: 400;
      line-height: 1;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }
    .profile-card-tag {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      line-height: 1.7;
      color: rgba(var(--overlay-rgb),0.4);
      white-space: pre-line;
    }
    .profile-card h3 {
      margin-left: auto;
      font-size: clamp(1.1rem, 1.6vw, 1.4rem);
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--text-primary);
    }

    .landing-footnote {
      text-align: center;
      color: rgba(var(--overlay-rgb),0.18);
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      padding-top: 20px;
    }

    /* =============================================
       SCREEN 2 — INTERVIEW SETUP (question builder)
    ============================================= */
    #screen-setup {
      background: var(--bg-void);
      overflow: hidden;
    }
    .setup-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 28px 36px;
    }
    .setup-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .setup-back {
      display: flex; align-items: center; gap: 8px;
      height: 32px; padding: 0 12px;
      background: transparent;
      border: 1px solid rgba(var(--overlay-rgb),0.2);
      border-radius: 7px;
      color: rgba(var(--overlay-rgb),0.6);
      font-family: inherit;
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      cursor: pointer;
      transition: all 180ms;
    }
    .setup-back:hover { border-color: rgba(var(--overlay-rgb),0.5); color: var(--text-primary); }
    .setup-mode-chip {
      height: 32px; padding: 0 14px;
      display: flex; align-items: center;
      border: 1px solid rgba(var(--overlay-rgb),0.85);
      border-radius: 4px;
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--text-primary);
    }

    /* Wizard: one step at a time */
    .setup-wizard {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      padding-top: 28px;
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
    }

    .setup-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 30px;
    }
    .setup-prog-step {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.3);
      transition: color 200ms;
    }
    .setup-prog-step .num {
      width: 22px; height: 22px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(var(--overlay-rgb),0.25);
      border-radius: 50%;
      font-size: 10px;
      transition: all 200ms;
    }
    .setup-prog-step.active { color: var(--text-primary); }
    .setup-prog-step.active .num { border-color: var(--text-primary); }
    .setup-prog-step.done .num { background: var(--invert-bg); border-color: var(--invert-bg); color: var(--invert-fg); }
    .setup-prog-line {
      width: 48px; height: 1px;
      background: rgba(var(--overlay-rgb),0.12);
    }

    .setup-step {
      display: none;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }
    .setup-step.active {
      display: flex;
      animation: stepIn 0.35s both cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes stepIn {
      from { opacity: 0; transform: translateX(24px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .setup-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-top: 18px;
    }
    .setup-nav-btn {
      padding: 11px 22px;
      background: transparent;
      border: 1px solid rgba(var(--overlay-rgb),0.25);
      border-radius: 6px;
      color: rgba(var(--overlay-rgb),0.7);
      font-family: inherit;
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.16em; text-transform: uppercase;
      cursor: pointer;
      transition: all 180ms;
    }
    .setup-nav-btn:hover { border-color: rgba(var(--overlay-rgb),0.6); color: var(--text-primary); }
    .setup-nav-btn.primary {
      background: var(--invert-bg);
      border-color: var(--invert-bg);
      color: var(--invert-fg);
    }
    .setup-nav-btn.primary:hover { background: transparent; color: var(--text-primary); }

    .setup-heading {
      font-size: clamp(1.6rem, 2.6vw, 2.2rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      line-height: 1.15;
    }
    .setup-sub {
      margin-top: 8px;
      color: rgba(var(--overlay-rgb),0.35);
      font-size: 11px; font-weight: 500;
      letter-spacing: 0.22em; text-transform: uppercase;
    }

    .setup-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .setup-input {
      width: 100%;
      background: rgba(var(--overlay-rgb),0.035);
      border: 1px solid rgba(var(--overlay-rgb),0.07);
      border-radius: 6px;
      padding: 12px 14px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 13px;
      outline: none;
      transition: border-color 180ms, background 180ms;
    }
    .setup-input:focus { border-color: rgba(var(--overlay-rgb),0.25); background: rgba(var(--overlay-rgb),0.05); }
    .setup-input::placeholder { color: rgba(var(--overlay-rgb),0.25); }
    textarea.setup-input { flex: 1; min-height: 100px; resize: none; line-height: 1.6; }

    /* Question-type toggle chips */
    .setup-types {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .setup-type-chip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: rgba(var(--overlay-rgb),0.035);
      border: 1px solid rgba(var(--overlay-rgb),0.07);
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      transition: background 0.18s, border-color 0.18s;
    }
    .setup-type-chip:hover { border-color: rgba(var(--overlay-rgb),0.2); }
    .setup-type-chip input { display: none; }
    .setup-type-chip .box {
      width: 14px; height: 14px;
      border: 1px solid rgba(var(--overlay-rgb),0.4);
      border-radius: 3px;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; color: var(--invert-fg);
      transition: all 0.18s;
    }
    .setup-type-chip:has(input:checked) {
      background: rgba(var(--overlay-rgb),0.09);
      border-color: rgba(var(--overlay-rgb),0.35);
    }
    .setup-type-chip:has(input:checked) .box { background: var(--invert-bg); border-color: var(--invert-bg); }
    .setup-type-chip:has(input:checked) .box::after { content: '✓'; }
    .setup-type-name {
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.8);
    }

    /* Question count stepper */
    .setup-count-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: rgba(var(--overlay-rgb),0.035);
      border: 1px solid rgba(var(--overlay-rgb),0.07);
      border-radius: 6px;
    }
    .setup-count-label {
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.8);
    }
    .setup-stepper { display: flex; align-items: center; gap: 14px; }
    .setup-stepper button {
      width: 26px; height: 26px;
      background: transparent;
      border: 1px solid rgba(var(--overlay-rgb),0.25);
      border-radius: 5px;
      color: var(--text-primary); font-size: 13px;
      cursor: pointer;
      transition: all 140ms;
    }
    .setup-stepper button:hover { border-color: var(--text-primary); }
    .setup-stepper .num { font-size: 16px; font-weight: 500; color: var(--text-primary); min-width: 24px; text-align: center; }

    .setup-generate-btn {
      margin-top: 16px;
      padding: 14px;
      width: 100%;
      background: var(--invert-bg);
      border: 1px solid var(--invert-bg);
      border-radius: 6px;
      color: var(--invert-fg);
      font-family: inherit;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      cursor: pointer;
      transition: all 180ms;
    }
    .setup-generate-btn:hover { background: transparent; color: var(--text-primary); }
    .setup-generate-btn:disabled { opacity: 0.4; cursor: wait; }

    /* Generated questions list */
    .setup-questions {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-right: 4px;
    }
    .setup-questions::-webkit-scrollbar { width: 4px; }
    .setup-questions::-webkit-scrollbar-thumb { background: rgba(var(--overlay-rgb),0.15); border-radius: 2px; }
    .setup-q-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed rgba(var(--overlay-rgb),0.12);
      border-radius: 6px;
      color: rgba(var(--overlay-rgb),0.25);
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.2em; text-transform: uppercase;
      text-align: center;
      padding: 20px;
      line-height: 2;
    }
    .setup-q-item {
      display: flex;
      gap: 16px;
      align-items: baseline;
      padding: 13px 16px;
      background: rgba(var(--overlay-rgb),0.035);
      border: 1px solid rgba(var(--overlay-rgb),0.07);
      border-radius: 6px;
      animation: qItemIn 0.4s both cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes qItemIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .setup-q-num {
      font-size: 18px; font-weight: 400; color: var(--text-primary);
      min-width: 26px;
    }
    .setup-q-body { flex: 1; }
    .setup-q-cat {
      font-size: 8px; font-weight: 600;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: rgba(var(--overlay-rgb),0.35);
      margin-bottom: 3px;
    }
    .setup-q-text { font-size: 13px; color: rgba(var(--overlay-rgb),0.85); line-height: 1.5; }

    .setup-start-btn {
      margin-top: 14px;
      padding: 14px;
      width: 100%;
      background: transparent;
      border: 1px solid rgba(var(--overlay-rgb),0.85);
      border-radius: 6px;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      cursor: pointer;
      transition: all 180ms;
      display: none;
    }
    .setup-start-btn.visible { display: block; }
    .setup-start-btn:hover { background: var(--invert-bg); color: var(--invert-fg); }

    .setup-error {
      margin-top: 10px;
      font-size: 10px;
      letter-spacing: 0.08em;
      color: rgba(var(--overlay-rgb),0.45);
      text-align: center;
      display: none;
    }

    /* =============================================
       SCREEN 3 — MAIN DASHBOARD
    ============================================= */
    #screen-dashboard {
      flex-direction: column;
    }

    /* Top bar */
    .topbar {
      position: relative; z-index: 20;
      height: 56px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .topbar-left {
      display: flex; align-items: center; gap: 20px;
    }
    .topbar-logo {
      display: flex; align-items: center; gap: 10px;
    }
    .topbar-logo-mark {
      width: 32px; height: 32px;
    }
    .topbar-logo-mark svg { width: 100%; height: 100%; }
    .topbar-logo-name {
      font-family: var(--font-display); font-size: 18px; font-weight: 800;
      color: var(--text-primary); letter-spacing: -0.01em;
    }
    .topbar-logo-name span { color: var(--cyan); }

    .topbar-divider {
      width: 1px; height: 24px;
      background: var(--border);
    }

    .topbar-profile-chip {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 12px 4px 8px;
      background: var(--cyan-dim);
      border: 1px solid rgba(0,229,255,0.2);
      border-radius: 20px;
      font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--cyan);
    }
    .topbar-profile-chip-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 8px var(--cyan-glow);
    }

    .topbar-center {
      position: absolute; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 24px;
    }
    .topbar-timer {
      font-size: 22px; font-weight: 500; letter-spacing: 0.05em;
      color: var(--text-primary);
    }
    .topbar-timer-label { font-size: 9px; color: var(--text-muted); text-align: center; letter-spacing: 0.1em; }

    .topbar-right {
      display: flex; align-items: center; gap: 16px;
    }

    .topbar-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid;
      font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer; transition: all var(--transition);
      background: transparent;
    }
    .topbar-btn.end-session {
      border-color: rgba(255,61,90,0.4);
      color: var(--red);
    }
    .topbar-btn.end-session:hover {
      background: var(--red-dim);
      border-color: var(--red);
    }

    /* Dashboard layout */
    .dash-body {
      flex: 1;
      display: grid;
      grid-template-columns: 280px 1fr 280px;
      grid-template-rows: 1fr;
      gap: 0;
      overflow: hidden;
    }

    /* Left panel */
    .dash-left {
      display: flex; flex-direction: column;
      border-right: 1px solid var(--border);
      overflow-y: auto;
      padding: 16px;
      gap: 12px;
    }

    /* Center panel */
    .dash-center {
      display: flex; flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    /* Right panel */
    .dash-right {
      display: flex; flex-direction: column;
      border-left: 1px solid var(--border);
      overflow-y: auto;
      padding: 16px;
      gap: 12px;
    }

    /* Scrollbar styling */
    .dash-left::-webkit-scrollbar,
    .dash-right::-webkit-scrollbar { width: 4px; }
    .dash-left::-webkit-scrollbar-track,
    .dash-right::-webkit-scrollbar-track { background: transparent; }
    .dash-left::-webkit-scrollbar-thumb,
    .dash-right::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    /* Panel section headers */
    .panel-section-label {
      font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--text-muted);
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 4px;
    }

    /* =============================================
       METRIC CARDS (left/right panels)
    ============================================= */
    .metric-card {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 12px 14px;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    .metric-card::before {
      content: '';
      position: absolute; top: 0; left: 0;
      width: 3px; height: 100%;
      background: var(--metric-color, var(--cyan));
      border-radius: 2px 0 0 2px;
      opacity: 0.7;
    }

    .metric-card-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 10px;
    }
    .metric-card-name {
      font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--text-muted);
    }
    .metric-card-badge {
      font-size: 9px; padding: 2px 6px;
      border-radius: 3px;
      border: 1px solid var(--metric-color, var(--cyan));
      color: var(--metric-color, var(--cyan));
      background: var(--metric-color-dim, var(--cyan-dim));
    }

    .metric-card-value {
      font-size: 28px; font-weight: 500; letter-spacing: -0.02em;
      color: var(--metric-color, var(--cyan));
      line-height: 1;
      margin-bottom: 4px;
      transition: all var(--transition);
    }
    .metric-card-unit {
      font-size: 11px; color: var(--text-muted);
      margin-left: 3px;
    }
    .metric-card-label {
      font-size: 10px; color: var(--text-secondary);
      margin-bottom: 10px;
    }

    /* Sparkline */
    .metric-sparkline {
      height: 36px;
      position: relative;
    }
    .metric-sparkline canvas { width: 100% !important; height: 100% !important; }

    /* Bar gauge */
    .metric-bar {
      height: 4px;
      background: rgba(var(--overlay-rgb),0.06);
      border-radius: 2px;
      overflow: hidden;
      margin-top: 8px;
    }
    .metric-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--metric-color, var(--cyan)), var(--metric-color-alt, var(--purple)));
      border-radius: 2px;
      transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* =============================================
       SCORE RING SECTION
    ============================================= */
    /* =============================================
       QUESTION CARD
    ============================================= */
    .question-card {
      flex-shrink: 0;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border);
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .question-card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .question-card-category {
      font-size: 9px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--cyan);
    }
    .question-card-progress {
      font-size: 9px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .question-card-text {
      font-size: 14px;
      color: var(--text-primary);
      font-family: var(--font-display);
      font-weight: 600;
      line-height: 1.4;
    }
    .question-card-nav {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;
    }
    .question-btn {
      padding: 4px 12px;
      font-size: 10px;
      font-family: var(--font-mono);
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition);
      letter-spacing: 0.06em;
    }
    .question-btn:hover:not(:disabled) {
      border-color: var(--cyan);
      color: var(--cyan);
      background: var(--cyan-dim);
    }
    .question-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .question-btn.primary {
      border-color: var(--cyan);
      color: var(--cyan);
      background: var(--cyan-dim);
    }

    .scores-section {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 16px;
      align-items: center;
      flex-shrink: 0;
    }

    .score-ring-wrap {
      position: relative;
      width: 100px; height: 100px;
      flex-shrink: 0;
    }
    #score-ring-canvas { width: 100%; height: 100%; }
    .score-ring-inner {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .score-ring-value {
      font-size: 28px; font-weight: 500;
      color: var(--text-primary); letter-spacing: -0.02em;
    }
    .score-ring-grade {
      font-size: 11px; color: var(--cyan); font-weight: 600;
    }

    .score-breakdown {
      flex: 1;
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .score-item {
      display: flex; flex-direction: column; gap: 4px;
    }
    .score-item-header {
      display: flex; justify-content: space-between;
      font-size: 10px; color: var(--text-secondary);
    }
    .score-item-val { font-weight: 500; color: var(--text-primary); }
    .score-item-bar {
      height: 3px;
      background: rgba(var(--overlay-rgb),0.06);
      border-radius: 2px; overflow: hidden;
    }
    .score-item-bar-fill {
      height: 100%;
      background: var(--cyan);
      transition: width 600ms ease;
    }

    /* =============================================
       VIDEO FEED AREA (center)
    ============================================= */
    .video-container {
      flex: 1;
      position: relative;
      background: #000;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }

    #video-feed {
      width: 100%; height: 100%;
      object-fit: cover;
      transform: scaleX(-1);
    }

    /* Face overlay canvas */
    #face-overlay-canvas {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      transform: scaleX(-1);
    }

    /* Gaze tracker dot */
    #gaze-dot {
      position: fixed;
      width: 16px; height: 16px;
      margin: -8px 0 0 -8px;
      border-radius: 50%;
      border: 2px solid var(--cyan);
      background: rgba(0,229,255,0.3);
      box-shadow: 0 0 16px var(--cyan-glow);
      pointer-events: none;
      z-index: 200;
      transition: left 60ms linear, top 60ms linear;
      display: none;
    }

    /* Corner brackets for video */
    .video-bracket {
      position: absolute;
      width: 24px; height: 24px;
      border-color: var(--cyan);
      border-style: solid;
      opacity: 0.6;
      pointer-events: none;
      z-index: 5;
    }
    .video-bracket.tl { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
    .video-bracket.tr { top: 16px; right: 16px; border-width: 2px 2px 0 0; }
    .video-bracket.bl { bottom: 16px; left: 16px; border-width: 0 0 2px 2px; }
    .video-bracket.br { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }

    /* =============================================
       CAMERA VIEW MODES
    ============================================= */
    .cam-mode-toggle {
      position: absolute; bottom: 12px; right: 12px;
      display: flex; gap: 4px;
      z-index: 10;
    }
    .cam-mode-btn {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 13px;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
    .cam-mode-btn.active {
      background: rgba(41, 151, 255, 0.2);
      border-color: var(--accent);
      color: var(--accent);
    }
    .cam-mode-btn:hover:not(.active) {
      border-color: rgba(255, 255, 255, 0.25);
      color: var(--text-primary);
    }

    /* Minimized PiP */
    .video-container.cam-minimized {
      position: fixed !important;
      width: 160px !important; height: 120px !important;
      bottom: 80px; right: 20px;
      top: auto !important; left: auto !important;
      flex: none !important;
      z-index: 100;
      border-radius: var(--radius);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      cursor: move;
      transition: width 0.3s ease, height 0.3s ease;
    }
    .video-container.cam-minimized .cam-mode-btn { width: 22px; height: 22px; font-size: 11px; }

    /* Fullscreen ghost */
    .video-container.cam-fullscreen {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important; height: 100vh !important;
      flex: none !important;
      z-index: 5;
      background: transparent;
      transition: all 0.3s ease;
    }
    .video-container.cam-fullscreen #video-feed,
    .video-container.cam-fullscreen #face-overlay-canvas { opacity: 0.12; }
    .video-container.cam-fullscreen .cam-mode-toggle { z-index: 15; bottom: 20px; right: 20px; }
    .video-container.cam-fullscreen .cam-mode-btn   { background: rgba(0, 0, 0, 0.75); }

    /* =============================================
       SESSION CONTROL FOOTER
    ============================================= */
    .center-footer {
      flex-shrink: 0;
      padding: 20px 24px;
      display: flex;
      justify-content: center;
      background: var(--bg-void);
      border-top: 1px solid var(--border);
    }
    .session-pill-btn {
      height: 48px;
      padding: 0 56px;
      min-width: 200px;
      border-radius: 24px;
      font-family: var(--font-display);
      font-size: 15px; font-weight: 500;
      letter-spacing: -0.01em;
      background: rgba(255, 69, 58, 0.12);
      color: var(--red);
      border: 1px solid rgba(255, 69, 58, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .session-pill-btn:hover {
      background: rgba(255, 69, 58, 0.22);
      border-color: var(--red);
    }

    /* =============================================
       STATUS ORB (replaces all alerts / toasts / modals)
    ============================================= */
    #status-orb {
      position: fixed;
      top: 21px; left: 7px;
      width: 14px; height: 14px;
      border-radius: 50%;
      z-index: 600;
      cursor: pointer;
      background: #2997ff;
      box-shadow: 0 0 6px rgba(41, 151, 255, 0.45);
      transition: background-color 1.7s ease, box-shadow 1.7s ease;
    }
    #status-orb.orb-blue   { background: #2997ff; box-shadow: 0 0 6px rgba(41, 151, 255, 0.45); }
    #status-orb.orb-green  { background: #30d158; box-shadow: 0 0 6px rgba(48, 209, 88, 0.45);  }
    #status-orb.orb-yellow { background: #ffd60a; box-shadow: 0 0 6px rgba(255, 214, 10, 0.45); }
    #status-orb.orb-orange { background: #ff9f0a; box-shadow: 0 0 6px rgba(255, 159, 10, 0.45); }
    #status-orb.orb-red    { background: #ff453a; box-shadow: 0 0 6px rgba(255, 69, 58, 0.45);  }

    .orb-card {
      position: fixed;
      top: 44px; left: 4px;
      width: 210px;
      background: var(--bg-card);
      border: 1px solid var(--border-bright);
      border-radius: var(--radius);
      padding: 12px 14px;
      z-index: 601;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    .orb-card.hidden { display: none; }
    .orb-card-label {
      font-size: 11px; font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
      padding-right: 24px;
      letter-spacing: 0.04em;
    }
    .orb-card-desc {
      font-size: 11px; line-height: 1.5;
      color: var(--text-secondary);
    }
    .orb-card-dismiss {
      position: absolute; top: 8px; right: 8px;
      width: 20px; height: 20px;
      display: flex; align-items: center; justify-content: center;
      background: transparent; border: none;
      color: var(--text-muted); cursor: pointer;
      font-size: 16px; line-height: 1;
      border-radius: 4px;
      transition: color var(--transition);
    }
    .orb-card-dismiss:hover { color: var(--text-primary); }

    /* =============================================
       EVENT LOG (right panel)
    ============================================= */
    .event-log {
      display: flex; flex-direction: column; gap: 6px;
    }
    .event-log-item {
      display: flex; gap: 8px; align-items: flex-start;
      padding: 8px 10px;
      background: var(--bg-deep);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      animation: eventIn 300ms ease forwards;
    }
    @keyframes eventIn {
      from { opacity: 0; transform: translateX(8px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .event-log-dot {
      width: 6px; height: 6px; border-radius: 50%;
      margin-top: 4px; flex-shrink: 0;
    }
    .event-log-dot.flag  { background: var(--red); box-shadow: 0 0 6px var(--red); }
    .event-log-dot.info  { background: var(--cyan); box-shadow: 0 0 6px var(--cyan-glow); }
    .event-log-dot.score { background: var(--amber); box-shadow: 0 0 6px var(--amber); }
    .event-log-dot.intervention { background: var(--purple); }

    .event-log-text {
      flex: 1;
      font-size: 10px; line-height: 1.5;
      color: var(--text-secondary);
    }
    .event-log-text strong { color: var(--text-primary); font-weight: 500; }
    .event-log-time {
      font-size: 9px; color: var(--text-muted);
      flex-shrink: 0; margin-top: 2px;
    }

    /* =============================================
       SESSION SUMMARY SCREEN
    ============================================= */
    #screen-summary {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      overflow-y: auto;
    }

    .summary-card {
      width: 100%;
      max-width: 760px;
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 40px;
      position: relative;
      overflow: hidden;
    }
    .summary-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    }

    .summary-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 36px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--border);
    }
    .summary-header-left h2 {
      font-family: var(--font-display); font-size: 32px; font-weight: 800;
      color: var(--text-primary);
    }
    .summary-header-left p { font-size: 12px; color: var(--text-secondary); margin-top: 6px; }

    .summary-grade-badge {
      display: flex; flex-direction: column; align-items: center;
      padding: 16px 24px;
      background: var(--cyan-dim);
      border: 1px solid rgba(0,229,255,0.3);
      border-radius: var(--radius);
    }
    .summary-grade-letter {
      font-family: var(--font-display); font-size: 48px; font-weight: 800;
      color: var(--cyan); line-height: 1;
    }
    .summary-grade-label { font-size: 9px; letter-spacing: 0.15em; color: var(--text-secondary); margin-top: 4px; }

    .summary-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }

    .summary-stat {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
      text-align: center;
    }
    .summary-stat-value {
      font-size: 28px; font-weight: 500;
      color: var(--cyan);
      margin-bottom: 4px;
    }
    .summary-stat-label {
      font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--text-muted);
    }

    .summary-actions {
      display: flex; gap: 12px; justify-content: center;
      margin-top: 32px;
    }
    .btn-primary, .btn-secondary {
      padding: 10px 28px;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono); font-size: 12px;
      letter-spacing: 0.1em; text-transform: uppercase;
      cursor: pointer; transition: all var(--transition);
      border: 1px solid;
    }
    .btn-primary {
      background: var(--cyan); border-color: var(--cyan);
      color: var(--bg-void);
    }
    .btn-primary:hover { box-shadow: 0 0 24px var(--cyan-glow); }
    .btn-secondary {
      background: transparent; border-color: var(--border-bright);
      color: var(--text-secondary);
    }
    .btn-secondary:hover { border-color: var(--text-secondary); color: var(--text-primary); }

    /* =============================================
       UTILITY / HELPERS
    ============================================= */
    .hidden { display: none !important; }

    /* Number counter animation */
    @keyframes countUp {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .value-update { animation: countUp 200ms ease forwards; }

    /* Loading shimmer */
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .shimmer {
      background: linear-gradient(90deg, var(--bg-card) 25%, var(--bg-card-hover) 50%, var(--bg-card) 75%);
      background-size: 800px 100%;
      animation: shimmer 1.5s infinite;
    }

    /* =============================================
       SYSTEM STATUS DOT
    ============================================= */
    .system-status-dot {
      position: relative;
      display: flex; align-items: center; gap: 6px;
      cursor: default;
    }
    .ssd-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: background 300ms ease, box-shadow 300ms ease;
    }
    .system-status-dot.status-nominal .ssd-dot {
      background: var(--green);
      box-shadow: 0 0 8px rgba(0,255,136,0.7);
      animation: pulseDot 2s ease-in-out infinite;
    }
    .system-status-dot.status-warning .ssd-dot {
      background: var(--amber);
      box-shadow: 0 0 8px rgba(255,183,0,0.7);
      animation: pulseDot 1s ease-in-out infinite;
    }
    .system-status-dot.status-error .ssd-dot {
      background: var(--red);
      box-shadow: 0 0 8px rgba(255,61,90,0.7);
      animation: pulseDot 0.7s ease-in-out infinite;
    }
    .ssd-tooltip {
      display: none;
      position: absolute; top: calc(100% + 10px); right: 0;
      padding: 6px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: 11px; color: var(--text-secondary);
      white-space: nowrap; z-index: 1000;
      pointer-events: none;
    }
    .system-status-dot:hover .ssd-tooltip { display: block; }

    /* =============================================
       SETTINGS PANEL
    ============================================= */
    .settings-panel {
      position: relative;
    }
    .settings-toggle-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 12px;
      background: transparent;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-family: var(--font-mono); font-size: 11px;
      cursor: pointer; transition: all var(--transition);
      letter-spacing: 0.06em;
    }
    .settings-toggle-btn:hover {
      border-color: var(--border-bright);
      color: var(--text-primary);
    }
    .settings-toggle-btn[aria-expanded="true"] {
      border-color: var(--cyan);
      color: var(--cyan);
      background: var(--cyan-dim);
    }

    .settings-content {
      display: none;
      position: absolute; top: calc(100% + 8px); right: 0;
      width: 280px;
      background: var(--bg-card);
      border: 1px solid var(--border-bright);
      border-radius: var(--radius);
      padding: 18px;
      z-index: 500;
      box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px var(--border);
      flex-direction: column; gap: 14px;
    }
    .settings-content.expanded { display: flex; }

    .settings-section-label {
      font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 2px;
    }

    /* Mode switch row */
    .mode-switch-row {
      display: flex; align-items: center; gap: 10px;
    }
    .mode-switch-label-text {
      font-size: 12px; color: var(--text-muted); flex: 1; transition: color var(--transition);
    }
    .mode-switch-label-text.active { color: var(--text-primary); font-weight: 600; }

    .mode-switch {
      position: relative; width: 52px; height: 28px; flex-shrink: 0;
    }
    .mode-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
    .mode-switch-slider {
      position: absolute; inset: 0;
      background: rgba(var(--overlay-rgb),0.06);
      border: 1px solid var(--border);
      border-radius: 14px;
      cursor: pointer;
      transition: all var(--transition);
    }
    .mode-switch-slider::before {
      content: '';
      position: absolute; top: 4px; left: 4px;
      width: 18px; height: 18px;
      background: var(--text-muted);
      border-radius: 50%;
      transition: all var(--transition);
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    }
    .mode-switch input:checked + .mode-switch-slider {
      background: var(--cyan-dim);
      border-color: var(--cyan);
    }
    .mode-switch input:checked + .mode-switch-slider::before {
      transform: translateX(24px);
      background: var(--cyan);
      box-shadow: 0 0 8px var(--cyan-glow);
    }

    .settings-mode-desc {
      font-size: 10px; color: var(--text-muted); line-height: 1.6; margin-top: 2px;
    }

    /* Demo mode switch (profile screen) */
    .demo-switch-row {
      display: inline-flex; align-items: center; gap: 12px;
      padding: 10px 20px;
      background: var(--bg-panel);
      border: 1px solid rgba(255,183,0,0.3);
      border-radius: var(--radius);
      cursor: pointer;
    }
    .demo-switch-label {
      font-size: 13px; color: var(--amber); font-family: var(--font-mono); letter-spacing: 0.04em;
    }
    .demo-switch {
      position: relative; width: 52px; height: 28px; flex-shrink: 0;
    }
    .demo-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
    .demo-switch-slider {
      position: absolute; inset: 0;
      background: rgba(255,183,0,0.06);
      border: 1px solid rgba(255,183,0,0.25);
      border-radius: 14px;
      cursor: pointer;
      transition: all var(--transition);
    }
    .demo-switch-slider::before {
      content: '';
      position: absolute; top: 4px; left: 4px;
      width: 18px; height: 18px;
      background: rgba(255,183,0,0.4);
      border-radius: 50%;
      transition: all var(--transition);
    }
    .demo-switch input:checked + .demo-switch-slider {
      background: rgba(255,183,0,0.15);
      border-color: var(--amber);
    }
    .demo-switch input:checked + .demo-switch-slider::before {
      transform: translateX(24px);
      background: var(--amber);
      box-shadow: 0 0 8px rgba(255,183,0,0.6);
    }

    /* =============================================
       SIMPLE MODE LAYOUT
    ============================================= */
    body.mode-simple .dash-left   { display: none; }
    body.mode-simple .dash-right  { display: none; }
    body.mode-simple .dash-body   { grid-template-columns: 1fr; }
    body.mode-simple .scores-section  { display: none; }
    body.mode-simple #face-overlay-canvas { opacity: 0; pointer-events: none; }
    body.mode-simple .video-bracket    { display: none; }
    body.mode-simple .video-status-badge { display: none; }
    body.mode-simple #gaze-dot { display: none !important; }

    /* =============================================
       QUESTION CARD — LARGE TEXT HERO
    ============================================= */
    .question-card {
      padding: 40px 48px !important;
      gap: 20px !important;
      background: var(--bg-card) !important;
    }
    .question-card-text {
      font-size: 2.2rem !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      color: var(--text-primary) !important;
      letter-spacing: -0.01em !important;
    }
    @media (max-width: 768px) {
      .question-card { padding: 24px !important; }
      .question-card-text { font-size: 1.5rem !important; }
    }

    /* =============================================
       MODE TOGGLE PILL (topbar, always visible)
    ============================================= */
    .mode-toggle-pill {
      display: flex; align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 3px;
      gap: 2px;
    }
    .mode-pill-btn {
      padding: 5px 14px;
      border-radius: 16px;
      border: none;
      font-family: var(--font-display); font-size: 12px; font-weight: 500;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition: all var(--transition);
      background: transparent;
      color: var(--text-secondary);
      min-height: 28px;
      white-space: nowrap;
    }
    .mode-pill-btn.active {
      background: var(--accent);
      color: var(--on-accent);
      box-shadow: 0 1px 8px rgba(41, 151, 255, 0.4);
    }
    .mode-pill-btn:hover:not(.active) {
      color: var(--text-primary);
    }

    /* =============================================
       SENSOR DOTS (4 dedicated status indicators)
    ============================================= */
    .sensor-dots {
      display: flex; align-items: center; gap: 6px;
    }
    .sensor-dot {
      position: relative;
      width: 22px; height: 22px;
      display: flex; align-items: center; justify-content: center;
      cursor: default;
    }
    .sensor-dot-indicator {
      width: 7px; height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: background 300ms ease, box-shadow 300ms ease;
    }
    .sensor-dot.inactive .sensor-dot-indicator {
      background: var(--text-muted);
    }
    .sensor-dot.nominal .sensor-dot-indicator {
      background: var(--green);
      box-shadow: 0 0 6px rgba(48, 209, 88, 0.6);
      animation: pulseDot 2s ease-in-out infinite;
    }
    .sensor-dot.active .sensor-dot-indicator {
      background: var(--accent);
      box-shadow: 0 0 6px var(--accent-glow);
      animation: pulseDot 2s ease-in-out infinite;
    }
    .sensor-dot.warning .sensor-dot-indicator {
      background: var(--amber);
      box-shadow: 0 0 6px rgba(245, 166, 35, 0.6);
      animation: pulseDot 1s ease-in-out infinite;
    }
    .sensor-dot.error .sensor-dot-indicator {
      background: var(--red);
      box-shadow: 0 0 6px rgba(255, 69, 58, 0.6);
      animation: pulseDot 0.7s ease-in-out infinite;
    }
    .sensor-dot-tooltip {
      display: none;
      position: absolute; top: calc(100% + 8px); left: 50%;
      transform: translateX(-50%);
      padding: 5px 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-bright);
      border-radius: var(--radius-sm);
      font-size: 11px; color: var(--text-secondary);
      white-space: nowrap; z-index: 1000;
      pointer-events: none;
      font-family: var(--font-display);
    }
    .sensor-dot:hover .sensor-dot-tooltip { display: block; }

    /* =============================================
       PROFILE SELECTOR — PILL SEGMENTED CONTROL
    ============================================= */
    .profile-selector {
      display: flex;
      gap: 0;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 4px;
    }
    .profile-selector .profile-card {
      flex: 1;
      padding: 18px 28px;
      min-width: 140px;
      max-width: none;
      width: auto;
      border-radius: 14px;
      border: 1px solid transparent !important;
      background: transparent;
      text-align: center;
      box-shadow: none !important;
    }
    .profile-selector .profile-card:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: transparent !important;
      transform: none !important;
      box-shadow: none !important;
    }
    .profile-selector .profile-card::before,
    .profile-selector .profile-card::after { display: none !important; }
    .profile-selector .profile-card h3  { font-size: 18px; margin-bottom: 2px; }
    .profile-selector .profile-card p   { font-size: 11px; color: var(--text-muted); margin-bottom: 0; line-height: 1.3; }

    /* Topbar cleaner */
    .topbar {
      background: rgba(10, 10, 10, 0.94) !important;
      backdrop-filter: blur(24px) !important;
    }

    /* Topbar profile chip: accent color */
    .topbar-profile-chip {
      background: var(--accent-dim) !important;
      border-color: rgba(41, 151, 255, 0.2) !important;
      color: var(--accent) !important;
    }
    .topbar-profile-chip-dot {
      background: var(--accent) !important;
      box-shadow: none !important;
    }

    /* Summary grade badge */
    .summary-grade-badge {
      background: var(--accent-dim) !important;
      border-color: rgba(41, 151, 255, 0.25) !important;
    }
    .summary-grade-letter { color: var(--accent) !important; }
    .summary-stat-value   { color: var(--accent) !important; }

    /* Buttons */
    .btn-primary {
      background: var(--accent) !important;
      border-color: var(--accent) !important;
    }
    .btn-primary:hover { box-shadow: 0 0 20px var(--accent-glow) !important; }

    /* Apple cleanup: remove all neon glows from metrics */
    .metric-card-value { text-shadow: none !important; }
    .metric-bar-fill   { box-shadow: none !important; }

    /* Ensure interactive buttons meet 44px tap target */
    /* =============================================
       NEW DASHBOARD — complete override
    ============================================= */

    /* Layout */
    #screen-dashboard { flex-direction: column; background: var(--bg-void); overflow: hidden; }

    /* ── Topbar ── */
    .topbar {
      height: 48px !important;
      background: var(--bg-void) !important;
      backdrop-filter: none !important;
      border-bottom: 0.5px solid var(--border) !important;
      padding: 0 20px !important;
      display: flex; align-items: center; justify-content: space-between;
      flex-shrink: 0; position: relative; z-index: 20;
    }
    .topbar-left  { display: flex; align-items: center; gap: 10px; }
    .topbar-center {
      position: absolute; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 8px;
    }
    .topbar-right { display: flex; align-items: center; }

    .topbar-logo { display: flex; align-items: center; gap: 8px; }
    .topbar-logo-mark-new {
      width: 26px; height: 26px; border-radius: 7px;
      background: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 500; color: var(--on-accent); flex-shrink: 0;
    }
    .topbar-logo-name-new {
      font-size: 14px; font-weight: 500; color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    .topbar-timer-pill {
      display: flex; align-items: center; gap: 5px;
      background: rgba(var(--overlay-rgb),0.07);
      border-radius: 20px; padding: 3px 10px;
      font-size: 12px; color: var(--text-muted);
    }
    .topbar-timer-pill .ti { font-size: 12px; }
    .topbar-profile-chip-new {
      background: var(--accent-dim);
      color: var(--accent);
      border: 0.5px solid var(--accent-border);
      border-radius: 20px; padding: 3px 9px;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.06em; text-transform: uppercase;
    }

    /* ── Warming up pill ── */
    #warmup-pill {
      background: rgba(var(--overlay-rgb),0.05);
      border: 0.5px solid rgba(var(--overlay-rgb),0.1);
      border-radius: 999px;
      padding: 3px 10px;
      font-size: 10px;
      color: rgba(var(--overlay-rgb),0.35);
      display: flex;
      align-items: center;
      gap: 6px;
      opacity: 0;
      transition: opacity 600ms ease;
      pointer-events: none;
    }
    #warmup-pill .pulse-dot {
      width: 5px; height: 5px;
      background: rgba(var(--overlay-rgb),0.35);
    }

    /* ── Video area ── */
    /* Resizable video/question layout — three preset grid states.
       .video-area's rendered box changes size with the grid row, which is
       what the ResizeObserver in ui.js watches to re-sync the canvas. */
    .dash-main {
      flex: 1;
      display: grid;
      grid-template-rows: 1fr auto;
      overflow: hidden;
      min-height: 0;
    }
    .dash-main.layout-split { grid-template-rows: 1fr auto; }
    .dash-main.layout-focus { grid-template-rows: 220px 1fr; }
    .dash-main.layout-pip   { grid-template-rows: 1fr; }

    .dash-main.layout-focus .video-area {
      min-height: 0;
    }
    .dash-main.layout-focus .question-bar {
      overflow-y: auto;
    }
    /* position:fixed removes .video-area from grid flow entirely, so the
       single 1fr row is left for .question-bar to fill on its own. */
    .dash-main.layout-pip .video-area {
      position: fixed;
      width: 220px; height: 150px;
      right: 20px; bottom: 100px;
      min-height: 0;
      border-radius: var(--radius);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      z-index: 25;
    }
    .dash-main.layout-pip .question-bar {
      overflow-y: auto;
    }
    /* Overlay panels (coach/score/signals) don't fit a 150px PiP box */
    .dash-main.layout-pip .video-area .overlay-panel {
      display: none !important;
    }

    .layout-toggle {
      display: flex; gap: 4px; margin-right: auto;
    }
    .layout-toggle-btn {
      height: 30px; padding: 0 10px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-secondary);
      font-family: inherit; font-size: 11px; font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 150ms;
    }
    .layout-toggle-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); }
    .layout-toggle-btn.active { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }

    .video-area {
      flex: 1; position: relative; background: #000;
      overflow: hidden; min-height: 260px;
    }
    .video-area #video-feed {
      width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);
    }
    .video-area #face-overlay-canvas {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; transform: scaleX(-1);
    }

    /* ── Overlay panels ── */
    .overlay-panel {
      position: absolute; bottom: 0; left: 0; right: 0; z-index: 20;
      background: var(--bg-glass);
      border-top: 0.5px solid var(--border-bright);
      padding: 16px 18px; display: none;
    }
    .overlay-panel.visible { display: block; }
    .overlay-panel-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 12px;
    }
    .overlay-panel-title {
      font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--text-muted);
    }
    .overlay-panel-close {
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); font-size: 14px; line-height: 1;
      padding: 2px 4px; transition: color 150ms; display: flex; align-items: center;
    }
    .overlay-panel-close:hover { color: var(--text-primary); }

    /* Coach panel */
    .coach-row { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
    .coach-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
    .coach-label { font-size: 11px; color: var(--accent); font-weight: 500; }
    .coach-tip { font-size: 13px; line-height: 1.65; color: var(--text-secondary); margin: 0; }
    .coach-tip em { color: var(--text-muted); font-style: italic; }

    /* Score panel */
    .score-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
    }
    .score-card {
      background: rgba(var(--overlay-rgb),0.05); border-radius: 9px;
      padding: 10px 8px; text-align: center;
    }
    .score-card-value { font-size: 20px; font-weight: 500; line-height: 1; margin-bottom: 4px; }
    .score-card-label { font-size: 10px; color: var(--text-muted); margin-bottom: 6px; line-height: 1.3; }
    .score-card-bar { height: 3px; background: rgba(var(--overlay-rgb),0.07); border-radius: 2px; overflow: hidden; }
    .score-card-bar-fill { height: 100%; border-radius: 2px; transition: width 600ms ease, background-color 600ms ease; }

    /* Signals panel */
    .signals-row { display: flex; gap: 8px; }
    .signal-pill {
      flex: 1; background: rgba(var(--overlay-rgb),0.05);
      border-radius: 9px; padding: 10px 8px; text-align: center;
    }
    .signal-pill-icon { font-size: 18px; color: var(--text-muted); display: block; margin-bottom: 4px; }
    .signal-pill-label {
      font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--text-muted); margin-bottom: 4px; display: block;
    }
    .signal-pill-value { font-size: 16px; font-weight: 500; }

    /* ── Code sandbox panel (Phase 9) ── */
    .code-panel {
      left: 50%; right: auto; bottom: 16px;
      transform: translateX(-50%);
      width: min(560px, 92%); max-height: 70%;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-bright);
      display: none;
      flex-direction: column;
    }
    .code-panel.visible { display: flex; }
    .code-panel-header-right { display: flex; align-items: center; gap: 8px; }
    .code-language-select {
      background: rgba(var(--overlay-rgb),0.07);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-family: inherit; font-size: 11px;
      padding: 4px 6px;
    }
    .monaco-editor-container {
      height: 280px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      margin-top: 10px;
      border: 1px solid var(--border);
    }
    .code-panel-footer {
      display: flex; align-items: center; justify-content: space-between;
      gap: 10px; margin-top: 10px;
    }
    .code-results {
      flex: 1; font-size: 11px; color: var(--text-secondary);
      max-height: 60px; overflow-y: auto;
    }

    /* ── Question bar ── */
    .question-bar {
      background: var(--bg-surface);
      border-top: 0.5px solid var(--border);
      padding: 13px 18px; flex-shrink: 0;
    }
    .question-bar-meta {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 6px;
    }
    .question-bar-category {
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent);
    }
    .question-bar-progress { font-size: 10px; color: var(--text-muted); }
    .question-bar-text {
      font-size: 13px; font-weight: 500; line-height: 1.5;
      color: var(--text-primary); margin-bottom: 8px;
    }
    .question-bar-nav {
      display: flex; gap: 8px; justify-content: flex-end; align-items: center;
    }
    .qnav-btn {
      border-radius: 20px; border: 0.5px solid var(--border-bright);
      background: transparent; color: var(--text-muted);
      font-size: 11px; padding: 4px 12px; cursor: pointer;
      font-family: var(--font-display); transition: all 150ms;
    }
    .qnav-btn:hover:not(:disabled) { border-color: var(--text-secondary); color: var(--text-primary); }
    .qnav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .qnav-btn.qnav-primary { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
    .qnav-btn.qnav-primary:disabled { background: var(--text-muted); border-color: var(--text-muted); }

    /* ── Bottom controls ── */
    .bottom-controls {
      height: 68px; display: flex; align-items: center;
      justify-content: space-between; padding: 0 20px;
      background: var(--bg-void); border-top: 0.5px solid var(--border); flex-shrink: 0;
    }
    .bottom-left  { display: flex; gap: 8px; }
    .bottom-center{ display: flex; gap: 10px; align-items: center; }
    .bottom-right { display: flex; gap: 8px; }

    .panel-toggle-btn {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      background: rgba(var(--overlay-rgb),0.05); border: 0.5px solid var(--border);
      border-radius: 10px; padding: 7px 12px; min-width: 56px;
      cursor: pointer; color: var(--text-muted); font-size: 10px;
      font-family: var(--font-display); transition: all 150ms;
    }
    .panel-toggle-btn .ti { font-size: 18px; }
    .panel-toggle-btn:hover { background: rgba(var(--overlay-rgb),0.09); color: var(--text-primary); }
    .panel-toggle-btn.active {
      background: var(--accent-dim); border-color: var(--accent-border); color: var(--accent);
    }

    .theme-toggle-btn {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(var(--overlay-rgb),0.07);
      border: 1px solid var(--border);
      font-size: 14px; color: var(--text-secondary);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 150ms;
    }
    .theme-toggle-btn:hover { background: rgba(var(--overlay-rgb),0.12); color: var(--text-primary); }
    .topbar-right .theme-toggle-btn { margin-right: 10px; }

    .call-btn {
      width: 42px; height: 42px; border-radius: 50%;
      background: rgba(var(--overlay-rgb),0.07); border: none;
      font-size: 18px; color: var(--text-secondary);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 150ms;
    }
    .call-btn:hover { background: rgba(var(--overlay-rgb),0.12); color: var(--text-primary); }
    .call-btn.muted { background: rgba(255,69,58,0.3) !important; color: var(--red) !important; }
    .call-btn-end { background: var(--red) !important; color: var(--on-accent) !important; }
    .call-btn-end:hover { filter: brightness(1.1); }

    .util-btn {
      height: 42px; padding: 0 12px; border-radius: 10px;
      background: rgba(var(--overlay-rgb),0.07); border: none;
      font-size: 18px; color: var(--text-secondary);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 150ms;
    }
    .util-btn:hover { background: rgba(var(--overlay-rgb),0.12); color: var(--text-primary); }

    /* ── Gaze dot ── */
    #gaze-dot {
      position: fixed; width: 16px; height: 16px; margin: -8px 0 0 -8px;
      border-radius: 50%; border: 2px solid var(--accent);
      background: rgba(41,151,255,0.3); pointer-events: none; z-index: 200;
      transition: left 60ms linear, top 60ms linear; display: none;
    }

    /* ── PDF button on summary ── */
    .btn-pdf {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 24px; border-radius: 24px;
      background: var(--accent); color: var(--on-accent);
      font-size: 13px; font-weight: 500; border: none; cursor: pointer;
      font-family: var(--font-display); transition: all var(--transition);
    }
    .btn-pdf:hover { box-shadow: 0 0 20px var(--accent-glow); }
    .btn-pdf .ti { font-size: 16px; }
  </style>
</head>
<body>

  <!-- Backend-provided configuration (API key etc.) — never asked of the user.
       The hidden inputs keep the existing read paths working unchanged. -->
  <script src="config.js"></script>
  <input type="hidden" id="api-key-input">
  <input type="checkbox" id="demo-mode-toggle" hidden>
  <script>
    document.getElementById('api-key-input').value =
      (window.ADAPTIQ_CONFIG && window.ADAPTIQ_CONFIG.claudeApiKey) || '';
  </script>

  <!-- ==========================================
       SCREEN 1: LOADING / BOOT
  =========================================== -->
  <!-- ==========================================
       SCREEN 1: LANDING / PROFILE SELECTION
  =========================================== -->
  <div id="screen-profile" class="screen active">
    <!-- Animated spotlight blobs -->
    <div class="spotlight-overlay">
      <div class="spotlight-blob spotlight-blob--left"></div>
      <div class="spotlight-blob spotlight-blob--mid"></div>
      <div class="spotlight-blob spotlight-blob--right"></div>
    </div>

    <div class="landing-content">
      <!-- Top bar -->
      <div class="landing-topbar">
        <div class="landing-topbar-left">
          <button class="theme-toggle-btn" id="theme-toggle-btn" type="button" title="Toggle light/dark theme" aria-label="Toggle theme">
            <span id="theme-toggle-icon">🌙</span>
          </button>
        </div>
        <div class="landing-account" id="account-dropdown">
          <button class="landing-account-btn" id="account-btn" type="button">
            <span class="landing-account-avatar" id="account-avatar-sm">G</span>
            <span id="account-btn-label">Profile</span>
            <span class="landing-account-caret">▼</span>
          </button>
          <div class="landing-account-menu">
            <div class="landing-account-header">
              <div class="landing-account-header-avatar" id="account-avatar-lg">G</div>
              <div>
                <div class="landing-account-name" id="account-name">Guest</div>
                <div class="landing-account-sub" id="account-sub">Not signed in</div>
              </div>
            </div>
            <div class="landing-account-divider"></div>
            <button class="landing-account-item" type="button">
              Selected Profile <span class="value" id="account-selected-profile">None</span>
            </button>
            <button class="landing-account-item" type="button">Account Settings</button>
            <button class="landing-account-item" type="button">Preferences</button>
            <div class="landing-account-divider"></div>
            <button class="landing-account-item" type="button" id="account-auth-btn">Sign In with Google</button>
          </div>
        </div>
      </div>

      <div class="landing-split">
        <!-- LEFT: wordmark + job description + resume upload -->
        <div class="landing-left">
          <h1 class="landing-wordmark">AdaptIQ</h1>
          <p class="landing-tagline">Adaptive Learning Intelligence</p>

          <div class="landing-section-label">Job Description</div>
          <textarea id="job-description-input" class="landing-jd-input"
                    placeholder="Paste the job description here…"></textarea>

          <label class="landing-resume-zone" id="resume-zone">
            <input type="file" id="resume-upload" accept=".pdf,.doc,.docx,.txt">
            <span class="landing-resume-text" id="resume-zone-text">Drop your resume here or browse</span>
            <span class="landing-resume-btn">Upload Resume</span>
          </label>
        </div>

        <!-- RIGHT: mode selection -->
        <div class="landing-right">
          <div class="landing-section-label">Select a Mode</div>
          <div class="landing-profiles">
            <div class="profile-card" data-id="adhd">
              <div class="profile-card-number">1</div>
              <div class="profile-card-tag">Focus
Engagement</div>
              <h3>ADHD</h3>
            </div>
            <div class="profile-card" data-id="anxiety">
              <div class="profile-card-number">2</div>
              <div class="profile-card-tag">Calm
Clarity</div>
              <h3>Anxiety</h3>
            </div>
            <div class="profile-card" data-id="asd">
              <div class="profile-card-number">3</div>
              <div class="profile-card-tag">Order
Progress</div>
              <h3>ASD</h3>
            </div>
          </div>
        </div>
      </div>

      <p class="landing-footnote">AdaptIQ tailors all interventions and sensitivity thresholds to the selected profile.</p>
      <script>
        (() => {
          // Theme toggle — mirrors state across the landing-screen and
          // in-session buttons and persists the choice across reloads.
          function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            try { localStorage.setItem('adaptiq-theme', theme); } catch (e) {}
            const icon = theme === 'light' ? '☀️' : '🌙';
            const iconEls = [
              document.getElementById('theme-toggle-icon'),
              document.getElementById('theme-toggle-icon-session'),
            ];
            iconEls.forEach(el => { if (el) el.textContent = icon; });
          }
          const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
          applyTheme(currentTheme);
          [
            document.getElementById('theme-toggle-btn'),
            document.getElementById('theme-toggle-btn-session'),
          ].forEach(el => {
            if (!el) return;
            el.addEventListener('click', () => {
              const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
              applyTheme(next);
            });
          });

          const dd  = document.getElementById('account-dropdown');
          const btn = document.getElementById('account-btn');
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dd.classList.toggle('open');
          });
          document.addEventListener('click', (e) => {
            if (!dd.contains(e.target)) dd.classList.remove('open');
          });
          document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', () => {
              document.getElementById('account-selected-profile').textContent =
                card.dataset.id.toUpperCase();
            });
          });
        })();
        // ── Resume upload + text extraction ──
        // Extracted text is stored on window.ResumeText and fed to Claude
        // during question generation so questions reference the actual resume.
        window.ResumeText = '';

        async function extractResumeText(file) {
          const name = file.name.toLowerCase();
          if (name.endsWith('.txt')) {
            return await file.text();
          }
          if (name.endsWith('.pdf')) {
            const lib = window.pdfjsLib;
            if (!lib) throw new Error('pdf.js not loaded');
            lib.GlobalWorkerOptions.workerSrc =
              'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
            const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
            const pages = [];
            for (let i = 1; i <= pdf.numPages; i++) {
              const content = await (await pdf.getPage(i)).getTextContent();
              pages.push(content.items.map(it => it.str).join(' '));
            }
            return pages.join('\n');
          }
          if (name.endsWith('.docx')) {
            if (!window.mammoth) throw new Error('mammoth not loaded');
            const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
            return result.value;
          }
          throw new Error('unsupported'); // legacy .doc etc.
        }

        // ── Structured entity extraction (Phase 10) ──
        // Prefers a background Worker (off the main thread); classic Workers
        // can throw under a file:// origin (no bundler/server here), so this
        // falls back to running the same logic inline on the main thread —
        // resumes are short enough that the fallback is still instant.
        window.ResumeMetadata = null;
        let resumeWorker;
        try { resumeWorker = new Worker('resume-worker.js'); } catch (e) { resumeWorker = null; }

        function extractResumeEntitiesFallback(text) {
          const LANGUAGES = ['JavaScript','TypeScript','Python','Java','C++','C#','Go','Rust','Ruby','PHP','Swift','Kotlin','Scala','R','MATLAB','SQL','HTML','CSS','Shell','Bash','Perl','Objective-C','Dart','Elixir','Haskell'];
          const FRAMEWORKS = ['React','Angular','Vue','Next.js','Node.js','Express','Django','Flask','FastAPI','Spring','Spring Boot','Rails','Laravel','.NET','ASP.NET','TensorFlow','PyTorch','Keras','scikit-learn','Pandas','NumPy','Redux','GraphQL','Docker','Kubernetes','AWS','Azure','GCP','Firebase','MongoDB','PostgreSQL','MySQL','Redis','Jenkins','Terraform','Webpack','jQuery','Bootstrap','Tailwind','Svelte','Flutter','Unity'];
          const findMatches = (dict) => dict.filter(term => {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i').test(text);
          });
          let years = 0;
          (text.match(/(\d+(?:\.\d+)?)\+?\s*years?/gi) || []).forEach(m => {
            const n = parseFloat(m);
            if (!isNaN(n) && n < 50) years = Math.max(years, n);
          });
          const now = new Date().getFullYear();
          let rangeTotal = 0;
          (text.match(/(19|20)\d{2}\s*[-–—]\s*((19|20)\d{2}|present|current)/gi) || []).forEach(r => {
            const parts = r.match(/(19|20)\d{2}|present|current/gi) || [];
            const start = parseInt(parts[0], 10);
            const end = /present|current/i.test(parts[1]) ? now : parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && end >= start) rangeTotal += (end - start);
          });
          return {
            languages: findMatches(LANGUAGES),
            frameworks: findMatches(FRAMEWORKS),
            tenureYears: Math.round(Math.max(years, rangeTotal) * 10) / 10,
          };
        }

        function extractResumeMetadata(text) {
          if (resumeWorker) {
            resumeWorker.onmessage = (e) => { window.ResumeMetadata = e.data; };
            resumeWorker.onerror = () => { window.ResumeMetadata = extractResumeEntitiesFallback(text); };
            resumeWorker.postMessage({ text });
          } else {
            window.ResumeMetadata = extractResumeEntitiesFallback(text);
          }
        }

        document.getElementById('resume-upload').addEventListener('change', async (e) => {
          const file = e.target.files[0];
          const zone = document.getElementById('resume-zone');
          const text = document.getElementById('resume-zone-text');
          window.ResumeText = '';
          window.ResumeMetadata = null;
          if (!file) {
            text.textContent = 'Drop your resume here or browse';
            zone.classList.remove('has-file');
            return;
          }
          text.textContent = `Reading ${file.name}…`;
          try {
            const extracted = (await extractResumeText(file)).replace(/\s+/g, ' ').trim();
            if (extracted.length < 30) throw new Error('empty');
            window.ResumeText = extracted;
            extractResumeMetadata(extracted);
            text.textContent = `✓ ${file.name} — resume understood`;
            zone.classList.add('has-file');
          } catch (err) {
            console.warn('[Resume] extraction failed:', err);
            text.textContent = err.message === 'unsupported'
              ? `${file.name} — format not supported, use PDF, DOCX, or TXT`
              : `${file.name} — couldn't read text, try PDF or TXT`;
            zone.classList.remove('has-file');
          }
        });

        // ── Firebase Google Sign-In ──
        // Paste your config from Firebase Console → Project settings → General → Your apps
        const firebaseConfig = {
          apiKey: "****",
          authDomain: "adaptiq-fa584.firebaseapp.com",
          projectId: "adaptiq-fa584",
          storageBucket: "adaptiq-fa584.firebasestorage.app",
          messagingSenderId: "418982090683",
          appId: "1:418982090683:web:0b029dcaab9b41ad98969e",
          measurementId: "G-JX5CPG088L"
        };

        (() => {
          const authBtn   = document.getElementById('account-auth-btn');
          const nameEl    = document.getElementById('account-name');
          const subEl     = document.getElementById('account-sub');
          const btnLabel  = document.getElementById('account-btn-label');
          const avatarSm  = document.getElementById('account-avatar-sm');
          const avatarLg  = document.getElementById('account-avatar-lg');

          if (firebaseConfig.apiKey.startsWith('PASTE_')) {
            authBtn.addEventListener('click', () => {
              subEl.textContent = 'Add Firebase config first';
            });
            return;
          }

          firebase.initializeApp(firebaseConfig);
          const auth = firebase.auth();

          function setAvatar(el, user) {
            if (user?.photoURL) {
              el.textContent = '';
              el.style.backgroundImage = `url(${user.photoURL})`;
              el.style.backgroundSize = 'cover';
            } else {
              el.style.backgroundImage = '';
              el.textContent = (user?.displayName || 'G')[0].toUpperCase();
            }
          }

          auth.onAuthStateChanged((user) => {
            if (user) {
              nameEl.textContent    = user.displayName || user.email;
              subEl.textContent     = user.email;
              btnLabel.textContent  = (user.displayName || 'Profile').split(' ')[0];
              authBtn.textContent   = 'Sign Out';
            } else {
              nameEl.textContent    = 'Guest';
              subEl.textContent     = 'Not signed in';
              btnLabel.textContent  = 'Profile';
              authBtn.textContent   = 'Sign In with Google';
            }
            setAvatar(avatarSm, user);
            setAvatar(avatarLg, user);
          });

          authBtn.addEventListener('click', async () => {
            if (auth.currentUser) {
              await auth.signOut();
              return;
            }
            try {
              const provider = new firebase.auth.GoogleAuthProvider();
              await auth.signInWithPopup(provider);
            } catch (err) {
              console.warn('[Auth] Sign-in failed:', err);
              subEl.textContent = err.code === 'auth/popup-closed-by-user'
                ? 'Sign-in cancelled' : 'Sign-in failed — see console';
            }
          });
        })();
      </script>
    </div>
  </div>

  <!-- ==========================================
       SCREEN 2: INTERVIEW SETUP / QUESTION BUILDER
  =========================================== -->
  <div id="screen-setup" class="screen">
    <div class="setup-content">
      <!-- Top bar -->
      <div class="setup-topbar">
        <button class="setup-back" id="setup-back-btn" type="button">← Back</button>
        <div class="setup-mode-chip" id="setup-mode-chip">Mode: —</div>
      </div>

      <div class="setup-wizard">
        <!-- Progress indicator -->
        <div class="setup-progress">
          <div class="setup-prog-step active" data-step="1"><span class="num">1</span><span class="lbl">Job Details</span></div>
          <div class="setup-prog-line"></div>
          <div class="setup-prog-step" data-step="2"><span class="num">2</span><span class="lbl">Interview Type</span></div>
          <div class="setup-prog-line"></div>
          <div class="setup-prog-step" data-step="3"><span class="num">3</span><span class="lbl">Customize</span></div>
        </div>

        <!-- STEP 1: JOB DETAILS -->
        <div class="setup-step active" data-step="1">
          <h2 class="setup-heading">Tell us about the job</h2>
          <p class="setup-sub">Every question gets tailored to it</p>

          <div class="landing-section-label">Job Details</div>
          <div class="setup-field-row">
            <input id="setup-role" class="setup-input" placeholder="Role title — e.g. Data Analyst Intern">
            <input id="setup-company" class="setup-input" placeholder="Company — e.g. Prudential">
          </div>
          <div style="height:12px"></div>
          <textarea id="setup-jd" class="setup-input"
                    placeholder="Paste the job description here… (optional)"></textarea>
        </div>

        <!-- STEP 2: INTERVIEW TYPE -->
        <div class="setup-step" data-step="2">
          <h2 class="setup-heading">What kind of interview?</h2>
          <p class="setup-sub">Pick every type you want to practice</p>

          <div class="landing-section-label">Question Types</div>
          <div class="setup-types">
            <label class="setup-type-chip"><input type="checkbox" value="Background" checked><span class="box"></span><span class="setup-type-name">Background</span></label>
            <label class="setup-type-chip"><input type="checkbox" value="Behavioral" checked><span class="box"></span><span class="setup-type-name">Behavioral</span></label>
            <label class="setup-type-chip"><input type="checkbox" value="Technical"><span class="box"></span><span class="setup-type-name">Technical</span></label>
            <label class="setup-type-chip"><input type="checkbox" value="Situational"><span class="box"></span><span class="setup-type-name">Situational</span></label>
            <label class="setup-type-chip"><input type="checkbox" value="Strengths & Growth"><span class="box"></span><span class="setup-type-name">Strengths &amp; Growth</span></label>
            <label class="setup-type-chip"><input type="checkbox" value="Closing" checked><span class="box"></span><span class="setup-type-name">Closing</span></label>
          </div>
        </div>

        <!-- STEP 3: CUSTOMIZE & GENERATE -->
        <div class="setup-step" data-step="3">
          <h2 class="setup-heading">Customize your questions</h2>
          <p class="setup-sub">Generate, review, regenerate until it feels right</p>

          <div class="landing-section-label">Final Touches</div>
          <textarea id="setup-notes" class="setup-input" style="min-height:64px"
                    placeholder="Anything else? Team, tech stack, what you're nervous about…"></textarea>
          <div style="height:12px"></div>
          <div class="setup-count-row">
            <span class="setup-count-label">Number of Questions</span>
            <div class="setup-stepper">
              <button type="button" id="setup-count-minus">−</button>
              <span class="num" id="setup-count">8</span>
              <button type="button" id="setup-count-plus">+</button>
            </div>
          </div>

          <button class="setup-generate-btn" id="setup-generate-btn" type="button">Generate Questions</button>
          <div class="setup-error" id="setup-error"></div>

          <div class="landing-section-label">Your Questions</div>
          <div class="setup-questions" id="setup-questions">
            <div class="setup-q-empty">Generate your custom question set above</div>
          </div>
          <button class="setup-start-btn" id="setup-start-btn" type="button">Start Interview →</button>
        </div>

        <!-- Wizard navigation -->
        <div class="setup-nav">
          <button class="setup-nav-btn" id="setup-prev-step" type="button" style="visibility:hidden">← Back</button>
          <div class="setup-error" id="setup-step-error" style="margin-top:0"></div>
          <button class="setup-nav-btn primary" id="setup-next-step" type="button">Continue →</button>
        </div>
      </div>
    </div>
  </div>

  <script>
  // ── Interview setup: question generation ──
  (() => {
    const FALLBACK_BANK = {
      'Background': [
        { q: 'Tell me about yourself.' },
        { q: 'Walk me through your resume.' },
        { q: 'Why did you choose your major or field of study?' },
        { q: 'What drew you to apply for the {role} position?' },
        { q: 'What do you know about {company}?' },
      ],
      'Behavioral': [
        { q: 'Tell me about a time you worked on a team. What was your role?' },
        { q: 'Describe a time you had to learn something new quickly.' },
        { q: 'Tell me about a mistake you made and what you learned from it.' },
        { q: 'Describe a time you took initiative without being asked.' },
        { q: 'How do you handle disagreements with teammates?' },
      ],
      'Technical': [
        { q: 'Walk me through a project you built. What were the key technical decisions?' },
        { q: 'What tools or technologies are you most comfortable with, and why?' },
        { q: 'How would you approach a problem you have never seen before in a {role} role?' },
        { q: 'Describe a technical challenge you hit recently and how you debugged it.' },
        { q: 'How do you decide when your work is good enough to ship or submit?' },
      ],
      'Situational': [
        { q: 'Imagine you have multiple deadlines at once. How do you prioritize?' },
        { q: 'What would you do if you were assigned a task with unclear instructions?' },
        { q: 'If a teammate was not contributing, how would you handle it?' },
        { q: 'How would you respond if your manager gave you critical feedback?' },
      ],
      'Strengths & Growth': [
        { q: 'What is one of your strengths? Give a concrete example.' },
        { q: 'What is one area you are actively working to improve?' },
        { q: 'Where do you see yourself in five years?' },
        { q: 'What kind of work environment helps you do your best work?' },
      ],
      'Closing': [
        { q: 'Why should we hire you for this position?' },
        { q: 'What are your salary expectations?' },
        { q: 'Do you have any questions for us?' },
      ],
    };

    let count = 8;
    let generated = [];

    const $ = (id) => document.getElementById(id);

    // ── Wizard step navigation ──
    const TOTAL_STEPS = 3;
    let step = 1;

    function showStep(n) {
      step = Math.max(1, Math.min(TOTAL_STEPS, n));
      document.querySelectorAll('.setup-step').forEach(el =>
        el.classList.toggle('active', +el.dataset.step === step));
      document.querySelectorAll('.setup-prog-step').forEach(el => {
        el.classList.toggle('active', +el.dataset.step === step);
        el.classList.toggle('done',   +el.dataset.step < step);
      });
      $('setup-prev-step').style.visibility = step === 1 ? 'hidden' : 'visible';
      $('setup-next-step').style.display    = step === TOTAL_STEPS ? 'none' : '';
      $('setup-step-error').style.display   = 'none';
    }

    $('setup-next-step').addEventListener('click', () => {
      // Step 2 requires at least one interview type before continuing
      if (step === 2 && selectedTypes().length === 0) {
        const err = $('setup-step-error');
        err.textContent = 'Select at least one question type.';
        err.style.display = 'block';
        return;
      }
      showStep(step + 1);
    });
    $('setup-prev-step').addEventListener('click', () => showStep(step - 1));

    // Arriving from screen 1: show mode, restart wizard, prefill the job
    // description from the landing page if one was pasted there
    document.querySelectorAll('.profile-card').forEach(card => {
      card.addEventListener('click', () => {
        $('setup-mode-chip').textContent = `Mode: ${card.dataset.id.toUpperCase()}`;
        const landingJd = document.getElementById('job-description-input')?.value?.trim();
        if (landingJd && !$('setup-jd').value.trim()) $('setup-jd').value = landingJd;
        showStep(1);
      });
    });

    $('setup-back-btn').addEventListener('click', () => window.AdaptIQ_UI.showScreen('profile'));

    $('setup-count-minus').addEventListener('click', () => { count = Math.max(3, count - 1); $('setup-count').textContent = count; });
    $('setup-count-plus').addEventListener('click', () => { count = Math.min(30, count + 1); $('setup-count').textContent = count; });

    function selectedTypes() {
      return [...document.querySelectorAll('.setup-type-chip input:checked')].map(i => i.value);
    }

    function fillTokens(q, role, company) {
      return q
        .replace('{role}', role || 'this')
        .replace('{company}', company || 'our company');
    }

    function fallbackGenerate(types, role, company) {
      const pool = [];
      types.forEach(t => (FALLBACK_BANK[t] || []).forEach(item =>
        pool.push({ cat: t, q: fillTokens(item.q, role, company) })));
      // Interleave categories so the set feels like a real interview arc
      const byCat = types.map(t => pool.filter(p => p.cat === t));
      const out = [];
      let i = 0;
      while (out.length < count && byCat.some(c => c.length)) {
        const c = byCat[i % byCat.length];
        if (c.length) out.push(c.shift());
        i++;
      }
      return out;
    }

    async function claudeGenerate(apiKey, types, role, company, notes, jd, profile) {
      const resume = (window.ResumeText || '').slice(0, 8000);
      const meta = window.ResumeMetadata;
      const metaBlock = meta && (meta.languages.length || meta.frameworks.length || meta.tenureYears > 0)
        ? `\nExtracted from resume — languages: ${meta.languages.join(', ') || 'none detected'}; frameworks/tools: ${meta.frameworks.join(', ') || 'none detected'}; estimated experience: ${meta.tenureYears || '?'} years.\nIf "Technical" is an allowed question type, target technical questions at these SPECIFIC languages/frameworks (not generic CS trivia) and calibrate difficulty to the estimated experience level (junior/mid/senior). Calibrate behavioral question depth the same way — a candidate with more tenure should get questions probing leadership/ownership, not just individual tasks.`
        : '';
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 3000,
          messages: [{
            role: 'user',
            content: `You are an interview coach preparing practice questions for a neurodivergent job seeker (support profile: ${profile || 'general'}). Generate exactly ${count} interview questions tailored to this job and this candidate.

Role: ${role || 'not specified'}
Company: ${company || 'not specified'}
Job description: ${jd || 'not provided'}
Additional notes from the candidate: ${notes || 'none'}
Candidate's resume: ${resume || 'not provided'}${metaBlock}

Only use these question types: ${types.join(', ')}.
${resume ? 'Ground several questions in SPECIFIC items from the resume — real projects, employers, skills, or education it mentions (e.g. "Tell me about your work on X at Y"). Also probe gaps between the resume and the job requirements.' : ''}
Order them like a real interview (background first, closing last). Keep each question clear, concrete, and one sentence — no compound multi-part questions, no jargon.

Return ONLY a JSON array, each element: {"cat": "<one of the allowed types>", "q": "<question>"}`,
          }],
        }),
      });
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const json = await resp.json();
      const text = json.content?.[0]?.text || '';
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON in response');
      const arr = JSON.parse(match[0]).filter(x => x && x.q);
      if (!arr.length) throw new Error('Empty question list');
      return arr.slice(0, count);
    }

    function renderQuestions(list) {
      const box = $('setup-questions');
      box.innerHTML = '';
      list.forEach((item, idx) => {
        const el = document.createElement('div');
        el.className = 'setup-q-item';
        el.style.animationDelay = `${idx * 60}ms`;
        el.innerHTML = `
          <div class="setup-q-num">${idx + 1}</div>
          <div class="setup-q-body">
            <div class="setup-q-cat"></div>
            <div class="setup-q-text"></div>
          </div>`;
        el.querySelector('.setup-q-cat').textContent  = item.cat || 'Custom';
        el.querySelector('.setup-q-text').textContent = item.q;
        box.appendChild(el);
      });
      $('setup-start-btn').classList.add('visible');
    }

    $('setup-generate-btn').addEventListener('click', async () => {
      const types = selectedTypes();
      const err = $('setup-error');
      err.style.display = 'none';
      if (!types.length) {
        err.textContent = 'Select at least one question type.';
        err.style.display = 'block';
        return;
      }

      const btn = $('setup-generate-btn');
      btn.disabled = true;
      btn.textContent = 'Generating…';

      const role    = $('setup-role').value.trim();
      const company = $('setup-company').value.trim();
      const notes   = $('setup-notes').value.trim();
      const jd      = $('setup-jd').value.trim()
                      || document.getElementById('job-description-input')?.value?.trim();
      const apiKey  = document.getElementById('api-key-input')?.value?.trim();
      const profile = document.getElementById('topbar-profile-label')?.textContent;

      try {
        if (apiKey) {
          generated = await claudeGenerate(apiKey, types, role, company, notes, jd, profile);
        } else {
          generated = fallbackGenerate(types, role, company);
        }
      } catch (e) {
        console.warn('[Setup] Claude generation failed, using fallback:', e);
        generated = fallbackGenerate(types, role, company);
        err.textContent = 'AI generation unavailable — built questions from templates instead.';
        err.style.display = 'block';
      }

      renderQuestions(generated);
      btn.disabled = false;
      btn.textContent = 'Regenerate Questions';
    });

    $('setup-start-btn').addEventListener('click', () => {
      if (generated.length && window.QuestionManager) {
        window.QuestionManager.setQuestions(generated);
      }
      window.AdaptIQ_UI.showScreen('dashboard');
      window.AdaptIQ_UI.startSession();
    });
  })();
  </script>

  <!-- ==========================================
       SCREEN 3: MAIN DASHBOARD
  =========================================== -->
  <div id="screen-dashboard" class="screen">

    <!-- TOP BAR -->
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-logo">
          <div class="topbar-logo-mark-new">AQ</div>
          <div class="topbar-logo-name-new">AdaptIQ</div>
        </div>
      </div>

      <div class="topbar-center">
        <div class="topbar-timer-pill">
          <i class="ti ti-clock"></i>
          <span id="session-timer">00:00</span>
        </div>
        <div id="warmup-pill">
          <span class="pulse-dot"></span>
          Warming up…
        </div>
      </div>

      <div class="topbar-right">
        <button class="theme-toggle-btn" id="theme-toggle-btn-session" type="button" title="Toggle light/dark theme" aria-label="Toggle theme">
          <span id="theme-toggle-icon-session">🌙</span>
        </button>
        <div class="topbar-profile-chip-new">
          <span id="topbar-profile-label">ADHD</span>
        </div>
      </div>
    </div>

    <!-- RESIZABLE VIDEO/QUESTION LAYOUT -->
    <div class="dash-main layout-split" id="dash-main">

    <!-- VIDEO AREA + OVERLAY PANELS -->
    <div class="video-area" id="video-panel">
      <video id="video-feed" autoplay muted playsinline></video>
      <canvas id="face-overlay-canvas"></canvas>

      <!-- PANEL A — AI Coach -->
      <div class="overlay-panel" id="panel-coach">
        <div class="overlay-panel-header">
          <span class="overlay-panel-title">AI Coach</span>
          <button class="overlay-panel-close" data-panel="coach"><i class="ti ti-x"></i></button>
        </div>
        <div class="coach-row">
          <div class="coach-dot"></div>
          <span class="coach-label">AdaptIQ</span>
        </div>
        <p class="coach-tip" id="coach-tip-text"><em>Listening for cues…</em></p>
      </div>

      <!-- PANEL B — Session Scores -->
      <div class="overlay-panel" id="panel-score">
        <div class="overlay-panel-header">
          <span class="overlay-panel-title">Session Scores</span>
          <button class="overlay-panel-close" data-panel="score"><i class="ti ti-x"></i></button>
        </div>
        <div class="score-grid">
          <div class="score-card">
            <div class="score-card-value" id="ps-eye">0</div>
            <div class="score-card-label">Eye Contact</div>
            <div class="score-card-bar"><div class="score-card-bar-fill" id="psb-eye" style="width:0%"></div></div>
          </div>
          <div class="score-card">
            <div class="score-card-value" id="ps-head">0</div>
            <div class="score-card-label">Head Stability</div>
            <div class="score-card-bar"><div class="score-card-bar-fill" id="psb-head" style="width:0%"></div></div>
          </div>
          <div class="score-card">
            <div class="score-card-value" id="ps-vocal">0</div>
            <div class="score-card-label">Vocal Confidence</div>
            <div class="score-card-bar"><div class="score-card-bar-fill" id="psb-vocal" style="width:0%"></div></div>
          </div>
          <div class="score-card">
            <div class="score-card-value" id="ps-clarity">0</div>
            <div class="score-card-label">Clarity</div>
            <div class="score-card-bar"><div class="score-card-bar-fill" id="psb-clarity" style="width:0%"></div></div>
          </div>
        </div>
      </div>

      <!-- PANEL C — Live Signals -->
      <div class="overlay-panel" id="panel-signals">
        <div class="overlay-panel-header">
          <span class="overlay-panel-title">Live Signals</span>
          <button class="overlay-panel-close" data-panel="signals"><i class="ti ti-x"></i></button>
        </div>
        <div class="signals-row">
          <div class="signal-pill">
            <i class="ti ti-eye signal-pill-icon"></i>
            <span class="signal-pill-label">Eye</span>
            <div class="signal-pill-value" id="sig-eye">0</div>
          </div>
          <div class="signal-pill">
            <i class="ti ti-heart signal-pill-icon"></i>
            <span class="signal-pill-label">Calm</span>
            <div class="signal-pill-value" id="sig-calm">0</div>
          </div>
          <div class="signal-pill">
            <i class="ti ti-microphone signal-pill-icon"></i>
            <span class="signal-pill-label">Voice</span>
            <div class="signal-pill-value" id="sig-voice">0</div>
          </div>
        </div>
      </div>

      <!-- PANEL D — Code Sandbox (technical questions only) -->
      <div class="overlay-panel code-panel" id="panel-code">
        <div class="overlay-panel-header">
          <span class="overlay-panel-title">Code Sandbox</span>
          <div class="code-panel-header-right">
            <select id="code-language-select" class="code-language-select">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            <button class="overlay-panel-close" data-panel="code"><i class="ti ti-x"></i></button>
          </div>
        </div>
        <div id="monaco-editor-container" class="monaco-editor-container"></div>
        <div class="code-panel-footer">
          <div id="code-results" class="code-results"></div>
          <button class="qnav-btn qnav-primary" id="btn-submit-code">Run &amp; Submit</button>
        </div>
      </div>
    </div>

    <!-- QUESTION BAR -->
    <div class="question-bar">
      <div class="question-bar-meta">
        <span class="question-bar-category" id="question-category">Basic Information</span>
        <span class="question-bar-progress" id="question-progress">1 / 26</span>
      </div>
      <div class="question-bar-text" id="question-text">What is your name?</div>
      <div class="question-bar-nav">
        <div class="layout-toggle" id="layout-toggle" role="group" aria-label="Resize layout">
          <button class="layout-toggle-btn active" data-layout="split" title="Split view">Split</button>
          <button class="layout-toggle-btn" data-layout="focus" title="Focus on question">Focus</button>
          <button class="layout-toggle-btn" data-layout="pip" title="Picture-in-picture camera">PiP</button>
        </div>
        <button class="qnav-btn" id="btn-help" title="Get a tip for this question">💡 Help</button>
        <button class="qnav-btn" id="btn-prev-q" disabled>← Prev</button>
        <button class="qnav-btn qnav-primary" id="btn-next-q">Next →</button>
      </div>
    </div>

    </div> <!-- /dash-main -->

    <!-- BOTTOM CONTROLS -->
    <div class="bottom-controls">
      <div class="bottom-left">
        <button class="panel-toggle-btn" id="btn-coach" data-panel="coach">
          <i class="ti ti-robot"></i>
          <span>Coach</span>
        </button>
        <button class="panel-toggle-btn" id="btn-score" data-panel="score">
          <i class="ti ti-chart-bar"></i>
          <span>Scores</span>
        </button>
        <button class="panel-toggle-btn" id="btn-signals" data-panel="signals">
          <i class="ti ti-activity"></i>
          <span>Signals</span>
        </button>
        <button class="panel-toggle-btn" id="btn-code" data-panel="code" style="display:none;">
          <i class="ti ti-code"></i>
          <span>Code</span>
        </button>
      </div>

      <div class="bottom-center">
        <button class="call-btn" id="btn-mic-toggle" title="Toggle Microphone">
          <i class="ti ti-microphone" id="mic-icon"></i>
        </button>
        <button class="call-btn" id="btn-cam-toggle" title="Toggle Camera">
          <i class="ti ti-video" id="cam-icon"></i>
        </button>
        <button class="call-btn call-btn-end" id="btn-end-session" title="End Session">
          <i class="ti ti-phone-off"></i>
        </button>
      </div>

      <div class="bottom-right">
        <button class="util-btn" id="btn-settings" title="Settings">
          <i class="ti ti-settings"></i>
        </button>
      </div>
    </div>

    <!-- Legacy hidden elements — keep IDs for backward-compat JS -->
    <div style="display:none" aria-hidden="true">
      <canvas id="score-ring-canvas" width="100" height="100"></canvas>
      <div id="score-overall">--</div>
      <div id="score-grade">—</div>
      <div id="score-eye">0</div>
      <div id="score-head">0</div>
      <div id="score-vocal">0</div>
      <div id="score-clarity">0</div>
      <div id="sbar-eye"></div><div id="sbar-head"></div>
      <div id="sbar-vocal"></div><div id="sbar-clarity"></div>
      <div id="metric-gds">0</div><div id="metric-hpd">0</div>
      <div id="metric-bra">0</div><div id="metric-ves">0</div>
      <div id="metric-sr">0</div><div id="metric-osr">0</div>
      <div id="metric-et">0</div><div id="metric-ces">0</div>
      <div id="metric-silr">0</div><div id="metric-pvs">0</div>
      <div id="bar-bra"></div><div id="bar-sr"></div>
      <div id="bar-osr"></div><div id="bar-pvs"></div>
      <canvas id="spark-gds"></canvas><canvas id="spark-hpd"></canvas>
      <canvas id="spark-ves"></canvas><canvas id="spark-ces"></canvas>
      <canvas id="spark-silr"></canvas>
      <button id="mode-btn-simple" class="active"></button>
      <button id="mode-btn-technical"></button>
      <input type="checkbox" id="mode-toggle">
      <span id="mode-label-simple"></span><span id="mode-label-technical"></span>
      <div id="question-card"></div>
      <div class="sensor-dot inactive" id="status-dot-camera">
        <span class="sensor-dot-indicator"></span>
        <span class="sensor-dot-tooltip">Camera inactive</span>
      </div>
      <div class="sensor-dot inactive" id="status-dot-mic">
        <span class="sensor-dot-indicator"></span>
        <span class="sensor-dot-tooltip">Microphone inactive</span>
      </div>
      <div class="sensor-dot inactive" id="status-dot-ai">
        <span class="sensor-dot-indicator"></span>
        <span class="sensor-dot-tooltip">AI offline</span>
      </div>
      <div class="sensor-dot nominal" id="status-dot-system">
        <span class="sensor-dot-indicator"></span>
        <span class="sensor-dot-tooltip">Systems nominal</span>
      </div>
    </div>

  </div>

  <!-- ==========================================
       SCREEN 5: SESSION SUMMARY
  =========================================== -->
  <div id="screen-summary" class="screen">
    <div class="summary-card">
      <div class="summary-header">
        <div class="summary-header-left">
          <h2>Session Complete</h2>
          <p id="summary-subtitle">Session ended · Profile: ADHD</p>
        </div>
        <div class="summary-grade-badge">
          <div class="summary-grade-letter" id="summary-grade">B</div>
          <div class="summary-grade-label">Overall Grade</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-stat">
          <div class="summary-stat-value" id="sum-overall">--</div>
          <div class="summary-stat-label">Overall Score</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-value" id="sum-eye">--</div>
          <div class="summary-stat-label">Eye Contact</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-value" id="sum-head">--</div>
          <div class="summary-stat-label">Head Stability</div>
        </div>
        <div class="summary-stat">
          <div class="summary-stat-value" id="sum-vocal">--</div>
          <div class="summary-stat-label">Vocal Confidence</div>
        </div>
      </div>

      <div class="h-rule"></div>

      <div style="margin-top: 24px; padding: 20px; background: var(--bg-card); border-radius: var(--radius); border: 1px solid var(--border);">
        <div class="panel-section-label" style="border: none; padding: 0; margin-bottom: 12px;">AI Insights</div>
        <div id="summary-insights" style="font-size: 13px; line-height: 1.8; color: var(--text-secondary);">
          Analysis complete. Review the metrics above for detailed performance breakdown.
        </div>
      </div>

      <div class="summary-actions">
        <button class="btn-secondary" id="btn-new-session">New Session</button>
        <button class="btn-pdf" id="btn-export">
          <i class="ti ti-download"></i>
          Download PDF Report
        </button>
      </div>
    </div>
  </div>

  <!-- ==========================================
       OVERLAYS (always in DOM)
  =========================================== -->

  <!-- Gaze dot (technical mode only) -->
  <div id="gaze-dot"></div>

  <!-- Status orb + detail card -->
  <div id="status-orb" class="orb-blue" title="Nominal"></div>
  <div id="orb-card" class="orb-card hidden">
    <button class="orb-card-dismiss" id="orb-card-dismiss">×</button>
    <div class="orb-card-label" id="orb-card-label">Nominal</div>
    <div class="orb-card-desc" id="orb-card-desc">All systems running normally.</div>
  </div>

  <!-- ==========================================
       SCRIPTS
  =========================================== -->
  <script>
    // === EVENT BUS === //
    const Bus = (() => {
      const subs = {};
      return {
        on(evt, fn)   { (subs[evt] ||= []).push(fn); },
        off(evt, fn)  { subs[evt] = (subs[evt] || []).filter(f => f !== fn); },
        emit(evt, data) { (subs[evt] || []).forEach(fn => fn(data)); }
      };
    })();
  </script>

  <script src="metrics-math.js"></script>
  <script>
    // === SENSORS MODULE === //
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
          baseline = { avgX: 0.5, avgY: 0.5 };
        }
        _applyHeadBaseline();
        Bus.emit('calibration:complete', { type: 'gaze' });
        resolve();
      }, 2000);
    });
  }

  function start() { running = true; }
  function stop()  {
    running = false;
    if (loopId) { clearInterval(loopId); loopId = null; }
  }
  function getLatest() { return latest; }

  return { init, startCalibration, startMultiPointCalibration, start, stop, getLatest };
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

  return { init, start, stop, reset, getLatest, getTranscript, getTranscriptSegments, hasSpeechRecognition };
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
  stop()  { FaceEngine.stop();  GazeEngine.stop();  AudioEngine.stop();  },
};
  </script>

  <script>
    // === BRAIN MODULE === //
// === ADAPTIQ BRAIN MODULE === //

// =========================================================
// 1. PROFILE CONFIG
// =========================================================
const ProfileConfig = (() => {
  // Each weakness contributes signal focus, tighter z-score/value thresholds,
  // and intervention overrides on top of the base profile.
  const WEAKNESS_CATALOG = {
    stuttering: {
      label: 'Stuttering',
      monitored_signals: ['silr', 'sr'],
      signal_z: { sr: 1.3 },
      val_thresholds: { PROLONGED_SILENCE_SILR: 40 },
      interventions: {
        PROLONGED_SILENCE: { action: 'claude_response', message: "Take your time — there's no rush." },
        SPEECH_PANIC:      { action: 'banner', message: "Pause, breathe, and continue whenever you're ready.", color: '#f59e0b', severity: 'medium' },
      },
    },
    eye_contact: {
      label: 'Losing Eye Contact',
      monitored_signals: ['gds', 'osr'],
      signal_z: { gds: 1.3 },
      val_thresholds: { GAZE_LOST_OSR: 65 },
      interventions: {
        GAZE_ERRATIC: { action: 'banner', message: 'Try to keep your eyes on the camera.', color: '#f59e0b', severity: 'medium' },
        GAZE_LOST:    { action: 'banner', message: "Look at the camera — I'm right here.", color: '#ef4444', severity: 'high' },
      },
    },
    distraction: {
      label: 'Distraction',
      monitored_signals: ['gds', 'hpd'],
      signal_z: { gds: 1.5, hpd: 1.5 },
      ces_alert_level: 55,
      interventions: {
        ATTENTION_DROP: { action: 'content_swap', message: "Let's try something different!" },
        FOCUS_DRIFT:    { action: 'focus_object',  message: 'Can you find the shape?', duration: 3000 },
      },
    },
    speaking_too_fast: {
      label: 'Speaking Too Fast',
      monitored_signals: ['sr', 'pvs'],
      val_thresholds: { SPEECH_PANIC_SR: 55, OVERCONFIDENT_PACE_SR: 50 },
      interventions: {
        SPEECH_PANIC:       { action: 'banner', message: "You're speaking very fast. Pause and collect your thoughts.", color: '#ef4444', severity: 'high' },
        OVERCONFIDENT_PACE: { action: 'banner', message: 'Great energy! Try varying your pace for emphasis.', color: '#3b82f6', severity: 'low' },
      },
    },
    anxiety: {
      label: 'Anxiety / Stress',
      monitored_signals: ['et', 'ves', 'pvs'],
      signal_z: { et: 1.5, ves: 1.5 },
      interventions: {
        STRESS_DETECTED: { action: 'break_timer', message: 'Time for a quick break!', duration: 30000 },
      },
    },
  };

  const BASE_INTERVENTIONS = {
    GAZE_ERRATIC:       { action: 'banner',         message: 'Maintain steady eye contact with the camera.', color: '#f59e0b', severity: 'medium' },
    GAZE_LOST:          { action: 'banner',         message: 'Look at the camera.', color: '#ef4444', severity: 'high' },
    ATTENTION_DROP:     { action: 'content_swap',   message: "Let's try something different!" },
    STRESS_DETECTED:    { action: 'banner',         message: "Take a breath. Slow down. You've got this.", color: '#f59e0b', severity: 'medium' },
    FOCUS_DRIFT:        { action: 'claude_response',message: 'Let me rephrase that differently.' },
    PROLONGED_SILENCE:  { action: 'claude_response',message: "You've been quiet — need help?" },
    SPEECH_PANIC:       { action: 'banner',         message: "You're speaking quickly. Take a moment.", color: '#f59e0b', severity: 'medium' },
    OVERCONFIDENT_PACE: { action: 'banner',         message: 'Great energy! Try varying your pace for emphasis.', color: '#3b82f6', severity: 'low' },
  };

  // threshold_z is the default z-score bound; val_thresholds are the default
  // raw-value bounds checked directly against a signal (0-100 scale).
  // PROLONGED_SILENCE_SILR is tighter here (60) than the brain.js test
  // fixture (80) — matches this app's pre-existing live-demo tuning.
  const DEFAULT_VAL_THRESHOLDS = {
    GAZE_LOST_OSR:          80,
    PROLONGED_SILENCE_SILR: 60,
    SPEECH_PANIC_SR:        70,
    OVERCONFIDENT_PACE_SR:  60,
    OVERCONFIDENT_PACE_PVS: 10,
  };

  function build(weaknesses = []) {
    const ids = weaknesses.map(w => (typeof w === 'string' ? w : w?.id)).filter(Boolean);

    const profile = {
      id: ids.length ? `custom:${ids.join('+')}` : 'custom:general',
      name: ids.length ? ids.map(id => WEAKNESS_CATALOG[id]?.label || id).join(' + ') : 'General',
      threshold_z: 2.0,
      ces_alert_level: 63,
      cooldown_seconds: 15,
      monitored_signals: ['gds', 'osr', 'hpd', 'et', 'ves', 'pvs', 'sr', 'silr', 'bra'],
      signal_z: {},
      val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
      interventions: JSON.parse(JSON.stringify(BASE_INTERVENTIONS)),
      weaknesses: ids,
    };

    ids.forEach(id => {
      const w = WEAKNESS_CATALOG[id];
      if (!w) return;
      if (w.ces_alert_level !== undefined) profile.ces_alert_level = w.ces_alert_level;
      if (w.signal_z) Object.assign(profile.signal_z, w.signal_z);
      if (w.val_thresholds) Object.assign(profile.val_thresholds, w.val_thresholds);
      if (w.interventions) {
        Object.entries(w.interventions).forEach(([flag, iv]) => {
          profile.interventions[flag] = { ...profile.interventions[flag], ...iv };
        });
      }
    });

    return profile;
  }

  // Legacy single-select UI profile IDs map to a starter weakness set until
  // the weakness-picker UI (later phase) replaces the profile-card selector.
  const LEGACY_WEAKNESSES = {
    special_needs: ['distraction', 'eye_contact'],
    adhd:          ['distraction'],
    anxiety:       ['anxiety'],
    asd:           ['eye_contact'],
  };

  const INTERVIEW_COACH = {
    id: 'interview_coach',
    name: 'Interview Coach',
    threshold_z: 2.0,
    ces_alert_level: 63,
    cooldown_seconds: 15,
    monitored_signals: ['gds', 'osr', 'hpd', 'ves', 'pvs', 'sr', 'silr'],
    scored_metrics: true,
    signal_z: {},
    val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
    interventions: {
      GAZE_ERRATIC:        { action: 'banner',         message: 'Maintain steady eye contact with the camera.',              color: '#f59e0b', severity: 'medium' },
      GAZE_LOST:           { action: 'banner',         message: 'Look at the camera — your interviewer is here.',           color: '#ef4444', severity: 'high'   },
      STRESS_DETECTED:     { action: 'banner',         message: "Take a breath. Slow down. You've got this.",               color: '#f59e0b', severity: 'medium' },
      SPEECH_PANIC:        { action: 'banner',         message: "You're speaking very fast. Pause and collect your thoughts.", color: '#ef4444', severity: 'high' },
      PROLONGED_SILENCE:   { action: 'claude_response',message: "Looks like you're thinking — want a hint?"                                                       },
      OVERCONFIDENT_PACE:  { action: 'banner',         message: 'Great energy! Try varying your pace for emphasis.',        color: '#3b82f6', severity: 'low'    },
    },
  };

  const LANGUAGE_TEACHER = {
    id: 'language_teacher',
    name: 'Language Teacher',
    threshold_z: 2.0,
    ces_alert_level: 63,
    cooldown_seconds: 15,
    monitored_signals: ['et', 'pvs', 'silr', 'sr'],
    signal_z: {},
    val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
    interventions: {
      STRESS_DETECTED:   { action: 'content_swap',   message: "Let's simplify this. Try an easier sentence."     },
      FOCUS_DRIFT:       { action: 'claude_response',message: 'Let me rephrase that differently.'                },
      PROLONGED_SILENCE: { action: 'claude_response',message: 'Take your time. Want me to repeat?'               },
      SPEECH_PANIC:      { action: 'banner',         message: 'Slow down — pronunciation is more important than speed.', color: '#f59e0b', severity: 'medium' },
    },
  };

  return {
    WEAKNESS_CATALOG,
    INTERVIEW_COACH,
    LANGUAGE_TEACHER,
    build,
    getById(id) {
      if (id === 'interview_coach')  return INTERVIEW_COACH;
      if (id === 'language_teacher') return LANGUAGE_TEACHER;
      const weaknesses = LEGACY_WEAKNESSES[id];
      return weaknesses ? build(weaknesses) : null;
    },
  };
})();

window.ProfileConfig = ProfileConfig;

// =========================================================
// 2. ANOMALY DETECTOR
// =========================================================
const AnomalyDetector = (() => {
  const SIGNAL_NAMES = ['gds', 'osr', 'hpd', 'et', 'ves', 'pvs', 'silr', 'sr', 'bra'];
  const CES_W = { gds: 0.20, osr: 0.20, hpd: 0.15, et: 0.10, ves: 0.10, pvs: 0.10, sr: 0.10, bra: 0.05 };

  const FLAG_DURATION = {
    GAZE_ERRATIC:       3000,
    GAZE_LOST:          5000,
    ATTENTION_DROP:     10000,
    STRESS_DETECTED:    5000,
    FOCUS_DRIFT:        8000,
    SPEECH_PANIC:       3000,
    PROLONGED_SILENCE:  5000,
    OVERCONFIDENT_PACE: 10000,
  };

  // Demo mode: much shorter durations so flags fire in seconds during a live demo
  const DEMO_FLAG_DURATION = {
    GAZE_ERRATIC:       1000,
    GAZE_LOST:          1500,
    ATTENTION_DROP:     2000,
    STRESS_DETECTED:    1500,
    FOCUS_DRIFT:        2000,
    SPEECH_PANIC:       1000,
    PROLONGED_SILENCE:  3000,
    OVERCONFIDENT_PACE: 2000,
  };

  const FLAG_SEVERITY = {
    GAZE_ERRATIC:       'medium',
    GAZE_LOST:          'high',
    ATTENTION_DROP:     'high',
    STRESS_DETECTED:    'medium',
    FOCUS_DRIFT:        'low',
    SPEECH_PANIC:       'high',
    PROLONGED_SILENCE:  'medium',
    OVERCONFIDENT_PACE: 'low',
  };

  let buffers = {};
  let latestSignals = {};
  let isCalibrating = true;
  let calibrationStartTime = null;
  let activeProfile = null;
  let detectionInterval = null;
  let flagOnsetTimes = {};

  function clamp(v, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, v)); }

  function makeBuffer() {
    return (typeof SignalBuffer !== 'undefined') ? new SignalBuffer(60) : null;
  }

  function resetState() {
    buffers = {};
    SIGNAL_NAMES.forEach(n => { buffers[n] = makeBuffer(); });
    latestSignals = {};
    flagOnsetTimes = {};
    isCalibrating = true;
    calibrationStartTime = Date.now();
  }

  function pushToBuffer(name, value) {
    if (!buffers[name]) buffers[name] = makeBuffer();
    if (buffers[name]) buffers[name].push(value);
  }

  function getZ(name) {
    const buf = buffers[name];
    if (!buf) return 0;
    return buf.zScore(latestSignals[name] || 0);
  }

  function getVal(name) { return latestSignals[name] || 0; }

  function computeCES(s) {
    const raw = Object.keys(CES_W).reduce((sum, k) => sum + (s[k] || 0) * CES_W[k], 0);
    return clamp(100 - raw);
  }

  function zFor(name) {
    return (activeProfile.signal_z && activeProfile.signal_z[name]) || activeProfile.threshold_z;
  }

  function vt(key, fallback) {
    const v = activeProfile.val_thresholds && activeProfile.val_thresholds[key];
    return v !== undefined ? v : fallback;
  }

  function checkCondition(flagType) {
    if (!activeProfile) return false;
    switch (flagType) {
      case 'GAZE_ERRATIC':       return getZ('gds') > zFor('gds');
      case 'GAZE_LOST':          return getVal('osr') > vt('GAZE_LOST_OSR', 80);
      case 'ATTENTION_DROP':     return computeCES(latestSignals) < activeProfile.ces_alert_level;
      case 'STRESS_DETECTED':    return getZ('et') > zFor('et') && (getZ('ves') > zFor('ves') || getZ('pvs') > zFor('pvs'));
      case 'FOCUS_DRIFT':        return getZ('gds') > zFor('gds') * 0.8 && getZ('hpd') > zFor('hpd') * 0.8;
      case 'SPEECH_PANIC':       return getVal('sr') > vt('SPEECH_PANIC_SR', 70) && getZ('ves') > zFor('ves');
      case 'PROLONGED_SILENCE':  return getVal('silr') > vt('PROLONGED_SILENCE_SILR', 60);
      case 'OVERCONFIDENT_PACE': return getVal('sr') > vt('OVERCONFIDENT_PACE_SR', 60) && getVal('pvs') < vt('OVERCONFIDENT_PACE_PVS', 10);
      default:                   return false;
    }
  }

  function detectionCycle() {
    if (!activeProfile) return;
    const now = Date.now();
    const elapsed = now - calibrationStartTime;

    if (isCalibrating) {
      const calibWindow = window.DEMO_MODE ? 5000 : 8000;
      if (elapsed < calibWindow) { Bus.emit('signal:update', { ...latestSignals, ces: 100 }); return; }
      isCalibrating = false;
      Bus.emit('calibration:complete', { type: 'baseline' });
    }

    const ces = computeCES(latestSignals);
    Bus.emit('signal:update', { ...latestSignals, ces });

    Object.keys(FLAG_DURATION).forEach(flagType => {
      if (!activeProfile.interventions[flagType]) return;
      const triggered = checkCondition(flagType);
      if (triggered) {
        if (!flagOnsetTimes[flagType]) {
          flagOnsetTimes[flagType] = now;
        } else if (now - flagOnsetTimes[flagType] >= (window.DEMO_MODE ? DEMO_FLAG_DURATION : FLAG_DURATION)[flagType]) {
          delete flagOnsetTimes[flagType];
          Bus.emit('flag:fired', {
            type: flagType,
            severity: FLAG_SEVERITY[flagType],
            timestamp: now,
            message: activeProfile.interventions[flagType]?.message || flagType,
          });
        }
      } else {
        delete flagOnsetTimes[flagType];
      }
    });
  }

  function init(profile) { activeProfile = profile; resetState(); }
  function start() {
    if (detectionInterval) clearInterval(detectionInterval);
    detectionInterval = setInterval(() => { try { detectionCycle(); } catch (e) { console.error('[AnomalyDetector]', e); } }, 100);
  }
  function stop() { if (detectionInterval) { clearInterval(detectionInterval); detectionInterval = null; } }
  function reset() { stop(); resetState(); }
  function getCES() { return computeCES(latestSignals); }

  Bus.on('signal:face', ({ et, hpd, bra }) => {
    latestSignals.et = et || 0; latestSignals.hpd = hpd || 0; latestSignals.bra = bra || 0;
    pushToBuffer('et', latestSignals.et); pushToBuffer('hpd', latestSignals.hpd); pushToBuffer('bra', latestSignals.bra);
  });
  Bus.on('signal:gaze', ({ gds, osr }) => {
    latestSignals.gds = gds || 0; latestSignals.osr = osr || 0;
    pushToBuffer('gds', latestSignals.gds); pushToBuffer('osr', latestSignals.osr);
  });
  Bus.on('signal:audio', ({ ves, pvs, silr, sr }) => {
    latestSignals.ves = ves || 0; latestSignals.pvs = pvs || 0; latestSignals.silr = silr || 0; latestSignals.sr = sr || 0;
    pushToBuffer('ves', latestSignals.ves); pushToBuffer('pvs', latestSignals.pvs);
    pushToBuffer('silr', latestSignals.silr); pushToBuffer('sr', latestSignals.sr);
  });
  Bus.on('profile:selected', ({ id, config }) => { init(config); });

  return { init, start, stop, reset, get isCalibrating() { return isCalibrating; }, getCES };
})();

window.AnomalyDetector = AnomalyDetector;

// =========================================================
// 3. INTERVENTION DISPATCHER
// =========================================================
const InterventionDispatcher = (() => {
  let lastInterventionTime = 0;
  let interventionLog = [];
  let activeProfile = null;

  function init(profile) { activeProfile = profile; interventionLog = []; lastInterventionTime = 0; }

  Bus.on('profile:selected', ({ id, config }) => { init(config); });

  Bus.on('flag:fired', (flag) => {
    if (!activeProfile) return;
    const now = Date.now();
    if (now - lastInterventionTime < (window.DEMO_MODE ? 5 : activeProfile.cooldown_seconds) * 1000) return;
    const intervention = activeProfile.interventions[flag.type];
    if (!intervention) return;
    interventionLog.push({ flag, intervention, timestamp: now });
    lastInterventionTime = now;
    if (intervention.action === 'claude_response') {
      window.ClaudeClient?.generate({
        profile: activeProfile,
        signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
        transcript: window.AudioEngine ? AudioEngine.getTranscript() : '',
        flagType: flag.type,
        message: intervention.message,
      });
    } else {
      Bus.emit('intervention:trigger', { ...intervention, profile: activeProfile.id });
    }
  });

  // On-demand help — ui.js stays decoupled from ClaudeClient/AudioEngine and
  // only knows the current question; this listener owns gathering context.
  // Not gated by the intervention cooldown: a manual click is an explicit
  // request, not an anomaly-driven interruption.
  Bus.on('help:requested', ({ questionText } = {}) => {
    if (!activeProfile) return;
    const now = Date.now();
    const allSegments = window.AudioEngine && AudioEngine.getTranscriptSegments
      ? AudioEngine.getTranscriptSegments()
      : [];
    const recentTranscript = allSegments
      .filter(s => now - s.timestamp <= 60000)
      .map(s => s.text)
      .join(' ');
    window.ClaudeClient?.generate({
      profile: activeProfile,
      signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
      transcript: recentTranscript,
      requestType: 'help',
      questionText: questionText || '',
      message: "Here's a tip for this question.",
    });
  });

  // Technical-question code sandbox (Phase 9) — once a real backend exists
  // and emits sandbox:result after executing submitted code, this triggers
  // LLM feedback on algorithmic efficiency (not correctness — the sandbox's
  // hidden test cases already judge that deterministically).
  Bus.on('sandbox:result', (result) => {
    if (!activeProfile || !result) return;
    window.ClaudeClient?.generate({
      profile: activeProfile,
      signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
      requestType: 'sandbox_feedback',
      sandboxResult: result,
      message: 'Here\'s feedback on your solution\'s efficiency.',
    });
  });

  return { init, getLog() { return [...interventionLog]; }, reset() { interventionLog = []; lastInterventionTime = 0; } };
})();

window.InterventionDispatcher = InterventionDispatcher;

// =========================================================
// 4. CLAUDE CLIENT
// =========================================================
const ClaudeClient = (() => {
  let apiKey = null;

  const SYSTEM_PROMPTS = {
    interview_coach:  'You are a professional interview coach. Give direct, actionable feedback. Reference specific behaviors (eye contact, pacing, filler words). Keep responses under 3 sentences. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
    language_teacher: 'You are a friendly language teacher. Simplify your vocabulary. If the student is struggling, rephrase or offer an easier alternative. Keep responses under 2 sentences. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
  };

  // Coaching guidance per weakness (Phase 1's ProfileConfig.build) — injected
  // into the system prompt for weakness-based custom profiles so real-time
  // advice targets the user's actual selected pain points.
  const WEAKNESS_COACHING_NOTES = {
    stuttering:        'they may stutter or need extra time to get words out — never rush them, and reassure them that pausing is fine',
    eye_contact:       'they tend to lose eye contact with the camera — gently encourage them to look back at the camera without repeating yourself',
    distraction:       'they are prone to losing focus — help redirect their attention kindly',
    speaking_too_fast: 'they tend to speak too quickly when nervous — encourage a slower, steadier pace',
    anxiety:           'they experience anxiety or stress during interviews — keep your tone calm and reassuring',
  };

  function setApiKey(key) { apiKey = key; }

  function systemPromptFor(profile) {
    const profileId = profile?.id || 'interview_coach';
    if (SYSTEM_PROMPTS[profileId]) return SYSTEM_PROMPTS[profileId];

    const notes = (profile?.weaknesses || []).map(w => WEAKNESS_COACHING_NOTES[w]).filter(Boolean);
    const tailored = notes.length ? ` Keep in mind: ${notes.join('; ')}.` : '';
    return `You are a warm, encouraging interview coach for a neurodivergent job seeker.${tailored} Keep responses under 2-3 sentences and avoid jargon. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.`;
  }

  async function generate(context) {
    const { profile, signals, transcript, flagType, message, requestType, questionText, sandboxResult } = context;
    const systemPrompt = systemPromptFor(profile);
    const coachResume = (window.ResumeText || '').slice(0, 1500);
    const resumeNote = coachResume ? ` Candidate's resume (for context — reference their real experience when it helps): "${coachResume}".` : '';
    const userMsg = requestType === 'help'
      ? `The candidate tapped "Help" while answering: "${questionText || ''}". Recent transcript (last 60s): "${(transcript || '').slice(-600)}".${resumeNote} Give one brief, encouraging tip to help them answer this specific question well.`
      : requestType === 'sandbox_feedback'
      ? `The candidate submitted a coding solution that passed ${sandboxResult.passed}/${sandboxResult.total} hidden test cases, with time complexity O(${sandboxResult.timeComplexity || '?'}) and space complexity O(${sandboxResult.spaceComplexity || '?'}). Give one brief tip on the algorithmic efficiency of their approach — do not comment on correctness, that's already judged.`
      : `Flag triggered: ${flagType}. CES=${(signals.ces || 0).toFixed(0)}. Transcript: "${(transcript || '').slice(-200)}".${resumeNote} Respond briefly and helpfully.`;

    if (!apiKey) { Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true }); return; }

    let settled = false;
    let receivedFirstChunk = false;
    // Only use fallback if no response received after 15 seconds (network timeout, not slow response)
    const fallback = setTimeout(() => {
      if (!settled && !receivedFirstChunk) {
        settled = true;
        console.warn('[ClaudeClient] No response after 15s, using fallback');
        Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      }
    }, 15000);

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 150,
          stream: true,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });

      if (!resp.ok) {
        clearTimeout(fallback);
        if (!settled) { settled = true; Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true }); }
        return;
      }

      clearTimeout(fallback); settled = true;
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'content_block_delta' && evt.delta?.text) {
              receivedFirstChunk = true; // got first chunk, don't fall back
              Bus.emit('intervention:trigger', { action: 'claude_response', chunk: evt.delta.text, done: false });
            }
          } catch { /* skip malformed SSE */ }
        }
      }
      Bus.emit('intervention:trigger', { action: 'claude_response', chunk: '', done: true });
    } catch (err) {
      console.error('[ClaudeClient] generate error:', err);
      if (!settled) { settled = true; clearTimeout(fallback); Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true }); }
    }
  }

  async function generateDebrief(sessionData) {
    if (!apiKey) return null;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 400,
          system: 'You are a professional interview coach writing a session debrief. Be constructive, specific, and encouraging. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
          messages: [{ role: 'user', content: `Write a professional debrief for this interview practice session.\n\nSession data:\n${JSON.stringify(sessionData, null, 2)}\n${(window.ResumeText || '') ? `\nCandidate's resume:\n${window.ResumeText.slice(0, 3000)}\n\nWhere relevant, connect the feedback to their actual background — e.g. how to better present specific projects or experience from the resume.\n` : ''}\nInclude: overall performance summary, 2 strengths, 2 areas to improve, and 2 actionable tips.` }],
        }),
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      return json.content?.[0]?.text || null;
    } catch (err) { console.error('[ClaudeClient] debrief error:', err); return null; }
  }

  return { setApiKey, generate, generateDebrief };
})();

window.ClaudeClient = ClaudeClient;

// =========================================================
// 5. INTERVIEW SCORECARD
// =========================================================
const InterviewScorecard = (() => {
  const FILLER_RE = /\b(um|uh|like|you know|basically|actually|literally)\b/gi;
  let totalFrames = 0, framesWithGoodEyeContact = 0;
  let hpdValues = [], fillerCount = 0, wordCount = 0;
  let latestPvs = 0, latestSilr = 0, latestSr = 0;
  let scoreInterval = null, signalUpdateHandler = null, audioHandler = null;

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function reset() {
    totalFrames = 0; framesWithGoodEyeContact = 0; hpdValues = [];
    fillerCount = 0; wordCount = 0; latestPvs = 0; latestSilr = 0; latestSr = 0;
  }

  function getScores() {
    const eyeContact      = clamp(totalFrames > 0 ? (framesWithGoodEyeContact / totalFrames) * 100 : 0);
    const avgHpd          = hpdValues.length > 0 ? hpdValues.reduce((a, b) => a + b, 0) / hpdValues.length : 0;
    const headStability   = clamp(100 - avgHpd);
    // PVS: moderate variation is fine, only heavily penalise excessive pitch swings
    // SilR: silence is the primary penalty for vocal presence
    const vocalConfidence = clamp(100 - latestPvs * 0.3 - latestSilr * 0.7);

    // Speech Clarity requires the Web Speech API (Chrome/Edge). Where it is
    // unavailable (e.g. Firefox) it is null and excluded from the overall
    // grade via weight renormalisation — never a free 100.
    const srAvailable = window.AudioEngine?.hasSpeechRecognition?.() ?? true;
    let speechClarity = null;
    if (srAvailable) {
      const fillerPenalty = wordCount > 0 ? (fillerCount / wordCount) * 100 : 0;
      speechClarity = clamp(100 - latestSr - fillerPenalty);
    }

    const { overall, grade } = window.MetricsMath.overallScore(
      { eyeContact, headStability, vocalConfidence, speechClarity });
    return { eyeContact, headStability, vocalConfidence, speechClarity, overall, grade };
  }

  function init() {
    reset();
    if (signalUpdateHandler) Bus.off('signal:update', signalUpdateHandler);
    if (audioHandler) Bus.off('signal:audio', audioHandler);

    signalUpdateHandler = ({ osr, hpd }) => {
      // Skip counting during baseline calibration window — would skew percentages
      if (window.AnomalyDetector?.isCalibrating) return;
      totalFrames++;
      if ((osr || 0) < 30) framesWithGoodEyeContact++;
      if (hpd !== undefined) { hpdValues.push(hpd); if (hpdValues.length > 300) hpdValues.shift(); }
    };
    audioHandler = ({ pvs, silr, sr, transcript }) => {
      latestPvs = pvs || 0; latestSilr = silr || 0; latestSr = sr || 0;
      if (transcript) {
        fillerCount = (transcript.match(FILLER_RE) || []).length;
        wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
      }
    };

    Bus.on('signal:update', signalUpdateHandler);
    Bus.on('signal:audio', audioHandler);
    if (scoreInterval) clearInterval(scoreInterval);
    scoreInterval = setInterval(() => { try { Bus.emit('scores:update', getScores()); } catch (e) { console.error('[InterviewScorecard]', e); } }, 2000);
  }

  // Init for ALL profiles — scorecard metrics are universal
  Bus.on('profile:selected', ({ id, config }) => { if (config) return; init(); });

  return { init, reset, getScores };
})();

window.InterviewScorecard = InterviewScorecard;

// =========================================================
// 6. SESSION MANAGER
// =========================================================
const SessionManager = (() => {
  let sessionStartTime = null, lastSessionData = null;

  function start() { sessionStartTime = Date.now(); lastSessionData = null; }

  async function endSession() {
    const duration = sessionStartTime ? Date.now() - sessionStartTime : 0;
    lastSessionData = {
      duration_ms:       duration,
      duration_readable: `${Math.floor(duration / 60000)}m ${Math.floor((duration % 60000) / 1000)}s`,
      ces_final:         window.AnomalyDetector ? AnomalyDetector.getCES() : 0,
      total_flags:       window.InterventionDispatcher ? InterventionDispatcher.getLog().length : 0,
      flag_log:          window.InterventionDispatcher ? InterventionDispatcher.getLog() : [],
      scores:            window.InterviewScorecard ? InterviewScorecard.getScores() : null,
      transcript:        (window.AudioEngine ? AudioEngine.getTranscript() : '').slice(-2000),
      // Structured per-utterance transcript ({timestamp, speaker, text, wpm})
      // for the LLM report payload — richer than the flat string above.
      transcript_segments: (window.AudioEngine && AudioEngine.getTranscriptSegments) ? AudioEngine.getTranscriptSegments() : [],
      exported_at:       new Date().toISOString(),
    };
    Bus.emit('session:end', { summary: lastSessionData });
    if (lastSessionData.scores && window.ClaudeClient) {
      ClaudeClient.generateDebrief(lastSessionData).then(debrief => {
        if (debrief) { lastSessionData.debrief = debrief; Bus.emit('session:debrief', { text: debrief }); }
      });
    }
    return lastSessionData;
  }

  return { start, endSession, getSessionData() { return lastSessionData; } };
})();

window.SessionManager = SessionManager;

// =========================================================
// 7. BRAIN MANAGER
// =========================================================
window.BrainManager = {
  // Accepts either a legacy profile id string or an array of weakness ids
  // (e.g. ['stuttering', 'eye_contact']) built via ProfileConfig.build().
  init(profileIdOrWeaknesses) {
    const isWeaknessArray = Array.isArray(profileIdOrWeaknesses);
    const profile = isWeaknessArray
      ? ProfileConfig.build(profileIdOrWeaknesses)
      : ProfileConfig.getById(profileIdOrWeaknesses);
    if (!profile) { console.error('[BrainManager] Unknown profile:', profileIdOrWeaknesses); return; }

    const id = isWeaknessArray ? profile.id : profileIdOrWeaknesses;
    Bus.emit('profile:selected', { id, config: profile });
    AnomalyDetector.init(profile);
    InterventionDispatcher.init(profile);
    InterviewScorecard.init(); // always run scorecard — metrics useful for all profiles
    SessionManager.start();
  },
  start()      { AnomalyDetector.start(); },
  stop()       { AnomalyDetector.stop(); },
  endSession() { return SessionManager.endSession(); },
};
  </script>

  <script>
  // === QUESTION MANAGER === //
  window.QuestionManager = (() => {
    let QUESTIONS = [
      // Basic Information
      { cat: 'Basic Information',      q: 'What is your name?' },
      { cat: 'Basic Information',      q: 'What college do you go to?' },
      { cat: 'Basic Information',      q: 'What is your major?' },
      { cat: 'Basic Information',      q: 'Why did you choose your major?' },
      // Interest & Goals
      { cat: 'Interest & Goals',       q: 'What companies are you interested in?' },
      { cat: 'Interest & Goals',       q: 'What role or job position are you looking for?' },
      { cat: 'Interest & Goals',       q: 'Where are you located?' },
      // About You
      { cat: 'About You',              q: 'Tell me about yourself.' },
      { cat: 'About You',              q: 'How did you hear about this job?' },
      { cat: 'About You',              q: 'What are you looking for in a job or internship?' },
      // Experience
      { cat: 'Experience',             q: 'Have you worked on a team before? Tell us about it.' },
      { cat: 'Experience',             q: 'How do you handle disagreements with team members?' },
      { cat: 'Experience',             q: 'Describe a time you helped someone on your team.' },
      { cat: 'Experience',             q: 'Have you ever led a group or project?' },
      { cat: 'Experience',             q: 'Describe a time you took initiative without being asked.' },
      { cat: 'Experience',             q: 'How do you encourage others to participate?' },
      // Challenges
      { cat: 'Challenges',             q: 'Tell me about a mistake you made and what you learned.' },
      { cat: 'Challenges',             q: 'Describe a time you failed. What would you do differently?' },
      { cat: 'Challenges',             q: 'Tell me about a time you had multiple things due at once. How did you manage?' },
      { cat: 'Challenges',             q: 'How do you handle stressful situations?' },
      // Strengths & Development
      { cat: 'Strengths & Development',q: 'What is one of your strengths? Give an example.' },
      { cat: 'Strengths & Development',q: 'What is one area where you want to improve?' },
      { cat: 'Strengths & Development',q: 'Where do you see yourself in five years?' },
      // Closing
      { cat: 'Closing',                q: 'Why should we hire you?' },
      { cat: 'Closing',                q: 'What are your salary expectations?' },
      { cat: 'Closing',                q: 'Do you have any questions for us?' },
    ];

    let current = 0;

    function render() {
      const q = QUESTIONS[current];
      const textEl     = document.getElementById('question-text');
      const catEl      = document.getElementById('question-category');
      const progEl     = document.getElementById('question-progress');
      const prevBtn    = document.getElementById('btn-prev-q');
      const nextBtn    = document.getElementById('btn-next-q');
      if (!textEl) return;

      textEl.textContent  = q.q;
      catEl.textContent   = q.cat;
      progEl.textContent  = `${current + 1} / ${QUESTIONS.length}`;
      prevBtn.disabled    = current === 0;
      nextBtn.disabled    = current === QUESTIONS.length - 1;
      nextBtn.textContent = current === QUESTIONS.length - 1 ? 'Done' : 'Next →';
    }

    // Every navigation path (buttons, arrow keys, programmatic) announces the
    // new index so per-question scoring can never desync from the UI.
    function _announce() {
      if (typeof Bus !== 'undefined') Bus.emit('question:changed', { index: current });
    }
    function next() { if (current < QUESTIONS.length - 1) { current++; render(); _announce(); } }
    function prev() { if (current > 0) { current--; render(); _announce(); } }
    function reset() { current = 0; render(); _announce(); }

    function init() {
      const prevBtn = document.getElementById('btn-prev-q');
      const nextBtn = document.getElementById('btn-next-q');
      if (!prevBtn || !nextBtn) return;

      prevBtn.addEventListener('click', prev);
      nextBtn.addEventListener('click', next);

      // Arrow key navigation when dashboard is active
      document.addEventListener('keydown', (e) => {
        const card = document.getElementById('question-card');
        if (!card || !document.getElementById('screen-dashboard')?.classList.contains('active')) return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft')  prev();
      });

      render();
    }

    // Reset to Q1 at the start of every session
    if (typeof Bus !== 'undefined') {
      Bus.on('calibration:complete', ({ type }) => {
        if (type === 'gaze') reset();
      });
    }

    function setQuestions(arr) {
      if (!Array.isArray(arr) || arr.length === 0) return;
      QUESTIONS = arr.map(item => ({ cat: item.cat || 'Custom', q: item.q }));
      current = 0;
      render();
      _announce();
    }

    return { init, next, prev, reset, setQuestions, get total() { return QUESTIONS.length; }, get(i) { return QUESTIONS[i]; } };
  })();
  </script>

  <script src="ui.js"></script>

  <script>
    // === APP INIT === //
    (async () => {
      // Boot UI (runs loading sequence, then shows profile screen)
      if (window.AdaptIQ_UI) window.AdaptIQ_UI.init();
      if (window.QuestionManager) window.QuestionManager.init();

      // Wire Demo Mode toggle — reads checkbox state each time a profile is selected so it can be toggled on profile screen
      window.DEMO_MODE = false;
      document.getElementById('demo-mode-toggle')?.addEventListener('change', (e) => {
        window.DEMO_MODE = e.target.checked;
        console.log('[AppInit] Demo mode:', window.DEMO_MODE ? 'ON' : 'OFF');
      });

      // Set demo API key immediately so ClaudeClient is ready before any profile is chosen
      if (window.ClaudeClient) {
        const demoKey = document.getElementById('api-key-input')?.value?.trim();
        if (demoKey) ClaudeClient.setApiKey(demoKey);
      }

      const videoEl = document.getElementById('video-feed');
      let sensorsInitialized = false;
      let mediaStream = null; // shared stream for both video and audio

      // profile:selected fires twice: once from UI (no config) then from BrainManager (with config).
      // We only act on the first emission (from UI) to avoid double-init.
      Bus.on('profile:selected', async ({ id, config }) => {
        if (config) return; // BrainManager's re-emission — brain modules handle this one

        // Re-read key in case user changed it after boot
        const apiKey = document.getElementById('api-key-input')?.value?.trim();
        if (apiKey && window.ClaudeClient) ClaudeClient.setApiKey(apiKey);

        // Init brain (registers profile config on brain modules; start() deferred until sensors are live)
        if (window.BrainManager) BrainManager.init(id);

        // Reset audio transcript and sensor state for new session
        if (window.AudioEngine) AudioEngine.reset();

        // Init sensors once (loads face models + mic + gaze)
        if (window.SensorManager && !sensorsInitialized) {
          sensorsInitialized = true;
          try {
            // Request both video AND audio in one permission flow (UX better than separate requests)
            if (!mediaStream) {
              mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
              });
              if (videoEl) videoEl.srcObject = mediaStream;
            }

            await SensorManager.init(videoEl, mediaStream); // FaceEngine emits models:loaded when models finish
            SensorManager.start();

            // Start anomaly detection only after sensors are live
            if (window.BrainManager) BrainManager.start();

            // Silent background calibration — no UI blocking
            SensorManager.startCalibration().catch(() => {});
          } catch (err) {
            console.warn('[AppInit] Permission denied or sensor init failed:', err);
            const errMsg = err.name === 'NotAllowedError'
              ? 'Camera/microphone access denied. AdaptIQ needs these to function.'
              : 'Sensor initialization failed. Please refresh and try again.';
            if (window.AdaptIQ_UI) {
              window.AdaptIQ_UI.updateSystemStatus('error', errMsg);
            }
            Bus.emit('calibration:complete', { type: 'gaze' }); // advance UI so user is not stuck
          }
        }
      });

      // End session button
      document.getElementById('btn-end-session')?.addEventListener('click', () => {
        if (window.SensorManager) SensorManager.stop();
        if (window.BrainManager) {
          BrainManager.stop();      // stops AnomalyDetector — no more flags or popups
          BrainManager.endSession();
        }
        if (window.InterventionDispatcher) InterventionDispatcher.reset();
      });
    })();
  </script>
</body>
</html>
```

## File: integration/test.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>brain.js — Test Harness</title>
  <style>
    body { font-family: monospace; background: #111; color: #ddd; padding: 16px; }
    h2   { color: #00d4ff; margin-top: 24px; }
    button { background: #222; color: #eee; border: 1px solid #444; padding: 6px 14px;
             margin: 4px; cursor: pointer; border-radius: 4px; font-size: 13px; }
    button:hover { background: #333; }
    #log { background: #0a0a0f; border: 1px solid #333; padding: 10px; height: 260px;
           overflow-y: auto; font-size: 12px; white-space: pre-wrap; margin-top: 8px; }
    .flag   { color: #ef4444; }
    .interv { color: #f59e0b; }
    .update { color: #4ade80; }
    .score  { color: #60a5fa; }
    .info   { color: #a3a3a3; }
    label   { margin-right: 6px; }
    input[type=range] { width: 120px; vertical-align: middle; }
    .row { margin: 6px 0; }
  </style>
</head>
<body>
<h1 style="color:#00d4ff">AdaptIQ — brain.js Test Harness</h1>

<h2>1. Select Profile</h2>
<button onclick="selectProfile('special_needs')">Special Needs Tutor</button>
<button onclick="selectProfile('interview_coach')">Interview Coach</button>
<button onclick="selectProfile('language_teacher')">Language Teacher</button>

<h2>2. Fire Fake Sensor Events</h2>
<div class="row">
  <label>GDS <input type="range" id="gds" min="0" max="100" value="10"></label>
  <label>OSR <input type="range" id="osr" min="0" max="100" value="10"></label>
  <label>HPD <input type="range" id="hpd" min="0" max="100" value="10"></label>
</div>
<div class="row">
  <label>ET  <input type="range" id="et"  min="0" max="100" value="10"></label>
  <label>BRA <input type="range" id="bra" min="0" max="100" value="10"></label>
</div>
<div class="row">
  <label>VES <input type="range" id="ves" min="0" max="100" value="10"></label>
  <label>PVS <input type="range" id="pvs" min="0" max="100" value="10"></label>
  <label>SilR<input type="range" id="silr" min="0" max="100" value="10"></label>
  <label>SR  <input type="range" id="sr"  min="0" max="100" value="10"></label>
</div>
<button onclick="emitSignals()">Emit Signals Once</button>
<button onclick="startLoop()">Start Signal Loop (1Hz)</button>
<button onclick="stopLoop()">Stop Loop</button>

<h2>3. Scenario Shortcuts</h2>
<button onclick="scenario('gaze_lost')">Trigger GAZE_LOST (osr=90)</button>
<button onclick="scenario('stress')">Trigger STRESS_DETECTED (et+ves high)</button>
<button onclick="scenario('panic')">Trigger SPEECH_PANIC (sr+ves high)</button>
<button onclick="scenario('silence')">Trigger PROLONGED_SILENCE (silr=90)</button>
<button onclick="scenario('normal')">Reset to Normal Signals</button>

<h2>4. Session</h2>
<button onclick="endSess()">End Session</button>
<button onclick="clearLog()">Clear Log</button>

<h2>Event Log</h2>
<div id="log"></div>

<script>
// ===== STUBS =====

// Minimal SignalBuffer (mirrors the real one)
class SignalBuffer {
  constructor(size = 60) { this._size = size; this._buf = []; }
  push(v)  { this._buf.push(v); if (this._buf.length > this._size) this._buf.shift(); }
  values() { return [...this._buf]; }
  mean()   { if (!this._buf.length) return 0; return this._buf.reduce((a,b)=>a+b,0)/this._buf.length; }
  stddev() {
    if (this._buf.length < 2) return 0;
    const m = this.mean();
    return Math.sqrt(this._buf.reduce((a,b)=>a+(b-m)**2,0)/this._buf.length);
  }
  zScore(v) { const s = this.stddev(); return s === 0 ? 0 : (v - this.mean()) / s; }
}
window.SignalBuffer = SignalBuffer;

// Event Bus
const Bus = (() => {
  const subs = {};
  return {
    on(evt, fn)   { (subs[evt] ||= []).push(fn); },
    off(evt, fn)  { subs[evt] = (subs[evt]||[]).filter(f=>f!==fn); },
    emit(evt, data) { (subs[evt]||[]).forEach(fn => { try { fn(data); } catch(e) { console.error(e); } }); }
  };
})();
window.Bus = Bus;

// Stub AudioEngine.getTranscript
window.AudioEngine = { getTranscript: () => 'This is a test transcript with um uh filler words.' };
</script>

<!-- brain.js loaded here -->
<script src="brain.js"></script>

<script>
// ===== TEST HARNESS =====
let loopId = null;
let activeProfileId = null;

function log(cls, msg) {
  const el = document.getElementById('log');
  const ts  = new Date().toLocaleTimeString();
  el.innerHTML += `<span class="${cls}">[${ts}] ${msg}</span>\n`;
  el.scrollTop = el.scrollHeight;
}

// Wire up Bus listeners for observation
Bus.on('flag:fired',          d => log('flag',   `FLAG FIRED: ${d.type} (${d.severity}) — "${d.message}"`));
Bus.on('intervention:trigger',d => log('interv', `INTERVENTION: action=${d.action} msg="${d.message||''}" chunk="${d.chunk||''}"`));
Bus.on('signal:update',       d => log('update', `CES=${d.ces?.toFixed(1)} gds=${d.gds?.toFixed(1)} osr=${d.osr?.toFixed(1)} hpd=${d.hpd?.toFixed(1)} et=${d.et?.toFixed(1)}`));
Bus.on('scores:update',       d => log('score',  `SCORES: eyeContact=${d.eyeContact?.toFixed(1)} headStab=${d.headStability?.toFixed(1)} vocal=${d.vocalConfidence?.toFixed(1)} clarity=${d.speechClarity?.toFixed(1)} overall=${d.overall?.toFixed(1)} (${d.grade})`));
Bus.on('calibration:complete',d => log('info',   `CALIBRATION COMPLETE: type=${d.type}`));
Bus.on('session:end',         d => log('info',   `SESSION END — flags=${d.summary?.total_flags} ces=${d.summary?.ces_final?.toFixed(1)}`));
Bus.on('session:debrief',     d => log('info',   `DEBRIEF: ${d.text?.slice(0,120)}...`));

function selectProfile(id) {
  activeProfileId = id;
  BrainManager.init(id);
  BrainManager.start();
  log('info', `Profile selected: ${id}. Calibrating for 30s — signals collected but no flags during this window.`);
}

function getSliders() {
  return {
    gds:  +document.getElementById('gds').value,
    osr:  +document.getElementById('osr').value,
    hpd:  +document.getElementById('hpd').value,
    et:   +document.getElementById('et').value,
    bra:  +document.getElementById('bra').value,
    ves:  +document.getElementById('ves').value,
    pvs:  +document.getElementById('pvs').value,
    silr: +document.getElementById('silr').value,
    sr:   +document.getElementById('sr').value,
  };
}

function setSliders(vals) {
  Object.entries(vals).forEach(([k,v]) => {
    const el = document.getElementById(k);
    if (el) el.value = v;
  });
}

function emitSignals() {
  const s = getSliders();
  Bus.emit('signal:face',  { et: s.et, hpd: s.hpd, bra: s.bra, landmarks: null, expressions: null, bbox: null });
  Bus.emit('signal:gaze',  { gds: s.gds, osr: s.osr, x: 400, y: 300 });
  Bus.emit('signal:audio', { ves: s.ves, pvs: s.pvs, silr: s.silr, sr: s.sr, transcript: AudioEngine.getTranscript() });
}

function startLoop() {
  stopLoop();
  loopId = setInterval(emitSignals, 1000);
  log('info', 'Signal loop started (1Hz)');
}

function stopLoop() {
  if (loopId) { clearInterval(loopId); loopId = null; log('info', 'Signal loop stopped'); }
}

const SCENARIOS = {
  gaze_lost: { gds: 50, osr: 90, hpd: 20, et: 20, bra: 15, ves: 20, pvs: 20, silr: 10, sr: 30 },
  stress:    { gds: 30, osr: 20, hpd: 20, et: 85, bra: 30, ves: 80, pvs: 75, silr: 10, sr: 50 },
  panic:     { gds: 30, osr: 20, hpd: 20, et: 50, bra: 20, ves: 85, pvs: 40, silr: 5,  sr: 85 },
  silence:   { gds: 10, osr: 10, hpd: 10, et: 10, bra: 10, ves: 5,  pvs: 5,  silr: 90, sr: 5  },
  normal:    { gds: 10, osr: 15, hpd: 8,  et: 12, bra: 10, ves: 20, pvs: 15, silr: 10, sr: 30 },
};

function scenario(name) {
  const vals = SCENARIOS[name];
  if (!vals) return;
  setSliders(vals);
  // Fire repeatedly so sustained-duration counters build up
  for (let i = 0; i < 3; i++) setTimeout(emitSignals, i * 300);
  log('info', `Scenario "${name}" loaded. Keep the signal loop running to sustain it.`);
}

async function endSess() {
  stopLoop();
  BrainManager.stop();
  await BrainManager.endSession();
}

function clearLog() { document.getElementById('log').innerHTML = ''; }

log('info', 'Harness ready. Select a profile to begin.');
</script>
</body>
</html>
```

## File: perception/test.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AdaptIQ Sensors — Test</title>

  <script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/meyda/dist/web/meyda.min.js"></script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #e4e4e7; font-family: monospace; display: flex; flex-direction: column; align-items: center; padding: 24px; gap: 16px; }
    h1 { color: #00d4ff; font-size: 1.4rem; }
    #status { color: #a1a1aa; font-size: 0.9rem; }

    #video-wrap { position: relative; width: 400px; height: 300px; background: #141420; border: 1px solid #2a2a3a; border-radius: 8px; overflow: hidden; }
    #webcam  { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
    #overlay { position: absolute; inset: 0; width: 100%; height: 100%; }

    .panels { display: flex; gap: 16px; width: 100%; max-width: 900px; }
    .panel { flex: 1; background: #141420; border: 1px solid #2a2a3a; border-radius: 8px; padding: 12px; }
    .panel h2 { color: #00d4ff; font-size: 0.85rem; margin-bottom: 8px; }

    .signal { display: flex; justify-content: space-between; font-size: 0.8rem; margin: 4px 0; }
    .signal span.label { color: #a1a1aa; }
    .signal span.val   { color: #22c55e; font-weight: bold; }

    #transcript-box { background: #141420; border: 1px solid #2a2a3a; border-radius: 8px; padding: 12px; width: 100%; max-width: 900px; font-size: 0.8rem; color: #a1a1aa; min-height: 60px; white-space: pre-wrap; }

    .controls { display: flex; gap: 12px; }
    button { padding: 8px 20px; border: 1px solid #2a2a3a; border-radius: 6px; background: #1e1e30; color: #e4e4e7; cursor: pointer; font-family: monospace; font-size: 0.85rem; }
    button:hover { background: #2a2a3a; }
    button.primary { background: #00d4ff22; border-color: #00d4ff; color: #00d4ff; }
    button:disabled { opacity: 0.4; cursor: not-allowed; }

    #log { width: 100%; max-width: 900px; background: #141420; border: 1px solid #2a2a3a; border-radius: 8px; padding: 12px; font-size: 0.75rem; color: #a1a1aa; max-height: 160px; overflow-y: auto; }
    #log .entry { margin: 2px 0; }
    #log .entry.ok  { color: #22c55e; }
    #log .entry.warn{ color: #f59e0b; }
    #log .entry.err { color: #ef4444; }
  </style>
</head>
<body>

<h1>AdaptIQ — Sensors Test Harness</h1>
<div id="status">Idle</div>

<div id="video-wrap">
  <video id="webcam" autoplay playsinline muted></video>
  <canvas id="overlay"></canvas>
</div>

<div class="controls">
  <button id="btn-init" class="primary">1. Init Sensors</button>
  <button id="btn-calib" disabled>2. Gaze Calibration</button>
  <button id="btn-start" disabled>3. Start</button>
  <button id="btn-stop"  disabled>4. Stop</button>
</div>

<div class="panels">
  <div class="panel">
    <h2>Face Signals</h2>
    <div class="signal"><span class="label">ET  — Expression Tension</span><span class="val" id="s-et">—</span></div>
    <div class="signal"><span class="label">HPD — Head Pose Deviation</span><span class="val" id="s-hpd">—</span></div>
    <div class="signal"><span class="label">BRA — Blink Rate Anomaly</span><span class="val" id="s-bra">—</span></div>
  </div>
  <div class="panel">
    <h2>Gaze Signals</h2>
    <div class="signal"><span class="label">GDS — Gaze Drift Score</span><span class="val" id="s-gds">—</span></div>
    <div class="signal"><span class="label">OSR — Off-Screen Ratio</span><span class="val" id="s-osr">—</span></div>
    <div class="signal"><span class="label">X / Y — Raw Gaze</span><span class="val" id="s-xy">—</span></div>
  </div>
  <div class="panel">
    <h2>Audio Signals</h2>
    <div class="signal"><span class="label">VES — Vocal Energy Spike</span><span class="val" id="s-ves">—</span></div>
    <div class="signal"><span class="label">PVS — Pitch Variance</span><span class="val" id="s-pvs">—</span></div>
    <div class="signal"><span class="label">SilR — Silence Ratio</span><span class="val" id="s-silr">—</span></div>
    <div class="signal"><span class="label">SR  — Speech Rate</span><span class="val" id="s-sr">—</span></div>
  </div>
</div>

<div id="transcript-box">Transcript will appear here...</div>
<div id="log"></div>

<!-- Event Bus -->
<script>
const Bus = (() => {
  const subs = {};
  return {
    on(evt, fn)   { (subs[evt] ||= []).push(fn); },
    off(evt, fn)  { subs[evt] = (subs[evt] || []).filter(f => f !== fn); },
    emit(evt, data){ (subs[evt] || []).forEach(fn => fn(data)); }
  };
})();
</script>

<!-- Sensors Module -->
<script src="sensors.js"></script>

<!-- Test Harness Logic -->
<script>
const videoEl  = document.getElementById('webcam');
const canvas   = document.getElementById('overlay');
const ctx      = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const logEl    = document.getElementById('log');

function log(msg, type = 'ok') {
  const d = document.createElement('div');
  d.className = `entry ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logEl.prepend(d);
}

function setStatus(msg) { statusEl.textContent = msg; }

// Resize canvas to match video
function syncCanvas() {
  canvas.width  = videoEl.offsetWidth;
  canvas.height = videoEl.offsetHeight;
}
new ResizeObserver(syncCanvas).observe(videoEl);

// ── Bus listeners ──────────────────────────────────────────────────────────

Bus.on('models:loaded', () => {
  log('Face-api models loaded ✓');
  setStatus('Models loaded — ready to calibrate');
  document.getElementById('btn-calib').disabled = false;
  document.getElementById('btn-start').disabled = false;
});

Bus.on('signal:face', ({ et, hpd, bra, bbox, landmarks }) => {
  document.getElementById('s-et').textContent  = et;
  document.getElementById('s-hpd').textContent = hpd;
  document.getElementById('s-bra').textContent = bra;

  // Draw face bounding box
  syncCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bbox) {
    // face-api box coords are in video-native pixels; scale to displayed size
    const scaleX = canvas.width  / videoEl.videoWidth;
    const scaleY = canvas.height / videoEl.videoHeight;
    // mirrored: flip x
    const mirroredX = canvas.width - (bbox.x + bbox.width) * scaleX;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth   = 2;
    ctx.strokeRect(mirroredX, bbox.y * scaleY, bbox.width * scaleX, bbox.height * scaleY);
  }
});

Bus.on('signal:gaze', ({ gds, osr, x, y }) => {
  document.getElementById('s-gds').textContent = gds;
  document.getElementById('s-osr').textContent = osr;
  document.getElementById('s-xy').textContent  = `${Math.round(x)}, ${Math.round(y)}`;
});

Bus.on('signal:audio', ({ ves, pvs, silr, sr, transcript }) => {
  document.getElementById('s-ves').textContent  = ves;
  document.getElementById('s-pvs').textContent  = pvs;
  document.getElementById('s-silr').textContent = silr;
  document.getElementById('s-sr').textContent   = sr;
  if (transcript) document.getElementById('transcript-box').textContent = transcript;
});

Bus.on('calibration:complete', ({ type }) => {
  log(`Calibration complete: ${type}`);
  setStatus(type === 'gaze' ? 'Gaze calibrated — start sensors' : 'Baseline calibrated');
});

Bus.on('flag:fired', ({ type, severity, message }) => {
  log(`FLAG [${severity}] ${type}: ${message}`, severity === 'high' ? 'err' : 'warn');
});

// ── Button handlers ────────────────────────────────────────────────────────

document.getElementById('btn-init').onclick = async () => {
  try {
    setStatus('Requesting camera + mic permissions...');
    // Start webcam so FaceEngine has a video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoEl.srcObject = stream;
    await videoEl.play();

    setStatus('Loading face-api models (may take ~10s)...');
    log('Initialising SensorManager...');
    await SensorManager.init(videoEl);
    document.getElementById('btn-init').disabled = true;
    log('SensorManager.init() complete');
  } catch (err) {
    log('Init failed: ' + err.message, 'err');
    setStatus('Error — check console');
    console.error(err);
  }
};

document.getElementById('btn-calib').onclick = async () => {
  log('Starting gaze calibration...');
  setStatus('Gaze calibration — click the dots');
  await SensorManager.startCalibration();
};

document.getElementById('btn-start').onclick = () => {
  SensorManager.start();
  document.getElementById('btn-start').disabled = true;
  document.getElementById('btn-stop').disabled  = false;
  setStatus('Running — sensors active');
  log('Sensors started');
};

document.getElementById('btn-stop').onclick = () => {
  SensorManager.stop();
  document.getElementById('btn-stop').disabled  = true;
  document.getElementById('btn-start').disabled = false;
  setStatus('Stopped');
  log('Sensors stopped', 'warn');
};
</script>

</body>
</html>
```
