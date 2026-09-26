CREATE TABLE IF NOT EXISTS users (
 id text PRIMARY KEY, email text NOT NULL, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS logins (
 token_hash text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS jobs (
 id uuid PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), company text NOT NULL,
 role text NOT NULL, description text NOT NULL, resume_text text NOT NULL DEFAULT '',
 resume_key text, resume_name text, stage text NOT NULL DEFAULT 'saved'
 CHECK (stage IN ('saved','applied','interviewing','offer','rejected','withdrawn')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS jobs_owner ON jobs(user_id);
CREATE TABLE IF NOT EXISTS interviews (
 id uuid PRIMARY KEY, user_id text NOT NULL REFERENCES users(id), job_id uuid NOT NULL REFERENCES jobs(id),
 questions jsonb NOT NULL, status text NOT NULL DEFAULT 'practice'
 CHECK (status IN ('practice','saving','saved')), created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz DEFAULT now() + interval '24 hours'
);
CREATE INDEX IF NOT EXISTS interviews_owner ON interviews(user_id);
CREATE TABLE IF NOT EXISTS answers (
 interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE, question_index integer NOT NULL,
 file_name text NOT NULL, mime_type text NOT NULL, duration_seconds double precision NOT NULL,
 metrics jsonb NOT NULL DEFAULT '{}',
 PRIMARY KEY(interview_id, question_index)
);
