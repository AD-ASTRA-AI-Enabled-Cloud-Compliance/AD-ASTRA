from azure.identity import ClientSecretCredential
from azure.mgmt.resource import ResourceManagementClient
import hcl2
import json

def parse_uploaded_config(file_path):
    """Parses an uploaded JSON configuration file."""
    print(f"Parsing uploaded config file: {file_path}")
    with open(file_path, 'r') as f:
        config_data = json.load(f)
    print(f"Found {len(config_data)} resources in uploaded file.")
    return config_data

def get_live_azure_resources(credential_details, subscription_id):
    """Connects to Azure and gets an inventory of all resources."""
    print("Fetching live resources from Azure...")
    credential = ClientSecretCredential(
        tenant_id=credential_details['tenant_id'],
        client_id=credential_details['client_id'],
        client_secret=credential_details['client_secret']
    )
    resource_client = ResourceManagementClient(credential, subscription_id)
    
    live_resources = {}
    for resource in resource_client.resources.list():
        live_resources[resource.name] = {
            "name": resource.name,
            "type": resource.type,
            "location": resource.location
        }
    print(f"Found {len(live_resources)} live resources.")
    return live_resources

def parse_baseline_tf(file_path):
    """Parses an HCL file and extracts resource definitions."""
    print(f"Parsing baseline file: {file_path}")
    with open(file_path, 'r') as f:
        hcl_data = hcl2.load(f)
    
    baseline_resources = {}
    for resource_block in hcl_data.get('resource', []):
        for resource_type, resource_config in resource_block.items():
            for resource_name, resource_values in resource_config.items():
                name_value = resource_values.get('name', [None])[0]
                if name_value:
                    baseline_resources[name_value] = {
                        "name": name_value,
                        "tf_type": resource_type,
                        "defined_location": resource_values.get('location', [None])[0]
                    }
    print(f"Found {len(baseline_resources)} resources in baseline.")
    return baseline_resources

def compare_resources(current_config, baseline_resources):
    """Compares current resource configuration to the baseline and generates a report."""
    print("Comparing current configuration to baseline...")
    report = {
        "compliant": [],
        "non_compliant": [],
        "unmanaged": []
    }

    for current_name, current_res in current_config.items():
        # --- NEW: Add a check to ensure the resource is a dictionary ---
        if not isinstance(current_res, dict):
            print(f"Skipping malformed resource in JSON: {current_name}")
            continue # Skip this item and move to the next one

        if current_name in baseline_resources:
            baseline_res = baseline_resources[current_name]
            if current_res.get('location') == baseline_res.get('defined_location'):
                report['compliant'].append({
                    "name": current_name, "type": current_res.get('type'),
                    "reason": "Configuration matches baseline."
                })
            else:
                report['non_compliant'].append({
                    "name": current_name, "type": current_res.get('type'),
                    "reason": f"Location mismatch. Current is '{current_res.get('location')}', baseline requires '{baseline_res.get('defined_location')}'."
                })
        else:
            report['unmanaged'].append({
                "name": current_name, "type": current_res.get('type'),
                "reason": "Resource exists but is not defined in the baseline."
            })
    
    print("Comparison complete.")
    return report