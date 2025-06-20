import json
from flask import Flask, request, render_template, send_file
import os
from parser import load_terraform_file
from comparator import find_resource_gaps
from patcher import generate_patch_file, merge_patch_into_actual
from utils import parse_tfvars_file, apply_variables_to_patch
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = 'uploads'
OUTPUT_PATCH = 'output/patch.tf'
FINAL_PATCH = 'output/final_patch.tf'
FINAL_INFRA = 'output/updated_actual.tf'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('output', exist_ok=True)

# Store compliance gaps temporarily
app.config['last_gaps'] = []

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/upload_files', methods=['GET', 'POST'])
def upload_files():
    if request.method == 'POST':
        pci_file = request.files['pci_file']
        actual_file = request.files['actual_file']
        tfvars_file = request.files.get('tfvars_file')  # Optional

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
        app.config['last_gaps'] = gaps
        app.config['actual_path'] = actual_path
        app.config['tfvars_path'] = tfvars_path

        json_data = json.dumps(gaps, indent=2)


        # return render_template('result.html', gaps=gaps, patch_ready=bool(gaps))
        return json_data

    return render_template('index.html')


@app.route('/generate_patch', methods=['POST'])
def generate_patch():
    selected = request.form.getlist('selected_resources')
    selected_pairs = [s.split("::") for s in selected]

    all_gaps = app.config.get('last_gaps', [])
    filtered_gaps = [g for g in all_gaps if [g['type'], g['name']] in selected_pairs]

    generate_patch_file(filtered_gaps, OUTPUT_PATCH)

    # Read raw patch
    with open(OUTPUT_PATCH, 'r') as f:
        raw_patch = f.read()

    # Load variables
    tfvars_path = app.config.get('tfvars_path')
    variables = parse_tfvars_file(tfvars_path) if tfvars_path else {}

    # Apply variables
    final_patch = apply_variables_to_patch(raw_patch, variables)

    # Save rendered patch
    with open(FINAL_PATCH, 'w') as f:
        f.write(final_patch)

    # Merge patch into infrastructure file
    actual_path = app.config.get('actual_path')
    merge_patch_into_actual(actual_path, FINAL_PATCH, FINAL_INFRA)

    return send_file(FINAL_INFRA, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
