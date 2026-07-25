"""Thin Groq client wrapper for structured complaint extraction."""

from __future__ import annotations

import json
import os
import re
from typing import Any

from groq import Groq

from app.core.config import get_settings


class GroqClient:
    """Interact with Groq's chat API for complaint analysis."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or get_settings().groq_api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not configured")
        self.client = Groq(api_key=self.api_key)

    def _parse_payload(self, content: str) -> dict[str, Any]:
        """Parse Groq output that may be plain JSON, markdown fenced JSON, or text."""
        cleaned = (content or "{}").strip()
        if not cleaned:
            return {}

        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned).strip()

        if cleaned.startswith("{") and cleaned.endswith("}"):
            try:
                payload = json.loads(cleaned)
            except json.JSONDecodeError as exc:
                raise ValueError("Malformed JSON response from Groq") from exc
            if isinstance(payload, dict):
                return payload
            raise ValueError("Groq response was not a JSON object")

        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                payload = json.loads(match.group(0))
            except json.JSONDecodeError as exc:
                raise ValueError("Malformed JSON response from Groq") from exc
            if isinstance(payload, dict):
                return payload
            raise ValueError("Groq response was not a JSON object")

        raise ValueError("Groq response was not valid JSON")

    def extract_complaint_data(self, text: str) -> dict[str, Any]:
        """Call Groq and return a parsed JSON payload."""
        prompt = (
            "Extract structured complaint information from the provided text. "
            "Return ONLY valid JSON matching this schema: "
            '{"customer_name":"","email":"","product_name":"","product_strength":"","batch_number":"",'
            '"manufacturing_date":"","expiry_date":"","quantity_affected":"","complaint_type":"",'
            '"complaint_date":"","description":"","priority":"","category":""}'
            " Do not include markdown, commentary, or extra fields."
            f"\n\nText:\n{text}"
        )

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=500,
        )
        content = response.choices[0].message.content or "{}"
        return self._parse_payload(content)
