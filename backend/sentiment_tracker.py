"""Validate and group AdaptIQ version 1 interview analytics inputs."""

import json


class SessionValidationError(ValueError):
    """An input could not be prepared for analysis."""


_BOUNDS = ("startMs", "endMs")
_ANSWER_FIELDS = ("sessionId", "questionId", "answerId", *_BOUNDS, "transcriptSegments")
_SEGMENT_FIELDS = (*_BOUNDS, "text")
_MEASUREMENTS = ("wordCount", "speakingMs", "pauseCount", "pauseMs", "fillerCount")


# checks that all fiels have data and there are no extra fields. if there is, returns an error w/ a path to file
def _check_fields(record, path, required, optional=()):
    if not isinstance(record, dict):
        raise SessionValidationError(f"{path}: expected an object")
    for field in required:
        if field not in record:
            raise SessionValidationError(f"{path}.{field}: required field is missing")
    for field in record:
        if field not in required and field not in optional:
            raise SessionValidationError(f"{path}: field outside the version 1 contract")

# checks that a value is a nonnegative integer
def _check_integer(value, path):
    if type(value) is not int or value < 0:
        raise SessionValidationError(f"{path}: expected a nonnegative integer")

#checks that a value is a nonempty string
def _check_text(value, path):
    if not isinstance(value, str) or not value.strip():
        raise SessionValidationError(f"{path}: expected a nonempty string")

# checks that startMs and endMs are nonnegative integers and that endMs is greater than startMs
def _check_bounds(record, path):
    for field in _BOUNDS:
        _check_integer(record[field], f"{path}.{field}")
    if record["endMs"] <= record["startMs"]:
        raise SessionValidationError(f"{path}.endMs: must be greater than startMs")

# validates transcript segments and speech windows, ensuring they are chronological and do not overlap. Also checks that speech windows have at least one measurement and that the measurements are valid.
def _prepare_intervals(answer, field, path, *, windows=False):
    intervals = answer[field]
    if not isinstance(intervals, list):
        raise SessionValidationError(f"{path}.{field}: expected an array")

    prepared = []
    earliest_start = answer["startMs"]
    for index, interval in enumerate(intervals):
        item_path = f"{path}.{field}[{index}]"
        if windows:
            _check_fields(interval, item_path, _BOUNDS, _MEASUREMENTS)
        else:
            _check_fields(interval, item_path, _SEGMENT_FIELDS, ("confidence",))
        _check_bounds(interval, item_path)
        start, end = interval["startMs"], interval["endMs"]
        if start < answer["startMs"] or end > answer["endMs"]:
            raise SessionValidationError(f"{item_path}: must lie within the answer")
        if start < earliest_start:
            rule = "must be chronological and nonoverlapping" if windows else "must be chronological"
            raise SessionValidationError(f"{item_path}.startMs: {rule}")

        if windows:
            measurements = interval.keys() & set(_MEASUREMENTS)
            if not measurements:
                raise SessionValidationError(f"{item_path}: at least one measurement is required")
            for name in _MEASUREMENTS:
                if name in measurements:
                    _check_integer(interval[name], f"{item_path}.{name}")
                    if name in ("speakingMs", "pauseMs") and interval[name] > end - start:
                        raise SessionValidationError(f"{item_path}.{name}: exceeds the window duration")
            earliest_start = end
        else:
            _check_text(interval["text"], f"{item_path}.text")
            if "confidence" in interval:
                confidence = interval["confidence"]
                if type(confidence) not in (int, float) or not 0 <= confidence <= 1:
                    raise SessionValidationError(f"{item_path}.confidence: expected a number from 0 to 1")
            earliest_start = start
        prepared.append(dict(interval))
    return prepared

# prepares a mapping from session ID to lists of validated answers, ensuring that answers are chronological and that there are no duplicate answer IDs within a session. Raises SessionValidationError for invalid input.
def prepare_sessions(data):
    """Return a mapping from session ID to chronological lists of validated answers.

    Accept a decoded answer object or list of answers, or a string containing that
    JSON. Use an empty list for no answers. Each answer retains its question ID,
    answer ID, and nested session-relative intervals. Invalid input raises
    SessionValidationError with the location and reason, without returning partial data.
    """
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError as error:
            raise SessionValidationError(
                f"Invalid JSON at line {error.lineno}, column {error.colno}: {error.msg}"
            ) from None

    if isinstance(data, dict):
        data = [data]
    if not isinstance(data, list):
        raise SessionValidationError("Expected an answer object or an array of answers")

    sessions = {}
    seen_answers = {}
    for index, answer in enumerate(data):
        path = f"answers[{index}]"
        _check_fields(answer, path, _ANSWER_FIELDS, ("speechWindows",))
        for field in ("sessionId", "questionId", "answerId"):
            _check_text(answer[field], f"{path}.{field}")
        _check_bounds(answer, path)

        session_id = answer["sessionId"]
        answers = sessions.setdefault(session_id, [])
        answer_ids = seen_answers.setdefault(session_id, set())
        if answer["answerId"] in answer_ids:
            raise SessionValidationError(f"{path}.answerId: duplicate answer ID within the session")
        if answers and answer["startMs"] < answers[-1]["startMs"]:
            raise SessionValidationError(f"{path}.startMs: answers must be chronological within the session")

        prepared = dict(answer)
        prepared["transcriptSegments"] = _prepare_intervals(answer, "transcriptSegments", path)
        if "speechWindows" in answer:
            prepared["speechWindows"] = _prepare_intervals(answer, "speechWindows", path, windows=True)
        answers.append(prepared)
        answer_ids.add(answer["answerId"])

    return sessions
