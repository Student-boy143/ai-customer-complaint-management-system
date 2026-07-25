"""Schemas for AI complaint extraction responses."""

from pydantic import BaseModel, ConfigDict, Field


class ExtractionRequest(BaseModel):
    """Request body expected by the AI extraction endpoint."""

    text: str = Field(..., min_length=1)
    complaint_id: int = Field(..., gt=0)


class ExtractionResponse(BaseModel):
    """Structured complaint extraction returned by the AI endpoint."""

    model_config = ConfigDict(extra="forbid")

    customer_name: str = ""
    email: str | None = None
    product_name: str = ""
    product_strength: str = ""
    batch_number: str = ""
    manufacturing_date: str = ""
    expiry_date: str = ""
    quantity_affected: str = ""
    complaint_type: str = ""
    complaint_date: str = ""
    description: str = ""
    priority: str = ""
    category: str = ""
