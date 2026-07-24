"""Pydantic schemas for Complaint."""

from datetime import datetime
from typing import List, Optional

from pydantic import EmailStr, Field

from app.models.enums import ComplaintCategory, ComplaintPriority, ComplaintStatus
from app.schemas.ai_log import AILogResponse
from app.schemas.attachment import AttachmentResponse
from app.schemas.common import ORMModel


class ComplaintBase(ORMModel):
    """Fields shared across complaint create/update/response schemas."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    customer_name: str = Field(..., min_length=1, max_length=150)
    customer_email: EmailStr


class ComplaintCreate(ComplaintBase):
    """Schema for submitting a new complaint."""

    pass


class ComplaintUpdate(ORMModel):
    """
    Partial update schema — all fields optional.

    Used by agents/admins to update status or apply AI-enriched fields.
    """

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    customer_name: Optional[str] = Field(None, min_length=1, max_length=150)
    customer_email: Optional[EmailStr] = None
    status: Optional[ComplaintStatus] = None
    category: Optional[ComplaintCategory] = None
    priority: Optional[ComplaintPriority] = None
    ai_summary: Optional[str] = None
    ai_suggested_response: Optional[str] = None


class ComplaintResponse(ComplaintBase):
    """Full complaint record including AI-enriched and relational data."""

    id: int
    status: ComplaintStatus
    category: Optional[ComplaintCategory] = None
    priority: Optional[ComplaintPriority] = None
    ai_summary: Optional[str] = None
    ai_suggested_response: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    attachments: List[AttachmentResponse] = []
    ai_logs: List[AILogResponse] = []


class ComplaintSummary(ORMModel):
    """
    Lightweight complaint representation for list views.

    Excludes nested relations and long text fields to keep list responses small.
    """

    id: int
    title: str
    customer_name: str
    customer_email: EmailStr
    status: ComplaintStatus
    category: Optional[ComplaintCategory] = None
    priority: Optional[ComplaintPriority] = None
    created_at: datetime
    updated_at: datetime


class ComplaintListResponse(ORMModel):
    """Paginated list of complaint summaries."""

    items: List[ComplaintSummary]
    total: int
    skip: int
    limit: int
