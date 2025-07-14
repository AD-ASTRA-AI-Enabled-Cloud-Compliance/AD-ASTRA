# ---------------------------------------------------------------------------------------------------------------
# Added by Harsimran Kaur
# This file is part of pipeline 3.
# This file defines the BaselineTerraformGenerator class, which converts cloud security context JSON files
# into Terraform configuration files for AWS, Azure, and GCP. It handles resource naming, variable extraction,
# provider blocks, and automatic formatting and validation of the
# ---------------------------------------------------------------------------------------------------------------

import json
import os
import subprocess
from datetime import datetime
from io import StringIO

from src.utils.templates import TerraformTemplateWriter

INDENT = "  "

class BaselineTerraformGenerator:
    def __init__(self, session):
        self.session = session
        self.sessionID = session.sessionID
        self.companyID = session.companyID
        self.userID = session.userID

        self.mongo = session.mongo
        self.qdrant = session.qdrant
        self.ws = session.ws.send_progress_update

        self.temperature = session.temperature
        self.chunk_size = session.chunk_size
        self.chunk_overlap = session.chunk_overlap
        self.top_k = session.top_k
        self.max_token_limit = session.max_token_limit


    def generate_baseline_from_provider_json(self, json_data, tf_output_path=None, framework=None):
        data = json_data

        if not isinstance(data, list):
            raise Exception("Expected JSON to be a list of rule objects")

        provider = data[0].get("provider", "azure").lower()
        resources = []
        all_variable_names = set()
        resource_counts = {}

        for entry in data:
            settings_dict = entry.get("settings", {})
            for resource_type, resource_settings in settings_dict.items():
                self.collect_variable_names(resource_settings, all_variable_names)

                base_name = self.sanitize_name(resource_type)
                count = resource_counts.get(base_name, 0) + 1
                resource_counts[base_name] = count
                unique_name = f"{base_name}_{count}" if count > 1 else base_name

                resources.append({
                    "resource_type": resource_type,
                    "creation_strategy": "always_create",
                    "settings": resource_settings,
                    "name": unique_name
                })

        if tf_output_path:
            with open(tf_output_path, "w", encoding="utf-8") as tf:
                self.write_provider_block(tf, provider, framework or "baseline")
                for res in resources:
                    resource_type = res["resource_type"]
                    settings = res.get("settings", {})
                    res_name = res.get("name", resource_type)
                    tf.write(f"# Resource: {resource_type}\n")
                    resource_name = self.sanitize_name(res_name)
                    tf_block = TerraformTemplateWriter.render_tf_resource(
                        resource_type,
                        resource_name,
                        settings,
                        framework
                    )
                    tf.write(tf_block)

            var_file = os.path.join(os.path.dirname(tf_output_path), "variables.tf")
            with open(var_file, "w", encoding="utf-8") as vf:
                for var_name in sorted(all_variable_names):
                    vf.write(f'variable "{var_name}" {{}}\n')

            # Run format and validate
            self.format_and_validate(os.path.dirname(tf_output_path))

            # Read .terraform.lock.hcl
            lockfile_path = os.path.join(os.path.dirname(tf_output_path), ".terraform.lock.hcl")
            if os.path.exists(lockfile_path):
                with open(lockfile_path, "r", encoding="utf-8") as lf:
                    lockfile_content = lf.read()
            else:
                lockfile_content = ""

            # Read formatted terraform file
            with open(tf_output_path, "r", encoding="utf-8") as tf:
                terraform_content = tf.read()

            # Read variables.tf
            with open(var_file, "r", encoding="utf-8") as vf:
                variables_content = vf.read()

            # Return all artifacts (NO plan)
            return {
                "terraform": terraform_content,
                "variables": variables_content,
                "lockfile": lockfile_content
            }

        else:
            tf_buffer = StringIO()
            self.write_provider_block(tf_buffer, provider, framework or "baseline")
            for res in resources:
                resource_type = res["resource_type"]
                settings = res.get("settings", {})
                res_name = res.get("name", resource_type)
                tf_buffer.write(f"# Resource: {resource_type}\n")
                resource_name = self.sanitize_name(res_name)
                tf_block = TerraformTemplateWriter.render_tf_resource(
                    resource_type,
                    resource_name,
                    settings,
                    framework
                )
                tf_buffer.write(tf_block)

            return {
                "terraform": tf_buffer.getvalue(),
                "variables": "",
                "lockfile": ""
            }

    def collect_variable_names(self, settings, variable_names):
        if isinstance(settings, dict):
            for v in settings.values():
                self.collect_variable_names(v, variable_names)
        elif isinstance(settings, list):
            for i in settings:
                self.collect_variable_names(i, variable_names)
        elif isinstance(settings, str):
            if settings.startswith("${var.") and settings.endswith("}"):
                var_name = settings[6:-1]
                variable_names.add(var_name)

    def format_and_validate(self, tf_directory):
        try:
            print(f"🔍 Running terraform fmt in {tf_directory}...")
            subprocess.run(["terraform", "fmt", tf_directory], check=True)
            self.ws("✅ terraform fmt completed.")
        except subprocess.CalledProcessError as e:
            self.ws(f"⚠️ terraform fmt failed: {e}")

        try:
            print(f"🔍 Running terraform init -upgrade in {tf_directory}...")
            subprocess.run(["terraform", "init", "-upgrade", "-backend=false"], cwd=tf_directory, check=True)
            self.ws("✅ terraform init completed.")
        except subprocess.CalledProcessError as e:
            self.ws(f"⚠️ terraform init failed: {e}")

        try:
            print(f"🔍 Running terraform validate in {tf_directory}...")
            self.ws(f"🔍 Running terraform validate in ...")
            subprocess.run(["terraform", "validate"], cwd=tf_directory, check=True)
            self.ws("✅ terraform validate passed.")
        except subprocess.CalledProcessError as e:
            self.ws(f"⚠️ terraform validate failed: {e}")

    def sanitize_name(self, service):
        return (
            service.replace("azurerm_", "")
            .replace("azuread_", "")
            .replace("azure_", "")
            .replace("-", "_")
        )

    def write_provider_block(self, tf, provider, framework):
        if provider == "aws":
            tf.write(f'// 🚧 Auto-generated {framework.upper()} Baseline for {provider.upper()}\n\n')
            tf.write('terraform {\n')
            tf.write(f'{INDENT}required_version = ">= 1.1.0"\n')
            tf.write(f'{INDENT}required_providers {{\n')
            tf.write(f'{INDENT*2}aws = {{ source = "hashicorp/aws", version = "~> 5.0" }}\n')
            tf.write(f'{INDENT}}}\n}}\n\n')
            tf.write('provider "aws" {\n  region = "us-east-1"\n}\n\n')
        elif provider == "azure":
            tf.write(f'// 🚧 Auto-generated {framework.upper()} Baseline for {provider.upper()}\n\n')
            tf.write('terraform {\n')
            tf.write(f'{INDENT}required_version = ">= 1.1.0"\n')
            tf.write(f'{INDENT}required_providers {{\n')
            tf.write(f'{INDENT*2}azurerm = {{ source = "hashicorp/azurerm", version = "~> 3.50.0" }}\n')
            tf.write(f'{INDENT*2}azuread = {{ source = "hashicorp/azuread", version = "~> 2.0" }}\n')
            tf.write(f'{INDENT}}}\n}}\n\n')
            tf.write('provider "azurerm" {\n  features {}\n}\n\n')
        elif provider == "gcp":
            tf.write(f'// 🚧 Auto-generated {framework.upper()} Baseline for {provider.upper()}\n\n')
            tf.write('terraform {\n')
            tf.write(f'{INDENT}required_version = ">= 1.1.0"\n')
            tf.write(f'{INDENT}required_providers {{\n')
            tf.write(f'{INDENT*2}google = {{ source = "hashicorp/google", version = "~> 5.0" }}\n')
            tf.write(f'{INDENT}}}\n}}\n\n')
            tf.write('provider "google" {\n  project = "<project_id>"\n  region = "us-central1"\n}\n\n')
