"""API route aggregation."""

from fastapi import APIRouter

from app.api import health

api_router = APIRouter()

# Register route modules
api_router.include_router(health.router)
