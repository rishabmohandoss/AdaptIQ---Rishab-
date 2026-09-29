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

Run `npm run start:review`, open `http://localhost:3001`, sign in with Google, and select “Include Jev coaching.” The existing Firebase project's authorized domains must include localhost (already configured). Look toward the camera during calibration, record a short answer, then check both guided review modes. Browser microphone/camera permission and speech recognition support are required for their respective signals. Unsupported or unavailable sources are omitted.

## Production with the current Firebase site

The live frontend is on Firebase Hosting; the Node review service is not hosted by static Firebase files. The standalone service allows deploying this feature to the existing EC2 instance without first configuring RDS or migrating the whole platform.

1. Put this branch on the instance and install locked dependencies with `npm ci --omit=dev`.
2. Add the key and `APP_ORIGIN=https://adaptiq.study`, `FIREBASE_PROJECT_ID=adaptiq-fa584`, and `REVIEW_PORT=3001` to the service user's private `/etc/adaptiq.env` (mode 600). Keep any existing variables.
3. Install `adaptiq-review.service`, adjusting the checkout and Node paths. Expose `/api/review` through an existing HTTPS reverse proxy to `127.0.0.1:3001`. The service listens only on loopback.
4. Once its HTTPS address is known, set `REVIEW_API_ORIGIN=https://YOUR_REVIEW_API_HOST` when building. This overrides only the generated public configuration, preserving same-origin local development. This origin is public configuration, never a credential. The service permits browser CORS only from the configured `APP_ORIGIN` and verifies Firebase ID tokens independently.
5. Run `REVIEW_API_ORIGIN=https://api.adaptiq.study npm run build:review` to prepare only the public files in ignored `data/review-public/` for the production API hostname. It maps the studio HTML to `/app.html`, rewrites asset paths, and includes the sensor assets. Publish those files using the same narrow Hosting update workflow as the previous studio release, preserving the existing landing page, auth configuration and other file hashes. Do not deploy the repository root or server/private files. Verify the API's HTTPS health endpoint before publishing.
6. Verify a signed-in request, an expired/invalid token, video-only silence, audio-only hidden video, highlight pause/Continue, skip, a failed provider call, and a second question. An unset key returns 503 and the player remains usable with no generated scores.

The full Express application also mounts `/api/review`. The route uses Firebase ID tokens, independent of the older Google-ID-token/session-cookie account flow. No sign-in migration is needed for review analysis.

## Data and review behavior

An explicit opt-in enables browser-side face/gaze/audio estimates and speech recognition. The recorder clock anchors ten-second evidence windows. Speech final-result receipt times are approximate and are not word-level alignment. No face detection, gaze calibration, or speech evidence means no corresponding measured value; missing values are never replaced with zero. Only the question, measured fields, and bounded transcript are sent to TypeSafe. Resume/JD and raw audio/video are not sent.

Jev receives independent Choice questions for observed segments and Score questions only for categories with evidence. The server validates all response labels, distributions, confidence values, score ranges, and legends. Code supplies feedback text for the selected label; Jev does not generate coaching prose. The initial confidence/probability threshold is 0.75 and must be evaluated on representative recordings before treating coaching scores as calibrated. Category scores scale the four-level rubric to 0–10; overall is the average of available accepted categories. No supported evidence yields no score.

Results and recordings remain in browser memory. The stateless review service does not write transcript, signals, or results to RDS, S3, disk, or logs. Provider retention is governed by TypeSafe's policy; cancelling playback does not recall an already submitted provider request. The current studio releases recordings and analysis on advancement/finish; saved-session persistence is a separate pending integration.

Example review is explicitly separate from recorded answers. Provider failures, missing keys, and low-confidence results never substitute example scores. The user can retry, continue without analysis, or skip any review stage. A single in-flight analysis per user plus per-user/IP rate limits bounds duplicate calls. API retries on 429/529/503 use capped backoff and per-request timeouts.

## Validation

`npm run test:review` covers the official request/response contract, malformed responses, uncertainty, missing data, retry policy, authentication/origin checks, consent, concurrent requests, timestamp aggregation, and the player flow with mocked media/DOM/provider. `npm test` covers existing metrics and backend behavior. The real provider check and real camera/browser check require the test key and user sign-in.

References: [API](https://docs.typesafe.ai/api), [models](https://docs.typesafe.ai/models), [confidence](https://docs.typesafe.ai/confidence), [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens).
