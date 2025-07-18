#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# The first argument to this script is the unique deployment directory
DEPLOY_DIR=$1
VAR_FILE="terraform.tfvars"

if [ -z "$DEPLOY_DIR" ]; then
  echo "Error: Deployment directory not provided."
  exit 1
fi

echo "--- Changing to deployment directory: $DEPLOY_DIR ---"
cd "$DEPLOY_DIR"

echo "--- Running terraform init ---"
terraform init -no-color

echo "--- Running terraform validate ---"
terraform validate -no-color

# Check if the variables file exists before using it
if [ -f "$VAR_FILE" ]; then
  echo "--- Applying with variables file: $VAR_FILE ---"
  terraform apply -var-file="$VAR_FILE" -auto-approve -no-color
else
  echo "--- Applying without variables file ---"
  terraform apply -auto-approve -no-color
fi


echo "--- ✅ Infrastructure Deployed Successfully ---"