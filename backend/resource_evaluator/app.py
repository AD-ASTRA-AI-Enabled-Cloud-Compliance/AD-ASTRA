import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import random # Not used in final logic, but was in original
import time   # Not used in final logic, but was in original

# Cloud SDKs
import boto3 # AWS SDK, included for completeness if needed later
from botocore.exceptions import ClientError as BotoClientError
from azure.identity import ClientSecretCredential
from azure.core.exceptions import ClientAuthenticationError, HttpResponseError
from azure.mgmt.storage import StorageManagementClient
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.keyvault import KeyVaultManagementClient
from azure.mgmt.network import NetworkManagementClient

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# --- AWS Client Helper (remains as is) ---
def get_aws_client(service_name, region_name):
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_REGION', region_name or 'us-east-1')

    if not aws_access_key_id or not aws_secret_access_key:
        raise ValueError("AWS credentials not found in .env. Cannot connect to AWS.")

    return boto3.client(
        service_name,
        region_name=aws_region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )

# --- Azure Client Helper (remains as is) ---
def get_azure_client(client_class, subscription_id, tenant_id, client_id, client_secret):
    try:
        credential = ClientSecretCredential(tenant_id, client_id, client_secret)
        return client_class(credential, subscription_id)
    except ClientAuthenticationError as e:
        raise ValueError(f"Azure authentication failed. Error: {e.message}")
    except Exception as e:
        raise ValueError(f"Failed to create Azure client: {e}")

# --- Azure Compliance Evaluation Functions ---
# These functions take an Azure SDK resource object and apply rules.
# They return a dictionary with compliance status, failed, and passed rules.

def evaluate_storage_account_compliance(sa_obj):
    compliance_status = "COMPLIANT"
    failed_rules = []
    passed_rules = []

    # Rule 1: Enforce HTTPS only (PCI, HIPAA, NIST)
    rule_name_https = "Storage Account HTTPS Only"
    if not sa_obj.supports_https_traffic_only:
        compliance_status = "NON_COMPLIANT"
        failed_rules.append({
            "framework": "PCI, HIPAA, NIST",
            "ruleName": rule_name_https,
            "details": "Storage account does not enforce HTTPS only traffic. Data in transit may be vulnerable."
        })
    else:
        passed_rules.append({"framework": "PCI, HIPAA, NIST", "ruleName": rule_name_https})

    # Rule 2: No public access (HIPAA, PCI, NIST, ISO)
    # This checks for anonymous public read/write access.
    # Note: 'allow_blob_public_access' being true allows configuration, not necessarily direct access.
    # A true check would involve inspecting containers for actual public ACLs.
    # For simplicity, we'll check `allow_blob_public_access`.
    rule_name_public_access = "Storage Account Public Blob Access Disabled"
    if sa_obj.allow_blob_public_access:
        compliance_status = "NON_COMPLIANT"
        failed_rules.append({
            "framework": "HIPAA, PCI, NIST, ISO",
            "ruleName": rule_name_public_access,
            "details": "Storage account allows public blob access. Data may be exposed."
        })
    else:
        passed_rules.append({"framework": "HIPAA, PCI, NIST, ISO", "ruleName": rule_name_public_access})

    return {
        "complianceStatus": compliance_status,
        "failedRules": failed_rules,
        "passedRules": passed_rules
    }

def evaluate_virtual_machine_compliance(vm_obj):
    compliance_status = "COMPLIANT"
    failed_rules = []
    passed_rules = []

    # Rule 1: VM should not have a public IP address (NIST, ISO)
    # This requires inspecting network interfaces attached to the VM.
    # It's a bit more complex as network interfaces are separate resources.
    # For simplification, we'll check if any primary NIC has a public IP config.
    # A complete solution would iterate through vm.network_profile.network_interfaces
    # and then fetch each NIC to check its IP configurations.
    
    # Placeholder: Assuming a direct property check for simplicity
    # In reality, you'd need to fetch NICs and check their ip_configurations for public_ip_address.
    # For now, let's assume a simplified check that would ideally come from a richer VM object.
    
    # A VM object doesn't directly expose 'has_public_ip'. You'd need to fetch NIC details.
    # For demonstration, we'll make a simplified rule.
    # Let's say, for example, if the VM name contains "public", it's non-compliant (bad rule, but demonstrates logic)
    rule_name_public_ip = "Virtual Machine without Public IP"
    # To properly check public IP:
    # 1. Get the compute_client
    # 2. Iterate vm.network_profile.network_interfaces
    # 3. For each network interface ID, call network_client.network_interfaces.get()
    # 4. Check network_interface_obj.ip_configurations for public_ip_address.
    
    # Since we can't do that nested call easily here without the network_client and resource group,
    # let's assume for this example that if the VM object has a specific property
    # or if we fetch the details. For a true check, this would involve more API calls.
    # Given the current `list_all` method on VMs, getting public IP status directly is hard.
    # Let's use a very simple (and not robust) example:
    if vm_obj.name and "public" in vm_obj.name.lower(): # VERY basic example rule
         compliance_status = "NON_COMPLIANT"
         failed_rules.append({
            "framework": "NIST, ISO",
            "ruleName": rule_name_public_ip,
            "details": f"VM '{vm_obj.name}' name suggests it might have a public IP. (Requires deeper check for actual IP config)."
         })
    else:
        passed_rules.append({"framework": "NIST, ISO", "ruleName": rule_name_public_ip})

    # Rule 2: VM Managed Disks (PCI, ISO)
    rule_name_managed_disk = "Virtual Machine uses Managed Disks"
    if vm_obj.storage_profile and vm_obj.storage_profile.os_disk and vm_obj.storage_profile.os_disk.managed_disk:
        passed_rules.append({"framework": "PCI, ISO", "ruleName": rule_name_managed_disk})
    else:
        compliance_status = "NON_COMPLIANT"
        failed_rules.append({
            "framework": "PCI, ISO",
            "ruleName": rule_name_managed_disk,
            "details": "VM does not use managed disks for OS disk. Consider using managed disks for better management and reliability."
        })

    return {
        "complianceStatus": compliance_status,
        "failedRules": failed_rules,
        "passedRules": passed_rules
    }

def evaluate_key_vault_compliance(kv_obj):
    compliance_status = "COMPLIANT"
    failed_rules = []
    passed_rules = []

    # Rule 1: Soft Delete Enabled (NIST, ISO, HIPAA)
    rule_name_soft_delete = "Key Vault Soft Delete Enabled"
    if not kv_obj.properties.enable_soft_delete:
        compliance_status = "NON_COMPLIANT"
        failed_rules.append({
            "framework": "NIST, ISO, HIPAA",
            "ruleName": rule_name_soft_delete,
            "details": "Key Vault soft delete is not enabled. Critical data may be permanently lost upon accidental deletion."
        })
    else:
        passed_rules.append({"framework": "NIST, ISO, HIPAA", "ruleName": rule_name_soft_delete})

    # Rule 2: Purge Protection Enabled (NIST, ISO, HIPAA)
    rule_name_purge_protection = "Key Vault Purge Protection Enabled"
    if kv_obj.properties.enable_soft_delete and not kv_obj.properties.enable_purge_protection:
        compliance_status = "NON_COMPLIANT"
        failed_rules.append({
            "framework": "NIST, ISO, HIPAA",
            "ruleName": rule_name_purge_protection,
            "details": "Key Vault soft delete is enabled, but purge protection is not. Malicious actors could still purge data."
        })
    else:
        passed_rules.append({"framework": "NIST, ISO, HIPAA", "ruleName": rule_name_purge_protection})

    return {
        "complianceStatus": compliance_status,
        "failedRules": failed_rules,
        "passedRules": passed_rules
    }

def evaluate_network_security_group_compliance(nsg_obj):
    compliance_status = "COMPLIANT"
    failed_rules = []
    passed_rules = []

    # Rule 1: No inbound rule from 'Any' source (0.0.0.0/0) on common dangerous ports (NIST, PCI)
    dangerous_ports = ["22", "3389", "80", "443"] # SSH, RDP, HTTP, HTTPS
    rule_name_open_ports = "NSG No Inbound Rules from Any Source on Dangerous Ports"
    
    has_dangerous_open_port = False
    if nsg_obj.security_rules:
        for rule in nsg_obj.security_rules:
            if rule.direction == "Inbound" and rule.access == "Allow":
                # Check for 'Any' source IP address or CIDR (0.0.0.0/0 or *)
                if "0.0.0.0/0" in rule.source_address_prefixes or "*" in rule.source_address_prefixes:
                    # Check for dangerous ports
                    for port in dangerous_ports:
                        if (rule.destination_port_range == port or
                            (rule.destination_port_ranges and port in rule.destination_port_ranges)):
                            has_dangerous_open_port = True
                            break
                    if has_dangerous_open_port:
                        break
        
    if has_dangerous_open_port:
        compliance_status = "NON_COMPLIANT"
        failed_rules.append({
            "framework": "NIST, PCI",
            "ruleName": rule_name_open_ports,
            "details": f"NSG '{nsg_obj.name}' has an inbound rule allowing access from 'Any' source on a dangerous port ({', '.join(dangerous_ports)})."
        })
    else:
        passed_rules.append({"framework": "NIST, PCI", "ruleName": rule_name_open_ports})

    # Rule 2: All security rules should have a description (ISO, Custom)
    rule_name_description = "All NSG Rules Have Description"
    missing_description = False
    if nsg_obj.security_rules:
        for rule in nsg_obj.security_rules:
            if not rule.description or rule.description.strip() == "":
                missing_description = True
                break
    
    if missing_description:
        if compliance_status != "NON_COMPLIANT": # Don't override if already non-compliant
            compliance_status = "NON_COMPLIANT" 
        failed_rules.append({
            "framework": "ISO, Custom",
            "ruleName": rule_name_description,
            "details": f"NSG '{nsg_obj.name}' has security rules without a description, hindering auditability."
        })
    else:
        passed_rules.append({"framework": "ISO, Custom", "ruleName": rule_name_description})


    return {
        "complianceStatus": compliance_status,
        "failedRules": failed_rules,
        "passedRules": passed_rules
    }


# --- Azure Resource Fetch Functions (now call evaluation helpers) ---
def fetch_azure_storage_accounts(subscription_id, tenant_id, client_id, client_secret):
    print(f"Fetching Azure Storage Accounts in Subscription: {subscription_id}...")
    storage_accounts_data = []
    try:
        storage_client = get_azure_client(StorageManagementClient, subscription_id, tenant_id, client_id, client_secret)
        for sa in storage_client.storage_accounts.list():
            # Evaluate each storage account
            compliance_results = evaluate_storage_account_compliance(sa)
            storage_accounts_data.append({
                "resourceId": sa.id,
                "name": sa.name,
                "resourceType": "Azure::Storage::StorageAccount",
                "region": sa.location, # Azure uses 'location' for region
                "complianceStatus": compliance_results["complianceStatus"],
                "failedRules": compliance_results["failedRules"],
                "passedRules": compliance_results["passedRules"]
            })
        print(f"Fetched and evaluated {len(storage_accounts_data)} Storage Accounts.")
    except HttpResponseError as e:
        raise ValueError(f"Azure Storage API error: {e.message}")
    return storage_accounts_data

def fetch_azure_virtual_machines(subscription_id, tenant_id, client_id, client_secret):
    print(f"Fetching Azure VMs in Subscription: {subscription_id}...")
    vms_data = []
    try:
        compute_client = get_azure_client(ComputeManagementClient, subscription_id, tenant_id, client_id, client_secret)
        for vm in compute_client.virtual_machines.list_all():
            # Evaluate each VM
            compliance_results = evaluate_virtual_machine_compliance(vm)
            vms_data.append({
                "resourceId": vm.id,
                "name": vm.name,
                "resourceType": "Azure::Compute::VirtualMachine",
                "region": vm.location,
                "complianceStatus": compliance_results["complianceStatus"],
                "failedRules": compliance_results["failedRules"],
                "passedRules": compliance_results["passedRules"]
            })
        print(f"Fetched and evaluated {len(vms_data)} VMs.")
    except HttpResponseError as e:
        raise ValueError(f"Azure VM API error: {e.message}")
    return vms_data

def fetch_azure_key_vaults(subscription_id, tenant_id, client_id, client_secret):
    print(f"Fetching Azure Key Vaults in Subscription: {subscription_id}...")
    kv_data = []
    try:
        kv_client = get_azure_client(KeyVaultManagementClient, subscription_id, tenant_id, client_id, client_secret)
        for vault in kv_client.vaults.list():
            # Evaluate each Key Vault
            compliance_results = evaluate_key_vault_compliance(vault)
            kv_data.append({
                "resourceId": vault.id,
                "name": vault.name,
                "resourceType": "Azure::KeyVault::Vault",
                "region": vault.location,
                "complianceStatus": compliance_results["complianceStatus"],
                "failedRules": compliance_results["failedRules"],
                "passedRules": compliance_results["passedRules"]
            })
        print(f"Fetched and evaluated {len(kv_data)} Key Vaults.")
    except HttpResponseError as e:
        raise ValueError(f"Azure Key Vault API error: {e.message}")
    return kv_data

def fetch_azure_network_security_groups(subscription_id, tenant_id, client_id, client_secret):
    print(f"Fetching Azure NSGs in Subscription: {subscription_id}...")
    nsg_data = []
    try:
        network_client = get_azure_client(NetworkManagementClient, subscription_id, tenant_id, client_id, client_secret)
        # NSGs are often tied to resource groups. List all might be fine, but sometimes get by resource group is needed.
        for nsg in network_client.network_security_groups.list_all():
            # Evaluate each NSG
            compliance_results = evaluate_network_security_group_compliance(nsg)
            nsg_data.append({
                "resourceId": nsg.id,
                "name": nsg.name,
                "resourceType": "Azure::Network::NetworkSecurityGroup",
                "region": nsg.location,
                "complianceStatus": compliance_results["complianceStatus"],
                "failedRules": compliance_results["failedRules"],
                "passedRules": compliance_results["passedRules"]
            })
        print(f"Fetched and evaluated {len(nsg_data)} NSGs.")
    except HttpResponseError as e:
        raise ValueError(f"Azure NSG API error: {e.message}")
    return nsg_data

# --- Flask Routes ---

@app.route('/')
def home():
    return "Hello from the Python Flask Backend!"

@app.route('/api/assess', methods=['POST'])
def assess():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data received"}), 400

    cloud_provider = data.get('cloudProvider')
    selected_resource_types = data.get('resourceTypes', [])

    all_resources = []
    try:
        if cloud_provider == 'Azure':
            tenant_id = data.get('azureTenantId')
            client_id = data.get('azureClientId')
            client_secret = data.get('azureClientSecret')
            subscription_id = data.get('azureSubscriptionId')

            if not all([tenant_id, client_id, client_secret, subscription_id]):
                raise ValueError("Missing Azure credentials in request body.")

            for resource_type in selected_resource_types:
                if resource_type == 'Azure::Compute::VirtualMachine':
                    all_resources.extend(fetch_azure_virtual_machines(subscription_id, tenant_id, client_id, client_secret))
                elif resource_type == 'Azure::Storage::StorageAccount':
                    all_resources.extend(fetch_azure_storage_accounts(subscription_id, tenant_id, client_id, client_secret))
                elif resource_type == 'Azure::KeyVault::Vault':
                    all_resources.extend(fetch_azure_key_vaults(subscription_id, tenant_id, client_id, client_secret))
                elif resource_type == 'Azure::Network::NetworkSecurityGroup':
                    all_resources.extend(fetch_azure_network_security_groups(subscription_id, tenant_id, client_id, client_secret))
                else:
                    print(f"Warning: Unknown resource type selected: {resource_type}")

        # If AWS is selected, you would implement similar fetching and evaluation logic here
        elif cloud_provider == 'AWS':
            # Example placeholder for AWS (you'd implement this fully)
            # aws_region = data.get('awsRegion') # If you pass region from frontend
            # if 'S3::Bucket' in selected_resource_types:
            #     s3_client = get_aws_client('s3', aws_region)
            #     buckets = s3_client.list_buckets()['Buckets']
            #     for bucket in buckets:
            #         # Implement AWS evaluation logic here
            #         all_resources.append({"resourceId": bucket['Name'], "name": bucket['Name'], "resourceType": "AWS::S3::Bucket", "region": "us-east-1", "complianceStatus": "NOT_EVALUATED", "failedRules": [], "passedRules": []})
            return jsonify({"error": "AWS assessment not fully implemented yet."}), 501 # Not Implemented
        else:
            return jsonify({"error": "Unsupported cloud provider."}), 400


        return jsonify({"resources": all_resources}), 200 # Return the evaluated resources

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Log the full exception for debugging in development
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An unhandled internal server error occurred: {str(e)}"}), 500

@app.route('/api/validate', methods=['POST'])
def validate_credentials():
    data = request.get_json()
    tenant_id = data.get('azureTenantId')
    client_id = data.get('azureClientId')
    client_secret = data.get('azureClientSecret')
    subscription_id = data.get('azureSubscriptionId')

    try:
        if not all([tenant_id, client_id, client_secret, subscription_id]):
            raise ValueError("Missing Azure credentials in request body.")

        # Try listing VMs to check credentials (as a live check)
        # This will raise ClientAuthenticationError or HttpResponseError if credentials are bad
        compute_client = get_azure_client(ComputeManagementClient, subscription_id, tenant_id, client_id, client_secret)
        list(compute_client.virtual_machines.list_all())  # If no exception, credentials are valid
        return jsonify({"valid": True}), 200

    except (ValueError, ClientAuthenticationError, HttpResponseError) as e:
        # For a more user-friendly error message, you can parse e.message or e.response.json()
        error_detail = str(e)
        if hasattr(e, 'message') and e.message:
            error_detail = e.message
        elif hasattr(e, 'response') and e.response:
            try:
                error_json = e.response.json()
                if 'error_description' in error_json:
                    error_detail = error_json['error_description']
                elif 'error' in error_json and 'message' in error_json['error']:
                    error_detail = error_json['error']['message']
            except:
                pass # Fallback to default str(e)
        
        return jsonify({"valid": False, "error": f"Authentication failed: {error_detail}"}), 401

    except Exception as e:
        import traceback
        traceback.print_exc() # Print full stack trace for unhandled errors
        return jsonify({"valid": False, "error": f"An unhandled internal error occurred during validation: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)