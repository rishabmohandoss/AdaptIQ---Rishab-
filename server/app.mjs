import express from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { mkdir, rm, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mintLiveToken } from './live.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha = token => createHash('sha256').update(token).digest('hex');
const fail = (status, message) => Object.assign(new Error(message), { status });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const stages = ['saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
function text(value, max, label, required = true) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw fail(400, `Invalid ${label}.`);
  return value.trim();
}
export function createApp({ db, storage, generate, env = process.env, verifyGoogle }) {
  const app = express();
  const recordings = path.resolve(env.RECORDINGS_DIR || './data/recordings');
  const google = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  const verify = verifyGoogle || (async credential => (await google.verifyIdToken({ idToken: credential, audience: env.GOOGLE_CLIENT_ID })).getPayload());
  const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 86400000 };
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.use((req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY' });
    if (req.path.startsWith('/api/')) {
      res.set('Cache-Control', 'no-store');
      if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('origin') !== env.APP_ORIGIN) return res.status(403).json({ error: 'Invalid request origin.' });
    }
    next();
  });
  app.use('/api', express.json({ limit: '150kb' }));
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.get('/api/config', (_req, res) => res.json({ googleClientId: env.GOOGLE_CLIENT_ID || '', questionGeneration: Boolean(env.GEMINI_API_KEY) }));
  app.post('/api/auth/google', rateLimit({ windowMs: 60000, limit: 15 }), async (req, res) => {
    if (!env.GOOGLE_CLIENT_ID) throw fail(503, 'Google sign-in is not configured.');
    let user;
    try { user = await verify(text(req.body.credential, 10000, 'credential')); } catch { throw fail(401, 'Google sign-in failed.'); }
    if (!user?.sub || !user.email_verified) throw fail(401, 'A verified Google account is required.');
    await db.query('INSERT INTO users(id,email,name) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET email=$2,name=$3', [user.sub, user.email, user.name || user.email]);
    const token = randomBytes(32).toString('hex');
    await db.query("INSERT INTO logins(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '7 days')", [sha(token), user.sub]);
    res.cookie('adaptiq_session', token, cookieOptions).json({ ok: true });
  });
  app.use('/api', async (req, _res, next) => {
    const token = req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('adaptiq_session='))?.slice(16);
    if (!token || !/^[0-9a-f]{64}$/.test(token)) throw fail(401, 'Please sign in.');
    const result = await db.query('SELECT u.* FROM users u JOIN logins l ON l.user_id=u.id WHERE l.token_hash=$1 AND l.expires_at>now()', [sha(token)]);
    if (!result.rows[0]) throw fail(401, 'Please sign in again.');
    req.user = result.rows[0]; req.tokenHash = sha(token); next();
  });
  app.get('/api/me', (req, res) => res.json(req.user));
  app.post('/api/auth/logout', async (req, res) => {
    await db.query('DELETE FROM logins WHERE token_hash=$1', [req.tokenHash]);
    res.clearCookie('adaptiq_session', { ...cookieOptions, maxAge: undefined }).json({ ok: true });
  });
  async function jobFor(req) {
    if (!uuid.test(req.params.id)) throw fail(404, 'Job not found.');
    const result = await db.query('SELECT * FROM jobs WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    if (!result.rows[0]) throw fail(404, 'Job not found.');
    return result.rows[0];
  }
  async function interviewFor(req) {
    if (!uuid.test(req.params.id)) throw fail(404, 'Interview not found.');
    const result = await db.query('SELECT * FROM interviews WHERE id=$1 AND user_id=$2 AND (expires_at IS NULL OR expires_at>now())', [req.params.id, req.user.id]);
    if (!result.rows[0]) throw fail(404, 'Interview not found or expired.');
    return result.rows[0];
  }
  app.get('/api/jobs', async (req, res) => res.json((await db.query('SELECT * FROM jobs WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id])).rows));
  app.post('/api/jobs', async (req, res) => {
    const b = req.body;
    const result = await db.query('INSERT INTO jobs(id,user_id,company,role,description,resume_text) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [randomUUID(), req.user.id, text(b.company, 200, 'company'), text(b.role, 200, 'role'), text(b.description, 30000, 'job description'), text(b.resumeText || '', 30000, 'resume', false)]);
    res.status(201).json(result.rows[0]);
  });
  app.patch('/api/jobs/:id', async (req, res) => {
    await jobFor(req);
    if (!stages.includes(req.body.stage)) throw fail(400, 'Invalid stage.');
    res.json((await db.query('UPDATE jobs SET stage=$1 WHERE id=$2 AND user_id=$3 RETURNING *', [req.body.stage, req.params.id, req.user.id])).rows[0]);
  });
  const resumeUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 } }).single('resume');
  app.post('/api/jobs/:id/resume', async (req, _res, next) => { req.job = await jobFor(req); next(); }, resumeUpload, async (req, res) => {
    const file = req.file;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!file || !allowed.includes(file.mimetype)) throw fail(400, 'Upload a PDF, DOCX, or TXT resume under 5 MB.');
    const key = `resumes/${req.user.id}/${randomUUID()}`;
    await storage.put(key, file.buffer, file.mimetype);
    try { await db.query('UPDATE jobs SET resume_key=$1,resume_name=$2 WHERE id=$3 AND user_id=$4', [key, file.originalname.slice(0, 255), req.params.id, req.user.id]); }
    catch (e) { await storage.delete(key); throw e; }
    if (req.job.resume_key) await storage.delete(req.job.resume_key);
    res.json({ name: file.originalname });
  });
  app.get('/api/jobs/:id/resume', async (req, res) => {
    const job = await jobFor(req);
    if (!job.resume_key) throw fail(404, 'No resume attached.');
    const object = await storage.get(job.resume_key);
    res.attachment(job.resume_name).type('application/octet-stream');
    object.Body.on('error', () => res.destroy()).pipe(res);
  });
  app.post('/api/jobs/:id/interviews', rateLimit({ windowMs: 60000, limit: 6, keyGenerator: req => req.user.id }), async (req, res) => {
    const job = await jobFor(req);
    if (!job.resume_text) throw fail(400, 'Paste your resume text when adding the job to personalize questions.');
    const count = req.body.count ?? 5;
    if (!Number.isInteger(count) || count < 3 || count > 10) throw fail(400, 'Choose 3–10 questions.');
    const questions = await generate(job, count);
    res.status(201).json((await db.query('INSERT INTO interviews(id,user_id,job_id,questions) VALUES($1,$2,$3,$4) RETURNING *', [randomUUID(), req.user.id, job.id, JSON.stringify(questions)])).rows[0]);
  });
  app.post('/api/jobs/:id/live-token', rateLimit({ windowMs: 60000, limit: 2, keyGenerator: req => req.user.id }), async (req, res) => {
    res.json(await mintLiveToken(await jobFor(req), env));
  });
  app.get('/api/interviews', async (req, res) => res.json((await db.query("SELECT i.*,j.company,j.role FROM interviews i JOIN jobs j ON j.id=i.job_id WHERE i.user_id=$1 AND i.status='saved' ORDER BY i.created_at DESC", [req.user.id])).rows));
  app.get('/api/interviews/:id', async (req, res) => {
    const interview = await interviewFor(req);
    const answers = (await db.query('SELECT question_index,mime_type,duration_seconds,metrics FROM answers WHERE interview_id=$1 ORDER BY question_index', [interview.id])).rows;
    res.json({ ...interview, answers });
  });
  app.post('/api/interviews/:id/save', async (req, res) => {
    const interview = await interviewFor(req);
    if (interview.status === 'saved') return res.json({ ok: true });
    await db.query("UPDATE interviews SET status='saving',expires_at=now()+interval '24 hours' WHERE id=$1 AND status IN ('practice','saving')", [interview.id]);
    res.json({ ok: true });
  });
  const videoUpload = multer({ storage: multer.diskStorage({
    destination: async (_req, _file, cb) => { try { await mkdir(recordings, { recursive: true, mode: 0o700 }); cb(null, recordings); } catch (e) { cb(e); } },
    filename: (_req, _file, cb) => cb(null, randomUUID())
  }), limits: { fileSize: 100 * 1024 * 1024, files: 1, fields: 2, fieldSize: 10000 } }).single('recording');
  app.post('/api/interviews/:id/answers/:index', async (req, _res, next) => {
    const interview = await interviewFor(req);
    const index = Number(req.params.index);
    if (interview.status !== 'saving' || !Number.isInteger(index) || index < 0 || index >= interview.questions.length) throw fail(409, 'This answer cannot be saved.');
    next();
  }, videoUpload, async (req, res) => {
    try {
      if (!req.file || !['video/webm', 'video/mp4'].includes(req.file.mimetype)) throw fail(400, 'Invalid recording format.');
      const duration = Number(req.body.duration);
      if (!Number.isFinite(duration) || duration <= 0 || duration > 305) throw fail(400, 'Invalid recording duration.');
      let metrics;
      try { metrics = JSON.parse(req.body.metrics || '{}'); } catch { throw fail(400, 'Invalid metrics.'); }
      if (!metrics || Array.isArray(metrics) || typeof metrics !== 'object' || Object.entries(metrics).some(([k,v]) => !['gds','osr','hpd','pvs','ves','wpm'].includes(k) || typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1000)) throw fail(400, 'Invalid metrics.');
      // The status condition also protects against a discard while an upload is in flight.
      const result = await db.query("INSERT INTO answers(interview_id,question_index,file_name,mime_type,duration_seconds,metrics) SELECT id,$2,$3,$4,$5,$7 FROM interviews WHERE id=$1 AND user_id=$6 AND status='saving' AND expires_at>now() ON CONFLICT(interview_id,question_index) DO NOTHING RETURNING *",
        [req.params.id, Number(req.params.index), req.file.filename, req.file.mimetype, duration, req.user.id, JSON.stringify(metrics)]);
      if (!result.rows.length) await rm(req.file.path, { force: true });
      res.json({ ok: true });
    } catch (e) { if (req.file) await rm(req.file.path, { force: true }); throw e; }
  });
  app.post('/api/interviews/:id/complete', async (req, res) => {
    const interview = await interviewFor(req);
    if (interview.status === 'saved') return res.json({ ok: true });
    const result = await db.query("UPDATE interviews SET status='saved',expires_at=NULL WHERE id=$1 AND status='saving' AND (SELECT count(*) FROM answers WHERE interview_id=$1)=jsonb_array_length(questions) RETURNING id", [interview.id]);
    if (!result.rows.length) throw fail(409, 'Upload every answer before saving the session.');
    res.json({ ok: true });
  });
  app.get('/api/interviews/:id/answers/:index', async (req, res) => {
    const interview = await interviewFor(req);
    if (interview.status !== 'saved') throw fail(404, 'Saved answer not found.');
    const index = Number(req.params.index);
    if (!Number.isInteger(index) || index < 0) throw fail(404, 'Answer not found.');
    const answer = (await db.query('SELECT * FROM answers WHERE interview_id=$1 AND question_index=$2', [interview.id, index])).rows[0];
    if (!answer) throw fail(404, 'Answer not found.');
    res.type(answer.mime_type).sendFile(answer.file_name, { root: recordings, acceptRanges: true });
  });
  app.delete('/api/interviews/:id', async (req, res) => {
    const interview = await interviewFor(req);
    const files = (await db.query('SELECT file_name FROM answers WHERE interview_id=$1', [interview.id])).rows;
    await db.query('DELETE FROM interviews WHERE id=$1 AND user_id=$2', [interview.id, req.user.id]);
    await Promise.all(files.map(f => rm(path.join(recordings, f.file_name), { force: true })));
    res.json({ ok: true });
  });
  // Explicit static allowlist: never expose server files, .env, Git history or recordings.
  for (const name of ['index.html', 'career.html', 'career.css', 'career.js', 'auth.js', 'metrics-math.js', 'career-sensors.js', 'live.js', 'pcm-worklet.js']) {
    app.get('/' + name, (_req, res) => res.sendFile(path.join(root, name)));
  }
  app.get('/', (_req, res) => res.sendFile(path.join(root, 'index.html')));
  app.get('/app.html', (_req, res) => res.redirect('/career.html'));
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((err, _req, res, _next) => {
    if (res.headersSent) return res.end();
    const status = err instanceof multer.MulterError ? 413 : err.status || 500;
    if (status === 500) console.error('Request failed:', err.code || err.name);
    res.status(status).json({ error: status === 500 ? 'Something went wrong. Please try again.' : err instanceof multer.MulterError ? 'File is too large or upload fields are invalid.' : err.message });
  });
  async function cleanup() {
    await db.query('DELETE FROM interviews WHERE expires_at < now()');
    await db.query('DELETE FROM logins WHERE expires_at < now()');
    // Remove abandoned partial uploads, including files left by a crashed process.
    const referenced = new Set((await db.query('SELECT file_name FROM answers')).rows.map(x => x.file_name));
    for (const name of await readdir(recordings).catch(() => [])) {
      if (!uuid.test(name) || referenced.has(name)) continue;
      const file = path.join(recordings, name);
      const info = await stat(file).catch(() => null);
      if (info && Date.now() - info.mtimeMs > 3600000) await rm(file, { force: true });
    }
  }
  return { app, cleanup };
}
