import os
import uuid
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import analyzer

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
REPORTS_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'reports')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORTS_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/analyze', methods=['POST'])
def analyze_compliance():
    # Check for required files and form data
    if 'baseline_tf' not in request.files:
        return jsonify({"status": "error", "message": "Baseline .tf file is required."}), 400
    
    analysis_type = request.form.get('analysis_type')
    if not analysis_type:
        return jsonify({"status": "error", "message": "Analysis type ('upload' or 'fetch') is required."}), 400

    # Save the baseline file temporarily
    baseline_file = request.files['baseline_tf']
    baseline_filename = secure_filename(baseline_file.filename)
    baseline_path = os.path.join(app.config['UPLOAD_FOLDER'], baseline_filename)
    baseline_file.save(baseline_path)

    current_config = {}
    config_path = None

    try:
        # Determine which logic path to follow based on user's choice
        if analysis_type == 'upload':
            if 'config_json' not in request.files:
                raise ValueError("Configuration JSON file is required for upload method.")
            config_file = request.files['config_json']
            config_filename = secure_filename(config_file.filename)
            config_path = os.path.join(app.config['UPLOAD_FOLDER'], config_filename)
            config_file.save(config_path)
            current_config = analyzer.parse_uploaded_config(config_path)

        elif analysis_type == 'fetch':
            credential_details = {
                'subscription_id': request.form.get('subscription_id'),
                'client_id': request.form.get('client_id'),
                'client_secret': request.form.get('client_secret'),
                'tenant_id': request.form.get('tenant_id')
            }
            current_config = analyzer.get_live_azure_resources(credential_details, credential_details['subscription_id'])
        
        else:
            raise ValueError(f"Invalid analysis_type: {analysis_type}")

        # Run the comparison logic
        baseline_resources = analyzer.parse_baseline_tf(baseline_path)
        report_data = analyzer.compare_resources(current_config, baseline_resources)

        # Save the report and return its ID
        report_id = str(uuid.uuid4())
        report_path = os.path.join(REPORTS_FOLDER, f"{report_id}.json")
        with open(report_path, 'w') as f:
            json.dump(report_data, f, indent=2)

        return jsonify({"status": "success", "reportId": report_id})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        # Clean up uploaded files
        if os.path.exists(baseline_path):
            os.remove(baseline_path)
        if config_path and os.path.exists(config_path):
            os.remove(config_path)


@app.route('/api/report/<report_id>', methods=['GET'])
def get_report(report_id):
    report_path = os.path.join(REPORTS_FOLDER, f"{report_id}.json")
    if os.path.exists(report_path):
        with open(report_path, 'r') as f:
            report_data = json.load(f)
        return jsonify(report_data)
    else:
        return jsonify({"status": "error", "message": "Report not found."}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5002)