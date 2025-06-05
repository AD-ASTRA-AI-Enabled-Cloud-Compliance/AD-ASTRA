from flask import Blueprint, request, jsonify, send_from_directory
from src.services.extract_service import process_document, list_documents
import os

doc_bp = Blueprint("document", __name__)

# Base folders
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "../uploads")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "../cloud_outputs")

# GET /uploads → list uploaded PDF files + JSON info
@doc_bp.route("/uploads", methods=["GET"], endpoint="list_uploads")
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
@doc_bp.route("/documents", methods=["GET"])
def documents():
    return jsonify(list_documents())

# GET /cloud_outputs/<filename> → download JSON rule file
@doc_bp.route("/cloud_outputs/<filename>")
def download_output(filename):
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)

# GET /uploads/<filename> → download uploaded PDF
@doc_bp.route("/uploads/<filename>")
def download_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

# POST /upload → upload and process PDF
@doc_bp.route("/upload", methods=["POST"])
def upload():
    return process_document(request)
