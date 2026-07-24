"""
Application-level exceptions and FastAPI exception handlers.
"""


class AppError(Exception):
    """Base exception for predictable application errors."""

    def __init__(self, message: str, status_code: int) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppError):
    """Raised when a requested resource does not exist."""

    def __init__(self, resource: str, identifier: int | str) -> None:
        super().__init__(
            message=f"{resource} with id '{identifier}' not found",
            status_code=404,
        )
        self.resource = resource
        self.identifier = identifier


class BadRequestError(AppError):
    """Raised when the client sends an invalid or empty request."""

    def __init__(self, message: str) -> None:
        super().__init__(message=message, status_code=400)
