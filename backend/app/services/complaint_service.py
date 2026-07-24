"""
Business logic for complaint CRUD operations.

Route handlers should delegate to this service and remain free of DB logic.
"""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.exceptions import BadRequestError, NotFoundError
from app.models.complaint import Complaint
from app.models.enums import ComplaintStatus
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate


class ComplaintService:
    """Encapsulates all database operations for the Complaint model."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, data: ComplaintCreate) -> Complaint:
        """Persist a new complaint with default PENDING status."""
        complaint = Complaint(
            title=data.title,
            description=data.description,
            customer_name=data.customer_name,
            customer_email=str(data.customer_email),
        )
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        return complaint

    def get_by_id(self, complaint_id: int) -> Complaint:
        """Return a complaint by primary key or raise NotFoundError."""
        complaint = self.db.get(Complaint, complaint_id)
        if complaint is None:
            raise NotFoundError("Complaint", complaint_id)
        return complaint

    def list_complaints(
        self,
        *,
        skip: int = 0,
        limit: int = 20,
        status: ComplaintStatus | None = None,
    ) -> tuple[list[Complaint], int]:
        """
        Return a paginated list of complaints and the total matching count.

        Results are ordered newest-first by created_at.
        """
        query = select(Complaint)
        count_query = select(func.count()).select_from(Complaint)

        if status is not None:
            query = query.where(Complaint.status == status)
            count_query = count_query.where(Complaint.status == status)

        total = self.db.scalar(count_query) or 0
        complaints = list(
            self.db.scalars(
                query.order_by(Complaint.created_at.desc()).offset(skip).limit(limit)
            ).all()
        )
        return complaints, total

    def update(self, complaint_id: int, data: ComplaintUpdate) -> Complaint:
        """Apply a partial update to an existing complaint."""
        complaint = self.get_by_id(complaint_id)
        update_data = data.model_dump(exclude_unset=True)

        if not update_data:
            raise BadRequestError("At least one field must be provided for update")

        # EmailStr serializes to str for ORM assignment
        if "customer_email" in update_data and update_data["customer_email"] is not None:
            update_data["customer_email"] = str(update_data["customer_email"])

        for field, value in update_data.items():
            setattr(complaint, field, value)

        self.db.commit()
        self.db.refresh(complaint)
        return complaint

    def delete(self, complaint_id: int) -> None:
        """Permanently remove a complaint and its related records."""
        complaint = self.get_by_id(complaint_id)
        self.db.delete(complaint)
        self.db.commit()
