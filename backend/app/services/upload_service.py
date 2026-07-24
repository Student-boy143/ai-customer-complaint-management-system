"""Business logic for file uploads and text extraction."""

from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.exceptions import BadRequestError
from app.schemas.upload import UploadResponse
from app.utils.file_utils import detect_file_type, extract_text, generate_storage_filename


class UploadService:
    """Persist uploaded files and extract text content."""

    def __init__(self, upload_dir: Path | None = None) -> None:
        self.upload_dir = upload_dir or Path(__file__).resolve().parents[2] / "uploads"

    def upload_file(self, file: UploadFile) -> UploadResponse:
        """Save an uploaded file and extract text from it."""
        if file.filename is None or not file.filename.strip():
            raise BadRequestError("A filename is required")

        file_type = detect_file_type(file.filename)
        stored_filename = generate_storage_filename(file.filename)

        self.upload_dir.mkdir(parents=True, exist_ok=True)
        destination = self.upload_dir / stored_filename

        contents = file.file.read()
        with destination.open("wb") as handle:
            handle.write(contents)

        try:
            extracted_text = extract_text(destination, file_type)
        except Exception:
            extracted_text = ""

        return UploadResponse(
            filename=stored_filename,
            file_type=file_type,
            text=extracted_text,
        )
