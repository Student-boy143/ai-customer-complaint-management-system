"""
Attachment ORM model — files linked to a complaint (screenshots, documents, etc.).
"""

from typing import TYPE_CHECKING, Optional

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.complaint import Complaint


class Attachment(Base, TimestampMixin):
    """
    A file uploaded alongside a complaint.

    Stores metadata only; actual files live on disk under the uploads directory.
    """

    __tablename__ = "attachments"
    __table_args__ = (Index("ix_attachments_complaint_id", "complaint_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    complaint_id: Mapped[int] = mapped_column(
        ForeignKey("complaints.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Stored filename (UUID-based) vs. original upload name shown to users
    stored_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    mime_type: Mapped[Optional[str]] = mapped_column(String(127), nullable=True)
    file_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    complaint: Mapped["Complaint"] = relationship(back_populates="attachments")

    def __repr__(self) -> str:
        return f"<Attachment id={self.id} complaint_id={self.complaint_id} file={self.original_filename!r}>"
