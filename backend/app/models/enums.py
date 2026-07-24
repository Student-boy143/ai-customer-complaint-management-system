"""
Shared enumeration types for ORM models and Pydantic schemas.
"""

import enum


class ComplaintStatus(str, enum.Enum):
    """Lifecycle status of a customer complaint."""

    PENDING = "pending"
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class ComplaintCategory(str, enum.Enum):
    """Complaint category — typically assigned by AI analysis."""

    BILLING = "billing"
    TECHNICAL = "technical"
    SERVICE = "service"
    PRODUCT = "product"
    OTHER = "other"


class ComplaintPriority(str, enum.Enum):
    """Complaint urgency — typically scored by AI analysis."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AIOperationType(str, enum.Enum):
    """Type of AI operation logged against a complaint."""

    CATEGORIZATION = "categorization"
    PRIORITY_ANALYSIS = "priority_analysis"
    SUMMARIZATION = "summarization"
    RESPONSE_GENERATION = "response_generation"
