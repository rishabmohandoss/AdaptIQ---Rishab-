# AdaptIQ career platform

Track job opportunities and practice interviews tailored to a resume and job
description. Google sign-in opens the career dashboard. Each recorded answer
can be reviewed as silent video or audio only before moving to the next question.
Recordings stay in browser memory until the user explicitly saves the session.

## AWS architecture

- EC2: Node.js API and frontend behind HTTPS Nginx.
- RDS PostgreSQL: users, sessions, jobs, generated questions, and answer metadata.
- S3: private resume attachments.
- Private persistent EC2/EBS directory: saved answer recordings.
- Gemini: backend question generation and optional Live voice practice with short-lived tokens.

See [deployment instructions](deploy/README.md) and [.env.example](.env.example)
for configuration. AWS resources and credentials are not included or provisioned
automatically. The schema currently targets PostgreSQL, not MySQL.

## Development

Use Node.js 22+ and PostgreSQL. Install with `npm ci`, copy `.env.example` to
`.env`, configure the database and service credentials, run `npm run migrate`,
then `npm start`. Open `http://localhost:3000`. Google sign-in requires a web
OAuth client with that exact authorized JavaScript origin. Camera access
requires localhost or HTTPS.

`npm test` runs the retained 27 sensor/scoring tests and API integration tests
using embedded PostgreSQL (PGlite), with Google, S3, and model responses mocked.
Those tests do not verify live AWS credentials, actual Gemini audio, camera
capture, or browser playback. Test those on the HTTPS deployment before release.

## Source map

| Path | Purpose |
| --- | --- |
| `index.html`, `auth.js` | Existing landing design and entry to Google sign-in |
| `career.html`, `career.css`, `career.js` | Dashboard, jobs, recorded interviews and saved reviews |
| `career-sensors.js`, `metrics-math.js` | Retained production eye/voice analysis and shared math |
| `live.js`, `pcm-worklet.js` | Optional Gemini Live microphone input and audio playback |
| `server/` | Authentication, RDS schema, question generation, S3 and recording APIs |
| `deploy/` | EC2 service, Nginx and deployment guide |
| `tests/` | Sensor and API verification |
| `app.html`, `ui.js`, `platform.js`, `tracker.js`, `resume-worker.js` | Previous application, retained during migration |
| `perception/`, `integration/` | Older standalone modules and test harnesses |

The EC2 server redirects `/app.html` to `/career.html`. The old frontend is
retained in Git but is not the new production route. `career-sensors.js` was
extracted from its newer inline sensor implementation; the older standalone
sensor file has different formulas. Firebase deployment files remain historical
configuration and are not used by the Node server. Prior localStorage/Firebase
data is not migrated automatically.

Originally built by Sneh Bhatt, Aagam Ambavi, Mayukha Ajeesh Ramsha Nath, and
Rishab Mohandoss at the Claude NJIT Hackathon 2026.
