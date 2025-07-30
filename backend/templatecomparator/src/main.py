# import json
# import os
# from flask import Flask, request, jsonify, render_template
# from flask_cors import CORS
# from datetime import datetime

# from src.tf_parser import load_terraform_file
# from file_comparator import find_resource_gaps
# from patcher import generate_patch_file, merge_patch_into_actual
# from utils import parse_tfvars_file, apply_variables_to_patch_text
# from mongo import collection  # MongoDB connection

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# # Define absolute paths for folders and output files
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
# OUTPUT_FOLDER = os.path.join(BASE_DIR, 'output')

# OUTPUT_PATCH = os.path.join(OUTPUT_FOLDER, 'patch.tf')
# FINAL_PATCH = os.path.join(OUTPUT_FOLDER, 'final_patch.tf')
# FINAL_INFRA = os.path.join(OUTPUT_FOLDER, 'updated_actual.tf')

# # Create folders if they don't exist
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# # Store last gaps and file paths in app config for statefulness
# app.config['last_gaps'] = []
# app.config['baseline_total'] = 0
# app.config['actual_path'] = ''
# app.config['tfvars_path'] = ''


# @app.route('/')
# def index():
#     # Serve a simple landing page or UI (optional)
#     return render_template('index.html')


# @app.route('/upload_files', methods=['POST'])
# def upload_files():
#     """
#     Endpoint to upload baseline, actual, and optional tfvars files.
#     It processes files to find gaps and calculates initial compliance score.
#     """
#     baseline_file = request.files.get('baseline_file')
#     actual_file = request.files.get('actual_file')
#     tfvars_file = request.files.get('tfvars_file')  # Optional

#     # Validate required files presence
#     if not baseline_file or not actual_file:
#         return jsonify({"error": "Baseline and actual files are required"}), 400

#     # Define local file paths for saving uploads
#     baseline_path = os.path.join(UPLOAD_FOLDER, 'baseline.tf')
#     actual_path = os.path.join(UPLOAD_FOLDER, 'actual.tf')
#     tfvars_path = os.path.join(UPLOAD_FOLDER, 'vars.tfvars') if tfvars_file else None

#     # Save uploaded files to disk
#     baseline_file.save(baseline_path)
#     actual_file.save(actual_path)
#     if tfvars_file:
#         tfvars_file.save(tfvars_path)

#     # Parse Terraform files into structured dicts
#     baseline_data = load_terraform_file(baseline_path)
#     actual_data = load_terraform_file(actual_path)

#     # Find gaps between baseline and actual infrastructure resources
#     gaps = find_resource_gaps(baseline_data, actual_data)

#     # Calculate total baseline resources and initial compliance score
#     total_baseline = len(baseline_data.get("resource", []))
#     matched = total_baseline - len(gaps)
#     initial_score = round((matched / total_baseline) * 100) if total_baseline else 0

#     # Store state for later patch generation
#     app.config['last_gaps'] = gaps
#     app.config['baseline_total'] = total_baseline
#     app.config['actual_path'] = actual_path
#     app.config['tfvars_path'] = tfvars_path

#     # Return gaps and initial score for frontend UI display
#     return jsonify({
#         "gaps": gaps,
#         "initial_score": initial_score
#     })


# @app.route('/generate_patch', methods=['POST'])
# def generate_patch():
#     """
#     Endpoint to generate a Terraform patch based on selected gaps,
#     apply variable substitution, merge patch into actual infra file,
#     calculate updated compliance score, and save result in MongoDB.
#     """
#     data = request.get_json()
#     selected = data.get('selected_resources', [])
#     selected_pairs = [s.split("::") for s in selected]

#     all_gaps = app.config.get('last_gaps', [])
#     # Filter only selected gaps to patch
#     filtered_gaps = [g for g in all_gaps if [g['type'], g['name']] in selected_pairs]

#     # Generate patch Terraform file for filtered gaps
#     generate_patch_file(filtered_gaps, OUTPUT_PATCH)

#     # Read raw patch text
#     with open(OUTPUT_PATCH, 'r') as f:
#         raw_patch = f.read()

#     # Parse variables from tfvars file if present
#     tfvars_path = app.config.get('tfvars_path')
#     variables = parse_tfvars_file(tfvars_path) if tfvars_path else {}

#     # Substitute variables in patch text (e.g., replace ${var.env} with actual value)
#     final_patch = apply_variables_to_patch_text(raw_patch, variables)

#     # Write final patch text after substitution
#     with open(FINAL_PATCH, 'w') as f:
#         f.write(final_patch)

#     actual_path = app.config.get('actual_path')
#     # Merge final patch into actual Terraform file to produce merged infra file
#     merge_patch_into_actual(actual_path, FINAL_PATCH, FINAL_INFRA)

#     # Read merged infra file content
#     with open(FINAL_INFRA, 'r') as f:
#         merged_content = f.read()

#     # Calculate compliance score after patching
#     total = app.config.get('baseline_total', 1)
#     score = round((len(selected) / total) * 100) if total else 0

#     # Save record in MongoDB
#     collection.insert_one({
#         "selected_resources": selected,
#         "patch_text": merged_content,
#         "score": score,
#         "timestamp": datetime.utcnow()
#     })

#     # Return merged content and updated compliance score for frontend display
#     return jsonify({
#         "merged_patch": merged_content,
#         "compliance_score": score
#     })


# if __name__ == '__main__':
#     app.run(debug=True)
