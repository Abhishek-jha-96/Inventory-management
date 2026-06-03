from typing import Any

from fastapi import HTTPException, status


class AppError(HTTPException):
    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message},
        )


def not_found(resource: str, identifier: int | str) -> AppError:
    return AppError(
        status_code=status.HTTP_404_NOT_FOUND,
        code=f"{resource.upper()}_NOT_FOUND",
        message=f"{resource} '{identifier}' was not found",
    )


def conflict(code: str, message: str) -> AppError:
    return AppError(
        status_code=status.HTTP_409_CONFLICT,
        code=code,
        message=message,
    )


def bad_request(code: str, message: str, *, extra: dict[str, Any] | None = None) -> AppError:
    detail: dict[str, Any] = {"code": code, "message": message}
    if extra:
        detail["details"] = extra
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
