import json
import os
import subprocess
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime

# Importing custom utility and logic modules
from parser.tf_parser import load_terraform_file_with_comments, load_terraform_file
from comparator import find_resource_gaps
from patcher import generate_patch_file, merge_patch_into_actual
from utils import parse_tfvars_file, apply_variables_to_patch_text
from mongo import collection  # MongoDB connection setup

# --- Flask App Setup ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Allow frontend origin

# --- Folder Structure Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
OUTPUT_FOLDER = os.path.join(BASE_DIR, 'output')
FINAL_PATCH = os.path.join(OUTPUT_FOLDER, 'final_patch.tf')
FINAL_INFRA = os.path.join(OUTPUT_FOLDER, 'updated_actual.tf')
PATCH_FILE = os.path.join(OUTPUT_FOLDER, 'patch.tf')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# --- Global App State ---
app.config['last_gaps'] = []  # Stores unmatched baseline resources
app.config['baseline_total'] = 0  # Total number of baseline checks
app.config['actual_path'] = ''  # Path to actual infra
app.config['tfvars_path'] = ''  # Path to uploaded tfvars


@app.route('/')
def index():
    return render_template('index.html')  # Optional route for web-based UI


@app.route('/upload_files', methods=['POST'])
def upload_files():
    """
    Endpoint to upload baseline, actual Terraform files and optional tfvars file.
    It parses both, identifies compliance gaps, and returns the initial score.
    """
    baseline_file = request.files.get('baseline_file')
    actual_file = request.files.get('actual_file')
    tfvars_file = request.files.get('tfvars_file')

    if not baseline_file or not actual_file:
        return jsonify({"error": "Baseline and actual files are required"}), 400

    # Save uploaded files
    baseline_path = os.path.join(UPLOAD_FOLDER, 'baseline.tf')
    actual_path = os.path.join(UPLOAD_FOLDER, 'actual.tf')
    tfvars_path = os.path.join(UPLOAD_FOLDER, 'vars.tfvars') if tfvars_file else None

    baseline_file.save(baseline_path)
    actual_file.save(actual_path)
    if tfvars_file:
        tfvars_file.save(tfvars_path)

    # Parse baseline with comments and actual infra
    baseline_data = load_terraform_file_with_comments(baseline_path)
    actual_data = load_terraform_file(actual_path)

    # Extract and map comments to resource identifiers
    resource_comments = {
        f"{res['type']}::{res['name']}": res.get('comment')
        for res in baseline_data
        if res.get('comment')
    }

    # Find differences between baseline and actual
    gaps = find_resource_gaps(baseline_data, actual_data)
    total_baseline = len(baseline_data)
    matched = total_baseline - len(gaps)
    initial_score = round((matched / total_baseline) * 100) if total_baseline else 0

    # Attach comment and block to each gap (for frontend display)
    for g in gaps:
        key = f"{g['type']}::{g['name']}"
        g['comment'] = resource_comments.get(key, "")
        match = next((res for res in baseline_data if res['type'] == g['type'] and res['name'] == g['name']), None)
        if match:
            g['block'] = match.get('block')

    # Store state for reuse in patch generation
    app.config.update({
        'last_gaps': gaps,
        'baseline_total': total_baseline,
        'actual_path': actual_path,
        'tfvars_path': tfvars_path
    })

    return jsonify({"gaps": gaps, "initial_score": initial_score})


@app.route('/generate_patch', methods=['POST'])
def generate_patch():
    """
    Endpoint that takes user-selected gaps, generates patch file,
    applies tfvars, validates, and stores result with compliance score.
    """
    data = request.get_json()
    selected = data.get('selected_resources')
    if not selected:
        return jsonify({"error": "No selected resources provided"}), 400

    selected_pairs = [s.split("::") for s in selected]
    all_gaps = app.config['last_gaps']
    filtered_gaps = [g for g in all_gaps if [g['type'], g['name']] in selected_pairs]

    # Load tfvars substitutions if available
    tfvars_path = app.config['tfvars_path']
    tfvars = parse_tfvars_file(tfvars_path) if tfvars_path else {}

    # Use block from gap (already attached during upload)
    patch_blocks = [g['block'] for g in filtered_gaps if g.get('block')]
    raw_patch = "\n\n".join(patch_blocks)
    final_patch = apply_variables_to_patch_text(raw_patch, tfvars)

    # Save the final patch
    with open(FINAL_PATCH, 'w') as f:
        f.write(final_patch)

    # Merge patch into actual infrastructure file
    actual_path = app.config['actual_path']
    merge_patch_into_actual(actual_path, FINAL_PATCH, FINAL_INFRA)

    with open(FINAL_INFRA, 'r') as f:
        merged_content = f.read()

    score = round((len(selected) / app.config['baseline_total']) * 100) if app.config['baseline_total'] else 0

    # Clean up temporary patch files
    for f in [PATCH_FILE, FINAL_PATCH]:
        if os.path.exists(f):
            os.remove(f)

    # Validate Terraform format and syntax
    validate_terraform(OUTPUT_FOLDER)

    # Save final result to MongoDB
    collection.insert_one({
        "selected_resources": selected,
        "patch_text": merged_content,
        "score": score,
        "timestamp": datetime.utcnow()
    })

    return jsonify({
        "merged_patch": merged_content,
        "compliance_score": score
    })


def validate_terraform(directory):
    """
    Runs `terraform fmt`, `init`, and `validate` on updated_actual.tf.
    Validates syntax and catches duplicate/invalid resources.
    """
    updated_path = os.path.join(directory, "updated_actual.tf")
    try:
        print(f"🔧 Running terraform fmt on updated_actual.tf...")
        subprocess.run(["terraform", "fmt", updated_path], check=True)

        print(f"🔧 Running terraform init -upgrade in {directory}...")
        subprocess.run(["terraform", "init", "-upgrade", "-backend=false"], cwd=directory, check=True)

        print(f"🔧 Running terraform validate in {directory}...")
        subprocess.run(["terraform", "validate"], cwd=directory, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Terraform validation failed: {e}")


if __name__ == '__main__':
    app.run(debug=True)
