import unittest

from backend.sentiment_tracker import analyze_answer_moments


def answer(answer_id, start, end, *segments):
    return {
        "sessionId": "session",
        "questionId": f"question-{answer_id}",
        "answerId": answer_id,
        "startMs": start,
        "endMs": end,
        "transcriptSegments": [
            {"startMs": start, "endMs": end, "text": text}
            for start, end, text in segments
        ],
    }


class AnswerMomentsTest(unittest.TestCase):
    def test_only_bracketed_gaps_count_and_overlapping_speech_extends_the_bound(self):
        answers = [
            answer("1", 0, 22000, (4000, 8000, "First."),
                   (5000, 6000, "More."), (11000, 12000, "Last.")),
            answer("2", 30000, 42000, (36000, 37000, "Another answer.")),
            answer("3", 45000, 59000),
        ]
        summary = analyze_answer_moments(answers)["session"]
        self.assertEqual(summary["pauseTimingByAnswer"], {
            "1": "available", "2": "unavailable", "3": "unavailable",
        })
        self.assertEqual(len(summary["findings"]), 1)
        finding = summary["findings"][0]
        self.assertEqual(
            (finding["answerId"], finding["startMs"], finding["endMs"], finding["kind"]),
            ("1", 8000, 11000, "pause"),
        )
        self.assertTrue(finding["reason"])
        self.assertEqual(
            analyze_answer_moments(answers, pause_threshold_ms=3001)["session"]["findings"],
            [],
        )

    def test_explicit_restart_cues_are_possible_restarts_at_segment_time(self):
        sample = answer(
            "1", 0, 5000,
            (100, 1000, "My coach said let me start again."),
            (1200, 3000, "Actually, LET ME START AGAIN. I led a team."),
            (3400, 4000, "I'll start over."),
        )
        findings = analyze_answer_moments(sample)["session"]["findings"]
        self.assertEqual(
            [(item["kind"], item["answerId"], item["startMs"]) for item in findings],
            [("possible_restart", "1", 1200), ("possible_restart", "1", 3400)],
        )
        self.assertTrue(all(item["reason"] for item in findings))
