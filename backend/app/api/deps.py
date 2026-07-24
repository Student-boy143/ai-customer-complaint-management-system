"""Shared FastAPI dependencies for route handlers."""

from app.database.session import DbSession
from app.services.ai_extraction_service import AIExtractionService
from app.services.complaint_service import ComplaintService
from app.services.upload_service import UploadService
from app.services.workflow_service import WorkflowService


def get_complaint_service(db: DbSession) -> ComplaintService:
    """Provide a ComplaintService bound to the current request session."""
    return ComplaintService(db)


def get_upload_service() -> UploadService:
    """Provide an UploadService instance for file handling."""
    return UploadService()


def get_ai_extraction_service(db: DbSession) -> AIExtractionService:
    """Provide an AIExtractionService bound to the current request session."""
    return AIExtractionService(db)


def get_workflow_service(db: DbSession) -> WorkflowService:
    """Provide a WorkflowService bound to the current request session."""
    return WorkflowService(db)
