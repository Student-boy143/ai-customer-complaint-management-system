"""Pydantic schemas for Attachment."""

from datetime import datetime
from typing import Optional

from pydantic import Field

from app.schemas.common import ORMModel


class AttachmentBase(ORMModel):
    """Shared attachment fields."""

    original_filename: str = Field(..., min_length=1, max_length=255)
    mime_type: Optional[str] = Field(None, max_length=127)
    file_size: Optional[int] = Field(None, ge=0)


class AttachmentCreate(AttachmentBase):
    """
    Schema for creating an attachment record.

    File path and stored filename are set by the upload service, not the client.
    """

    stored_filename: str = Field(..., min_length=1, max_length=255)
    file_path: str = Field(..., min_length=1, max_length=512)
    complaint_id: int = Field(..., gt=0)


class AttachmentResponse(AttachmentBase):
    """Attachment returned in API responses."""

    id: int
    complaint_id: int
    stored_filename: str
    file_path: str
    created_at: datetime
    updated_at: datetime
