from flask import Blueprint, jsonify, render_template, request, send_from_directory
from flask_cors import CORS
from src.controllers.upload_controller import process_upload
# Modified for enhancing management dashboard functionality
# Added imports for rules service and file system operations to support dashboard statistics
# TO REVERT: Remove these three import lines
from src.services.rules_service import rules_service
import os
import glob
# End Modified for enhancing management dashboard functionality

main_routes = Blueprint('main_routes', __name__)
CORS(main_routes, 
     resources={r"/*": {
         "origins": ["http://localhost:3000"],
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "x-xsrf-token"],
         "supports_credentials": True
     }})
@main_routes.route('/')
def health_check():
    return {
        "data" : {
            "status": "ok",
            "message": "Server is running",
            "data": "Welcome to the Document Processing API"
            }
    }


# @main_routes.route('/upload', methods=['POST'])
# def upload_file():
#     # if request.method == 'GET':
#     #     return render_template('upload.html')
#
#     if 'file' not in request.files:
#         return "No file uploaded", 400
#
#     file = request.files['file']
#     if file.filename == '':
#         return "Empty filename", 400
#
#     print("Processing file:", file.filename)
#     result = process_upload(file)
#
#     # return render_template(
#     #     'upload.html',
#     #     file_name=result["file_name"],
#     #     text=result["extracted_text"],
#     #     chunks=result["chunks"]
#     # )
#     return result

# Modified for enhancing management dashboard functionality
# API endpoints for dashboard statistics - document counts, rules stats, and file downloads
# TO REVERT: Remove all the @main_routes.route endpoints below until the next comment block
@main_routes.route('/api/documents/stats', methods=['GET'])
def get_documents_stats():
    """Get statistics about uploaded documents"""
    try:
        # Point to the correct uploads directory in models/ollama/src/input_files/uploads
        uploads_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
            'models', 'ollama', 'src', 'input_files', 'uploads'
        )
        
        # Get all files in uploads directory
        if os.path.exists(uploads_dir):
            files = [f for f in os.listdir(uploads_dir) if os.path.isfile(os.path.join(uploads_dir, f))]
            pdf_files = [f for f in files if f.lower().endswith('.pdf')]
            
            return jsonify({
                "success": True,
                "data": {
                    "total_documents": len(files),
                    "pdf_documents": len(pdf_files),
                    "documents": files
                }
            })
        else:
            return jsonify({
                "success": True,
                "data": {
                    "total_documents": 0,
                    "pdf_documents": 0,
                    "documents": []
                }
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# @main_routes.route('/api/documents/list', methods=['GET'])
# def get_documents_list():
#     """Get list of all uploaded documents with metadata"""
#     try:
#         # Point to the correct uploads directory in models/ollama/src/input_files/uploads
#         uploads_dir = os.path.join(
#             os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
#             'models', 'ollama', 'src', 'input_files', 'uploads'
#         )
#         
#         documents = []
#         if os.path.exists(uploads_dir):
#             for filename in os.listdir(uploads_dir):
#                 file_path = os.path.join(uploads_dir, filename)
#                 if os.path.isfile(file_path):
#                     # Get file stats
#                     stat = os.stat(file_path)
#                     documents.append({
#                         "filename": filename,
#                         "size": stat.st_size,
#                         "modified": stat.st_mtime,
#                         "type": filename.split('.')[-1].lower() if '.' in filename else 'unknown'
#                     })
#         
#         return jsonify({
#             "success": True,
#             "data": {
#                 "documents": documents,
#                 "count": len(documents)
#             }
#         })
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 500


# @main_routes.route('/api/documents/download/<filename>', methods=['GET'])
# def download_document(filename):
#     """Download a specific document"""
#     try:
#         # Point to the correct uploads directory in models/ollama/src/input_files/uploads
#         uploads_dir = os.path.join(
#             os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
#             'models', 'ollama', 'src', 'input_files', 'uploads'
#         )
#         
#         # Security check - ensure filename doesn't contain path traversal
#         if '..' in filename or '/' in filename or '\\' in filename:
#             return jsonify({"error": "Invalid filename"}), 400
#         
#         file_path = os.path.join(uploads_dir, filename)
#         if not os.path.exists(file_path):
#             return jsonify({"error": "File not found"}), 404
#         
#         return send_from_directory(uploads_dir, filename, as_attachment=True)
#     except Exception as e:
#         return jsonify({
#             "success": False,
#             "error": str(e)
#         }), 500

@main_routes.route('/api/rules/stats', methods=['GET'])
def get_rules_stats():
    """Get statistics about compliance rules from Qdrant"""
    try:
        stats = rules_service.get_rules_statistics()
        return jsonify({
            "success": True,
            "data": stats
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@main_routes.route('/api/rules/frameworks', methods=['GET'])
def get_frameworks():
    """Get list of all compliance frameworks"""
    try:
        frameworks = rules_service.get_frameworks_list()
        return jsonify({
            "success": True,
            "data": frameworks
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# @main_routes.route('/uploadtest', methods=['GET', 'POST'])
# def upload_file():
#     # Get the api parameter, default to False
#     api = request.args.get('api', '').lower() == 'true'

#     if request.method == 'GET':
#         if api:
#             return jsonify({"message": "Upload endpoint ready"}), 200
#         return render_template('upload.html')

#     if 'file' not in request.files:
#         error_msg = "No file uploaded"
#         if api:
#             return jsonify({"error": error_msg}), 400
#         return error_msg, 400

#     file = request.files['file']
#     if file.filename == '':
#         error_msg = "Empty filename"
#         if api:
#             return jsonify({"error": error_msg}), 400
#         return error_msg, 400

#     result = process_upload(file)

#     if api:
#         return jsonify(result), 200

#     return render_template(
#         'upload.html',
#         file_name=result["file_name"],
#         text=result["extracted_text"],
#         chunks=result["chunks"]
#     )
# End Modified for enhancing management dashboard functionality