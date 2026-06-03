from functools import lru_cache
from pathlib import Path

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _discover_env_files() -> tuple[Path, ...] | None:
    """Load .env from ancestor dirs (backend/ or monorepo root). Skip missing paths."""
    found: list[Path] = []
    for directory in Path(__file__).resolve().parents:
        candidate = directory / ".env"
        if candidate.is_file():
            found.append(candidate)
        if (directory / "pyproject.toml").is_file():
            break
    return tuple(reversed(found)) if found else None


_env_files = _discover_env_files()
_settings_config: dict[str, object] = {"extra": "ignore"}
if _env_files is not None:
    _settings_config["env_file"] = _env_files
    _settings_config["env_file_encoding"] = "utf-8"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(**_settings_config)

    postgres_user: str = "ethara"
    postgres_password: str = "ethara"
    postgres_db: str = "ethara"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url_sync(self) -> str:
        """Sync driver URL for Alembic migrations."""
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
