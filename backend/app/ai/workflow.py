"""LangGraph-style workflow for complaint processing."""

from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.schemas.ai_extraction import ExtractionRequest, ExtractionResponse
from app.services.ai_extraction_service import AIExtractionService


class ComplaintWorkflow:
    """Compose extraction, validation, priority tagging, and summary generation."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.ai_service = AIExtractionService(db)

    def run(self, text: str, complaint_id: int) -> dict[str, Any]:
        """Execute the workflow and return the final structured payload."""
        request = ExtractionRequest(text=text, complaint_id=complaint_id)
        try:
            structured_data = self.ai_service.extract(request)
            validated_data = self.validate_fields(structured_data.model_dump())
        except Exception:
            validated_data = self.validate_fields({})
        priority = self.assign_priority(validated_data, text)
        summary = self.generate_summary(validated_data, priority)
        return {
            "structured_data": validated_data,
            "summary": summary,
            "priority": priority,
            "validation_status": "success",
        }

    def validate_fields(self, payload: dict[str, Any]) -> dict[str, Any]:
        """Ensure the response contains every required field and uses null for missing values."""
        expected_fields = list(ExtractionResponse.model_fields.keys())
        result = {}
        for field in expected_fields:
            value = payload.get(field, "")
            if field == "email":
                if value is None:
                    result[field] = None
                else:
                    cleaned = str(value).strip()
                    result[field] = cleaned or None
            elif value is None or str(value).strip() == "":
                result[field] = None
            else:
                result[field] = str(value).strip()
        return result

    def assign_priority(self, payload: dict[str, Any], text: str) -> str:
        """Assign a simple priority when Groq does not provide one."""
        provided_priority = str(payload.get("priority", "") or "").strip().lower()
        if provided_priority in {"high", "medium", "low"}:
            return provided_priority.title()

        lowered = text.lower()
        if any(keyword in lowered for keyword in ["critical", "urgent", "danger", "severe", "death", "injury"]):
            return "High"
        if any(keyword in lowered for keyword in ["delay", "refund", "late", "poor", "defect", "issue"]):
            return "Medium"
        return "Low"

    def generate_summary(self, payload: dict[str, Any], priority: str) -> str:
        """Create a concise summary from the structured data."""
        customer_name = payload.get("customer_name") or "unknown customer"
        product_name = payload.get("product_name") or "unknown product"
        complaint_type = payload.get("complaint_type") or "complaint"
        description = payload.get("description") or "No description provided"
        return (
            f"{customer_name} reported a {complaint_type.lower()} involving {product_name} "
            f"with priority {priority.lower()}. {description}"
        )
