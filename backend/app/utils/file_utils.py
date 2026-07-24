"""Utility helpers for file upload validation and text extraction."""

from __future__ import annotations

import email
from pathlib import Path
from uuid import uuid4

from app.core.exceptions import BadRequestError

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".eml"}


def detect_file_type(filename: str) -> str:
    """Return a normalized file category for supported upload types."""
    extension = Path(filename).suffix.lower()
    if extension == ".pdf":
        return "pdf"
    if extension in {".png", ".jpg", ".jpeg"}:
        return "image"
    if extension == ".eml":
        return "email"
    raise BadRequestError(
        "Unsupported file type. Allowed types: PDF, PNG, JPG, JPEG, EML"
    )


def generate_storage_filename(filename: str) -> str:
    """Create a unique filename while preserving the original extension."""
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise BadRequestError(
            "Unsupported file type. Allowed types: PDF, PNG, JPG, JPEG, EML"
        )
    return f"{uuid4()}{extension}"


def extract_text(file_path: Path, file_type: str) -> str:
    """Extract text from a file based on its detected type."""
    if file_type == "pdf":
        return extract_text_from_pdf(file_path)
    if file_type == "image":
        return extract_text_from_image(file_path)
    if file_type == "email":
        return extract_text_from_eml(file_path.read_bytes())
    raise ValueError(f"Unsupported file type: {file_type}")


def extract_text_from_pdf(file_path: Path) -> str:
    """Extract text from a PDF document using pdfplumber."""
    try:
        import pdfplumber
    except ImportError as exc:  # pragma: no cover - depends on environment
        raise RuntimeError("pdfplumber is not installed") from exc

    try:
        with pdfplumber.open(file_path) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
        return "\n\n".join(page for page in pages if page).strip()
    except Exception as exc:  # pragma: no cover - depends on runtime deps
        raise RuntimeError(f"Failed to extract text from PDF: {exc}") from exc


def extract_text_from_image(file_path: Path) -> str:
    """Extract text from an image using Pillow and pytesseract."""
    try:
        from PIL import Image
        import pytesseract
    except ImportError as exc:  # pragma: no cover - depends on environment
        raise RuntimeError("pillow/pytesseract is not installed") from exc

    try:
        with Image.open(file_path) as image:
            text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as exc:  # pragma: no cover - depends on runtime deps
        raise RuntimeError(f"Failed to extract text from image: {exc}") from exc


def extract_text_from_eml(file_bytes: bytes) -> str:
    """Extract text content from an EML message."""
    try:
        message = email.message_from_bytes(file_bytes)
    except Exception as exc:  # pragma: no cover - depends on runtime deps
        raise RuntimeError(f"Failed to parse email: {exc}") from exc

    parts: list[str] = []
    if message.get("Subject"):
        parts.append(f"Subject: {message.get('Subject')}")
    if message.get("From"):
        parts.append(f"From: {message.get('From')}")

    body = ""
    if message.is_multipart():
        for part in message.walk():
            content_type = part.get_content_type()
            if content_type == "text/plain":
                payload = part.get_payload(decode=True)
                if payload:
                    body = payload.decode(errors="ignore")
                    break
    else:
        payload = message.get_payload(decode=True)
        if payload:
            body = payload.decode(errors="ignore")
        elif isinstance(message.get_payload(), str):
            body = message.get_payload()

    if body.strip():
        parts.append(body.strip())
    return "\n".join(parts).strip()
