from flask import Blueprint, jsonify, render_template, request
from src.controllers.upload_controller import process_upload

main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/')
def health_check():
    return "Healthy", 200

@main_routes.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'GET':
        return render_template('upload.html')

    if 'file' not in request.files:
        return "No file uploaded", 400

    file = request.files['file']
    if file.filename == '':
        return "Empty filename", 400

    result = process_upload(file)

    # return render_template(
    #     'upload.html',
    #     file_name=result["file_name"],
    #     text=result["extracted_text"],
    #     chunks=result["chunks"]
    # )
    return result

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