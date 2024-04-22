import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SECRET_KEY = os.getenv("SECRET_KEY", "very_secrect")
load_dotenv(os.path.join(BASE_DIR, ".env"))


class Config:
    DOMAIN = os.getenv("DOMAIN", "http://localhost:8080")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    JWT_SECRET_KEY = SECRET_KEY

    API_TITLE = "DICOM Image Processing API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.2"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///" + os.path.join(BASE_DIR, "development.db")
    )

    if os.getenv("IN_DOCKER", "False") == "True":
        SQLALCHEMY_DATABASE_URI = os.getenv(
            "DATABASE_URL", "postgresql://db:postgres@postgres:5432/postgres"
        )
