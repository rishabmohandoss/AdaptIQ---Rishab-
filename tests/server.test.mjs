import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import request from 'supertest';
import { readFile, mkdtemp, rm, readdir, writeFile, utimes } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Readable } from 'node:stream';
import { createApp } from '../server/app.mjs';
import { mintLiveToken } from '../server/live.mjs';
import { generateQuestions } from '../server/questions.mjs';
let db, dir, app, cleanup, owner, other, job, interview;
const origin = 'http://localhost:3000';
const objects = new Map();
const storage = { put: async (key, body) => objects.set(key, body), delete: async key => objects.delete(key), get: async key => ({ Body: Readable.from(objects.get(key)) }) };
const call = (agent, method, url) => agent[method](url).set('Origin', origin);
before(async () => {
  db = new PGlite(); dir = await mkdtemp(path.join(tmpdir(), 'adaptiq-test-'));
  await db.exec(await readFile(new URL('../server/schema.sql', import.meta.url), 'utf8'));
  ({ app, cleanup } = createApp({ db, storage, env: { GOOGLE_CLIENT_ID: 'test', APP_ORIGIN: origin, RECORDINGS_DIR: dir },
    verifyGoogle: async credential => { if (credential === 'invalid') throw Error(); return { sub: credential, name: credential, email: `${credential}@example.com`, email_verified: true }; },
    generate: async (_job, count) => Array.from({ length: count }, (_, i) => `Question ${i + 1}?`) }));
  owner = request.agent(app); other = request.agent(app);
  await call(owner, 'post', '/api/auth/google').send({ credential: 'alice' }).expect(200);
  await call(other, 'post', '/api/auth/google').send({ credential: 'bob' }).expect(200);
});
after(async () => { await db.close(); await rm(dir, { recursive: true, force: true }); });

test('anonymous and cross-origin mutations are rejected', async () => {
  await request(app).get('/api/jobs').expect(401);
  await owner.post('/api/jobs').set('Origin', 'https://attacker.example').send({}).expect(403);
  await call(owner, 'post', '/api/auth/google').send({ credential: 'invalid' }).expect(401);
});
test('private files are not static assets', async () => {
  for (const file of ['/.env','/server/schema.sql','/.git/config','/data/recordings/x','/config.js']) await owner.get(file).expect(404);
  await owner.get('/career.html').expect(200);
  await owner.get('/app.html').expect(302).expect('Location', '/career.html');
});
test('create a job and isolate it by owner', async () => {
  const result = await call(owner, 'post', '/api/jobs').send({ company: 'Example', role: 'Engineer', description: 'Build systems', resumeText: 'Built a database' }).expect(201); job = result.body;
  assert.equal((await other.get('/api/jobs')).body.length, 0);
  await call(other, 'patch', '/api/jobs/' + job.id).send({ stage: 'offer' }).expect(404);
  await call(owner, 'patch', '/api/jobs/' + job.id).send({ stage: 'interviewing' }).expect(200);
  await call(owner, 'patch', '/api/jobs/' + job.id).send({ stage: 'invalid' }).expect(400);
});
test('resume upload and download require job ownership', async () => {
  await call(other, 'post', `/api/jobs/${job.id}/resume`).attach('resume', Buffer.from('resume'), { filename: 'cv.txt', contentType: 'text/plain' }).expect(404);
  await call(owner, 'post', `/api/jobs/${job.id}/resume`).attach('resume', Buffer.from('resume'), { filename: 'cv.txt', contentType: 'text/plain' }).expect(200);
  assert.equal(objects.size, 1);
  await other.get(`/api/jobs/${job.id}/resume`).expect(404);
  await owner.get(`/api/jobs/${job.id}/resume`).expect(200);
});
test('generated questions are stored but unsaved sessions are not in history', async () => {
  interview = (await call(owner, 'post', `/api/jobs/${job.id}/interviews`).send({ count: 3 }).expect(201)).body;
  assert.equal(interview.questions.length, 3);
  assert.equal((await owner.get('/api/interviews')).body.length, 0);
  await other.get('/api/interviews/' + interview.id).expect(404);
});
test('Live token endpoint requires job ownership and configured provider', async () => {
  await call(other, 'post', `/api/jobs/${job.id}/live-token`).send({}).expect(404);
  await call(owner, 'post', `/api/jobs/${job.id}/live-token`).send({}).expect(503);
});
test('recordings cannot be uploaded before explicit save or by a different user', async () => {
  const url = `/api/interviews/${interview.id}/answers/0`;
  await call(owner, 'post', url).attach('recording', Buffer.from('video'), { filename: 'a.webm', contentType: 'video/webm' }).expect(409);
  await call(other, 'post', `/api/interviews/${interview.id}/save`).send({}).expect(404);
  await call(owner, 'post', `/api/interviews/${interview.id}/save`).send({}).expect(200);
  await call(owner, 'post', `/api/interviews/${interview.id}/complete`).send({}).expect(409);
});
test('upload retries are idempotent and finalization requires all answers', async () => {
  for (const i of [0, 0, 1, 2]) await call(owner, 'post', `/api/interviews/${interview.id}/answers/${i}`)
    .field('duration', '10').field('metrics', '{"pvs":12}').attach('recording', Buffer.from('video content'), { filename: 'a.webm', contentType: 'video/webm' }).expect(200);
  assert.equal((await readdir(dir)).length, 3);
  await call(owner, 'post', `/api/interviews/${interview.id}/complete`).send({}).expect(200);
  await call(owner, 'post', `/api/interviews/${interview.id}/complete`).send({}).expect(200);
  assert.equal((await owner.get('/api/interviews')).body.length, 1);
});
test('saved media supports range requests and remains private', async () => {
  await other.get(`/api/interviews/${interview.id}/answers/0`).expect(404);
  await owner.get(`/api/interviews/${interview.id}/answers/0`).set('Range','bytes=0-4').expect(206);
  const result = await owner.get('/api/interviews/' + interview.id).expect(200);
  assert.deepEqual(result.body.answers[0].metrics, { pvs: 12 });
});
test('deleting a saved session removes metadata and all media', async () => {
  await call(other, 'delete', '/api/interviews/' + interview.id).expect(404);
  await call(owner, 'delete', '/api/interviews/' + interview.id).expect(200);
  assert.equal((await readdir(dir)).length, 0);
  await owner.get('/api/interviews/' + interview.id).expect(404);
});
test('expired practices and old orphan uploads are cleaned up', async () => {
  const session = (await call(owner, 'post', `/api/jobs/${job.id}/interviews`).send({ count: 3 })).body;
  await db.query("UPDATE interviews SET expires_at=now()-interval '1 hour' WHERE id=$1", [session.id]);
  const file = path.join(dir, '00000000-0000-0000-0000-000000000000');
  await writeFile(file, 'abandoned'); const old = new Date(Date.now() - 7200000); await utimes(file, old, old);
  await cleanup();
  assert.equal((await readdir(dir)).length, 0);
  assert.equal((await db.query('SELECT * FROM interviews WHERE id=$1', [session.id])).rows.length, 0);
});
test('logout invalidates the server-side session', async () => {
  await call(owner, 'post', '/api/auth/logout').send({}).expect(200);
  await owner.get('/api/me').expect(401);
});
test('Live tokens are single use, constrained and never return the API key', async () => {
  const result = await mintLiveToken({ company: 'Example', role: 'Engineer' }, { GEMINI_API_KEY: 'server-secret', GEMINI_LIVE_MODEL: 'test-model' }, async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.uses, 1); assert.equal(body.liveConnectConstraints.model, 'models/test-model');
    assert.ok(Date.parse(body.expireTime) <= Date.now() + 8 * 60000);
    assert.equal(options.headers['x-goog-api-key'], 'server-secret');
    return { ok: true, json: async () => ({ name: 'short-lived-token' }) };
  });
  assert.deepEqual(result, { token: 'short-lived-token', model: 'models/test-model' });
});
test('question generation validates model output and keeps credentials server-side', async () => {
  const env = { GEMINI_API_KEY: 'server-secret', GEMINI_MODEL: 'test-model' };
  const generated = await generateQuestions({ description: 'A role', resume_text: 'My experience' }, 3, env, async (_url, options) => {
    assert.equal(options.headers['x-goog-api-key'], 'server-secret');
    assert.ok(JSON.parse(options.body).contents[0].parts[0].text.includes('My experience'));
    return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '["One?","Two?","Three?"]' }] } }] }) };
  });
  assert.equal(generated.length, 3);
  await assert.rejects(generateQuestions({}, 3, env, async () => ({ ok: true, json: async () => ({ candidates: [] }) })), { status: 502 });
  await assert.rejects(generateQuestions({}, 3, {}), { status: 503 });
});
