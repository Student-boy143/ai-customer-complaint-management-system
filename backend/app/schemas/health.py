"""Health check response schema."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response model for the health check endpoint."""

    status: str = Field(..., example="healthy")
    app_name: str
    version: str
