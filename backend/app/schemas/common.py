"""Shared Pydantic schema utilities."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    """Base schema with ORM mode enabled for SQLAlchemy model serialization."""

    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseModel):
    """Read-only timestamp fields returned on persisted records."""

    created_at: datetime
    updated_at: datetime
