"""
Complaint ORM model — central entity for customer complaint records.
"""

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Enum, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import ComplaintCategory, ComplaintPriority, ComplaintStatus

if TYPE_CHECKING:
    from app.models.ai_log import AILog
    from app.models.attachment import Attachment


class Complaint(Base, TimestampMixin):
    """
    A customer complaint submitted for tracking and AI-assisted resolution.

    Owns attachments and AI processing logs via one-to-many relationships.
    """

    __tablename__ = "complaints"
    __table_args__ = (
        Index("ix_complaints_status", "status"),
        Index("ix_complaints_created_at", "created_at"),
        Index("ix_complaints_customer_email", "customer_email"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # Customer-provided fields
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(255), nullable=False)

    # Workflow fields
    status: Mapped[ComplaintStatus] = mapped_column(
        Enum(ComplaintStatus, name="complaint_status"),
        default=ComplaintStatus.PENDING,
        nullable=False,
    )

    # AI-enriched fields (nullable until processed)
    category: Mapped[Optional[ComplaintCategory]] = mapped_column(
        Enum(ComplaintCategory, name="complaint_category"),
        nullable=True,
    )
    priority: Mapped[Optional[ComplaintPriority]] = mapped_column(
        Enum(ComplaintPriority, name="complaint_priority"),
        nullable=True,
    )
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_suggested_response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships — cascade deletes child records when a complaint is removed
    attachments: Mapped[List["Attachment"]] = relationship(
        back_populates="complaint",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    ai_logs: Mapped[List["AILog"]] = relationship(
        back_populates="complaint",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Complaint id={self.id} title={self.title!r} status={self.status}>"
