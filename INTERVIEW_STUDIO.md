# Connected interview studio

The existing landing page sends signed-in users to `/app.html`. This route now serves the dark interview studio rather than the legacy interview screen. Its scripts and styles are under `/studio/`.

Flow: Google sign-in → company, role, job description, pasted resume → five editable practice questions → recorded answer → guided silent video → guided audio-only playback → full playback and illustrative category scores → next question. Each guided highlight pauses playback until Continue is selected. Every review can be skipped.

Current limitations are disclosed in the UI: questions are built from templates using the supplied role, company, and recognized skills, not a live model; coaching highlights and scores are examples; recordings remain memory-only and are released on question advancement or completion. The AWS model, timestamped sensor analysis, and saved interview API are separate pending integrations. No API key is exposed or requested in the browser. Pasted job and resume text are not uploaded.

The production studio loads Firebase's public Hosting configuration and existing authentication session. Localhost is available as a sign-in-free design preview. The UI sign-in gate is not an API authorization mechanism; any future server endpoints must validate identity independently.

Validation: `node --test tests/auth-production.test.cjs studio/review-flow.test.mjs studio/questions.test.mjs`. The original app remains recoverable from Git history. Deployment preserves other live file hashes and Hosting configuration while replacing `/app.html` and adding six studio assets. The AWS and eye/vocal sensor source is preserved in the development branches.
