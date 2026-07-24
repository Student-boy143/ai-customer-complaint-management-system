"""Complaint CRUD API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response, status

from app.models.complaint import Complaint
from app.api.deps import get_complaint_service
from app.models.enums import ComplaintStatus
from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintListResponse,
    ComplaintResponse,
    ComplaintSummary,
    ComplaintUpdate,
)
from app.services.complaint_service import ComplaintService

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post(
    "",
    response_model=ComplaintResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a complaint",
)
def create_complaint(
    data: ComplaintCreate,
    service: Annotated[ComplaintService, Depends(get_complaint_service)],
) -> Complaint:
    return service.create(data)


@router.get(
    "",
    response_model=ComplaintListResponse,
    summary="List complaints",
)
def list_complaints(
    service: Annotated[ComplaintService, Depends(get_complaint_service)],
    skip: Annotated[int, Query(ge=0, description="Number of records to skip")] = 0,
    limit: Annotated[
        int, Query(ge=1, le=100, description="Maximum records to return")
    ] = 20,
    status_filter: Annotated[
        ComplaintStatus | None,
        Query(alias="status", description="Filter by complaint status"),
    ] = None,
) -> ComplaintListResponse:
    complaints, total = service.list_complaints(
        skip=skip, limit=limit, status=status_filter
    )
    return ComplaintListResponse(
        items=[ComplaintSummary.model_validate(c) for c in complaints],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{complaint_id}",
    response_model=ComplaintResponse,
    summary="Get a complaint by ID",
)
def get_complaint(
    complaint_id: int,
    service: Annotated[ComplaintService, Depends(get_complaint_service)],
) -> Complaint:
    return service.get_by_id(complaint_id)


@router.put(
    "/{complaint_id}",
    response_model=ComplaintResponse,
    summary="Update a complaint",
)
def update_complaint(
    complaint_id: int,
    data: ComplaintUpdate,
    service: Annotated[ComplaintService, Depends(get_complaint_service)],
) -> Complaint:
    return service.update(complaint_id, data)


@router.delete(
    "/{complaint_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a complaint",
)
def delete_complaint(
    complaint_id: int,
    service: Annotated[ComplaintService, Depends(get_complaint_service)],
) -> Response:
    service.delete(complaint_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
