"""LangGraph-style workflow API route."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.deps import get_workflow_service
from app.schemas.workflow import WorkflowRequest, WorkflowResponse
from app.services.workflow_service import WorkflowService

router = APIRouter(prefix="/workflow", tags=["Workflow"])


@router.post(
    "/complaint",
    response_model=WorkflowResponse,
    status_code=status.HTTP_200_OK,
    summary="Run the complaint processing workflow",
)
def run_complaint_workflow(
    data: WorkflowRequest,
    service: Annotated[WorkflowService, Depends(get_workflow_service)],
) -> WorkflowResponse:
    """Run the LangGraph-style pipeline over complaint text and complaint id."""
    return service.run(text=data.text, complaint_id=data.complaint_id)
