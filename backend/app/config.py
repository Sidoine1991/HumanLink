from pydantic_settings import BaseSettings
from pydantic import Field
import os
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = Field(default="HumanLink API")
    debug: bool = Field(default=True)

    # Database - Supabase PostgreSQL (requis)
    database_url: str = Field(..., description="SQLAlchemy connection string vers Supabase PostgreSQL")
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # S'assurer que database_url est une chaîne UTF-8 valide
        if isinstance(self.database_url, bytes):
            try:
                self.database_url = self.database_url.decode('utf-8')
            except UnicodeDecodeError:
                self.database_url = self.database_url.decode('latin-1')
        
        # Vérifier que nous utilisons Supabase PostgreSQL, pas SQLite
        if self.database_url.startswith("sqlite"):
            raise ValueError(
                "❌ ERREUR: SQLite n'est pas autorisé. "
                "Ce projet utilise uniquement Supabase PostgreSQL. "
                "Veuillez configurer DATABASE_URL dans le fichier .env avec votre connexion Supabase."
            )
        
        if not self.database_url.startswith("postgresql"):
            raise ValueError(
                f"❌ ERREUR: DATABASE_URL doit pointer vers Supabase PostgreSQL. "
                f"URL actuelle: {self.database_url[:50]}..."
            )

    # Supabase (optional, used when deploying with Supabase Postgres)
    supabase_url: str | None = Field(default=None)
    supabase_anon_key: str | None = Field(default=None)
    supabase_service_role_key: str | None = Field(default=None)

    # Auth
    jwt_secret_key: str = Field(default="dev-secret-change")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60 * 24)

    # Matching radius in meters
    default_matching_radius_m: int = Field(default=1500)

    # OpenAI (optional)
    openai_api_key: str | None = Field(default=None)
    openai_emotion_model: str = Field(default="gpt-4o-mini")

    # Email configuration
    email_user: str | None = Field(default=None)
    email_pass: str | None = Field(default=None)
    email_host: str = Field(default="smtp.gmail.com")
    email_port: int = Field(default=587)
    verification_code_expire_minutes: int = Field(default=15)

    # API Keys
    serpapi_api_key: str | None = Field(default=None)

    # Figma
    figma_token: str | None = Field(default=None, description="Personal Access Token Figma (Bearer)")

    class Config:
        # Chercher le .env dans le répertoire backend/ (parent de app/)
        env_file = str(Path(__file__).parent.parent / ".env")


settings = Settings()


