# main.py

import os
import sys
from flask import Flask
from flask_cors import CORS

from src.routes.routes import main_routes

from src.utils.db_connection import MongoDB, QdrantDB
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
import sys
import os
from dotenv import load_dotenv
load_dotenv()


def create_app():
    app = Flask(__name__)

    CORS(app)
    app.register_blueprint(main_routes)

    MongoDB().healthCheck()
    QdrantDB().healthCheck()
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=3001)

# 🔒 OLD Alternate startup block (commented)
# from src import config, app
# if __name__ == "__main__":
#     app.run(host= config.HOST,
#             port= config.PORT,
#             debug= config.DEBUG)
