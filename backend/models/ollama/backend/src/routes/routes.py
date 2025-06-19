from uuid import uuid4
from flask import Blueprint, jsonify, render_template, request
from flask_cors import CORS
from flask import Blueprint, request, jsonify, send_from_directory
from ..services.websocket.ws import WebsocketService
from src.services.extract_service import ExtractService
import os

main_routes = Blueprint('main_routes', __name__)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "../uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "../cloud_outputs")

CORS(main_routes,
     resources={r"/*": {
         "origins": ["*"],
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "x-xsrf-token"],
         "supports_credentials": True
     }})


@main_routes.route('/')
def health_check():
    return {
        "data": {
            "status": "ok",
            "message": "Server is running",
            "data": "Welcome to the Model API"
        }
    }


# GET /uploads → list uploaded PDF files + JSON info
@main_routes.route("/uploads", methods=["GET"], endpoint="list_uploads")
def list_uploads():
    try:
        files = [
            {
                "name": f,
                "pdf_url": f"/uploads/{f}",
                "json_url": f"/cloud_outputs/{f.replace('.pdf', '.json')}",
                "json_exists": os.path.exists(os.path.join(OUTPUT_FOLDER, f.replace('.pdf', '.json')))
            }
            for f in os.listdir(UPLOAD_FOLDER)
            if f.endswith(".pdf")
        ]
        return jsonify(files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# GET /documents → list JSON rule documents
@main_routes.route("/documents", methods=["GET"])
def documents():
    print(WebsocketService().info())
    return jsonify(ExtractService.list_documents())

# GET /cloud_outputs/<filename> → download JSON rule file
@main_routes.route("/cloud_outputs/<filename>")
def download_output(filename):
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)

# GET /uploads/<filename> → download uploaded PDF
@main_routes.route("/uploads/<filename>")
def download_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

# POST /upload → upload and process PDF
@main_routes.route("/upload", methods=["POST"])
def upload():
    sessionID = str(uuid4())
    
    return ExtractService(sessionID).process_document(request)
