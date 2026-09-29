# Interview review design

Run `node design/serve.mjs` from the repository root and open http://127.0.0.1:4173.

The entry screen collects company, role, job description, and pasted resume. It generates five editable template questions, then starts question → silent visual review → audio-only review → full playback and category scores. Review stages can be skipped. Both guided reviews pause automatically at each coaching moment, reveal one observation, and require Continue before playback resumes. Scrubbing is disabled during guided review so feedback cannot be bypassed accidentally; full playback supports scrubbing. The dark palette and Space Grotesk typography match adaptiq.study.

Camera recording requires browser permission. Recordings remain in memory and are released when advancing to the next question, restarting, or closing the tab. No recording is uploaded or saved. Example mode uses a simulated clock, without a video or audio asset.

All coaching observations, timings, and scores are illustrative, including when playing a user's recording. The waveform is decorative, not computed from audio. Production integration still needs a live authenticated question-generation backend, timestamped analysis, calibrated scoring, and the explicit save/delete workflow. Template mode is labeled in the setup and question preview; no AI API keys are requested or embedded in browser code.

On the Firebase-hosted production site, `session-auth.js` loads the existing project configuration and requires the existing Google sign-in for setup. Localhost skips sign-in for design review. This UI gate is not backend authorization; no remote user data is accessed by the studio. Deploy the HTML as `/app.html`, replacing relative asset paths with `/studio/` paths, and publish the supporting scripts and styles under `/studio/`. Retain the existing landing page and its sign-in flow. Existing sensor code and AWS implementation remain in their original branches.

Validation: `node --test design/review-flow.test.mjs design/questions.test.mjs`.
