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
    def __init__(self, session):

        self.session = session
        self.sessionID = session.sessionID
        self.companyID = session.companyID
        self.userID = session.userID

        self.mongo_client = session.mongo
        self.qdrant = session.qdrant
        self.ws = session.ws

        self.temperature = session.temperature
        self.chunk_size = session.chunk_size
        self.chunk_overlap = session.chunk_overlap
        self.top_k = session.top_k
        self.max_token_limit = session.max_token_limit

        # self.upload_folder = storage.upload_folder
        # self.output_folder = storage.output_folder
        # self.terraform_folder = storage.terraform_folder

        self.llm = LLMMapper()

        self.mongo_db = self.mongo_client["Skylock"]
        self.mongo_collection = self.mongo_db["Cloud_JSON_Baselines"]

    def get_rules_from_qdrant(self, selected_frameworks):
        all_rules = []
        for fw in selected_frameworks:
            hits, _ = self.qdrant.scroll(
                collection_name="framework_rules",
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
        msg = f"⚡ generate_context() CALLED with {selected_frameworks} / {selected_providers}"
        self.ws.send_progress_update(
            session=self.sessionID,
            message=msg,)

        for provider in selected_providers:
            baseline = self.mongo_collection.find_one(
                {"provider": provider.lower()})
            if not baseline:
                print(
                    f"❌ No baseline found in MongoDB for provider: {provider}")
                # Try loading from local reference file as fallback
                reference_path = os.path.join(
                    os.path.dirname(__file__),
                    "..",
                    "input_files",
                    "cloud_reference_context",
                    f"{provider.lower()}_context.json"
                )
                try:
                    with open(reference_path, 'r') as f:
                        baseline = json.load(f)
                    self.ws.send_progress_update(message=
                        f"✅ Loaded baseline from reference file")
                except FileNotFoundError:
                    print(
                        f"❌ No reference baseline found at")
                    continue
                except json.JSONDecodeError:
                    print(
                        f"❌ Invalid JSON in reference file")
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
                        selected_resources[res_name] = res_data.get(
                            "settings", {})
                        resource_sources[res_name] = set(tags)
                        selected_services.append(res_name)
                    else:
                        resource_sources[res_name].update(tags)

            if not selected_services:
                print(
                    f"⚠️ No resources matched frameworks {selected_frameworks} for {provider}.")
                continue

            context = [{
                "rule": f"Baseline inclusion for {', '.join(selected_frameworks)}",
                "provider": provider.lower(),
                "services": selected_services,
                "settings": selected_resources,
                "resource_sources": {k: list(v) for k, v in resource_sources.items()}
            }]

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

            # --- OLD file output commented ---
            # outfile = os.path.join(
            #     self.output_folder,
            #     f"cloud_context_{'_'.join(f.lower() for f in selected_frameworks)}_{provider.lower()}_{timestamp}.json"
            # )
            # with open(outfile, "w") as out:
            #     json.dump(context, out, indent=2)
            # print(f"✅ Saved context to {outfile}")

            # --- Save context JSON to MongoDB ---
            mongo_doc = {
                "frameworks": selected_frameworks,
                "provider": provider.lower(),
                "timestamp": timestamp,
                "context": context
            }
            result = self.mongo_client["Skylock"]["Cloud_Context_JSON"].insert_one(
                mongo_doc)
            self.ws.send_progress_update(session= self.sessionID, message = f"Context inserted into MongoDB: Skylock.Cloud_Context_JSON")
            self.ws.send_progress_update(session= self.sessionID, message = f"Inserted with _id: {result.inserted_id}")

            inserted_doc = self.mongo_client["Skylock"]["Cloud_Context_JSON"].find_one(
                {"_id": result.inserted_id})
            
            self.ws.send_progress_update(message = f"Document stored")
            print(json.dumps(inserted_doc, indent=2, default=str))

            # --- Validate coverage ---
            validation_results = self.validate_against_rules(
                selected_frameworks, provider, context)

            self.save_rule_validation_report(
                selected_frameworks, provider, validation_results)

            # --- OLD TF file output commented ---
            # base_dir = os.path.abspath(
            #     os.path.join(os.path.dirname(__file__), "..", "output_files", "terraform_files")
            # )
            # tf_output_dir = os.path.join(
            #     base_dir,
            #     provider,
            #     "_".join(f.lower() for f in selected_frameworks),
            #     timestamp
            # )
            # os.makedirs(tf_output_dir, exist_ok=True)
            # tf_output_path = os.path.join(
            #     tf_output_dir,
            #     f"terraform_{'_'.join(f.lower() for f in selected_frameworks)}_{provider.lower()}_{timestamp}.tf"
            # )

            # --- NEW: Still using disk output folder ---
            base_dir = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..",
                             "output_files", "terraform_files")
            )
            tf_output_dir = os.path.join(
                base_dir,
                provider,
                "_".join(f.lower() for f in selected_frameworks),
                timestamp
            )
            os.makedirs(tf_output_dir, exist_ok=True)

            tf_output_path = os.path.join(
                tf_output_dir,
                f"terraform_{'_'.join(f.lower() for f in selected_frameworks)}_{provider.lower()}_{timestamp}.tf"
            )

            # --- Generate Terraform
            tf_generator = BaselineTerraformGenerator(self.session)
            
            self.ws.send_progress_update(message = f"🚀 Generating Terraform for unified baseline...")
            
            tf_result = tf_generator.generate_baseline_from_provider_json(
                json_data=context,
                tf_output_path=tf_output_path,
                framework=selected_frameworks[0]
            )
            self.ws.send_progress_update(message = f"✅ Terraform content generated.")

            # --- Deduplication check before insert ---
            existing = self.mongo_client["Skylock"]["Terraform_Files"].find_one({
                "provider": provider.lower(),
                "frameworks": selected_frameworks,
                "timestamp": timestamp
            })
            if existing:
                
                self.ws.send_progress_update(message = "⚠️ Terraform file already exists for this combination—skipping insert.")
                continue

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
                "terraform_content": tf_result["terraform"],
                "variables_tf_content": tf_result["variables"],
                "lockfile_content": tf_result["lockfile"]
            }

            result_tf = self.mongo_client["Skylock"]["Terraform_Files"].insert_one(
                terraform_doc)
            
            self.ws.send_progress_update(message = f"✅ Terraform file inserted into MongoDB: Skylock.Terraform_Files")

           # return terraform_doc

    def validate_against_rules(self, selected_frameworks, provider, context):
        
        self.ws.send_progress_update(message = "\n🔍 Validating technical coverage of selected baseline services...\n")

        context_entry = context[0]
        selected_services = context_entry["services"]
        selected_settings = context_entry["settings"]
        settings_json = json.dumps(selected_settings, indent=2)

        all_rules = self.get_rules_from_qdrant(selected_frameworks)
        
        self.ws.send_progress_update(message = f"Fetched {len(all_rules)} rules from Qdrant for frameworks: {selected_frameworks}")

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

            # Modified: Clean markdown formatting from LLM response for better parsing
            thoughts_cleaned = re.sub(r'\*\*', '', thoughts)  # Remove ** markdown
            thoughts_cleaned = re.sub(r'\n+', '\n', thoughts_cleaned)  # Normalize newlines

            actionable_match = re.search(
                r"Actionable:\s*(Yes|No)", thoughts_cleaned, re.IGNORECASE)
            coverage_match = re.search(
                r"Coverage:\s*(Satisfied|Not Satisfied)", thoughts_cleaned, re.IGNORECASE)
            # Modified: Enhanced regex pattern to handle markdown and spacing issues in LLM responses
            further_match = re.search(
                r"(?:\*\*)?(?:Further\s*)?Recommendations?:\s*(?:\*\*)?\s*(Yes|No)", thoughts_cleaned, re.IGNORECASE)
            explanation_match = re.search(
                r"Explanation:\s*(.*)", thoughts_cleaned, re.IGNORECASE | re.DOTALL)

            actionable = actionable_match.group(
                1).strip() if actionable_match else "Unknown"
            coverage = coverage_match.group(
                1).strip() if coverage_match else "Unknown"
            further_recommendations = further_match.group(
                1).strip() if further_match else "Unknown"
            explanation = explanation_match.group(1).strip(
            ) if explanation_match else "No explanation returned."

            if actionable == "No":
                coverage = "Not Satisfied"
                further_recommendations = "No"

            # Modified: Replaced terminal printing with WebSocket progress updates for frontend visibility
            self.ws.send_progress_update(
                session=self.sessionID,
                message=f"🧠 Validated rule: {actionable} actionable, {coverage} coverage"
            )

            # Modified: Store all LLM validation results for complete database storage
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
        
        # Added: Calculate comprehensive summary statistics for all LLM validation results
        total_rules = len(validation_results)
        actionable_rules = len([r for r in validation_results if r["actionable"] == "Yes"])
        satisfied_rules = len([r for r in validation_results if r["coverage"] == "Satisfied"])
        not_satisfied_rules = len([r for r in validation_results if r["coverage"] == "Not Satisfied"])
        needs_further_recommendations = len([r for r in validation_results if r["further_recommendations"] == "Yes"])
        
        # Modified: Enhanced report structure to store ALL LLM analysis results in database
        report_data = {
            "report_metadata": {
                "provider": provider,
                "frameworks": selected_frameworks,
                "generated_at": timestamp,
                "total_rules_evaluated": total_rules,
                "summary_stats": {
                    "actionable_rules": actionable_rules,
                    "non_actionable_rules": total_rules - actionable_rules,
                    "satisfied_coverage": satisfied_rules,
                    "not_satisfied_coverage": not_satisfied_rules,
                    "needs_further_recommendations": needs_further_recommendations
                }
            },
            "all_validation_results": validation_results,  # Added: Complete LLM output storage
            "rules_needing_recommendations": []
        }

        # Keep the existing filtered logic for backward compatibility
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

        result = self.mongo_client["Skylock"]["Rule_Validation_Reports"].insert_one(
            report_data)
        
        # Print confirmation in backend terminal
        print(f"✅ Rule Validation Report inserted into MongoDB: Skylock.Rule_Validation_Reports")
        print(f"✅ Document ID: {result.inserted_id}")
        
        self.ws.send_progress_update(
            session=self.sessionID,
            message=f"✅ Compliance report saved: {total_rules} rules evaluated, {satisfied_rules} satisfied, {not_satisfied_rules} need attention"
        )
        self.ws.send_progress_update(
            session=self.sessionID,
            message=f"✅ Report ID: {result.inserted_id}"
        )
