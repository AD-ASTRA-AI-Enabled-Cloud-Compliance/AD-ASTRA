# Updated by Harsimran Kaur
# This code is for pipeline 3. 
# This file generates cloud security context JSON files by mapping compliance rules to Terraform-compatible resources and settings for selected cloud providers and frameworks using an LLM.

import os
import json
import re
from .gpt_mapper import GPTMapper
from datetime import datetime
import difflib
# from src.services.json_to_baseline_tf import BaselineTerraformGenerator


class CloudContextGenerator:
    def __init__(self):
        self.input_folder = "src/input_files/"
        self.output_folder = "src/output_files/cloudcontext"
        self.context_dir = "src/input_files/cloud_reference_context"
        os.makedirs(self.output_folder, exist_ok=True)
        self.llm = GPTMapper()

    def extract_json_from_response(self, response):
        # Remove code fences
        response = re.sub(r"^```json|^```|```$", "", response.strip(), flags=re.MULTILINE)
        # Try to extract the first valid JSON object or array
        json_match = re.search(r"(\{.*\}|\[.*\])", response, flags=re.DOTALL)
        if json_match:
            return json_match.group(0).strip()
        return ""

    def split_thoughts_and_json(self, response):
        idx = response.find('{')
        if idx != -1:
            thoughts = response[:idx].strip()
            json_part = response[idx:].strip()
        else:
            thoughts = response.strip()
            json_part = ""
        return thoughts, json_part

    def load_provider_context(self, provider):
        context_path = os.path.join(self.context_dir, f"{provider.lower()}_context.json")
        try:
            with open(context_path, "r") as f:
                return json.load(f).get("resources", {})
        except Exception as e:
            print(f"Failed to load provider context for {provider}: {e}")
            return {}

    def generate_context(self, selected_frameworks, selected_providers):
        for filename in os.listdir(self.input_folder):
            if not filename.endswith(".json"):
                continue

            full_path = os.path.join(self.input_folder, filename) 
            with open(full_path) as f:
                rules = json.load(f)

            raw_framework = filename.split(".")[0]
            framework = raw_framework.split("-")[0].strip().upper()

            if framework not in selected_frameworks:
                print(f"⏭️ Skipping {framework} (not selected)")
                continue

            print(f"📦 Processing context for framework: {framework}")

            for provider in selected_providers:
                flat_context = []
                provider_context = self.load_provider_context(provider)

                for rule_obj in rules:
                    rule = rule_obj.get("rule")
                    if not rule:
                        continue

                    prompt = f"""
You are a cloud security expert.

For the following compliance rule, use RE-ACT (Reasoning and Acting) to decide:
- If the rule is NOT actionable in cloud infrastructure (e.g., if it is only about training, documentation, or manual process), respond with ONLY this string: "SKIP".
- If the rule IS actionable, output ONLY valid JSON in this format:

{{
  "rule": "...",
  "provider": "{provider.lower()}",
  "services": ["<terraform_resource_type1>", ...]
}}

RE-ACT: First, explain your reasoning as "thoughts" about which cloud services best enforce compliance in {provider.upper()} and why. Then, output ONLY the JSON as shown above.

Rule: "{rule}"
"""

                    response = self.llm.call_openai("Cloud Security Compliance Assistant", prompt)

                    if response.strip().upper() == "SKIP":
                        print(f"⏭️ Skipping non-actionable rule: {rule}")
                        continue

                    thoughts, cleaned_json = self.split_thoughts_and_json(response)
                    cleaned_json = self.extract_json_from_response(cleaned_json)

                    if thoughts:
                        print(f"🧠 RE-ACT thoughts for rule: {rule[:50]}...:\n{thoughts}\n")

                    try:
                        json_response = json.loads(cleaned_json)
                        services = json_response.get("services", [])
                        settings = {}
                        valid_services = []
                        context_keys = list(provider_context.keys())
                        for service in services:
                            # Try exact match first
                            if service in provider_context:
                                settings[service] = provider_context[service].get("settings", {})
                                valid_services.append(service)
                            else:
                                # Fuzzy match
                                best_match = self.get_best_service_match(service, context_keys)
                                if best_match:
                                    print(f"🔎 Fuzzy matched '{service}' to '{best_match}'")
                                    settings[best_match] = provider_context[best_match].get("settings", {})
                                    valid_services.append(best_match)
                                else:
                                    print(f"⚠️ Service '{service}' not found in provider context for {provider}")
                        json_response["services"] = valid_services
                        json_response["settings"] = settings
                        flat_context.append(json_response)
                    except Exception as e:
                        print(f"⚠️ Invalid JSON from LLM for rule: {rule[:50]}... → {e}")

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                outfile = os.path.join(
                    self.output_folder,
                    f"cloud_context_{framework.lower()}_{provider.lower()}_{timestamp}.json"
                )
                with open(outfile, "w") as out:
                    json.dump(flat_context, out, indent=2)
                print(f"✅ Saved context to {outfile}")


                # added to call terraform generation


                # 🚀 Automatically generate Terraform for this JSON

                # filename = os.path.basename(outfile)
                # parts = filename.replace(".json", "").split("_")
                # framework_part = parts[2]
                # provider_part = parts[3]
                # timestamp_part = parts[4]

                # tf_output_dir = os.path.join("backend", "src", "output_files", "terraform_files", provider_part)
                # os.makedirs(tf_output_dir, exist_ok=True)

                # tf_output_path = os.path.join(
                #     tf_output_dir,
                #     f"terraform_{framework_part}_{provider_part}_{timestamp_part}.tf"
                # )

                # tf_generator = BaselineTerraformGenerator()
                # print(f"🚀 Generating Terraform for {outfile}...")
                # tf_generator.generate_baseline_from_provider_json(
                #     json_path=outfile,
                #     tf_output_path=tf_output_path
                # )
                # print(f"✅ Terraform generated: {tf_output_path}")


                for json_response in flat_context:
                    for service in json_response.get("services", []):
                        if not json_response.get("settings", {}).get(service):
                            print(f"⚠️ Warning: No settings for {service} in rule: {json_response['rule']}")

    def get_best_service_match(self, service, context_keys, cutoff=0.85):
        """
        Returns the closest matching service name from context_keys for the given service,
        but only if the match is strong enough and the core resource type is very similar.
        """
        matches = difflib.get_close_matches(service, context_keys, n=1, cutoff=cutoff)
        if matches:
            # Extra check: compare the suffix after 'aws_'
            def get_suffix(name):
                return name.split("aws_", 1)[-1] if name.startswith("aws_") else name
            service_suffix = get_suffix(service)
            match_suffix = get_suffix(matches[0])
            # Only match if the suffixes are very similar (e.g., >0.9 similarity)
            if difflib.SequenceMatcher(None, service_suffix, match_suffix).ratio() > 0.9:
                return matches[0]
        return None
    