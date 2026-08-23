import unittest
import json
from ai_engine import clean_and_parse_json, FALLBACK_RESPONSE

class TestAIEngine(unittest.TestCase):

    def test_valid_raw_json(self):
        sample_json = json.dumps({
            "risk_score": 85,
            "risk_level": "High Risk",
            "warning_indicators": ["Upfront fee requested", "Urgency requirement"],
            "psychological_tactics": ["Artificial Urgency", "Financial Exploitation"],
            "summary": "This job offer demands payment for equipment prior to onboarding."
        })
        parsed = clean_and_parse_json(sample_json)
        self.assertEqual(parsed["risk_score"], 85)
        self.assertEqual(parsed["risk_level"], "High Risk")
        self.assertIn("Upfront fee requested", parsed["warning_indicators"])

    def test_markdown_wrapped_json(self):
        sample_markdown = """```json
{
    "risk_score": 45,
    "risk_level": "Suspicious",
    "warning_indicators": ["Unverified email domain"],
    "psychological_tactics": ["Authority Bias"],
    "summary": "Recruiter using a gmail address instead of company domain."
}
```"""
        parsed = clean_and_parse_json(sample_markdown)
        self.assertEqual(parsed["risk_score"], 45)
        self.assertEqual(parsed["risk_level"], "Suspicious")
        self.assertEqual(len(parsed["warning_indicators"]), 1)

    def test_malformed_json_fallback(self):
        malformed_input = "This is not JSON content at all {{{ risk_score: 90"
        parsed = clean_and_parse_json(malformed_input)
        self.assertEqual(parsed["risk_score"], 0)
        self.assertEqual(parsed["risk_level"], "Safe")
        self.assertIn("Unable to parse model JSON response", parsed["warning_indicators"])

    def test_none_or_empty_input(self):
        parsed_none = clean_and_parse_json(None)
        self.assertEqual(parsed_none, FALLBACK_RESPONSE)

        parsed_empty = clean_and_parse_json("")
        self.assertEqual(parsed_empty, FALLBACK_RESPONSE)

if __name__ == "__main__":
    unittest.main()
