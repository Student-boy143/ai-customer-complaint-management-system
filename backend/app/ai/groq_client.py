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

    def extract_complaint_data(self, text: str) -> dict[str, Any]:
        """Call Groq and return a parsed JSON payload."""
        prompt = (
            "Extract structured complaint information from the provided text. "
            "Return ONLY valid JSON matching this schema: "
            '{"customer_name":"","product_name":"","product_strength":"","batch_number":"",'
            '"manufacturing_date":"","expiry_date":"","quantity_affected":"","complaint_type":"",'
            '"complaint_date":"","description":"","priority":"","category":""}'
            " Do not include markdown, commentary, or extra fields."
            f"\n\nText:\n{text}"
        )

        response = self.client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=500,
        )
        content = response.choices[0].message.content or "{}"
        content = content.strip()
        if content.startswith("```"):
            content = re.sub(r"^```(?:json)?\s*", "", content)
            content = re.sub(r"\s*```$", "", content)
        try:
            payload = json.loads(content)
        except json.JSONDecodeError as exc:
            raise ValueError("Malformed JSON response from Groq") from exc
        if not isinstance(payload, dict):
            raise ValueError("Groq response was not a JSON object")
        return payload
