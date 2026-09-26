# EC2 deployment

The application is a same-origin Node.js server behind HTTPS Nginx. PostgreSQL
on RDS stores users, hashed login sessions, jobs, question sets and answer
metadata. A private S3 bucket stores resumes. Saved recordings live in a private
directory on the EC2 instance's persistent EBS volume; they are not database
blobs and are never statically served. This is a single-instance deployment.

## Required configuration

Use Node.js 22 or newer. Copy `.env.example` to a private environment file
(`/etc/adaptiq.env` for systemd), owned by the service user with mode 600.
Supply the RDS PostgreSQL URL, Google web OAuth client ID, AWS region, S3 resume
bucket, Gemini API key/model and HTTPS application origin. Do not put secrets
in frontend files or commit the environment file.

For RDS set `DATABASE_SSL=true` and `DATABASE_CA_FILE` to the AWS RDS root CA
bundle. Certificate and hostname verification are enabled. Allow database
traffic only from the EC2 security group. Use a dedicated database/user;
`npm run migrate` creates the schema idempotently without deleting existing data.
RDS MySQL is not supported by this implementation.

Configure the Google OAuth web client with the exact HTTPS application origin
as an authorized JavaScript origin. The Google Identity Services callback sends
the ID token to the same-origin backend for verification; the application then
uses a secure HttpOnly session cookie. This is a new Google-based account store;
old Firebase/localStorage application records are not imported automatically.

Attach an IAM instance profile granting `s3:PutObject`, `s3:GetObject`, and
`s3:DeleteObject` on `arn:aws:s3:::YOUR_BUCKET/resumes/*`. No browser AWS keys
or bucket CORS configuration are required: uploads pass through the authenticated
backend. Enable S3 Block Public Access and bucket encryption. If using a
customer-managed KMS key, adapt the storage adapter and IAM permissions first.

Create `/var/lib/adaptiq/recordings`, owned by the `adaptiq` service user, mode 700.
Set `RECORDINGS_DIR=/var/lib/adaptiq/recordings` and `NODE_ENV=production`.
Use encrypted persistent EBS and monitor disk space. Back up RDS and saved
recordings consistently. Deleting a recording removes the active file; existing
infrastructure backups follow their separately configured retention policy.

## Install and run

From the checkout, install locked dependencies with `npm ci`, run `npm test`,
then run the migration with the environment loaded. Install production-only
dependencies with `npm ci --omit=dev --ignore-scripts` on the instance.
Install `adaptiq.service` in systemd, adjusting the Node path if needed.
Add the provided Nginx location to the domain's HTTPS server configuration.
Start the service and check `/health`, Google sign-in, question generation,
resume upload/download, recording/save/replay/delete, and a second user's access.
The application intentionally serves an explicit static-file allowlist.

## Retention

Before Save is selected, recordings exist only in browser memory. Finishing
and discarding clears that memory and deletes the temporary interview record.
Save first marks the session as `saving`, uploads each answer, and marks it
`saved` only after every question has a recording. Upload retries are idempotent.
Incomplete sessions expire after 24 hours. Startup and a 15-minute cleanup job
delete expired interview metadata and orphaned files older than one hour.
No unsaved media is uploaded in the background. Closing the tab drops local
recordings; expired question metadata is cleaned up later.

## Current scope

Five tailored questions per session; five-minute maximum per answer; PDF/DOCX/TXT
resume attachments up to 5 MB; recordings up to 100 MB per answer. Resume text
must be pasted for question generation (attachments are stored for reference).
The older frontend and sensors remain in the repository for reference; EC2's
`/app.html` route redirects to the career workspace. Optional Gemini Live is
separate from recorded interviews. Set `GEMINI_LIVE_MODEL` to a Live audio model
available to your project. The backend issues single-use eight-minute tokens
constrained to the model and interview context. Browser audio goes directly to
Gemini; the long-lived API key stays on the server. Live conversations are not
saved by AdaptIQ. Test microphone streaming and playback with real credentials
before enabling this feature for users.

Documentation: [Google token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token),
[Gemini generation](https://ai.google.dev/api/generate-content),
[AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html).
