# main.py

from flask import Flask
from flask_cors import CORS
from src.controllers.chat_controller import chat_bp
from src.controllers.document_controller import doc_bp
from src.utils.db_status import log_mongo_status  # ✅ Updated for Qdrant
import sys
import os

# 🔁 Ensure `src` folder is in the path
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

def create_app():
    app = Flask(__name__)

    # ✅ Log DB status using Qdrant (Mongo version commented below)
    log_mongo_status()
    

    CORS(app)
    app.register_blueprint(chat_bp)
    app.register_blueprint(doc_bp)

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
