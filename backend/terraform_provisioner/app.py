import os
import subprocess
import uuid
import json
import shutil
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEPLOYMENTS_DIR = os.path.join(BASE_DIR, 'deployments')

os.makedirs(DEPLOYMENTS_DIR, exist_ok=True)

def parse_terraform_json_output(json_data):
    """Parses the JSON output of 'terraform show' to extract resource info."""
    resources = []
    if not json_data or "values" not in json_data or "root_module" not in json_data["values"]:
        return resources


    for resource in json_data["values"]["root_module"].get("resources", []):
        details = ""
        if resource["type"] == "azurerm_public_ip":
            details = f"IP Address: {resource['values'].get('ip_address', 'N/A')}"
        elif resource["type"] == "azurerm_virtual_machine":
            details = f"Size: {resource['values'].get('vm_size', 'N/A')}"
        else:
            details = f"Location: {resource['values'].get('location', 'N/A')}"

        resources.append({
            "type": resource["type"],
            "name": resource["name"],
            "details": details
        })
    return resources

# Endpoint for the new results page to fetch deployment data


@app.route('/')
def health_check():
    return {
        "data": {
            "status": "ok",
            "message": "Server is running",
            "data": "Welcome to the TF Provisioner API"
        }
    }


@app.route('/api/deployment/<run_id>', methods=['GET'])
def get_deployment_status(run_id):
    run_dir = os.path.abspath(os.path.join(DEPLOYMENTS_DIR, run_id))

    if not run_dir.startswith(os.path.abspath(DEPLOYMENTS_DIR)) or not os.path.isdir(run_dir):
        return jsonify({"status": "error", "message": "Deployment not found."}), 404
        
    try:
        show_process = subprocess.run(['terraform', '-chdir=' + run_dir, 'show', '-json'], capture_output=True, text=True, check=True)
        deployed_resources = parse_terraform_json_output(json.loads(show_process.stdout))
        return jsonify({"status": "success", "resources": deployed_resources}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": "Could not retrieve deployment state."}), 500

# Endpoint for provisioning, now returns a run_id for redirection
@app.route('/api/provision', methods=['POST'])
def provision_infrastructure():
    if 'main_tf' not in request.files:
        print("main.tf file is required.")
        return jsonify({"status": "error", "message": "main.tf file is required."}), 400

    main_tf_file = request.files['main_tf']
    vars_file = request.files.get('variables_tf')
    run_id = str(uuid.uuid4())
    run_dir = os.path.join(DEPLOYMENTS_DIR, run_id)
    if not os.path.exists(run_dir):
        os.makedirs(run_dir)
    if main_tf_file:
        main_tf_file.save(os.path.join(run_dir, 'main.tf'))
    if vars_file:
        vars_file.save(os.path.join(run_dir, 'terraform.tfvars'))
    # return 'asd'
    try:
        script_path = os.path.join(BASE_DIR, 'provision.sh')
        print(script_path)
        
        # subprocess.run(['bash', script_path, run_dir], capture_output=True, text=True, check=True)
        # subprocess.run(['sh', script_path, run_dir],capture_output=True, text=True, check=True)
        # subprocess.run(['wsl', 'bash', script_path, run_dir], capture_output=True, text=True, check=True)
        bash_path = r"C:\Program Files\Git\bin\bash.exe"  # adjust if different

        subprocess.run([bash_path, script_path, run_dir], capture_output=True, text=True, check=True)


        return jsonify({"status": "success", "message": "Redirecting to results...", "run_id": run_id}), 200
    except subprocess.CalledProcessError as e:
        shutil.rmtree(run_dir)
        print(e.stdout)
        print(e.stderr)
        print("Terraform execution failed.")
        return jsonify({"status": "error", "message": "Terraform execution failed.", "log": f"{e.stdout}\n{e.stderr}"}), 500
    except Exception as e:
        shutil.rmtree(run_dir)
        
        print("Terraform execution failed 2.")
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 500

# Endpoint for destroying resources
@app.route('/api/destroy', methods=['POST'])
def destroy_infrastructure():
    data = request.get_json()
    run_id = data.get('run_id')
    if not run_id:
        return jsonify({"status": "error", "message": "run_id is required."}), 400
    run_dir = os.path.abspath(os.path.join(DEPLOYMENTS_DIR, run_id))
    if not run_dir.startswith(os.path.abspath(DEPLOYMENTS_DIR)):
        return jsonify({"status": "error", "message": "Invalid run_id."}), 400
    if not os.path.isdir(run_dir):
         return jsonify({"status": "error", "message": "Deployment not found or already deleted."}), 404
    try:
        script_path = os.path.join(BASE_DIR, 'destroy.sh')
        subprocess.run(['bash', script_path, run_dir], capture_output=True, text=True, check=True)
        shutil.rmtree(run_dir)
        return jsonify({"status": "success", "message": "Infrastructure destroyed successfully."}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": "Terraform destroy failed.", "log": f"{e.stdout}\n{e.stderr}"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    
    print("Provisioner")
    app.run(debug=True, port=5001)