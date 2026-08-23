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
Analyze the provided text and/or screenshot carefully for scam patterns and psychological manipulation tactics (such as artificial urgency, upfront fees/payments, vague job descriptions, unverified contact domains, or WhatsApp/Telegram-only communications).

You MUST return your output strictly as raw JSON matching the following schema structure:
{
  "risk_score": <integer 0-100>,
  "risk_level": "<Safe or Suspicious or High Risk>",
  "warning_indicators": ["string"],
  "psychological_tactics": ["string"],
  "summary": "string"
}
Do NOT include any extra text, markdown code blocks (such as ```json), or explanatory wrapping outside of the JSON object.
"""

def prepare_image_part(uploaded_file: Any, mime_type: str = "image/png") -> Any:
    """
    Utility helper for frontend/backend integration to convert Streamlit UploadedFile
    objects or raw bytes into the google.genai types.Part format required by the Gemini SDK.

    Args:
        uploaded_file: A Streamlit UploadedFile object, bytes, or PIL Image.
        mime_type (str): Fallback MIME type if not detected (default: "image/png").

    Returns:
        types.Part or PIL.Image.Image: Formatted input ready for Gemini API contents.
    """
    if uploaded_file is None:
        return None

    if isinstance(uploaded_file, types.Part):
        return uploaded_file

    # Streamlit UploadedFile object or file-like object with getvalue() and type attributes
    if hasattr(uploaded_file, "getvalue"):
        bytes_data = uploaded_file.getvalue()
        file_mime = getattr(uploaded_file, "type", None) or mime_type
        return types.Part.from_bytes(data=bytes_data, mime_type=file_mime)

    # Raw bytes input
    if isinstance(uploaded_file, bytes):
        return types.Part.from_bytes(data=uploaded_file, mime_type=mime_type)

    # PIL Image or other object passed directly
    return uploaded_file

def clean_and_parse_json(raw_response_text: str) -> Dict[str, Any]:
    """
    Strips accidental markdown code-block wrappers (```json ... ```)
    and safely parses the string into a Python dictionary.
    Returns a safe fallback dictionary on any parsing failure.
    """
    if not raw_response_text or not isinstance(raw_response_text, str):
        return FALLBACK_RESPONSE.copy()

    cleaned = raw_response_text.strip()
    
    # Remove markdown code fences if present
    markdown_pattern = r"^```(?:json)?\s*([\s\S]*?)\s*```$"
    match = re.match(markdown_pattern, cleaned, re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()

    # Attempt direct JSON parsing
    try:
        data = json.loads(cleaned)
        if isinstance(data, dict):
            data.setdefault("risk_score", 0)
            data.setdefault("risk_level", "Safe")
            data.setdefault("warning_indicators", [])
            data.setdefault("psychological_tactics", [])
            data.setdefault("summary", "")
            return data
    except (json.JSONDecodeError, TypeError, ValueError):
        pass

    # Secondary extraction regex: find outermost '{ ... }'
    try:
        json_match = re.search(r"\{[\s\S]*\}", cleaned)
        if json_match:
            data = json.loads(json_match.group(0))
            if isinstance(data, dict):
                data.setdefault("risk_score", 0)
                data.setdefault("risk_level", "Safe")
                data.setdefault("warning_indicators", [])
                data.setdefault("psychological_tactics", [])
                data.setdefault("summary", "")
                return data
    except Exception:
        pass

    return FALLBACK_RESPONSE.copy()

def analyze_opportunity(
    api_key: str,
    text_input: Optional[str] = None,
    image_part: Optional[Any] = None
) -> Dict[str, Any]:
    """
    Analyzes job/internship text and/or image screenshots using the gemini-2.5-flash model.
    Handles network errors, empty inputs, and structural fallbacks to ensure live app stability.
    """
    if not api_key:
        fallback = FALLBACK_RESPONSE.copy()
        fallback["warning_indicators"] = ["Missing Google GenAI API Key"]
        fallback["summary"] = "API key was not provided for analysis."
        return fallback

    if not text_input and image_part is None:
        fallback = FALLBACK_RESPONSE.copy()
        fallback["warning_indicators"] = ["No text or image provided for analysis"]
        fallback["summary"] = "Please provide job description text or a screenshot."
        return fallback

    try:
        client = genai.Client(api_key=api_key)
        contents = []

        if text_input:
            contents.append(text_input)

        if image_part is not None:
            formatted_part = prepare_image_part(image_part)
            if formatted_part is not None:
                contents.append(formatted_part)

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
