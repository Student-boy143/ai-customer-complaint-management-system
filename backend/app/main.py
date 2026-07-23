"""
FastAPI application entry point.

Run with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.core.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan — startup and shutdown hooks."""
    # Startup: initialize DB connections, AI clients, etc. in future milestones
    yield
    # Shutdown: clean up resources


def create_app() -> FastAPI:
    """Application factory for creating the FastAPI instance."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI-Powered Customer Complaint Management System API",
        debug=settings.debug,
        lifespan=lifespan,
    )

    # CORS middleware — allow React frontend to communicate with the API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API routes under /api prefix
    app.include_router(api_router, prefix="/api")

    return app


app = create_app()
