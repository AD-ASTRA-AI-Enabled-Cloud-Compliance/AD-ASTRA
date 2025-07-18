#!/bin/bash

# Define the path to your Terraform configuration files on the VM
# This assumes you copied the infra_deploy folder to your home directory in Phase 1.
TERRAFORM_DIR="/Users/puneetsharma/cric-ai/AD-ASTRA/backend/infra_deploy/terraform_infra/" # IMPORTANT: Replace 'your_username' with the actual username on your Azure VM

# Log file for Terraform output
LOG_FILE="/Users/puneetsharma/cric-ai/AD-ASTRA/backend/infra_deploy/terraform_infra/terraform_deployment.log" # IMPORTANT: Replace 'your_username' and add a proper log file name

# --- Start of Deployment Logic ---

echo "$(date): Starting Terraform deployment..." | tee -a "$LOG_FILE"

# Navigate to the Terraform directory
cd "$TERRAFORM_DIR" || { echo "$(date): Error: Terraform directory '$TERRAFORM_DIR' not found!" | tee -a "$LOG_FILE"; exit 1; }

# Initialize Terraform (downloads providers, sets up backend, if any)
echo "$(date): Running terraform init..." | tee -a "$LOG_FILE"
terraform init -backend-config="resource_group_name=tfstate_rg" -backend-config="storage_account_name=tfstate<unique_id>" -backend-config="container_name=tfstate" -backend-config="key=terraform.tfstate" || { echo "$(date): Terraform init failed! Check logs." | tee -a "$LOG_FILE"; exit 1; }

# Plan Terraform changes (optional, but good for verification)
echo "$(date): Running terraform plan..." | tee -a "$LOG_FILE"
terraform plan -out="tfplan" || { echo "$(date): Terraform plan failed! Check logs." | tee -a "$LOG_FILE"; exit 1; }

# Apply Terraform changes
# The -auto-approve flag is used for automation; it skips interactive confirmation.
# Be extremely cautious with this in production environments without proper safeguards.
echo "$(date): Running terraform apply..." | tee -a "$LOG_FILE"
terraform apply -auto-approve "tfplan" || { echo "$(date): Terraform apply failed! Check logs." | tee -a "$LOG_FILE"; exit 1; }

echo "$(date): Terraform deployment completed successfully." | tee -a "$LOG_FILE"

# --- End of Deployment Logic ---

# Important: The script's final output to stdout will be returned to your local web page.
# You can customize what gets echoed here.
echo "Deployment script finished. Check $LOG_FILE for full details on the VM."
exit 0