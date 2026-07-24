"""API route aggregation."""

from fastapi import APIRouter

from app.api import ai, complaints, health, upload

api_router = APIRouter()

# Register route modules
api_router.include_router(health.router)
api_router.include_router(complaints.router)
api_router.include_router(upload.router)
api_router.include_router(ai.router)
