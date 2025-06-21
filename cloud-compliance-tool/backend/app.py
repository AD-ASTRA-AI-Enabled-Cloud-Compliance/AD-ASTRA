# backend/app.py

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import random
import time

# --- Import REAL Cloud SDKs ---
import boto3
from botocore.exceptions import ClientError as BotoClientError

from azure.identity import DefaultAzureCredential
from azure.core.exceptions import ClientAuthenticationError, HttpResponseError
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.storage import StorageManagementClient
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.keyvault import KeyVaultManagementClient
from azure.mgmt.network import NetworkManagementClient # For Azure Network Resources

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# --- Helper to get AWS client securely ---
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

# --- Helper to get Azure client securely ---
def get_azure_client(client_class, subscription_id):
    try:
        credential = DefaultAzureCredential()
        return client_class(credential, subscription_id)
    except ClientAuthenticationError as e:
        raise ValueError(f"Azure authentication failed. Check your AZURE_ env variables. Error: {e.message}")
    except Exception as e:
        raise ValueError(f"Failed to create Azure client: {e}")


# --- AWS Data Retrieval Functions ---
def fetch_aws_s3_buckets(region):
    """Fetches actual S3 bucket data including public access and encryption."""
    print(f"Fetching AWS S3 Buckets in region: {region} with actual properties...")
    s3_buckets_data = []
    try:
        s3_client = get_aws_client('s3', region)
        response = s3_client.list_buckets()
        for bucket in response['Buckets']:
            bucket_name = bucket['Name']
            resource_properties = {}

            try:
                public_access_block_response = s3_client.get_public_access_block(Bucket=bucket_name)
                config = public_access_block_response['PublicAccessBlockConfiguration']
                resource_properties['publiclyAccessible'] = not (
                    config.get('BlockPublicAcls', False) and
                    config.get('IgnorePublicAcls', False) and
                    config.get('BlockPublicPolicy', False) and
                    config.get('RestrictPublicBuckets', False)
                )
            except BotoClientError as e:
                if e.response['Error']['Code'] == 'NoSuchPublicAccessBlockConfiguration':
                    resource_properties['publiclyAccessible'] = True
                else:
                    print(f"Warning: Could not get public access block for {bucket_name}: {e}")
                    resource_properties['publiclyAccessible'] = True

            try:
                encryption_response = s3_client.get_bucket_encryption(Bucket=bucket_name)
                resource_properties['encrypted'] = 'Rules' in encryption_response.get('ServerSideEncryptionConfiguration', {})
            except BotoClientError as e:
                if e.response['Error']['Code'] == 'ServerSideEncryptionConfigurationNotFoundError':
                    resource_properties['encrypted'] = False
                else:
                    print(f"Warning: Could not get encryption for {bucket_name}: {e}")
                    resource_properties['encrypted'] = False

            resource_properties['loggingEnabled'] = random.choice([True, False]) # Still random for simplicity for now

            s3_buckets_data.append({
                "resourceId": f"arn:aws:s3:::{bucket_name}",
                "resourceType": "AWS::S3::Bucket",
                "region": region,
                "name": bucket_name,
                "creationDate": bucket['CreationDate'].isoformat(),
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(s3_buckets_data)} S3 buckets.")
    except BotoClientError as e:
        if e.response['Error']['Code'] == 'InvalidClientTokenId':
            raise ValueError("AWS credentials are invalid. Please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env.")
        elif e.response['Error']['Code'] == 'UnauthorizedOperation':
            raise ValueError("AWS user lacks permissions to list S3 buckets or get their properties. Grant 's3:ListAllMyBuckets', 's3:GetPublicAccessBlock', 's3:GetBucketEncryption'.")
        else:
            raise ValueError(f"AWS S3 API error: {e}")
    except ValueError as e:
        raise e
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching AWS S3 buckets: {e}")
    return s3_buckets_data

def fetch_aws_ec2_instances(region):
    """Placeholder: Fetches actual EC2 instances (simplified properties)."""
    print(f"Fetching AWS EC2 Instances in region: {region}...")
    ec2_instances_data = []
    try:
        ec2_client = get_aws_client('ec2', region)
        response = ec2_client.describe_instances()
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                instance_id = instance['InstanceId']
                public_ip = instance.get('PublicIpAddress')
                resource_properties = {
                    "publiclyAccessible": bool(public_ip), # True if public IP exists
                    "encrypted": random.choice([True, False]), # Simplistic, actual EBS encryption check is complex
                    "hasIAMRole": 'IamInstanceProfile' in instance # Checks if an IAM role is attached
                }
                ec2_instances_data.append({
                    "resourceId": instance_id,
                    "resourceType": "AWS::EC2::Instance",
                    "region": region,
                    "name": next((tag['Value'] for tag in instance.get('Tags', []) if tag['Key'] == 'Name'), instance_id),
                    "properties": resource_properties
                })
        print(f"Successfully fetched {len(ec2_instances_data)} EC2 Instances.")
    except BotoClientError as e:
        raise ValueError(f"AWS EC2 API error: {e}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching AWS EC2 instances: {e}")
    return ec2_instances_data

def fetch_aws_lambda_functions(region):
    """Placeholder: Fetches actual Lambda Functions (simplified properties)."""
    print(f"Fetching AWS Lambda Functions in region: {region}...")
    lambda_functions_data = []
    try:
        lambda_client = get_aws_client('lambda', region)
        response = lambda_client.list_functions()
        for func in response['Functions']:
            func_name = func['FunctionName']
            resource_properties = {
                "runtime": func['Runtime'],
                "memory": func['Memory'],
                "timeout": func['Timeout'],
                "hasDeadLetterQueue": 'DeadLetterConfig' in func and 'TargetArn' in func['DeadLetterConfig'],
                "loggingEnabled": True # Most Lambdas have default logging
            }
            lambda_functions_data.append({
                "resourceId": func['FunctionArn'],
                "resourceType": "AWS::Lambda::Function",
                "region": region,
                "name": func_name,
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(lambda_functions_data)} Lambda Functions.")
    except BotoClientError as e:
        raise ValueError(f"AWS Lambda API error: {e}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching AWS Lambda functions: {e}")
    return lambda_functions_data

def fetch_aws_rds_instances(region):
    """Placeholder: Fetches actual RDS Instances (simplified properties)."""
    print(f"Fetching AWS RDS Instances in region: {region}...")
    rds_instances_data = []
    try:
        rds_client = get_aws_client('rds', region)
        response = rds_client.describe_db_instances()
        for db_instance in response['DBInstances']:
            instance_id = db_instance['DBInstanceIdentifier']
            resource_properties = {
                "publiclyAccessible": db_instance.get('PubliclyAccessible', False),
                "encrypted": db_instance.get('StorageEncrypted', False),
                "multiAZ": db_instance.get('MultiAZ', False),
                "backupEnabled": db_instance.get('BackupRetentionPeriod', 0) > 0
            }
            rds_instances_data.append({
                "resourceId": db_instance['DBInstanceArn'],
                "resourceType": "AWS::RDS::DBInstance",
                "region": region,
                "name": instance_id,
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(rds_instances_data)} RDS Instances.")
    except BotoClientError as e:
        raise ValueError(f"AWS RDS API error: {e}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching AWS RDS instances: {e}")
    return rds_instances_data

def fetch_aws_security_groups(region):
    """Fetches actual AWS Security Groups (simplified properties)."""
    print(f"Fetching AWS Security Groups in region: {region}...")
    security_groups_data = []
    try:
        ec2_client = get_aws_client('ec2', region) # Security Groups are managed by EC2 client
        response = ec2_client.describe_security_groups()
        for sg in response['SecurityGroups']:
            sg_id = sg['GroupId']
            # Simplistic check for overly permissive rules (e.g., ingress from 0.0.0.0/0 on common ports)
            has_permissive_ingress = False
            for perm in sg.get('IpPermissions', []):
                for ip_range in perm.get('IpRanges', []):
                    if ip_range.get('CidrIp') == '0.0.0.0/0':
                        # Check common risky ports for illustrative purposes
                        if perm.get('FromPort') is None and perm.get('ToPort') is None: # All ports
                            has_permissive_ingress = True
                            break
                        if perm.get('FromPort') in [22, 23, 80, 443, 3389, 8080] or \
                           perm.get('ToPort') in [22, 23, 80, 443, 3389, 8080]:
                            has_permissive_ingress = True
                            break
                if has_permissive_ingress:
                    break

            resource_properties = {
                "hasPublicIngress": has_permissive_ingress, # True if 0.0.0.0/0 ingress found
                "egressToAllTraffic": any(
                    'IpRanges' in perm and {'CidrIp': '0.0.0.0/0'} in perm['IpRanges']
                    for perm in sg.get('IpPermissionsEgress', [])
                ),
                "isDefaultSG": sg['GroupName'] == 'default' # Default security groups are often reviewed
            }

            security_groups_data.append({
                "resourceId": sg_id,
                "resourceType": "AWS::EC2::SecurityGroup",
                "region": region,
                "name": sg['GroupName'],
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(security_groups_data)} Security Groups.")
    except BotoClientError as e:
        raise ValueError(f"AWS Security Group API error: {e}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching AWS Security Groups: {e}")
    return security_groups_data


# --- Azure Data Retrieval Functions ---
def fetch_azure_storage_accounts(subscription_id):
    """Fetches actual Azure Storage Accounts with encryption status and simulated public access."""
    print(f"Fetching Azure Storage Accounts in Subscription: {subscription_id} with actual properties...")
    storage_accounts_data = []
    try:
        storage_client = get_azure_client(StorageManagementClient, subscription_id)

        for sa in storage_client.storage_accounts.list():
            resource_properties = {}

            resource_properties['encryptionEnabled'] = sa.encryption and sa.encryption.key_source != 'Microsoft.Storage' # Assuming MS managed key is "enabled" or customer-managed

            # Simplified public access check for Storage Account
            resource_properties['publiclyAccessible'] = False
            if sa.network_rule_set:
                # If default action is allow and no specific deny rules (simplified)
                if sa.network_rule_set.default_action == 'Allow' and not (sa.network_rule_set.ip_rules or sa.network_rule_set.virtual_network_rules):
                    resource_properties['publiclyAccessible'] = True
            elif sa.allow_blob_public_access: # Check for public blob access feature
                 resource_properties['publiclyAccessible'] = True


            resource_properties['networkSecurityGroupApplied'] = random.choice([True, False]) # Still random for simplicity


            storage_accounts_data.append({
                "resourceId": sa.id,
                "resourceType": "Azure::Storage::StorageAccount",
                "region": sa.location,
                "name": sa.name,
                "creationDate": sa.creation_time.isoformat() if sa.creation_time else None,
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(storage_accounts_data)} Azure Storage Accounts.")
    except ValueError as e:
        raise e
    except HttpResponseError as e:
        if e.status_code == 401 or e.status_code == 403:
            raise ValueError(f"Azure authentication or authorization error. Check your AZURE_ credentials and permissions. Status: {e.status_code}, Message: {e.message}")
        else:
            raise ValueError(f"Azure Storage API error: {e.message}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching Azure Storage Accounts: {e}")
    return storage_accounts_data

def fetch_azure_virtual_machines(subscription_id):
    """Placeholder: Fetches actual Azure Virtual Machines (simplified properties)."""
    print(f"Fetching Azure Virtual Machines in Subscription: {subscription_id}...")
    vms_data = []
    try:
        compute_client = get_azure_client(ComputeManagementClient, subscription_id)
        for vm in compute_client.virtual_machines.list_all():
            vm_id = vm.id
            resource_properties = {
                "publiclyAccessible": False, # Requires checking associated NICs and NSGs for real public access
                "encryptionEnabled": vm.os_profile and vm.os_profile.linux_configuration and vm.os_profile.linux_configuration.patch_settings and vm.os_profile.linux_configuration.patch_settings.assessment_mode == 'AutomaticByPlatform', # Very simplified, needs proper disk encryption check
                "hasNetworkSecurityGroup": True if vm.network_profile and vm.network_profile.network_interfaces else False # Simplistic check
            }
            vms_data.append({
                "resourceId": vm_id,
                "resourceType": "Azure::Compute::VirtualMachine",
                "region": vm.location,
                "name": vm.name,
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(vms_data)} Virtual Machines.")
    except HttpResponseError as e:
        raise ValueError(f"Azure Compute API error: {e.message}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching Azure Virtual Machines: {e}")
    return vms_data

def fetch_azure_key_vaults(subscription_id):
    """Placeholder: Fetches actual Azure Key Vaults (simplified properties)."""
    print(f"Fetching Azure Key Vaults in Subscription: {subscription_id}...")
    key_vaults_data = []
    try:
        keyvault_client = get_azure_client(KeyVaultManagementClient, subscription_id)
        for vault in keyvault_client.vaults.list():
            vault_id = vault.id
            resource_properties = {
                "privateEndpointEnabled": bool(vault.properties.private_endpoint_connections), # Checks if there are private endpoint connections
                "softDeleteEnabled": vault.properties.enable_soft_delete,
                "purgeProtectionEnabled": vault.properties.enable_purge_protection
            }
            key_vaults_data.append({
                "resourceId": vault_id,
                "resourceType": "Azure::KeyVault::Vault",
                "region": vault.location,
                "name": vault.name,
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(key_vaults_data)} Key Vaults.")
    except HttpResponseError as e:
        raise ValueError(f"Azure Key Vault API error: {e.message}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching Azure Key Vaults: {e}")
    return key_vaults_data

def fetch_azure_network_security_groups(subscription_id):
    """Fetches actual Azure Network Security Groups (simplified properties)."""
    print(f"Fetching Azure Network Security Groups in Subscription: {subscription_id}...")
    nsgs_data = []
    try:
        network_client = get_azure_client(NetworkManagementClient, subscription_id)
        for nsg in network_client.network_security_groups.list_all():
            nsg_id = nsg.id
            # Simplistic check for overly permissive ingress rules (priority and source address prefix 'Internet' or '*')
            has_permissive_ingress = False
            for rule in nsg.security_rules:
                if rule.direction == 'Inbound' and rule.access == 'Allow':
                    if (rule.source_address_prefix == '*' or rule.source_address_prefix == 'Internet' or rule.source_address_prefix == '0.0.0.0/0'): # Added 0.0.0.0/0 for completeness
                        # Check common risky ports for illustrative purposes
                        if rule.destination_port_range in ['*', '22', '23', '80', '443', '3389', '8080'] or \
                           (rule.destination_port_ranges and any(p in ['*', '22', '23', '80', '443', '3389', '8080'] for p in rule.destination_port_ranges)):
                            has_permissive_ingress = True
                            break
            
            resource_properties = {
                "hasPublicIngress": has_permissive_ingress,
                # For Azure NSGs, default rules can't be deleted, only overridden.
                # A common check is for custom rules that are too permissive, not default rule modification.
                # This property name 'defaultRulesModified' might be misleading, let's keep it simple for now.
                "customRulesExist": len(nsg.security_rules) > len(nsg.default_security_rules) if nsg.default_security_rules else len(nsg.security_rules) > 0
            }

            nsgs_data.append({
                "resourceId": nsg_id,
                "resourceType": "Azure::Network::NetworkSecurityGroup",
                "region": nsg.location,
                "name": nsg.name,
                "properties": resource_properties
            })
        print(f"Successfully fetched {len(nsgs_data)} Network Security Groups.")
    except HttpResponseError as e:
        raise ValueError(f"Azure Network API error: {e.message}")
    except Exception as e:
        raise ValueError(f"An unexpected error occurred fetching Azure Network Security Groups: {e}")
    return nsgs_data


# --- Mock Compliance Check Function (Add rules for new properties) ---
# This function applies generic rules based on common properties like 'publiclyAccessible' and 'encrypted'.
# It is extensible to check other properties as you add them in resource fetching functions.
def run_mock_compliance_checks(resources, frameworks, custom_rules):
    report = []
    all_possible_rules = {
        "HIPAA": [
            {"name": "Data Encryption at Rest", "field": "encrypted", "expected": True},
            {"name": "Access Control Strict", "field": "publiclyAccessible", "expected": False},
            {"name": "No Overly Permissive Network Access", "field": "hasPublicIngress", "expected": False}, # NEW RULE
            {"name": "Soft Delete Enabled (for Key Vaults)", "field": "softDeleteEnabled", "expected": True}, # For Key Vaults
        ],
        "PCI": [
            {"name": "No Publicly Accessible Resources", "field": "publiclyAccessible", "expected": False},
            {"name": "Logging Enabled", "field": "loggingEnabled", "expected": True},
            {"name": "Restrict Network Ingress", "field": "hasPublicIngress", "expected": False}, # NEW RULE
            {"name": "Default Security Groups Not Overly Permissive", "field": "isDefaultSG", "expected": False}, # NEW RULE (for AWS default SG)
            {"name": "Custom NSG Rules Not Overly Permissive", "field": "customRulesExist", "expected": False}, # NEW RULE (for Azure NSG)
        ],
        "ISO": [
            {"name": "Data Encrypted", "field": "encrypted", "expected": True},
            {"name": "Network Security Best Practices", "field": "networkSecurityGroupApplied", "expected": True},
            {"name": "Network Access Controls Enforced", "field": "hasPublicIngress", "expected": False}, # NEW RULE
            {"name": "Purge Protection Enabled (for Key Vaults)", "field": "purgeProtectionEnabled", "expected": True}, # For Key Vaults
        ],
        "NIST": [
            {"name": "Encryption in Use", "field": "encrypted", "expected": True},
            {"name": "Proper Access Restrictions", "field": "publiclyAccessible", "expected": False},
            {"name": "Secure Network Boundaries", "field": "hasPublicIngress", "expected": False}, # NEW RULE
            {"name": "Multi-AZ Deployment (for Databases)", "field": "multiAZ", "expected": True}, # For RDS
        ],
    }

    for resource in resources:
        resource_status = "COMPLIANT"
        failed_rules = []
        passed_rules = []

        # Check against selected frameworks
        for framework in frameworks:
            if framework in all_possible_rules:
                for rule in all_possible_rules[framework]:
                    # Check if the rule applies to the current resource type (optional, but good practice)
                    # For simplicity, if a rule field is missing, it's just skipped for that resource.
                    prop_value = resource["properties"].get(rule["field"])
                    if prop_value is not None:
                        if prop_value == rule["expected"]:
                            passed_rules.append({"framework": framework, "ruleName": rule["name"]})
                        else:
                            failed_rules.append({
                                "framework": framework,
                                "ruleName": rule["name"],
                                "details": f"Resource property '{rule['field']}' is '{prop_value}', expected '{rule['expected']}'."
                            })
                            resource_status = "NON_COMPLIANT"

        # Check against custom rules (if provided) - simplified
        if custom_rules:
            # Here, custom_rules is the parsed JSON dictionary.
            # You would iterate through your custom rule definitions and apply them.
            # For demonstration, we'll continue with a simple random check.
            if random.random() < 0.3: # 30% chance to fail a custom rule
                failed_rules.append({
                    "framework": "Custom",
                    "ruleName": "Simulated Custom Rule Check",
                    "details": "Resource failed a generic custom rule check based on custom rules."
                })
                resource_status = "NON_COMPLIANT"
            else:
                passed_rules.append({
                    "framework": "Custom",
                    "ruleName": "Simulated Custom Rule Check"
                })

        if len(failed_rules) > 0:
            resource_status = "NON_COMPLIANT"
        elif len(passed_rules) > 0:
            resource_status = "COMPLIANT"
        else:
            resource_status = "NOT_APPLICABLE"

        report.append({
            "resourceId": resource["resourceId"],
            "resourceType": resource["resourceType"],
            "region": resource["region"],
            "complianceStatus": resource_status,
            "failedRules": failed_rules,
            "passedRules": passed_rules,
            "resourceDetails": resource
        })
    return report

# --- Flask Routes ---

@app.route('/')
def home():
    return "Hello from the Python Flask Backend!"

@app.route('/api/test_env')
def test_env():
    aws_key_id = os.getenv('AWS_ACCESS_KEY_ID', 'Not Set')
    azure_client_id = os.getenv('AZURE_CLIENT_ID', 'Not Set')

    return jsonify({
        "message": "Environment variables loaded:",
        "AWS_ACCESS_KEY_ID_STATUS": "Set" if aws_key_id != 'Not Set' else "Not Set",
        "AZURE_CLIENT_ID_STATUS": "Set" if azure_client_id != 'Not Set' else "Not Set",
    })


@app.route('/api/assess', methods=['POST'])
def assess():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data received"}), 400

    cloud_provider = data.get('cloudProvider')
    frameworks = data.get('frameworks', [])
    custom_rules = data.get('customRules', None)
    selected_resource_types = data.get('resourceTypes', [])

    print(f"\n--- Assessment Request Received ---")
    print(f"Cloud Provider: {cloud_provider}")
    print(f"Selected Frameworks: {', '.join(frameworks)}")
    print(f"Selected Resource Types: {', '.join(selected_resource_types)}")
    print(f"Custom Rules enabled: {bool(custom_rules)}")
    print(f"-----------------------------------\n")

    all_resources = []
    try:
        aws_region = os.getenv('AWS_REGION', 'us-east-1')
        azure_subscription_id = os.getenv('AZURE_SUBSCRIPTION_ID')
        if not azure_subscription_id and cloud_provider == 'Azure':
            raise ValueError("AZURE_SUBSCRIPTION_ID not found in .env for Azure assessment.")

        for resource_type in selected_resource_types:
            if cloud_provider == 'AWS':
                if resource_type == 'S3::Bucket':
                    all_resources.extend(fetch_aws_s3_buckets(aws_region))
                elif resource_type == 'EC2::Instance':
                    all_resources.extend(fetch_aws_ec2_instances(aws_region))
                elif resource_type == 'Lambda::Function':
                    all_resources.extend(fetch_aws_lambda_functions(aws_region))
                elif resource_type == 'RDS::DBInstance':
                    all_resources.extend(fetch_aws_rds_instances(aws_region))
                elif resource_type == 'EC2::SecurityGroup':
                    all_resources.extend(fetch_aws_security_groups(aws_region))
                # Add more AWS resource type fetches here
            elif cloud_provider == 'Azure':
                if resource_type == 'Azure::Storage::StorageAccount':
                    all_resources.extend(fetch_azure_storage_accounts(azure_subscription_id))
                elif resource_type == 'Azure::Compute::VirtualMachine':
                    all_resources.extend(fetch_azure_virtual_machines(azure_subscription_id))
                elif resource_type == 'Azure::KeyVault::Vault':
                    all_resources.extend(fetch_azure_key_vaults(azure_subscription_id))
                elif resource_type == 'Azure::Network::NetworkSecurityGroup':
                    all_resources.extend(fetch_azure_network_security_groups(azure_subscription_id))
                # Add more Azure resource type fetches here
            else:
                print(f"Warning: Unsupported resource type '{resource_type}' for {cloud_provider} skipped.")
        
        if not all_resources and len(selected_resource_types) > 0:
            return jsonify({"report": [], "error": f"No resources found for selected types in {cloud_provider} or permissions issue."}), 200

        time.sleep(1) # Simulate processing delay

        final_report = run_mock_compliance_checks(all_resources, frameworks, custom_rules)

        return jsonify({"report": final_report}), 200

    except ValueError as e:
        error_message = str(e)
        print(f"Configuration/Credential/Permission Error: {error_message}")
        return jsonify({"error": error_message}), 400
    except Exception as e:
        error_message = f"An unhandled error occurred during assessment: {str(e)}"
        print(f"Unhandled Error: {error_message}")
        return jsonify({"error": error_message}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)