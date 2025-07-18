#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# The first argument is the unique deployment directory
DEPLOY_DIR=$1
VAR_FILE="terraform.tfvars"

if [ -z "$DEPLOY_DIR" ] || [ ! -d "$DEPLOY_DIR" ]; then
  echo "Error: Valid deployment directory not provided."
  exit 1
fi

echo "--- Changing to deployment directory: $DEPLOY_DIR ---"
cd "$DEPLOY_DIR"

echo "--- Running terraform destroy ---"

# Check if the variables file exists before using it
if [ -f "$VAR_FILE" ]; then
  echo "--- Destroying with variables file: $VAR_FILE ---"
  terraform destroy -var-file="$VAR_FILE" -auto-approve -no-color
else
  echo "--- Destroying without variables file ---"
  terraform destroy -auto-approve -no-color
fi

echo "--- ✅ Infrastructure Destroyed Successfully ---"