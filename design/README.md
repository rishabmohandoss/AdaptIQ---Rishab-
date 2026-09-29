# Interview review design

Run `node design/serve.mjs` from the repository root and open http://127.0.0.1:4173.

This isolated prototype explores question → silent visual review → audio-only review → full playback and category scores. Review stages can be skipped. Each coaching card seeks to a short moment and pauses at its end. Three example questions demonstrate progression.

Camera recording requires browser permission. Recordings remain in memory and are released when advancing to the next question, restarting, or closing the tab. No recording is uploaded or saved. Example mode uses a simulated clock, without a video or audio asset.

All coaching observations, timings, and scores are illustrative, including when playing a user's recording. The waveform is decorative, not computed from audio. Production integration needs timestamped analysis, calibrated scoring, and the existing explicit save/delete workflow. This prototype does not modify authentication, AWS storage, sensor logic, or the production career interface.
