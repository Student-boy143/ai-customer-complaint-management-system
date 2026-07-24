"""Shared FastAPI dependencies for route handlers."""

from app.database.session import DbSession
from app.services.complaint_service import ComplaintService


def get_complaint_service(db: DbSession) -> ComplaintService:
    """Provide a ComplaintService bound to the current request session."""
    return ComplaintService(db)
