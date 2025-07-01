from uuid import uuid4
from flask import Blueprint, jsonify, render_template, request
from flask_cors import CORS
from flask import Blueprint, request, jsonify, send_from_directory
from src.services.context_generator import CloudContextGenerator

from ..services.chat_service import handle_chat_query

from ..services.rules_service import RulesService
from ..services.websocket.ws import WebsocketService
from src.services.extract_service import ExtractService
import os

#from src.services.terraform_generator import TerraformGenerator


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
    print(f"Session ID from route: {sessionID}")
    
    return ExtractService(sessionID).process_document(request)


# ------------------------------------------------------------------------
# Updated by Harsimran Kaur
# This code is part of pipeline 3.
# POST /generate_terraform
# This endpoint receives selected frameworks and providers from the frontend,
# generates a unified cloud security context and corresponding Terraform files
# using the CloudContextGenerator service, and returns a success or error response.
# Used for automating cloud compliance and infrastructure-as-code generation.
# ------------------------------------------------------------------------
@main_routes.route("/generate_terraform", methods=["POST"])
def generate_terraform():
    print("🔔 /generate_terraform endpoint called")  # Add this line
    try:
        data = request.get_json()

        selected_frameworks = [f.strip().upper() for f in data.get("frameworks", [])]
        selected_providers = [p.strip().lower() for p in data.get("providers", [])]

        print("✅ Backend: /generate_terraform called")
        print("📂 Frameworks selected:", selected_frameworks)
        print("📦 Providers selected:", selected_providers)

        # ✅ Generate cloud context + Terraform all in one step
        context_gen = CloudContextGenerator()
        context_gen.generate_context(selected_frameworks, selected_providers)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        print(f"❌ Error in generation flow: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    

# javier changes
# Returns framweork rules generated from the uploaded PDF and stored in the vector store
@main_routes.route("/explore/rules", methods=["GET"])
def exploreRules():
    sessionID = str(uuid4())
    return RulesService(sessionID=sessionID).list_rules()



@main_routes.route("/react_chat", methods=["POST"])
def react_chat():
    data = request.get_json()
    query = data.get("query", "")
    
    if not query:
        return jsonify({"error": "No query provided"}), 400

    result = handle_chat_query(query)
    return jsonify(result)


# Code Added for Pipeline 3. 
# This is a route for generating cloud context based on selected frameworks and providers.
# This route will be called from the frontend when the user selects frameworks and providers for context generation
# It will use the CloudContextGenerator service to generate the context and return a success message.
# Updated By Harsimran Kaur 

# @main_routes.route("/generate_context", methods=["POST"])
# def generate_context():
#     try:
#         data = request.get_json()
#         selected_frameworks = [f.strip().upper() for f in data.get("frameworks", [])]
#         selected_providers = [p.strip().lower() for p in data.get("providers", [])]

#         print("✅ Backend: /generate_context called")
#         print("📂 Frameworks selected:", selected_frameworks)
#         print("📦 Providers selected:", selected_providers)

#         context_gen = CloudContextGenerator()
#         context_gen.generate_context(selected_frameworks, selected_providers)

#         return jsonify({"status": "success", "message": "Cloud context generated."}), 200

#     except Exception as e:
#         print(f"❌ Error in context generation: {e}")
#         return jsonify({"status": "error", "message": str(e)}), 500
