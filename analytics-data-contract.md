# AdaptIQ interview analytics data contract

Version 1 is proposed for team review. this is based off of research on personal speech pace and local processing.

## Input

Pass one JSON object per completed answer from the interview controller to the browser analytics module. Use the same shape whether or not transcription or speech measurements are available.

| Field | Required | Type and meaning |
| --- | --- | --- |
| `sessionId` | Yes | string identifying the interview session. |
| `questionId` | Yes | string identifying the prompt occurrence within the session. |
| `answerId` | Yes |  string identifying the answer attempt within the session. Each retake gets a new ID. |
| `startMs`, `endMs` | Yes | Answer start and end in session-relative milliseconds. |
| `transcriptSegments` | Yes | Array of finalized candidate transcript segments in chronological order. Use `[]` if unavailable. |
| `transcriptSegments[].startMs`, `endMs` | Yes per segment | Segment bounds on the session timeline. |
| `transcriptSegments[].text` | Yes per segment | Nonempty transcript text for that segment. |
| `transcriptSegments[].confidence` | No | Recognizer-reported confidence from 0 to 1, if available and meaningful. |
| `speechWindows` | No | Chronologically ordered, nonoverlapping measurement windows within the answer. |
| `speechWindows[].startMs`, `endMs` | Yes per window | Measurement bounds on the session timeline. |
| `speechWindows[].wordCount` | No | Nonnegative integer count of candidate words in the window. |
| `speechWindows[].speakingMs` | No | Total detected candidate speech duration within the window, in milliseconds. |
| `speechWindows[].pauseCount`, `pauseMs` | No | Detected within-answer pause count and total pause duration, using the producer's agreed pause definition. |
| `speechWindows[].fillerCount` | No | Nonnegative integer count of detected filler events in the window. |

The interview controller establishes `0` when the session starts and supplies a shared monotonic clock to producers. All offsets are nonnegative integers. Intervals are start-inclusive and end-exclusive with `startMs < endMs`. Segment and window bounds must lie within the answer. Durations cannot exceed their window. Omit unavailable measurements and use zero for a measured zero. Each supplied window must carry at least one measurement. Reject unsupported versions and fields outside this contract, including media bytes, recordings, blobs, encoded media, media URLs, and storage references.

```json
{
  "sessionId": "sess_8c31",
  "questionId": "q_02",
  "answerId": "a_02_01",
  "startMs": 42000,
  "endMs": 46000,
  "transcriptSegments": [
    {
      "startMs": 42500,
      "endMs": 45500,
      "text": "I helped the team finish the project."
    }
  ],
  "speechWindows": [
    {
      "startMs": 42000,
      "endMs": 46000,
      "wordCount": 7,
      "speakingMs": 3000
    }
  ]
}
```

## Processing and results

Compute feedback in the candidate's browser. Use approximately 15-second windows anchored at the answer start and calculate pace as `wordCount * 60000 / (endMs - startMs)`. This includes pauses within the window. Keep the existing speaking-time WPM metric distinct. Suppress pace findings when there are too few usable windows or the transcript is unreliable. PY&DS and Perception still need to agree on eligibility and confidence rules, including how to handle short final windows. Use a personal median when enough eligible observations exist. Describe measured speech pace as coaching feedback.

Return a versioned summary to the frontend with `sessionId`, and a required `findings` array that can be empty. Each finding carries `questionId`, `answerId`, `startMs`, `endMs`, and `kind`. A `pace` finding also carries numeric `wpm` and may carry numeric `baselineWpm`. Finding offsets use the same clock as inputs so the UI can place feedback on the interview timeline. Optional self-reported stress is outside this version of the analytics input and result.

The Python implementation, `backend.sentiment_tracker.analyze_pace`, accepts the same data as `prepare_sessions` and returns summaries keyed by session ID. Its provisional defaults are 15-second full windows, a 25% relative deviation from the median within the student's session, three usable windows, and a minimum confidence of 0.6 when supplied. Each default can be configured. A measured word count can span multiple adjacent intervals that cover the entire window. Otherwise, the implementation counts words from nonoverlapping transcript segments wholly within the window. An empty transcript or a low-confidence segment overlapping the window makes the window ineligible. A summary has status `not enough data` when too few windows qualify or the median is zero, and `ok` when a comparison was made. Pace findings describe measured changes for coaching.

The interview page computes and shows this feedback in the browser. Set `window.AdaptIQPaceConfig` in `config.js` to override `windowMs`, `threshold`, `minWindows`, or `minConfidence`. The browser implementation uses the existing recognizer's speech start, speech end, and final transcript events. It skips windows with missing, uncertain, or boundary-crossing speech timing. It retains only word counts and timing during the current answer, then only per-window pace observations until the review. The browser's existing speech recognition service provides the transcript. The pace calculation and its findings stay in the tab.

`backend.sentiment_tracker.analyze_answer_moments` accepts the same inputs as `prepare_sessions` and returns version 1 summaries keyed by session ID. Its `pause_threshold_ms` defaults to 3000 ms. It flags gaps at or above that threshold between timed transcript segments from the same answer and accounts for overlapping segments. Leading and trailing gaps and time between answers are excluded. Each answer's `pauseTimingByAnswer` entry is `unavailable` when fewer than two timed segments are supplied. Producers should supply `[]` when segment timing is unavailable. Aggregate speech windows do not locate individual pauses.

The provisional restart rule matches explicit start-over phrases at the start of a segment or sentence, such as “Let me start again,” “Let me restart,” and “I'll start over,” with an optional “actually” or “sorry” lead-in. Each match is a `possible_restart` finding timestamped to its containing segment. Both `pause` and `possible_restart` findings include a `reason` and use the shared finding IDs and time bounds.

The browser applies the same cue rule and uses completed speech-recognition episodes as timing evidence. A recognition interruption or question change breaks continuity for pause detection. The interview review shows the speech feedback when the candidate ends the session. Set `window.AdaptIQPaceConfig.pauseThresholdMs` in `config.js` to change the browser's default of 3000 ms.

## Access and deletion

- Capture and feature extraction happen upstream on the candidate's device. Release raw audio buffers and video frames after feature extraction and stop capture and clear remaining buffers at session end, cancellation, or error. The analytics module accepts transcript text and numeric measurements only.
- Keep analytics inputs in tab memory and restrict access to the local interview and analytics code. Release each answer's transcript and measurement windows after processing. Clear remaining inputs and interim state on session end, cancellation, error, or tab close. Keep only the derived feedback in memory while the candidate reviews it, then clear it when the review closes or the tab exits. Exclude inputs from logs, telemetry, browser storage, and network requests.
- History is off by default. If the signed-in candidate enables history and approves a summary, persist only the result fields above under that candidate's account. Enforce owner-only access in the database rules before enabling history. Keep an approved summary until the candidate deletes it or their account. Recruiters, teammates, and other users have no application access. Saved summaries contain no transcript, raw measurements, audio, or video.

