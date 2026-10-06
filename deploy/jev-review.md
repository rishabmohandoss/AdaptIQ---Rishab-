# Jev review integration

The implementation calls the official TypeSafe API, `https://api.typesafe.ai/v1/systemone`, with the pinned `jev-1.13.0` model. Set `TYPESAFE_API_KEY` (official name) or `JEV_API_KEY` (compatibility alias). Never place a key in browser assets. The API key is not returned by any endpoint or logged by the integration.

## Local provider check

Add the test key to the ignored `.env` in the repository root:

```env
TYPESAFE_API_KEY=replace_privately
JEV_MODEL=jev-1.13.0
APP_ORIGIN=http://localhost:3001
FIREBASE_PROJECT_ID=adaptiq-fa584
REVIEW_PORT=3001
```

Run `npm run check:jev`. This sends only synthetic transcript and sensor data. It checks the real response contract and prints the model, number of selected highlights, and category names, never the key. It incurs a small provider request.

Run `npm run start:review`, open `http://localhost:3001`, sign in with Google, and start an interview. Coaching is automatic; the setup screen explains what is shared. The existing Firebase project's authorized domains must include localhost (already configured). Look toward the camera during calibration, record a short answer, then check both guided review modes. Browser microphone/camera permission and speech recognition support are required for their respective signals. Unsupported or unavailable sources are omitted.

## Production with the current Firebase site

The live frontend is on Firebase Hosting; the Node review service is not hosted by static Firebase files. The standalone service allows deploying this feature to the existing EC2 instance without first configuring RDS or migrating the whole platform.

1. Put this branch on the instance and install locked dependencies with `npm ci --omit=dev`.
2. Add the key and `APP_ORIGIN=https://adaptiq.study`, `FIREBASE_PROJECT_ID=adaptiq-fa584`, and `REVIEW_PORT=3001` to the service user's private `/etc/adaptiq.env` (mode 600). Keep any existing variables.
3. Install `adaptiq-review.service`, adjusting the checkout and Node paths. Expose `/api/review` through an existing HTTPS reverse proxy to `127.0.0.1:3001`. The service listens only on loopback.
4. Once its HTTPS address is known, set `REVIEW_API_ORIGIN=https://YOUR_REVIEW_API_HOST` when building. This overrides only the generated public configuration, preserving same-origin local development. This origin is public configuration, never a credential. The service permits browser CORS only from the configured `APP_ORIGIN` and verifies Firebase ID tokens independently.
5. Run `REVIEW_API_ORIGIN=https://api.adaptiq.study npm run build:review` to prepare the public frontend in ignored `data/review-public/` for the production API hostname. The homepage is `index.html` and `app.html`; the studio is `interview.html`, served at `/interview`, with `/studio/` assets. Publish only these generated public files, preserving the existing Firebase authentication configuration. Firebase's configured public directory is the generated output, not the repository root. Verify the API's HTTPS health endpoint before publishing its origin.
6. Verify a signed-in request, an expired/invalid token, video-only silence, audio-only hidden video, highlight pause/Continue, skip, a failed provider call, and a second question. An unset key returns 503 and the player remains usable with no generated scores.

The full Express application also mounts `/api/review`. The route uses Firebase ID tokens, independent of the older Google-ID-token/session-cookie account flow. No sign-in migration is needed for review analysis.

## Data and review behavior

Starting an interview enables browser-side face/gaze/audio estimates and speech recognition without an optional checkbox. The recorder clock anchors ten-second evidence windows. Speech final-result receipt times are approximate and are not word-level alignment. No face detection, gaze calibration, or speech evidence means no corresponding measured value; missing values are never replaced with zero. Only the question, measured fields, and bounded transcript are sent to TypeSafe. Resume/JD and raw audio/video are not sent.

Jev receives independent Choice questions for observed segments and Score questions only for categories with evidence. The server validates all response labels, distributions, confidence values, score ranges, and legends. Code supplies feedback text for the selected label; Jev does not generate coaching prose. The initial confidence/probability threshold is 0.75 and must be evaluated on representative recordings before treating coaching scores as calibrated. Category scores scale the four-level rubric to 0–10; overall is the average of available accepted categories. No supported evidence yields no score. The shared `design/feedback-catalog.mjs` owns all phrases. Duration rules add a 30–90-second target for recordings at or below 15 seconds and a concise-answer reminder above 120 seconds. Recordings over 15 seconds get at least one strength; if no measured strength is supported, this is explicitly practice-effort encouragement, not a fabricated observation. Rules also work locally during service failures.

Results and recordings remain in browser memory. The stateless review service does not write transcript, signals, or results to RDS, S3, disk, or logs. Provider retention is governed by TypeSafe's policy; cancelling playback does not recall an already submitted provider request. The current studio releases recordings and analysis on advancement/finish; saved-session persistence is a separate pending integration.

Example review is explicitly separate from recorded answers. Provider failures, missing keys, and low-confidence results never substitute example scores. The user can retry, continue without analysis, or skip any review stage. A single in-flight analysis per user plus per-user/IP rate limits bounds duplicate calls. API retries on 429/529/503 use capped backoff and per-request timeouts.

## Validation

`npm run test:review` covers the official request/response contract, malformed responses, uncertainty, missing data, retry policy, authentication/origin checks, the disclosed-start consent contract, concurrent requests, timestamp aggregation, and the player flow with mocked media/DOM/provider. `npm test` covers existing metrics and backend behavior. The real provider check and real camera/browser check require the test key and user sign-in.

References: [API](https://docs.typesafe.ai/api), [models](https://docs.typesafe.ai/models), [confidence](https://docs.typesafe.ai/confidence), [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens).

## Live verification — October 1, 2026

The existing provider key passed a synthetic request to `jev-1.13.0`. EC2 health and configuration report an active, enabled review service. The public site still has an empty API origin; `api.adaptiq.study` has no DNS record. End-to-end live Jev coaching therefore remains blocked on the API DNS/HTTPS connection. Browser pause mechanics are tested with deterministic provider fixtures; detection quality and approximate speech timing still need representative recorded-answer evaluation.
