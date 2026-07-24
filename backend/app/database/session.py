"""
Database engine, session factory, and FastAPI dependency helpers.
"""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.database.base import Base

settings = get_settings()

# MySQL connections can go stale; pool_pre_ping validates connections before use.
# pool_recycle avoids "MySQL server has gone away" errors on long-lived processes.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=settings.debug,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    Yield a database session and ensure it is closed after the request.

    Intended for use as a FastAPI dependency in future API routes:
        db: Annotated[Session, Depends(get_db)]
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Type alias for cleaner dependency injection in route handlers (future use).
DbSession = Annotated[Session, Depends(get_db)]


def init_db() -> None:
    """
    Create all tables defined by ORM models.

    For development and bootstrapping only — use Alembic migrations in production.
    Import models here so they register with Base.metadata before create_all runs.
    """
    from app.models import AILog, Attachment, Complaint  # noqa: F401

    Base.metadata.create_all(bind=engine)
