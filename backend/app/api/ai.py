"""AI extraction API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.deps import get_ai_extraction_service
from app.schemas.ai_extraction import ExtractionRequest, ExtractionResponse
from app.services.ai_extraction_service import AIExtractionService

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post(
    "/extract",
    response_model=ExtractionResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract structured complaint information from text",
)
def extract_complaint_data(
    data: ExtractionRequest,
    service: Annotated[AIExtractionService, Depends(get_ai_extraction_service)],
) -> ExtractionResponse:
    """Send extracted text to Groq and return structured complaint details."""
    return service.extract(data)
