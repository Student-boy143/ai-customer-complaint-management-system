"""
AILog ORM model — audit trail for AI operations performed on a complaint.
"""

from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import AIOperationType

if TYPE_CHECKING:
    from app.models.complaint import Complaint


class AILog(Base, TimestampMixin):
    """
    Records each AI invocation for traceability, debugging, and cost tracking.

    Stores raw input/output payloads as JSON strings for flexibility across
    different LangGraph workflow steps.
    """

    __tablename__ = "ai_logs"
    __table_args__ = (
        Index("ix_ai_logs_complaint_id", "complaint_id"),
        Index("ix_ai_logs_operation", "operation"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    complaint_id: Mapped[int] = mapped_column(
        ForeignKey("complaints.id", ondelete="CASCADE"),
        nullable=False,
    )

    operation: Mapped[AIOperationType] = mapped_column(
        Enum(AIOperationType, name="ai_operation_type"),
        nullable=False,
    )
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)

    # Serialized JSON payloads for audit and replay
    input_payload: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    output_payload: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Token usage and performance metrics
    prompt_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    completion_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    latency_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    is_success: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    complaint: Mapped["Complaint"] = relationship(back_populates="ai_logs")

    def __repr__(self) -> str:
        return (
            f"<AILog id={self.id} complaint_id={self.complaint_id} "
            f"operation={self.operation} success={self.is_success}>"
        )
