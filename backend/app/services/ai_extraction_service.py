"""Service for structured complaint extraction via Groq."""

from __future__ import annotations

import json
import time
from typing import Any

from sqlalchemy.orm import Session

from app.ai.groq_client import GroqClient
from app.core.exceptions import BadRequestError
from app.database import init_db
from app.models.ai_log import AILog
from app.models.enums import AIOperationType
from app.schemas.ai_extraction import ExtractionRequest, ExtractionResponse


class AIExtractionService:
    """Handle AI-based complaint extraction and logging."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def validate_request(self, data: ExtractionRequest) -> None:
        if not data.text or not data.text.strip():
            raise BadRequestError("Extracted text cannot be empty")

    def normalize_response(self, payload: dict[str, Any]) -> dict[str, str | None]:
        schema = ExtractionResponse.model_fields
        normalized: dict[str, str | None] = {}
        for key in schema:
            value = payload.get(key, "")
            if key == "email":
                if value is None:
                    normalized[key] = None
                else:
                    text_value = str(value).strip()
                    normalized[key] = text_value or None
            else:
                normalized[key] = str(value).strip() if value is not None else ""
        return normalized

    def extract(self, data: ExtractionRequest) -> ExtractionResponse:
        self.validate_request(data)
        started_at = time.perf_counter()
        try:
            client = GroqClient()
            raw_payload = client.extract_complaint_data(data.text)
            normalized = self.normalize_response(raw_payload)
            response_model = ExtractionResponse(**normalized)
        except Exception as exc:  # pragma: no cover - runtime error path
            response_model = ExtractionResponse()
            self._log_result(
                complaint_id=data.complaint_id,
                input_payload=data.text,
                output_payload=json.dumps({"error": str(exc)}),
                success=False,
                error_message=str(exc),
                latency_ms=int((time.perf_counter() - started_at) * 1000),
            )
            raise BadRequestError(f"AI extraction failed: {exc}") from exc

        self._log_result(
            complaint_id=data.complaint_id,
            input_payload=data.text,
            output_payload=response_model.model_dump_json(),
            success=True,
            latency_ms=int((time.perf_counter() - started_at) * 1000),
        )
        return response_model


    def _log_result(
        self,
        *,
        complaint_id: int,
        input_payload: str,
        output_payload: str,
        success: bool,
        error_message: str | None = None,
        latency_ms: int | None = None,
    ) -> None:
        try:
            init_db()
            log_entry = AILog(
                complaint_id=complaint_id,
                operation=AIOperationType.CATEGORIZATION,
                model_name="llama-3.3-70b-versatile",
                input_payload=input_payload,
                output_payload=output_payload,
                is_success=success,
                error_message=error_message,
                latency_ms=latency_ms,
            )
            self.db.add(log_entry)
            self.db.commit()
            self.db.refresh(log_entry)
        except Exception:
            self.db.rollback()
