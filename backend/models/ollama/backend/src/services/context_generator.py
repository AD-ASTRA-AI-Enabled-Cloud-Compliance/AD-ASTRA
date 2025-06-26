# Updated by Harsimran Kaur
# This code is for pipeline 3. 
# This file generates cloud security context JSON files by mapping compliance rules to Terraform-compatible resources and settings for selected cloud providers and frameworks using an LLM.

import os
import json
import re
from .gpt_mapper import GPTMapper
from src.utils.prompt_helper import PromptExampleHelper
from datetime import datetime

class CloudContextGenerator:
    def __init__(self):
        self.input_folder = "src/input_files"
        self.output_folder = "src/output_files/cloudcontext"
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

                # ✅ Load a few-shot example dynamically for the provider
                example = PromptExampleHelper.get_provider_example_from_context(provider)

                for rule_obj in rules:
                    rule = rule_obj.get("rule")
                    if not rule:
                        continue

                    prompt = f"""
You are a cloud security expert.

For the following compliance rule, first explain your reasoning as "thoughts" about which cloud services and Terraform-compatible security settings best enforce compliance in {provider.upper()} and why.

Then, output ONLY valid JSON in this format:
{{
  "rule": "...",
  "provider": "{provider.lower()}",
  "services": ["<terraform_resource_type1>", "<terraform_resource_type2>", ...],
  "settings": {{
    "<terraform_resource_type1>": {{ "setting1": "value1", ... }},
    "<terraform_resource_type2>": {{ "setting1": "value1", ... }}
  }}
}}

✅ For every service in "services", provide all major security-relevant settings, at least 3-4, in "settings", using only valid Terraform arguments for that resource.
✅ Use only official services and valid Terraform resources for {provider.upper()}.
❌ Do NOT use any non-Terraform resources or services.
❌ Do NOT leave any services empty in "services" or "settings".
❌ Do NOT use services from other cloud providers.
❌ Do NOT invent resource names.
❌ No explanations or comments after the JSON.

{example}

Rule: "{rule}"
"""

                    response = self.llm.call_openai("Cloud Security Compliance Assistant", prompt)
                    thoughts, cleaned_json = self.split_thoughts_and_json(response)
                    cleaned_json = self.extract_json_from_response(cleaned_json)

                    if thoughts:
                        print(f"🧠 RE-ACT thoughts for rule: {rule[:50]}...:\n{thoughts}\n")

                    try:
                        json_response = json.loads(cleaned_json)
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

                for json_response in flat_context:
                    for service in json_response.get("services", []):
                        if not json_response.get("settings", {}).get(service):
                            print(f"⚠️ Warning: No settings for {service} in rule: {json_response['rule']}")
