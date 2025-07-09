import json
import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime

from parser.tf_parser import load_terraform_file
from comparator import find_resource_gaps
from patcher import generate_patch_file, merge_patch_into_actual
from utils import parse_tfvars_file, apply_variables_to_patch_text
from mongo import collection  # MongoDB connection

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = 'uploads'
OUTPUT_PATCH = 'output/patch.tf'
FINAL_PATCH = 'output/final_patch.tf'
FINAL_INFRA = 'output/updated_actual.tf'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('output', exist_ok=True)

app.config['last_gaps'] = []
app.config['pci_total'] = 0
app.config['actual_path'] = ''
app.config['tfvars_path'] = ''


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload_files', methods=['POST'])
def upload_files():
    pci_file = request.files['pci_file']
    actual_file = request.files['actual_file']
    tfvars_file = request.files.get('tfvars_file')

    pci_path = os.path.join(UPLOAD_FOLDER, 'pci.tf')
    actual_path = os.path.join(UPLOAD_FOLDER, 'actual.tf')
    tfvars_path = os.path.join(UPLOAD_FOLDER, 'vars.tfvars') if tfvars_file else None

    pci_file.save(pci_path)
    actual_file.save(actual_path)
    if tfvars_file:
        tfvars_file.save(tfvars_path)

    pci_data = load_terraform_file(pci_path)
    actual_data = load_terraform_file(actual_path)

    gaps = find_resource_gaps(pci_data, actual_data)

    total_pci = len(pci_data.get("resource", []))
    matched = total_pci - len(gaps)
    initial_score = round((matched / total_pci) * 100) if total_pci else 0

    app.config['last_gaps'] = gaps
    app.config['pci_total'] = total_pci
    app.config['actual_path'] = actual_path
    app.config['tfvars_path'] = tfvars_path

    return jsonify({
        "gaps": gaps,
        "initial_score": initial_score
    })


@app.route('/generate_patch', methods=['POST'])
def generate_patch():
    data = request.get_json()
    selected = data.get('selected_resources', [])
    selected_pairs = [s.split("::") for s in selected]

    all_gaps = app.config.get('last_gaps', [])
    filtered_gaps = [g for g in all_gaps if [g['type'], g['name']] in selected_pairs]

    generate_patch_file(filtered_gaps, OUTPUT_PATCH)

    with open(OUTPUT_PATCH, 'r') as f:
        raw_patch = f.read()

    tfvars_path = app.config.get('tfvars_path')
    variables = parse_tfvars_file(tfvars_path) if tfvars_path else {}

    final_patch = apply_variables_to_patch_text(raw_patch, variables)

    with open(FINAL_PATCH, 'w') as f:
        f.write(final_patch)

    actual_path = app.config.get('actual_path')
    merge_patch_into_actual(actual_path, FINAL_PATCH, FINAL_INFRA)

    with open(FINAL_INFRA, 'r') as f:
        merged_content = f.read()

    total = app.config.get('pci_total', 1)
    score = round((len(selected) / total) * 100) if total else 0

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


if __name__ == '__main__':
    app.run(debug=True)
