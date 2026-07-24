"""Schemas for the LangGraph workflow response."""

from typing import Any

from pydantic import BaseModel, Field


class WorkflowRequest(BaseModel):
    """Request body for the complaint workflow endpoint."""

    text: str = Field(..., min_length=1)
    complaint_id: int = Field(..., gt=0)


class WorkflowResponse(BaseModel):
    """Response returned by the LangGraph workflow endpoint."""

    structured_data: dict[str, Any]
    summary: str
    priority: str
    validation_status: str
