import json
import re
from typing import Optional, Union, Dict, Any
from google import genai
from google.genai import types
from PIL import Image

FALLBACK_RESPONSE: Dict[str, Any] = {
    "risk_score": 0,
    "risk_level": "Safe",
    "warning_indicators": ["Unable to parse model JSON response"],
    "psychological_tactics": [],
    "summary": "Analysis completed with structural parsing fallback."
}

SYSTEM_INSTRUCTION = """You are an expert AI Fraud-Detection Engine specializing in identifying job, internship, and career offer scams.
Analyze the provided text and/or screenshot carefully for scam patterns and psychological manipulation tactics.

Key indicators to inspect:
1. Artificial urgency (e.g. "immediate start required", "offer expires in 1 hour").
2. Upfront fees or equipment purchase requirements (e.g. paying for training, checks to cash, home office setup fees).
3. Vague job descriptions or missing company identity / unverified contact domain.
4. Unconventional communication methods (Telegram, WhatsApp only, non-corporate email).
5. Unrealistic salary/compensation relative to required skills.

You MUST return your output strictly as raw JSON matching the following schema structure:
{
  "risk_score": <integer 0-100>,
  "risk_level": "<Safe or Suspicious or High Risk>",
  "warning_indicators": ["string"],
  "psychological_tactics": ["string"],
  "summary": "string"
}
Do not include any extra explanatory text or markdown wrapping outside of the JSON object.
"""

def clean_and_parse_json(raw_response_text: str) -> Dict[str, Any]:
    """
    Strips accidental markdown code-block wrappers (```json ... ```)
    and safely parses the string into a Python dictionary. Returns fallback dict on error.
    """
    if not raw_response_text or not isinstance(raw_response_text, str):
        return FALLBACK_RESPONSE.copy()

    cleaned = raw_response_text.strip()
    
    # Remove markdown code fences if present
    markdown_pattern = r"^```(?:json)?\s*([\s\S]*?)\s*```$"
    match = re.match(markdown_pattern, cleaned, re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()

    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            # Ensure required keys exist
            data.setdefault("risk_score", 0)
            data.setdefault("risk_level", "Safe")
            data.setdefault("warning_indicators", [])
            data.setdefault("psychological_tactics", [])
            data.setdefault("summary", "")
            return data
    except (json.JSONDecodeError, TypeError, ValueError):
        pass

    return FALLBACK_RESPONSE.copy()

def analyze_opportunity(
    api_key: str,
    text_input: Optional[str] = None,
    image_part: Optional[Union[Image.Image, bytes]] = None
) -> Dict[str, Any]:
    """
    Analyzes job/internship text and/or image screenshots using gemini-2.5-flash model.
    """
    if not api_key:
        fallback = FALLBACK_RESPONSE.copy()
        fallback["warning_indicators"] = ["Missing Google GenAI API Key"]
        fallback["summary"] = "API key was not provided for analysis."
        return fallback

    if not text_input and not image_part:
        fallback = FALLBACK_RESPONSE.copy()
        fallback["warning_indicators"] = ["No text or image provided for analysis"]
        fallback["summary"] = "Please provide job description text or a screenshot."
        return fallback

    try:
        client = genai.Client(api_key=api_key)
        contents = []

        if text_input:
            contents.append(text_input)

        if image_part:
            contents.append(image_part)

        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=config,
        )

        if response and response.text:
            return clean_and_parse_json(response.text)

    except Exception as e:
        fallback = FALLBACK_RESPONSE.copy()
        fallback["warning_indicators"] = [f"API Execution Error: {str(e)}"]
        fallback["summary"] = "An error occurred during AI model analysis."
        return fallback

    return FALLBACK_RESPONSE.copy()
