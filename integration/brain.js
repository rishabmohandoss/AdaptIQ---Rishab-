// === ADAPTIQ BRAIN MODULE === //

// =========================================================
// 1. PROFILE CONFIG
// =========================================================
const ProfileConfig = (() => {
  // Each weakness contributes signal focus, tighter z-score/value thresholds,
  // and intervention overrides on top of the base profile.
  const WEAKNESS_CATALOG = {
    stuttering: {
      label: 'Stuttering',
      monitored_signals: ['silr', 'sr'],
      signal_z: { sr: 1.3 },
      val_thresholds: { PROLONGED_SILENCE_SILR: 50 },
      interventions: {
        PROLONGED_SILENCE: { action: 'claude_response', message: "Take your time — there's no rush." },
        SPEECH_PANIC:      { action: 'banner', message: "Pause, breathe, and continue whenever you're ready.", color: '#f59e0b', severity: 'medium' },
      },
    },
    eye_contact: {
      label: 'Losing Eye Contact',
      monitored_signals: ['gds', 'osr'],
      signal_z: { gds: 1.3 },
      val_thresholds: { GAZE_LOST_OSR: 65 },
      interventions: {
        GAZE_ERRATIC: { action: 'banner', message: 'Try to keep your eyes on the camera.', color: '#f59e0b', severity: 'medium' },
        GAZE_LOST:    { action: 'banner', message: "Look at the camera — I'm right here.", color: '#ef4444', severity: 'high' },
      },
    },
    distraction: {
      label: 'Distraction',
      monitored_signals: ['gds', 'hpd'],
      signal_z: { gds: 1.5, hpd: 1.5 },
      ces_alert_level: 45,
      interventions: {
        ATTENTION_DROP: { action: 'content_swap', message: "Let's try something different!" },
        FOCUS_DRIFT:    { action: 'focus_object',  message: 'Can you find the shape?', duration: 3000 },
      },
    },
    speaking_too_fast: {
      label: 'Speaking Too Fast',
      monitored_signals: ['sr', 'pvs'],
      val_thresholds: { SPEECH_PANIC_SR: 55, OVERCONFIDENT_PACE_SR: 50 },
      interventions: {
        SPEECH_PANIC:       { action: 'banner', message: "You're speaking very fast. Pause and collect your thoughts.", color: '#ef4444', severity: 'high' },
        OVERCONFIDENT_PACE: { action: 'banner', message: 'Great energy! Try varying your pace for emphasis.', color: '#3b82f6', severity: 'low' },
      },
    },
    anxiety: {
      label: 'Anxiety / Stress',
      monitored_signals: ['et', 'ves', 'pvs'],
      signal_z: { et: 1.5, ves: 1.5 },
      interventions: {
        STRESS_DETECTED: { action: 'break_timer', message: 'Time for a quick break!', duration: 30000 },
      },
    },
  };

  const BASE_INTERVENTIONS = {
    GAZE_ERRATIC:       { action: 'banner',         message: 'Maintain steady eye contact with the camera.', color: '#f59e0b', severity: 'medium' },
    GAZE_LOST:          { action: 'banner',         message: 'Look at the camera.', color: '#ef4444', severity: 'high' },
    ATTENTION_DROP:     { action: 'content_swap',   message: "Let's try something different!" },
    STRESS_DETECTED:    { action: 'banner',         message: "Take a breath. Slow down. You've got this.", color: '#f59e0b', severity: 'medium' },
    FOCUS_DRIFT:        { action: 'claude_response',message: 'Let me rephrase that differently.' },
    PROLONGED_SILENCE:  { action: 'claude_response',message: "You've been quiet — need help?" },
    SPEECH_PANIC:       { action: 'banner',         message: "You're speaking quickly. Take a moment.", color: '#f59e0b', severity: 'medium' },
    OVERCONFIDENT_PACE: { action: 'banner',         message: 'Great energy! Try varying your pace for emphasis.', color: '#3b82f6', severity: 'low' },
  };

  // threshold_z is the default z-score bound; val_thresholds are the default
  // raw-value bounds checked directly against a signal (0-100 scale).
  const DEFAULT_VAL_THRESHOLDS = {
    GAZE_LOST_OSR:          80,
    PROLONGED_SILENCE_SILR: 80,
    SPEECH_PANIC_SR:        70,
    OVERCONFIDENT_PACE_SR:  60,
    OVERCONFIDENT_PACE_PVS: 10,
  };

  function build(weaknesses = []) {
    const ids = weaknesses.map(w => (typeof w === 'string' ? w : w?.id)).filter(Boolean);

    const profile = {
      id: ids.length ? `custom:${ids.join('+')}` : 'custom:general',
      name: ids.length ? ids.map(id => WEAKNESS_CATALOG[id]?.label || id).join(' + ') : 'General',
      threshold_z: 2.0,
      ces_alert_level: 35,
      cooldown_seconds: 15,
      monitored_signals: ['gds', 'osr', 'hpd', 'et', 'ves', 'pvs', 'sr', 'silr', 'bra'],
      signal_z: {},
      val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
      interventions: JSON.parse(JSON.stringify(BASE_INTERVENTIONS)),
      weaknesses: ids,
    };

    ids.forEach(id => {
      const w = WEAKNESS_CATALOG[id];
      if (!w) return;
      if (w.ces_alert_level !== undefined) profile.ces_alert_level = w.ces_alert_level;
      if (w.signal_z) Object.assign(profile.signal_z, w.signal_z);
      if (w.val_thresholds) Object.assign(profile.val_thresholds, w.val_thresholds);
      if (w.interventions) {
        Object.entries(w.interventions).forEach(([flag, iv]) => {
          profile.interventions[flag] = { ...profile.interventions[flag], ...iv };
        });
      }
    });

    return profile;
  }

  // Legacy single-select UI profile IDs map to a starter weakness set until
  // the weakness-picker UI (later phase) replaces the profile-card selector.
  const LEGACY_WEAKNESSES = {
    special_needs: ['distraction', 'eye_contact'],
    adhd:          ['distraction'],
    anxiety:       ['anxiety'],
    asd:           ['eye_contact'],
  };

  const INTERVIEW_COACH = {
    id: 'interview_coach',
    name: 'Interview Coach',
    threshold_z: 2.0,
    ces_alert_level: 35,
    cooldown_seconds: 15,
    monitored_signals: ['gds', 'osr', 'hpd', 'ves', 'pvs', 'sr', 'silr'],
    scored_metrics: true,
    signal_z: {},
    val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
    interventions: {
      GAZE_ERRATIC:        { action: 'banner',         message: 'Maintain steady eye contact with the camera.',              color: '#f59e0b', severity: 'medium' },
      GAZE_LOST:           { action: 'banner',         message: 'Look at the camera — your interviewer is here.',           color: '#ef4444', severity: 'high'   },
      STRESS_DETECTED:     { action: 'banner',         message: "Take a breath. Slow down. You've got this.",               color: '#f59e0b', severity: 'medium' },
      SPEECH_PANIC:        { action: 'banner',         message: "You're speaking very fast. Pause and collect your thoughts.", color: '#ef4444', severity: 'high' },
      PROLONGED_SILENCE:   { action: 'claude_response',message: "Looks like you're thinking — want a hint?"                                                       },
      OVERCONFIDENT_PACE:  { action: 'banner',         message: 'Great energy! Try varying your pace for emphasis.',        color: '#3b82f6', severity: 'low'    },
    },
  };

  const LANGUAGE_TEACHER = {
    id: 'language_teacher',
    name: 'Language Teacher',
    threshold_z: 2.0,
    ces_alert_level: 35,
    cooldown_seconds: 15,
    monitored_signals: ['et', 'pvs', 'silr', 'sr'],
    signal_z: {},
    val_thresholds: { ...DEFAULT_VAL_THRESHOLDS },
    interventions: {
      STRESS_DETECTED:   { action: 'content_swap',   message: "Let's simplify this. Try an easier sentence."     },
      FOCUS_DRIFT:       { action: 'claude_response',message: 'Let me rephrase that differently.'                },
      PROLONGED_SILENCE: { action: 'claude_response',message: 'Take your time. Want me to repeat?'               },
      SPEECH_PANIC:      { action: 'banner',         message: 'Slow down — pronunciation is more important than speed.', color: '#f59e0b', severity: 'medium' },
    },
  };

  return {
    WEAKNESS_CATALOG,
    INTERVIEW_COACH,
    LANGUAGE_TEACHER,
    build,
    getById(id) {
      if (id === 'interview_coach')  return INTERVIEW_COACH;
      if (id === 'language_teacher') return LANGUAGE_TEACHER;
      const weaknesses = LEGACY_WEAKNESSES[id];
      return weaknesses ? build(weaknesses) : null;
    },
  };
})();

window.ProfileConfig = ProfileConfig;

// =========================================================
// 2. ANOMALY DETECTOR
// =========================================================
const AnomalyDetector = (() => {
  const SIGNAL_NAMES = ['gds', 'osr', 'hpd', 'et', 'ves', 'pvs', 'silr', 'sr', 'bra'];

  // CES weights — silr intentionally excluded per spec formula
  const CES_W = { gds: 0.20, osr: 0.20, hpd: 0.15, et: 0.10, ves: 0.10, pvs: 0.10, sr: 0.10, bra: 0.05 };

  // Sustained durations before a flag fires (ms)
  const FLAG_DURATION = {
    GAZE_ERRATIC:       3000,
    GAZE_LOST:          5000,
    ATTENTION_DROP:     10000,
    STRESS_DETECTED:    5000,
    FOCUS_DRIFT:        8000,
    SPEECH_PANIC:       3000,
    PROLONGED_SILENCE:  15000,
    OVERCONFIDENT_PACE: 10000,
  };

  const FLAG_SEVERITY = {
    GAZE_ERRATIC:       'medium',
    GAZE_LOST:          'high',
    ATTENTION_DROP:     'high',
    STRESS_DETECTED:    'medium',
    FOCUS_DRIFT:        'low',
    SPEECH_PANIC:       'high',
    PROLONGED_SILENCE:  'medium',
    OVERCONFIDENT_PACE: 'low',
  };

  let buffers = {};
  let latestSignals = {};
  let isCalibrating = true;
  let calibrationStartTime = null;
  let activeProfile = null;
  let detectionInterval = null;
  let flagOnsetTimes = {}; // { flagType: firstSeenTimestamp }

  function clamp(v, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, v)); }

  function makeBuffer() {
    // Lazy-create so we don't crash if SignalBuffer isn't loaded yet
    return (typeof SignalBuffer !== 'undefined') ? new SignalBuffer(60) : null;
  }

  function resetState() {
    buffers = {};
    SIGNAL_NAMES.forEach(n => { buffers[n] = makeBuffer(); });
    latestSignals = {};
    flagOnsetTimes = {};
    isCalibrating = true;
    calibrationStartTime = Date.now();
  }

  function pushToBuffer(name, value) {
    if (!buffers[name]) buffers[name] = makeBuffer();
    if (buffers[name]) buffers[name].push(value);
  }

  function getZ(name) {
    const buf = buffers[name];
    if (!buf) return 0;
    const val = latestSignals[name] || 0;
    return buf.zScore(val);
  }

  function getVal(name) { return latestSignals[name] || 0; }

  function computeCES(s) {
    const raw = Object.keys(CES_W).reduce((sum, k) => sum + (s[k] || 0) * CES_W[k], 0);
    return clamp(100 - raw);
  }

  function zFor(name) {
    return (activeProfile.signal_z && activeProfile.signal_z[name]) || activeProfile.threshold_z;
  }

  function vt(key, fallback) {
    const v = activeProfile.val_thresholds && activeProfile.val_thresholds[key];
    return v !== undefined ? v : fallback;
  }

  function checkCondition(flagType) {
    if (!activeProfile) return false;
    switch (flagType) {
      case 'GAZE_ERRATIC':       return getZ('gds') > zFor('gds');
      case 'GAZE_LOST':          return getVal('osr') > vt('GAZE_LOST_OSR', 80);
      case 'ATTENTION_DROP':     return computeCES(latestSignals) < activeProfile.ces_alert_level;
      case 'STRESS_DETECTED':    return getZ('et') > zFor('et') && (getZ('ves') > zFor('ves') || getZ('pvs') > zFor('pvs'));
      case 'FOCUS_DRIFT':        return getZ('gds') > zFor('gds') * 0.8 && getZ('hpd') > zFor('hpd') * 0.8;
      case 'SPEECH_PANIC':       return getVal('sr') > vt('SPEECH_PANIC_SR', 70) && getZ('ves') > zFor('ves');
      case 'PROLONGED_SILENCE':  return getVal('silr') > vt('PROLONGED_SILENCE_SILR', 80);
      case 'OVERCONFIDENT_PACE': return getVal('sr') > vt('OVERCONFIDENT_PACE_SR', 60) && getVal('pvs') < vt('OVERCONFIDENT_PACE_PVS', 10);
      default:                   return false;
    }
  }

  function detectionCycle() {
    if (!activeProfile) return;

    const now = Date.now();
    const elapsed = now - calibrationStartTime;

    if (isCalibrating) {
      if (elapsed < 8000) {
        Bus.emit('signal:update', { ...latestSignals, ces: 100 });
        return;
      }
      isCalibrating = false;
      Bus.emit('calibration:complete', { type: 'baseline' });
    }

    const ces = computeCES(latestSignals);
    Bus.emit('signal:update', { ...latestSignals, ces });

    // Evaluate every flag that has an intervention in the active profile
    Object.keys(FLAG_DURATION).forEach(flagType => {
      if (!activeProfile.interventions[flagType]) return;

      const triggered = checkCondition(flagType);

      if (triggered) {
        if (!flagOnsetTimes[flagType]) {
          flagOnsetTimes[flagType] = now;
        } else if (now - flagOnsetTimes[flagType] >= FLAG_DURATION[flagType]) {
          // Fire and reset onset so it can re-fire after another sustained window
          delete flagOnsetTimes[flagType];
          Bus.emit('flag:fired', {
            type: flagType,
            severity: FLAG_SEVERITY[flagType],
            timestamp: now,
            message: activeProfile.interventions[flagType]?.message || flagType,
          });
        }
      } else {
        delete flagOnsetTimes[flagType];
      }
    });
  }

  function init(profile) {
    activeProfile = profile;
    resetState();
  }

  function start() {
    if (detectionInterval) clearInterval(detectionInterval);
    detectionInterval = setInterval(() => {
      try { detectionCycle(); } catch (e) { console.error('[AnomalyDetector]', e); }
    }, 100);
  }

  function stop() {
    if (detectionInterval) { clearInterval(detectionInterval); detectionInterval = null; }
  }

  function reset() { stop(); resetState(); }

  function getCES() { return computeCES(latestSignals); }

  // --- Signal subscriptions ---
  Bus.on('signal:face', ({ et, hpd, bra }) => {
    latestSignals.et  = et  || 0;
    latestSignals.hpd = hpd || 0;
    latestSignals.bra = bra || 0;
    pushToBuffer('et',  latestSignals.et);
    pushToBuffer('hpd', latestSignals.hpd);
    pushToBuffer('bra', latestSignals.bra);
  });

  Bus.on('signal:gaze', ({ gds, osr }) => {
    latestSignals.gds = gds || 0;
    latestSignals.osr = osr || 0;
    pushToBuffer('gds', latestSignals.gds);
    pushToBuffer('osr', latestSignals.osr);
  });

  Bus.on('signal:audio', ({ ves, pvs, silr, sr }) => {
    latestSignals.ves  = ves  || 0;
    latestSignals.pvs  = pvs  || 0;
    latestSignals.silr = silr || 0;
    latestSignals.sr   = sr   || 0;
    pushToBuffer('ves',  latestSignals.ves);
    pushToBuffer('pvs',  latestSignals.pvs);
    pushToBuffer('silr', latestSignals.silr);
    pushToBuffer('sr',   latestSignals.sr);
  });

  Bus.on('profile:selected', ({ id, config }) => { init(config); });

  return {
    init, start, stop, reset,
    get isCalibrating() { return isCalibrating; },
    getCES,
  };
})();

window.AnomalyDetector = AnomalyDetector;

// =========================================================
// 3. INTERVENTION DISPATCHER
// =========================================================
const InterventionDispatcher = (() => {
  let lastInterventionTime = 0;
  let interventionLog = [];
  let activeProfile = null;

  function init(profile) {
    activeProfile = profile;
    interventionLog = [];
    lastInterventionTime = 0;
  }

  Bus.on('profile:selected', ({ id, config }) => { init(config); });

  Bus.on('flag:fired', (flag) => {
    if (!activeProfile) return;

    const now = Date.now();
    if (now - lastInterventionTime < activeProfile.cooldown_seconds * 1000) return;

    const intervention = activeProfile.interventions[flag.type];
    if (!intervention) return;

    interventionLog.push({ flag, intervention, timestamp: now });
    lastInterventionTime = now;

    if (intervention.action === 'claude_response') {
      const context = {
        profile: activeProfile,
        signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
        transcript: window.AudioEngine ? AudioEngine.getTranscript() : '',
        flagType: flag.type,
        message: intervention.message,
      };
      window.ClaudeClient?.generate(context);
    } else {
      Bus.emit('intervention:trigger', { ...intervention, profile: activeProfile.id });
    }
  });

  // On-demand help — ui.js stays decoupled from ClaudeClient/AudioEngine and
  // only knows the current question; this listener owns gathering context.
  // Not gated by the intervention cooldown: a manual click is an explicit
  // request, not an anomaly-driven interruption.
  Bus.on('help:requested', ({ questionText } = {}) => {
    if (!activeProfile) return;

    const now = Date.now();
    const allSegments = window.AudioEngine && AudioEngine.getTranscriptSegments
      ? AudioEngine.getTranscriptSegments()
      : [];
    const recentTranscript = allSegments
      .filter(s => now - s.timestamp <= 60000)
      .map(s => s.text)
      .join(' ');

    const context = {
      profile: activeProfile,
      signals: { ces: window.AnomalyDetector ? AnomalyDetector.getCES() : 0 },
      transcript: recentTranscript,
      requestType: 'help',
      questionText: questionText || '',
      message: "Here's a tip for this question.",
    };
    window.ClaudeClient?.generate(context);
  });

  return {
    init,
    getLog()  { return [...interventionLog]; },
    reset()   { interventionLog = []; lastInterventionTime = 0; },
  };
})();

window.InterventionDispatcher = InterventionDispatcher;

// =========================================================
// 4. CLAUDE CLIENT
// =========================================================
const ClaudeClient = (() => {
  let apiKey = null;

  const SYSTEM_PROMPTS = {
    interview_coach:  'You are a professional interview coach. Give direct, actionable feedback. Reference specific behaviors (eye contact, pacing, filler words). Keep responses under 3 sentences. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
    language_teacher: 'You are a friendly language teacher. Simplify your vocabulary. If the student is struggling, rephrase or offer an easier alternative. Keep responses under 2 sentences. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
  };

  // Coaching guidance per weakness (Phase 1's ProfileConfig.build) — injected
  // into the system prompt for weakness-based custom profiles so real-time
  // advice targets the user's actual selected pain points.
  const WEAKNESS_COACHING_NOTES = {
    stuttering:        'they may stutter or need extra time to get words out — never rush them, and reassure them that pausing is fine',
    eye_contact:       'they tend to lose eye contact with the camera — gently encourage them to look back at the camera without repeating yourself',
    distraction:       'they are prone to losing focus — help redirect their attention kindly',
    speaking_too_fast: 'they tend to speak too quickly when nervous — encourage a slower, steadier pace',
    anxiety:           'they experience anxiety or stress during interviews — keep your tone calm and reassuring',
  };

  function setApiKey(key) { apiKey = key; }

  function systemPromptFor(profile) {
    const profileId = profile?.id || 'interview_coach';
    if (SYSTEM_PROMPTS[profileId]) return SYSTEM_PROMPTS[profileId];

    const notes = (profile?.weaknesses || []).map(w => WEAKNESS_COACHING_NOTES[w]).filter(Boolean);
    const tailored = notes.length ? ` Keep in mind: ${notes.join('; ')}.` : '';
    return `You are a warm, encouraging interview coach for a neurodivergent job seeker.${tailored} Keep responses under 2-3 sentences and avoid jargon. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.`;
  }

  async function generate(context) {
    const { profile, signals, transcript, flagType, message, requestType, questionText } = context;
    const systemPrompt = systemPromptFor(profile);
    const userMsg = requestType === 'help'
      ? `The candidate tapped "Help" while answering: "${questionText || ''}". Recent transcript (last 60s): "${(transcript || '').slice(-600)}". Give one brief, encouraging tip to help them answer this specific question well.`
      : `Flag triggered: ${flagType}. CES=${(signals.ces || 0).toFixed(0)}. Transcript: "${(transcript || '').slice(-200)}". Respond briefly and helpfully.`;

    if (!apiKey) {
      Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      return;
    }

    let settled = false;
    const fallback = setTimeout(() => {
      if (!settled) {
        settled = true;
        Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      }
    }, 3000);

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 150,
          stream: true,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });

      if (!resp.ok) {
        clearTimeout(fallback);
        if (!settled) { settled = true; Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true }); }
        return;
      }

      clearTimeout(fallback);
      settled = true;

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split('\n');
        buf = lines.pop(); // keep incomplete line for next chunk

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'content_block_delta' && evt.delta?.text) {
              Bus.emit('intervention:trigger', { action: 'claude_response', chunk: evt.delta.text, done: false });
            }
          } catch { /* malformed SSE — skip */ }
        }
      }

      Bus.emit('intervention:trigger', { action: 'claude_response', chunk: '', done: true });
    } catch (err) {
      console.error('[ClaudeClient] generate error:', err);
      if (!settled) {
        settled = true;
        clearTimeout(fallback);
        Bus.emit('intervention:trigger', { action: 'claude_response', message, done: true });
      }
    }
  }

  async function generateDebrief(sessionData) {
    if (!apiKey) return null;
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 400,
          system: 'You are a professional interview coach writing a session debrief. Be constructive, specific, and encouraging. Do not use markdown formatting (no #, no **, no bullet points) — write in plain sentences.',
          messages: [{
            role: 'user',
            content: `Write a professional debrief for this interview practice session.\n\nSession data:\n${JSON.stringify(sessionData, null, 2)}\n\nInclude: overall performance summary, 2 strengths, 2 areas to improve, and 2 actionable tips.`,
          }],
        }),
      });
      if (!resp.ok) return null;
      const json = await resp.json();
      return json.content?.[0]?.text || null;
    } catch (err) {
      console.error('[ClaudeClient] debrief error:', err);
      return null;
    }
  }

  return { setApiKey, generate, generateDebrief };
})();

window.ClaudeClient = ClaudeClient;

// =========================================================
// 5. INTERVIEW SCORECARD
// =========================================================
const InterviewScorecard = (() => {
  const FILLER_RE = /\b(um|uh|like|you know|basically|actually|literally)\b/gi;

  let totalFrames = 0;
  let framesWithGoodEyeContact = 0;
  let hpdValues = [];
  let fillerCount = 0;
  let wordCount = 0;
  let latestPvs = 0, latestSilr = 0, latestSr = 0;
  let scoreInterval = null;
  let signalUpdateHandler = null;
  let audioHandler = null;

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function reset() {
    totalFrames = 0;
    framesWithGoodEyeContact = 0;
    hpdValues = [];
    fillerCount = 0;
    wordCount = 0;
    latestPvs = 0; latestSilr = 0; latestSr = 0;
  }

  function getScores() {
    const eyeContact    = clamp(totalFrames > 0 ? (framesWithGoodEyeContact / totalFrames) * 100 : 0);
    const avgHpd        = hpdValues.length > 0 ? hpdValues.reduce((a, b) => a + b, 0) / hpdValues.length : 0;
    const headStability = clamp(100 - avgHpd);
    const vocalConfidence = clamp(100 - latestPvs - latestSilr * 0.5);
    const fillerPenalty   = wordCount > 0 ? (fillerCount / wordCount) * 100 : 0;
    const speechClarity   = clamp(100 - latestSr - fillerPenalty);
    const overall         = clamp(eyeContact * 0.25 + headStability * 0.20 + vocalConfidence * 0.25 + speechClarity * 0.30);

    let grade = 'F';
    if (overall >= 85) grade = 'A';
    else if (overall >= 70) grade = 'B';
    else if (overall >= 55) grade = 'C';
    else if (overall >= 40) grade = 'D';

    return { eyeContact, headStability, vocalConfidence, speechClarity, overall, grade };
  }

  function init() {
    reset();

    // Remove stale listeners before adding fresh ones
    if (signalUpdateHandler) Bus.off('signal:update', signalUpdateHandler);
    if (audioHandler) Bus.off('signal:audio', audioHandler);

    signalUpdateHandler = ({ osr, hpd }) => {
      totalFrames++;
      if ((osr || 0) < 30) framesWithGoodEyeContact++;
      if (hpd !== undefined) {
        hpdValues.push(hpd);
        if (hpdValues.length > 300) hpdValues.shift(); // keep ~10s @ 30fps
      }
    };

    audioHandler = ({ pvs, silr, sr, transcript }) => {
      latestPvs  = pvs  || 0;
      latestSilr = silr || 0;
      latestSr   = sr   || 0;
      if (transcript) {
        const matches = transcript.match(FILLER_RE);
        fillerCount = matches ? matches.length : 0;
        wordCount   = transcript.trim().split(/\s+/).filter(Boolean).length;
      }
    };

    Bus.on('signal:update', signalUpdateHandler);
    Bus.on('signal:audio',  audioHandler);

    if (scoreInterval) clearInterval(scoreInterval);
    scoreInterval = setInterval(() => {
      try { Bus.emit('scores:update', getScores()); } catch (e) { console.error('[InterviewScorecard]', e); }
    }, 2000);
  }

  Bus.on('profile:selected', ({ id }) => {
    if (id === 'interview_coach') init();
  });

  return { init, reset, getScores };
})();

window.InterviewScorecard = InterviewScorecard;

// =========================================================
// 6. SESSION MANAGER
// =========================================================
const SessionManager = (() => {
  let sessionStartTime = null;
  let lastSessionData  = null;

  function start() {
    sessionStartTime = Date.now();
    lastSessionData  = null;
  }

  async function endSession() {
    const duration = sessionStartTime ? Date.now() - sessionStartTime : 0;
    const mins     = Math.floor(duration / 60000);
    const secs     = Math.floor((duration % 60000) / 1000);

    const flagLog     = window.InterventionDispatcher ? InterventionDispatcher.getLog() : [];
    const scores      = window.InterviewScorecard    ? InterviewScorecard.getScores()  : null;
    const transcript  = window.AudioEngine           ? AudioEngine.getTranscript()     : '';
    const transcript_segments = window.AudioEngine && AudioEngine.getTranscriptSegments
      ? AudioEngine.getTranscriptSegments()
      : [];
    const ces         = window.AnomalyDetector       ? AnomalyDetector.getCES()        : 0;

    lastSessionData = {
      duration_ms:       duration,
      duration_readable: `${mins}m ${secs}s`,
      ces_final:         ces,
      total_flags:       flagLog.length,
      flag_log:          flagLog,
      scores,
      transcript:        transcript.slice(-2000),
      // Structured per-utterance transcript ({timestamp, speaker, text, wpm})
      // for the LLM report payload — richer than the flat string above.
      transcript_segments,
      exported_at:       new Date().toISOString(),
    };

    Bus.emit('session:end', { summary: lastSessionData });

    // Generate debrief for Interview Coach (non-blocking — fires after session:end)
    if (scores && window.ClaudeClient) {
      ClaudeClient.generateDebrief(lastSessionData).then(debrief => {
        if (debrief) {
          lastSessionData.debrief = debrief;
          Bus.emit('session:debrief', { text: debrief });
        }
      });
    }

    return lastSessionData;
  }

  function getSessionData() { return lastSessionData; }

  return { start, endSession, getSessionData };
})();

window.SessionManager = SessionManager;

// =========================================================
// 7. BRAIN MANAGER — top-level orchestrator
// =========================================================
window.BrainManager = {
  // Accepts either a legacy profile id string or an array of weakness ids
  // (e.g. ['stuttering', 'eye_contact']) built via ProfileConfig.build().
  init(profileIdOrWeaknesses) {
    const isWeaknessArray = Array.isArray(profileIdOrWeaknesses);
    const profile = isWeaknessArray
      ? ProfileConfig.build(profileIdOrWeaknesses)
      : ProfileConfig.getById(profileIdOrWeaknesses);
    if (!profile) { console.error('[BrainManager] Unknown profile:', profileIdOrWeaknesses); return; }

    const id = isWeaknessArray ? profile.id : profileIdOrWeaknesses;
    Bus.emit('profile:selected', { id, config: profile });
    AnomalyDetector.init(profile);
    InterventionDispatcher.init(profile);
    if (id === 'interview_coach') InterviewScorecard.init();
    SessionManager.start();
  },
  start()      { AnomalyDetector.start(); },
  stop()       { AnomalyDetector.stop();  },
  endSession() { return SessionManager.endSession(); },
};
