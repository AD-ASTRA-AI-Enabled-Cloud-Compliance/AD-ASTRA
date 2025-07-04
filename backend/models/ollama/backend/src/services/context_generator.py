# -------------------------------------------------------------------------------------------------
# Updated by Harsimran Kaur
# This file is part of Pipeline 3.
# This module provides the CloudContextGenerator class, which:
# - Generates unified cloud security context JSONs for selected frameworks and providers.
# - Validates the generated context against compliance rules using an LLM (via LLMMapper).
# - Produces compliance validation reports highlighting technical coverage and recommendations.
# - Generates Terraform baseline files from the validated context for each provider.
# The workflow supports deduplication, technical validation, and infrastructure-as-code output for
# --------------------------------------------------------------------------------------------------

import os
import json
import re
from datetime import datetime
from pymongo import MongoClient
from src.services.json_to_baseline_tf import BaselineTerraformGenerator
from src.services.llm_mapper import LLMMapper
from qdrant_client import QdrantClient

class CloudContextGenerator:
    def __init__(self):

        mongo_uri = os.getenv("MONGO_URI")
        qdrant_host = os.getenv("QDRANT_HOST")
        qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))

        self.qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.llm = LLMMapper()

        # MongoDB connection
        self.mongo_client = MongoClient(mongo_uri)
        self.mongo_db = self.mongo_client["Skylock"]
        self.mongo_collection = self.mongo_db["Cloud_JSON_Baselines"]

    def get_rules_from_qdrant(self, selected_frameworks):
        all_rules = []
        for fw in selected_frameworks:
            hits, _ = self.qdrant.scroll(
                collection_name="framework_rules_gemma2b",
                scroll_filter={
                    "must": [
                        {"key": "framework", "match": {"value": fw.upper()}}
                    ]
                },
                limit=1000
            )
            for hit in hits:
                all_rules.append(hit.payload)
        return all_rules

    def generate_context(self, selected_frameworks, selected_providers):
        for provider in selected_providers:  

            # --- MONGO LOADING ---
            baseline = self.mongo_collection.find_one({"provider": provider.lower()})
            if not baseline:
                print(f"❌ No baseline found in MongoDB for provider: {provider}")
                continue

            baseline_resources = baseline.get("resources", {})
            selected_fw_lower = [fw.lower() for fw in selected_frameworks]

            selected_resources = {}
            resource_sources = {}
            selected_services = []

            for res_name, res_data in baseline_resources.items():
                tags = [t.lower() for t in res_data.get("compliance_tags", [])]
                if any(tag in selected_fw_lower for tag in tags):
                    if res_name not in selected_resources:
                        selected_resources[res_name] = res_data.get("settings", {})
                        resource_sources[res_name] = set(tags)
                        selected_services.append(res_name)
                    else:
                        resource_sources[res_name].update(tags)

            if not selected_services:
                print(f"⚠️ No resources matched frameworks {selected_frameworks} for {provider}.")
                continue

            context = [{
                "rule": f"Baseline inclusion for {', '.join(selected_frameworks)}",
                "provider": provider.lower(),
                "services": selected_services,
                "settings": selected_resources,
                "resource_sources": {
                    k: list(v) for k, v in resource_sources.items()
                }
            }]

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

            
            # --- SAVE TO MONGO ---
            mongo_doc = {
                "frameworks": selected_frameworks,
                "provider": provider.lower(),
                "timestamp": timestamp,
                "context": context
            }
            result = self.mongo_client["Skylock"]["Cloud_Context_JSON"].insert_one(mongo_doc)
            print(f"✅ Context inserted into MongoDB: Skylock.Cloud_Context_JSON")
            print("✅ Inserted with _id:", result.inserted_id)

            # Sanity check
            inserted_doc = self.mongo_client["Skylock"]["Cloud_Context_JSON"].find_one({"_id": result.inserted_id})
            print("🔍 Inserted document:")
            print(json.dumps(inserted_doc, indent=2, default=str))

            # Validate coverage
            validation_results = self.validate_against_rules(selected_frameworks, provider, context)

            # Save compliance report
            self.save_rule_validation_report(selected_frameworks, provider, validation_results)


            # --- GENERATE TERRAFORM AND SAVE TO MONGO ---
            tf_generator = BaselineTerraformGenerator()
            print(f"🚀 Generating Terraform for unified baseline...")

            terraform_content = tf_generator.generate_baseline_from_provider_json(
                json_data=context,
                tf_output_path=None,  # No local file output
                framework=selected_frameworks[0]
            )
            print("✅ Terraform content generated in memory.")

            terraform_doc = {
                "provider": provider.lower(),
                "frameworks": selected_frameworks,
                "timestamp": timestamp,
                "folder_structure": {
                    "provider": provider.lower(),
                    "framework": "_".join(f.lower() for f in selected_frameworks),
                    "timestamp": timestamp
                },
                "terraform_filename": f"terraform_{'_'.join(f.lower() for f in selected_frameworks)}_{provider.lower()}_{timestamp}.tf",
                "terraform_content": terraform_content
            }

            result_tf = self.mongo_client["Skylock"]["Terraform_Files"].insert_one(terraform_doc)
            print(f"✅ Terraform file inserted into MongoDB: Skylock.Terraform_Files")
            print("✅ Inserted with _id:", result_tf.inserted_id)

    def validate_against_rules(self, selected_frameworks, provider, context):
        print("\n🔍 Validating technical coverage of selected baseline services...\n")

        context_entry = context[0]
        selected_services = context_entry["services"]
        selected_settings = context_entry["settings"]

        settings_json = json.dumps(selected_settings, indent=2)

        all_rules = self.get_rules_from_qdrant(selected_frameworks)
        print(f"Fetched {len(all_rules)} rules from Qdrant for frameworks: {selected_frameworks}")

        validation_results = []

        for rule_obj in all_rules:
            rule_text = rule_obj.get("rule", "").strip()
            if not rule_text:
                continue

            prompt = f"""
You are a cloud compliance expert specializing in {provider.upper()}.

Below is a compliance rule:

\"{rule_text}\"

These {provider.upper()} services have been selected for the compliance baseline:

{', '.join(selected_services)}

Here are the detailed configuration settings of the selected services:

{settings_json}

First, determine whether this rule can be technically implemented or enforced using these services and configurations.
If yes, output "Actionable: Yes".
If no, output "Actionable: No".

Then, evaluate whether the selected configurations reasonably enforce the rule from a technical perspective.
If at least some relevant services and settings are present that implement significant aspects of the rule, output "Coverage: Satisfied."
If there are no relevant configurations or only trivial coverage, output "Coverage: Not Satisfied."

**Also output whether additional configurations or services would further improve coverage to be fully comprehensive.**
If improvements are needed, output "FurtherRecommendations: Yes."
If the coverage is already complete, output "FurtherRecommendations: No."

**Important:** Do NOT consider organizational policies, legal processes, employee training, documentation requirements, or non-technical factors—focus strictly on the technical capabilities and configurations shown.

Finally, output a short explanation.

Use this exact format:

Actionable: Yes or No

Coverage: Satisfied or Not Satisfied

FurtherRecommendations: Yes or No

Explanation: <your explanation here>
"""

            thoughts = self.llm.call_ollama(
                system_prompt="You are a helpful compliance assistant.",
                user_prompt=prompt
            )

            actionable_match = re.search(r"Actionable:\s*(Yes|No)", thoughts, re.IGNORECASE)
            coverage_match = re.search(r"Coverage:\s*(Satisfied|Not Satisfied)", thoughts, re.IGNORECASE)
            further_match = re.search(r"FurtherRecommendations:\s*(Yes|No)", thoughts, re.IGNORECASE)
            explanation_match = re.search(r"Explanation:\s*(.*)", thoughts, re.IGNORECASE | re.DOTALL)

            actionable = actionable_match.group(1).strip() if actionable_match else "Unknown"
            coverage = coverage_match.group(1).strip() if coverage_match else "Unknown"
            further_recommendations = further_match.group(1).strip() if further_match else "Unknown"
            explanation = explanation_match.group(1).strip() if explanation_match else "No explanation returned."

            if actionable == "No":
                coverage = "Not Satisfied"
                further_recommendations = "No"

            print(f"🧠 ReAct validation for rule: '{rule_text[:60]}...'\n")
            print(f"✅ Actionable: {actionable}")
            print(f"✅ Coverage: {coverage}")
            print(f"✅ Further Recommendations: {further_recommendations}")
            print(f"📝 Explanation: {explanation}\n")

            validation_results.append({
                "rule": rule_text,
                "actionable": actionable,
                "coverage": coverage,
                "further_recommendations": further_recommendations,
                "explanation": explanation
            })

        return validation_results

    def save_rule_validation_report(self, selected_frameworks, provider, validation_results):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        report_data = {
            "report_metadata": {
                "provider": provider,
                "frameworks": selected_frameworks,
                "generated_at": timestamp
            },
            "rules_needing_recommendations": []
        }

        for r in validation_results:
            if (
                r["actionable"] == "Yes" and (
                    r["coverage"] == "Not Satisfied" or
                    r["further_recommendations"] == "Yes"
                )
            ):
                report_data["rules_needing_recommendations"].append({
                    "rule": r["rule"],
                    "coverage": r["coverage"],
                    "further_recommendations": r["further_recommendations"],
                    "reason": r["explanation"],
                    "recommendations": {
                        "note": f"Review this rule manually to determine which {provider.capitalize()} services and configurations are needed to further improve coverage."
                    }
                })

        result = self.mongo_client["Skylock"]["Rule_Validation_Reports"].insert_one(report_data)
        print(f"✅ Compliance report inserted into MongoDB: Skylock.Rule_Validation_Reports")
        print("✅ Inserted with _id:", result.inserted_id)
