import requests
from src.utils.templates import TerraformTemplateWriter

class LLMMapper:
    def __init__(self):
        self.template_writer = TerraformTemplateWriter()
        self.model = "gemma:2b"
        self.ollama_url = "http://localhost:11434/api/generate"

    def call_ollama(self, system_prompt, user_prompt):
        prompt = f"{system_prompt.strip()}\n\n{user_prompt.strip()}"
        try:
            response = requests.post(self.ollama_url, json={
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "temperature": 0.2
            })
            response.raise_for_status()
            result = response.json().get("response", "")
            if not result:
                print("⚠️ Empty response from Ollama")
            return result
        except Exception as e:
            print(f"❌ Ollama call failed: {e}")
            return None

    def is_valid_for_provider(self, provider, response_text):
        if provider == "aws" and any(x in response_text for x in ["azurerm_", "google_"]):
            return False
        if provider == "azure" and any(x in response_text for x in ["aws_", "google_"]):
            return False
        if provider == "gcp" and any(x in response_text for x in ["aws_", "azurerm_"]):
            return False
        return True

    def process_framework_with_llm(self, rules, framework, providers):
        for rule_data in rules:
            rule = rule_data.get("rule")
            for provider in providers:
                system_prompt = f"""
You are a cloud security compliance expert.
You MUST generate only valid Terraform code blocks specific to {provider.upper()}.
Each rule below is related to the {framework} framework.

⚠️ DO NOT use services from other cloud providers.
Only use services and resource types available in {provider.upper()}.
Only output Terraform resources that enhance:
- Encryption
- Identity and Access Management (IAM)
- Logging & Monitoring
- Compliance policies

❌ Do NOT output any unrelated services like networking, compute, or storage provisioning.
✅ Only modify existing security configurations.

Respond ONLY in valid Terraform HCL.
"""

                user_prompt = f"Framework: {framework}\nRule: {rule}"

                print(f"🔁 Processing rule: {rule[:60]}... for {provider.upper()}")
                response = self.call_ollama(system_prompt, user_prompt)

                if response and self.is_valid_for_provider(provider, response):
                    self.template_writer.write_terraform_module(
                        provider,
                        framework,
                        rule,
                        response
                    )
                else:
                    print(f"⚠️ Skipping rule due to invalid or mismatched response for provider={provider}")
