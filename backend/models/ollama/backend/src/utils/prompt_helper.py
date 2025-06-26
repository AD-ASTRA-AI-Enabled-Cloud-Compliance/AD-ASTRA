# Updated by Harsimran Kaur
# This code is for pipeline 3. 
# This file provides a helper class for dynamically generating example JSON prompts for different cloud providers by sampling services and settings from a context file (cloud_context.json), to be used in LLM-based cloud security tasks.

import json
import random

class PromptExampleHelper:
    @staticmethod
    def get_provider_example_from_context(provider: str, context_path="src/utils/cloud_context.json") -> str:
        """
        Load a few-shot example from cloud_context.json based on the given provider (azure/aws/gcp).
        Returns a formatted string that can be embedded directly into the OpenAI prompt.
        """
        try:
            with open(context_path, "r") as f:
                context = json.load(f)

            provider = provider.lower()
            if provider not in context:
                return ""

            provider_services = {}
            for _, services in context.items():
                provider_services.update(services)
            if not provider_services:
                return ""

            # Pick up to 2 services randomly from the full context (not cloud-specific)
            selected_services = random.sample(list(provider_services.keys()), min(2, len(provider_services)))

            example_settings = {
                service: provider_services[service] for service in selected_services
            }

            example_json = {
                "rule": f"Example rule for logging and security configuration in {provider.upper()}",
                "provider": provider,
                "services": selected_services,
                "settings": example_settings
            }

            formatted = f"""Example for reference:\n\nRule: \"{example_json['rule']}\"\n\nExample JSON:\n{json.dumps(example_json, indent=2)}"""
            return formatted

        except Exception as e:
            print(f"Failed to load example for provider '{provider}': {e}")
            return ""
