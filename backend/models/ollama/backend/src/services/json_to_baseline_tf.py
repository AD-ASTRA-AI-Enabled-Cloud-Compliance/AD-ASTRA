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

from src.utils.templates import TerraformTemplateWriter

INDENT = "  "


class BaselineTerraformGenerator:
    def __init__(self):
        pass

    def generate_baseline_from_provider_json(self, json_path, tf_output_path, framework=None):
        """
        Generate Terraform from a JSON file structured as a list of rules.
        """
        with open(json_path, encoding="utf-8") as f:
            data = json.load(f)

        if not isinstance(data, list):
            raise Exception("Expected JSON to be a list of rule objects")

        provider = data[0].get("provider", "azure").lower()
        resources = []
        all_variable_names = set()
        resource_counts = {}

        for entry in data:
            settings_dict = entry.get("settings", {})
            for resource_type, resource_settings in settings_dict.items():
                
                # Collect variable names
                self.collect_variable_names(resource_settings, all_variable_names)

                # Ensure unique resource names
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

        # Write variables.tf
        var_file = os.path.join(os.path.dirname(tf_output_path), "variables.tf")
        with open(var_file, "w", encoding="utf-8") as vf:
            for var_name in sorted(all_variable_names):
                vf.write(f'variable "{var_name}" {{}}\n')

        # Format & validate
        self.format_and_validate(os.path.dirname(tf_output_path))

    def collect_variable_names(self, settings, variable_names):
        """
        Recursively collect variable names referenced in settings dict.
        """
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

    def generate_tf_from_context_folder(self, context_folder, output_folder):
        """
        Process all JSON files in the context folder and generate TF files with predictable naming.
        """
        for filename in os.listdir(context_folder):
            if not filename.startswith("cloud_context_") or not filename.endswith(".json"):
                continue

            full_path = os.path.join(context_folder, filename)

            parts = filename.replace(".json", "").split("_")
            if len(parts) >= 5:
                framework, provider, timestamp = parts[-3:]
            else:
                print(f"⚠️ Unexpected filename format: {filename}")
                continue

            provider_dir = os.path.join(output_folder, provider.lower())
            os.makedirs(provider_dir, exist_ok=True)

            tf_filename = f"terraform_{framework}_{provider}_{timestamp}.tf"
            tf_output_path = os.path.join(provider_dir, tf_filename)

            print(f"🔨 Generating TF for {framework} on {provider} ({timestamp})...")
            self.generate_baseline_from_provider_json(full_path, tf_output_path, framework)

    def format_and_validate(self, tf_directory):
        """
        Run terraform fmt and validate.
        """
        print(f"🔍 Running terraform fmt in {tf_directory}...")
        subprocess.run(["terraform", "fmt", tf_directory], check=True)

        print(f"✅ terraform fmt completed.")

        print(f"🔍 Running terraform init in {tf_directory}...")
        subprocess.run(["terraform", "init", "-backend=false"], cwd=tf_directory, check=True)

        print(f"🔍 Running terraform validate in {tf_directory}...")
        subprocess.run(["terraform", "validate"], cwd=tf_directory, check=True)

        print(f"✅ terraform validate passed.")

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
            tf.write(f'{INDENT*2}azurerm = {{ source = "hashicorp/azurerm", version = "~> 3.0" }}\n')
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
