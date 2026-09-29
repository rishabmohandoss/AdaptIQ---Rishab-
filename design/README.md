# Interview review design

Run `node design/serve.mjs` from the repository root and open http://127.0.0.1:4173.

This isolated prototype explores question → silent visual review → audio-only review → full playback and category scores. Review stages can be skipped. Both guided reviews pause automatically at each coaching moment, reveal one observation, and require Continue before playback resumes. Scrubbing is disabled during guided review so feedback cannot be bypassed accidentally; full playback supports scrubbing. Three example questions demonstrate progression. The dark palette and Space Grotesk typography match adaptiq.study.

Camera recording requires browser permission. Recordings remain in memory and are released when advancing to the next question, restarting, or closing the tab. No recording is uploaded or saved. Example mode uses a simulated clock, without a video or audio asset.

All coaching observations, timings, and scores are illustrative, including when playing a user's recording. The waveform is decorative, not computed from audio. Production integration needs timestamped analysis, calibrated scoring, and the existing explicit save/delete workflow. This prototype does not modify authentication, AWS storage, sensor logic, or the production career interface.
