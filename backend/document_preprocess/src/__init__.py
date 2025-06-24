from flask import Flask
from flask_cors import CORS
from src.config.config import Config
from dotenv import load_dotenv
from src.routes import main_routes
# from .models.user_model import db

load_dotenv()  # ✅ Load .env before app is created

app = Flask(__name__)
CORS(app)

config = Config().dev_config
app.config.from_object(config)  # ✅ Apply config to Flask app

# db.init_app(app)
app.register_blueprint(main_routes)

# __all__ = ['app', 'db']
__all__ = ['app']
