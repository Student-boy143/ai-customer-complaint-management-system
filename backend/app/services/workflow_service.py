"""Service layer for the LangGraph-style workflow."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.ai.workflow import ComplaintWorkflow
from app.schemas.workflow import WorkflowResponse


class WorkflowService:
    """Wrap the complaint workflow in a reusable service."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def run(self, *, text: str, complaint_id: int) -> WorkflowResponse:
        workflow = ComplaintWorkflow(self.db)
        result = workflow.run(text=text, complaint_id=complaint_id)
        return WorkflowResponse(**result)
