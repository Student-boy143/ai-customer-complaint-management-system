"""Pydantic schemas for AILog."""

from datetime import datetime
from typing import Optional

from pydantic import Field

from app.models.enums import AIOperationType
from app.schemas.common import ORMModel


class AILogBase(ORMModel):
    """Shared AI log fields."""

    operation: AIOperationType
    model_name: str = Field(..., min_length=1, max_length=100)
    input_payload: Optional[str] = None
    output_payload: Optional[str] = None
    prompt_tokens: Optional[int] = Field(None, ge=0)
    completion_tokens: Optional[int] = Field(None, ge=0)
    latency_ms: Optional[int] = Field(None, ge=0)
    is_success: bool = True
    error_message: Optional[str] = None


class AILogCreate(AILogBase):
    """Schema for persisting a new AI operation log entry."""

    complaint_id: int = Field(..., gt=0)


class AILogResponse(AILogBase):
    """AI log entry returned in API responses."""

    id: int
    complaint_id: int
    created_at: datetime
    updated_at: datetime
