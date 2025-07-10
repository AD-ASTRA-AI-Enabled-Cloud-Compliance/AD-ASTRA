import os
from dotenv import load_dotenv

load_dotenv()

class DevConfig:
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = os.getenv("FLASK_DEBUG", "True") == "True"
    PORT = int(os.getenv("PORT", 3030))
    HOST = os.getenv("HOST", "0.0.0.0")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
