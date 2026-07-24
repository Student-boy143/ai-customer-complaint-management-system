"""Pydantic schemas for upload responses."""

from pydantic import BaseModel


class UploadResponse(BaseModel):
    """Response model returned after uploading and extracting text."""

    filename: str
    file_type: str
    text: str
