/* Browser-local pace analysis. Recognition events supply bounds and word counts. */
function createSpeakingPace({
  windowMs = 15000, threshold = 0.25, minWindows = 3, minConfidence = 0.6,
  now = () => performance.now(),
} = {}) {
  if (!Number.isSafeInteger(windowMs) || windowMs <= 0 ||
      !Number.isFinite(threshold) || threshold <= 0 ||
      !Number.isSafeInteger(minWindows) || minWindows < 2 ||
      !Number.isFinite(minConfidence) || minConfidence < 0 || minConfidence > 1) {
    throw new RangeError('Invalid speaking pace settings');
  }

  let sessionId, origin, answer, episode, observations, attempt;
  let speaking = false;
  const offset = () => Math.max(0, Math.round(now() - origin));

  function saveEpisode(endMs) {
    if (!episode) return;
    answer.episodes.push({
      ...episode,
      endMs: episode.endMs ?? endMs,
      usable: episode.endMs != null && episode.words > 0 && episode.usable,
    });
    episode = null;
  }

  function closeAnswer(endMs) {
    if (!answer) return;
    saveEpisode(endMs);
    if (!answer.invalid) {
      const windows = new Map();
      for (const segment of answer.episodes) {
        const first = Math.floor((segment.startMs - answer.startMs) / windowMs);
        const last = Math.max(first, Math.ceil((segment.endMs - answer.startMs) / windowMs) - 1);
        for (let index = first; index <= last; index++) {
          if (!segment.usable || first !== last) windows.set(index, null);
          else if (windows.get(index) !== null) {
            windows.set(index, (windows.get(index) ?? 0) + segment.words);
          }
        }
      }
      for (const [index, words] of windows) {
        const startMs = answer.startMs + index * windowMs;
        if (words === null || startMs + windowMs > endMs) continue;
        observations.push({
          questionId: answer.questionId, answerId: answer.answerId,
          startMs, endMs: startMs + windowMs, kind: 'pace',
          wpm: words * 60000 / windowMs,
        });
      }
    }
    answer = null;
  }

  function next(questionId, unavailable = false) {
    if (!observations) return;
    if (answer?.questionId === String(questionId)) return;
    const startMs = offset();
    const pending = episode && !episode.words;
    closeAnswer(startMs);
    answer = {
      questionId: String(questionId), answerId: String(++attempt), startMs,
      episodes: [], invalid: unavailable || speaking || Boolean(pending),
    };
  }

  function interrupt() {
    if (answer) answer.invalid = true;
    episode = null;
    speaking = false;
  }

  return {
    start(id, questionId, unavailable) {
      origin = now();
      sessionId = id;
      observations = [];
      attempt = 0;
      answer = episode = null;
      next(questionId, unavailable);
    },
    next,
    speechStart() {
      speaking = true;
      if (!answer) return;
      // An unresolved preceding episode makes subsequent final results ambiguous.
      const usable = !episode || (episode.endMs != null && episode.words > 0);
      if (!usable) answer.invalid = true;
      saveEpisode(offset());
      episode = { startMs: offset(), endMs: null, words: 0, usable };
    },
    speechEnd() {
      speaking = false;
      if (episode && episode.endMs === null) {
        episode.endMs = Math.max(episode.startMs + 1, offset());
      }
    },
    finalResult(text, confidence) {
      if (!episode) {
        if (answer) answer.invalid = true;
        return;
      }
      episode.words += text.split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
      if (Number.isFinite(confidence) && confidence < minConfidence) episode.usable = false;
    },
    recognitionEnded() {
      if (speaking) interrupt();
      else if (answer) saveEpisode(offset());
    },
    interrupt,
    finish() {
      if (!observations) return null;
      closeAnswer(offset());
      const ordered = observations.map(window => window.wpm).sort((a, b) => a - b);
      const middle = Math.floor(ordered.length / 2);
      const baselineWpm = ordered.length % 2 ? ordered[middle] :
        (ordered[middle - 1] + ordered[middle]) / 2;
      const reliable = ordered.length >= minWindows && baselineWpm > 0;
      const findings = reliable ? observations
        .filter(window => Math.abs(window.wpm - baselineWpm) / baselineWpm >= threshold)
        .sort((a, b) => a.startMs - b.startMs)
        .map(window => ({ ...window, baselineWpm })) : [];
      observations = null;
      return { version: 1, sessionId, status: reliable ? 'ok' : 'not enough data', findings };
    },
    clear() {
      answer = episode = observations = null;
      speaking = false;
    },
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = createSpeakingPace;
