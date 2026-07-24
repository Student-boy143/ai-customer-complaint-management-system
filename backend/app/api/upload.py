"""File upload API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, status

from app.api.deps import get_upload_service
from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post(
    "",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a file and extract text",
)
async def upload_file(
    file: Annotated[UploadFile, File(...)],
    service: Annotated[UploadService, Depends(get_upload_service)],
) -> UploadResponse:
    """Persist an uploaded document and return extracted text."""
    return service.upload_file(file)
