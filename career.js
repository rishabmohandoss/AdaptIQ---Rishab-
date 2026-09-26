/* Unsaved media is deliberately memory-only: no localStorage, IndexedDB, or background uploads. */
const $ = id => document.getElementById(id);
let jobs = [], interview = null, stream = null, recorder = null, answers = [], index = 0;
let timer, startedAt, objectUrl, busy = false, viewedSession = null;
let analysisReady = false, analysisSamples = {}, sensorLoading;
window.Bus = (() => { const handlers = {}; return { on: (e,f) => (handlers[e] ||= []).push(f), emit: (e,d) => (handlers[e] || []).forEach(f => f(d)) }; })();
for (const event of ['signal:face','signal:gaze','signal:audio']) Bus.on(event, data => {
  if (recorder?.state !== 'recording') return;
  for (const key of ['gds','osr','hpd','pvs','ves','wpm']) if (Number.isFinite(data[key])) {
    const sample = analysisSamples[key] ||= { total: 0, count: 0 }; sample.total += data[key]; sample.count++;
  }
});
function loadScript(src) { return new Promise((resolve,reject) => { const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = () => { s.remove(); reject(new Error('Analysis library failed to load')); }; document.head.append(s); }); }
async function prepareAnalysis() {
  if (!$('analyze').checked) { $('analysis-status').textContent = ''; return; }
  $('analysis-status').textContent = 'Loading analysis. Look toward the camera to calibrate…';
  try {
    sensorLoading ||= (async () => {
      await loadScript('/metrics-math.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');
      await loadScript('https://cdn.jsdelivr.net/npm/meyda/dist/web/meyda.min.js');
      await loadScript('/career-sensors.js');
    })();
    await sensorLoading; await SensorManager.init($('camera'), stream); await SensorManager.startCalibration();
    analysisReady = true; $('analysis-status').textContent = 'Eye and voice analysis ready. No live coaching interruptions.';
  } catch { window.SensorManager?.dispose(); analysisReady = false; $('analysis-status').textContent = 'Analysis unavailable. You can still record and review your answers.'; }
}
async function api(url, method = 'GET', body) {
  const response = await fetch('/api' + url, { method, credentials: 'same-origin',
    headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
function message(value = '') { $('message').textContent = value; }
function screen(name) { for (const id of ['signin', 'home', 'practice', 'finish', 'saved']) $(id).hidden = id !== name; }
function button(label, action) { const b = document.createElement('button'); b.textContent = label; b.onclick = () => action().catch(e => message(e.message)); return b; }
function card(title, subtitle) { const el = document.createElement('article'); el.className = 'card'; const h = document.createElement('h3'); h.textContent = title; const p = document.createElement('p'); p.textContent = subtitle; el.append(h, p); return el; }
async function home() {
  const [list, saved] = await Promise.all([api('/jobs'), api('/interviews')]); jobs = list;
  $('job-count').textContent = jobs.length; $('interview-count').textContent = saved.length;
  $('jobs-empty').hidden = !!jobs.length; $('sessions-empty').hidden = !!saved.length;
  $('jobs').replaceChildren(); $('sessions').replaceChildren();
  for (const job of jobs) {
    const el = card(job.company, job.role);
    const select = document.createElement('select'); select.setAttribute('aria-label', `Application stage at ${job.company}`);
    for (const stage of ['saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn']) { const o = document.createElement('option'); o.value = stage; o.textContent = stage[0].toUpperCase() + stage.slice(1); select.append(o); }
    select.value = job.stage;
    select.onchange = async () => { select.disabled = true; try { await api('/jobs/' + job.id, 'PATCH', { stage: select.value }); job.stage = select.value; } catch (e) { select.value = job.stage; message(e.message); } finally { select.disabled = false; } };
    const start = button('New interview', async () => { start.disabled = true; try { await begin(job); } finally { start.disabled = false; } }); start.className = 'primary';
    el.append(select, start, button('Practice with AI', async () => {
      $('live-dialog').showModal(); $('live-status').textContent = 'Ready when you are.';
      $('live-start').onclick = () => AdaptIQLive.start(job.id);
    }));
    if (job.resume_key) { const a = document.createElement('a'); a.href = `/api/jobs/${job.id}/resume`; a.textContent = 'Download resume'; el.append(document.createElement('br'), a); }
    $('jobs').append(el);
  }
  for (const session of saved) { const el = card(session.company, `${session.role} · ${new Date(session.created_at).toLocaleDateString()}`); el.append(button('Review answers', () => reviewSaved(session.id))); $('sessions').append(el); }
  screen('home');
}
async function begin(job) {
  if (busy || interview) return;
  if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) throw new Error('Recording requires HTTPS and a browser with camera recording support.');
  busy = true; message('Creating questions tailored to your resume and this role…');
  try {
    interview = await api(`/jobs/${job.id}/interviews`, 'POST', { count: 5 });
    answers = []; index = 0;
    $('practice-title').textContent = `${job.company} · ${job.role}`;
    await openCamera(); screen('practice'); question(); $('record').disabled = true; $('leave-practice').disabled = true;
    await prepareAnalysis(); $('record').disabled = false; $('leave-practice').disabled = false; message();
  } catch (e) { if (interview) await api(`/interviews/${interview.id}`, 'DELETE').catch(() => {}); interview = null; release(); throw e; }
  finally { busy = false; }
}
async function openCamera() {
  stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true });
  $('camera').srcObject = stream; await $('camera').play();
}
function resetPlayback() {
  $('review-video').pause(); $('review-audio').pause();
  $('review-video').removeAttribute('src'); $('review-video').load();
  $('review-audio').removeAttribute('src'); $('review-audio').load();
  if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = null;
}
function release() { clearInterval(timer); window.SensorManager?.dispose(); analysisReady = false; stream?.getTracks().forEach(t => t.stop()); stream = null; $('camera').srcObject = null; resetPlayback(); }
function question() {
  resetPlayback(); $('question').textContent = interview.questions[index];
  $('progress').textContent = `QUESTION ${index + 1} OF ${interview.questions.length}`;
  $('instructions').textContent = 'Take a moment. Start recording when you are ready.';
  $('recording-status').textContent = 'Camera preview'; $('timer').textContent = '0:00 / 5:00';
  for (const id of ['watch','listen','next','stop','review-video','audio-review']) $(id).hidden = true;
  $('record').hidden = false; $('camera').hidden = false;
}
$('record').onclick = () => {
  try {
    const mimeType = ['video/webm;codecs=vp8,opus','video/webm','video/mp4'].find(t => MediaRecorder.isTypeSupported(t));
    recorder = new MediaRecorder(stream, mimeType ? { mimeType, videoBitsPerSecond: 1500000 } : undefined);
    let chunks = [], bytes = 0;
    recorder.ondataavailable = e => { if (e.data.size) { chunks.push(e.data); bytes += e.data.size; if (bytes > 90 * 1024 * 1024 && recorder.state === 'recording') recorder.stop(); } };
    recorder.onerror = () => { message('Recording was interrupted. Leave practice and try again.'); release(); };
    recorder.onstop = () => {
      clearInterval(timer);
      const blob = new Blob(chunks, { type: recorder.mimeType }); chunks = [];
      if (analysisReady) SensorManager.stop();
      const metrics = Object.fromEntries(Object.entries(analysisSamples).map(([k,v]) => [k, Math.round(v.total / v.count)]));
      answers[index] = { blob, duration: Math.min(305, (Date.now() - startedAt) / 1000), metrics };
      if (analysisReady) $('analysis-status').textContent = `Practice estimates: ${Object.entries(metrics).map(([k,v]) => `${k.toUpperCase()} ${v}`).join(' · ') || 'Not enough samples'}`;
      $('stop').hidden = true;
      for (const id of ['watch','listen','next']) $(id).hidden = false;
      $('next').textContent = index === interview.questions.length - 1 ? 'Finish interview' : 'Next question';
      $('instructions').textContent = 'Review your body language silently, then listen to your delivery. Both are optional.';
      $('recording-status').textContent = 'Answer recorded · not saved';
    };
    analysisSamples = {}; recorder.start(1000); startedAt = Date.now();
    if (analysisReady) { AudioEngine.reset(); SensorManager.start(); }
    $('record').hidden = true; $('stop').hidden = false; $('recording-status').textContent = 'Recording';
    timer = setInterval(() => { const secs = Math.floor((Date.now() - startedAt) / 1000); $('timer').textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2,'0')} / 5:00`; if (secs >= 300 && recorder.state === 'recording') recorder.stop(); }, 250);
  } catch (e) { message('Could not start recording: ' + e.message); }
};
$('stop').onclick = () => { if (recorder?.state === 'recording') recorder.stop(); };
function playback(mode) {
  resetPlayback(); objectUrl = URL.createObjectURL(answers[index].blob);
  $('camera').hidden = true; $('review-video').hidden = mode !== 'video'; $('audio-review').hidden = mode !== 'audio';
  const player = mode === 'video' ? $('review-video') : $('review-audio');
  player.src = objectUrl; player.muted = mode === 'video';
  // No native video controls: volume controls could defeat silent review.
  $('recording-status').textContent = mode === 'video' ? 'Silent replay · click Watch to restart' : 'Audio-only replay';
  player.play().catch(() => message('Playback could not start. Try the review button again.'));
}
$('watch').onclick = () => playback('video'); $('listen').onclick = () => playback('audio');
$('next').onclick = () => { if (!answers[index]?.blob.size) return; index++; if (index >= interview.questions.length) { release(); screen('finish'); } else question(); };
async function discard() {
  if (busy) return;
  busy = true;
  try {
    if (recorder?.state === 'recording') { recorder.onstop = null; recorder.stop(); }
    release(); answers = [];
    if (interview) await api(`/interviews/${interview.id}`, 'DELETE');
    interview = null; message('Unsaved practice deleted.'); await home();
  } finally { busy = false; }
}
$('leave-practice').onclick = () => { if (confirm('Leave and delete this unsaved practice?')) discard().catch(e => message(e.message)); };
$('discard-session').onclick = () => discard().catch(e => message(e.message));
$('save-session').onclick = async () => {
  if (busy) return; busy = true;
  $('save-session').disabled = true; $('discard-session').disabled = true;
  try {
    await api(`/interviews/${interview.id}/save`, 'POST', {});
    for (let i = 0; i < answers.length; i++) {
      $('save-progress').textContent = `Saving answer ${i + 1} of ${answers.length}…`;
      const form = new FormData(); form.append('recording', answers[i].blob, 'answer'); form.append('duration', String(answers[i].duration)); form.append('metrics', JSON.stringify(answers[i].metrics || {}));
      await api(`/interviews/${interview.id}/answers/${i}`, 'POST', form);
    }
    await api(`/interviews/${interview.id}/complete`, 'POST', {});
    answers = []; interview = null; $('save-progress').textContent = ''; message('Session saved. You can revisit it below.'); await home();
  } catch (e) { $('save-progress').textContent = e.message + ' Your recordings are still here. Retry saving, or delete the session.'; }
  finally { busy = false; $('save-session').disabled = false; $('discard-session').disabled = false; }
};
async function reviewSaved(id) {
  const session = await api('/interviews/' + id); viewedSession = id; $('saved-answers').replaceChildren();
  for (const answer of session.answers) {
    const el = card(`Question ${answer.question_index + 1}`, session.questions[answer.question_index]);
    const video = document.createElement('video'); video.playsInline = true; video.preload = 'none'; video.hidden = true;
    const audio = document.createElement('audio'); audio.controls = true; audio.preload = 'none'; audio.hidden = true;
    const src = `/api/interviews/${id}/answers/${answer.question_index}`;
    const pauseAll = () => document.querySelectorAll('#saved video,#saved audio').forEach(p => p.pause());
    el.append(video, audio, button('Watch silently', async () => { pauseAll(); audio.hidden = true; video.hidden = false; video.muted = true; video.src = src; await video.play(); }), button('Listen only', async () => { pauseAll(); video.hidden = true; audio.hidden = false; audio.src = src; await audio.play(); })); $('saved-answers').append(el);
  }
  screen('saved');
}
$('back-home').onclick = () => { $('saved-answers').replaceChildren(); home().catch(e => message(e.message)); };
$('delete-saved').onclick = async () => { if (!confirm('Permanently delete this saved interview and its recordings?')) return; try { await api('/interviews/' + viewedSession, 'DELETE'); $('saved-answers').replaceChildren(); await home(); } catch (e) { message(e.message); } };
$('add-job').onclick = () => { $('job-error').textContent = ''; $('job-dialog').showModal(); };
$('close-job').onclick = () => $('job-dialog').close();
$('live-stop').onclick = () => { AdaptIQLive.stop(); $('live-dialog').close(); };
$('live-dialog').addEventListener('cancel', () => AdaptIQLive.stop());
$('job-form').onsubmit = async e => {
  e.preventDefault(); const submit = e.target.querySelector('[type=submit]'); submit.disabled = true;
  try {
    const form = new FormData(e.target), file = form.get('resume');
    if (file.size > 5 * 1024 * 1024) throw new Error('Resume must be under 5 MB.');
    const job = await api('/jobs', 'POST', Object.fromEntries(['company','role','description','resumeText'].map(k => [k, form.get(k)])));
    if (file.size) { const upload = new FormData(); upload.append('resume', file); try { await api(`/jobs/${job.id}/resume`, 'POST', upload); } catch (err) { message('Job saved, but resume file upload failed: ' + err.message); } }
    e.target.reset(); $('job-dialog').close(); await home();
  } catch (err) { $('job-error').textContent = err.message; } finally { submit.disabled = false; }
};
$('logout').onclick = async () => { if (interview && !confirm('Sign out and delete this unsaved practice?')) return; try { if (interview) await discard(); await api('/auth/logout', 'POST', {}); location.href = '/'; } catch (e) { message(e.message); } };
window.addEventListener('beforeunload', e => { if (interview) { e.preventDefault(); e.returnValue = ''; } });
window.addEventListener('pagehide', () => { release(); answers = []; });
(async () => {
  try { await api('/me'); $('logout').hidden = false; await home(); }
  catch { screen('signin'); try { const config = await api('/config'); if (!config.googleClientId) return message('Google sign-in is awaiting server configuration.');
    await new Promise((resolve, reject) => { let ticks = 0; const t = setInterval(() => { if (window.google?.accounts) { clearInterval(t); resolve(); } else if (++ticks > 100) { clearInterval(t); reject(new Error('Google sign-in could not load. Please reload.')); } }, 100); });
    google.accounts.id.initialize({ client_id: config.googleClientId, callback: async result => { try { await api('/auth/google', 'POST', { credential: result.credential }); location.reload(); } catch (e) { message(e.message); } } });
    google.accounts.id.renderButton($('google-signin'), { theme: 'filled_black', size: 'large' });
  } catch (e) { message(e.message); } }
})();
