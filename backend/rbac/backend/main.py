# ✅ Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
import os


# ✅ Initialize Flask app
app = Flask(__name__)

# More permissive CORS configuration for development
CORS(app, 
     resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])


# ✅ Register Auth Blueprint from rbac module
from src.routes.auth_routes import auth_routes
app.register_blueprint(auth_routes, url_prefix="/api/auth")

# ✅ Optional: Register other routes (e.g., document processing)
# from document_preprocess.src.routes.routes import main_routes
# app.register_blueprint(main_routes)

# ✅ Root health check route
@app.route("/")
def health_check():
    return {
        "status": "ok",
        "message": "Skylock backend is live"
    }

# ✅ Run the app
if __name__ == "__main__":
    port = int(os.getenv("PORT", 3010))
    app.run(host="0.0.0.0", port=port, debug=True)
