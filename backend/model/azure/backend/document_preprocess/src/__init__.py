from flask import Flask
import os

from flask_cors import CORS
from src.config.config import Config
from dotenv import load_dotenv
from src.routes import main_routes
from flask import Flask
from .models.user_model import db

app = Flask(__name__)
CORS(app)

# db.create_all()
# loading environment variables
load_dotenv()

# calling the dev configuration
config = Config().dev_config

# making our application to use dev env
app.env = config.ENV

# Register the routes
app.register_blueprint(main_routes)

# Export 
__all__ = ['app', 'db']