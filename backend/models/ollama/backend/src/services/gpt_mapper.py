# Updated by Harsimran Kaur
# This code is for pipeline 3.
# This file defines a GPT-4-based service for generating cloud security json rules; cloud provider + framework specific cloud context.
# Also implements logic for token counting, to check responses are not truncated.
# Commented out code for Ollama/Gemma and for terraform generation using LLMs.

import os
import tiktoken
import openai
import dotenv
# Load environment variables from .env file
dotenv.load_dotenv()

class GPTMapper:
    def __init__(self):
        self.model = "gpt-4"  # ✅ Using OpenAI GPT-4
        openai.api_key = os.getenv("OPENAI_API_KEY")

        # 🔒 Commented Ollama/Gemma logic
        # self.model = "gemma:2b"
        # self.ollama_url = "http://localhost:11434/api/generate"

        # ✅ Tokenizer for estimating prompt size
        self.tokenizer = tiktoken.encoding_for_model(self.model)

    def count_tokens(self, text):
        return len(self.tokenizer.encode(text))

    def call_openai(self, system_prompt, user_prompt):
        try:
            # ✅ Token counting logic
            prompt_tokens = self.count_tokens(system_prompt) + self.count_tokens(user_prompt)
            print(f"🧠 Estimated prompt token count: {prompt_tokens}")

            # Adjust these based on the model you're using
            max_total_tokens = 8192  # gpt-4 default; use 128000 for gpt-4o
            max_completion_tokens = 2048
            max_prompt_tokens = max_total_tokens - max_completion_tokens

            if prompt_tokens > max_prompt_tokens:
                print(f"⚠️ Prompt may exceed model context limit ({prompt_tokens} > {max_prompt_tokens}). Truncation likely.")

            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model=self.model,
                temperature=0.2,
                max_tokens=max_completion_tokens,
                messages=[
                    {"role": "system", "content": system_prompt.strip()},
                    {"role": "user", "content": user_prompt.strip()}
                ]
            )
            result = response.choices[0].message.content.strip()

            # ✅ Check if model stopped due to hitting token limit
            finish_reason = response.choices[0].finish_reason
            if finish_reason == "length":
                print("⚠️ GPT-4 response was truncated (max_tokens reached).")

            if not result:
                print("⚠️ Empty response from OpenAI")
            return result
        except Exception as e:
            print(f"❌ OpenAI call failed: {e}")
            return None

    # 🔒 Commented Ollama call
    # def call_ollama(self, system_prompt, user_prompt):
    #     prompt = f"{system_prompt.strip()}\n\n{user_prompt.strip()}"
    #     try:
    #         response = requests.post(self.ollama_url, json={
    #             "model": self.model,
    #             "prompt": prompt,
    #             "stream": False,
    #             "temperature": 0.2
    #         })
    #         response.raise_for_status()
    #         result = response.json().get("response", "")
    #         if not result:
    #             print("⚠️ Empty response from Ollama")
    #         return result
    #     except Exception as e:
    #         print(f"❌ Ollama call failed: {e}")
    #         return None

    def is_valid_for_provider(self, provider, response_text):
        if provider == "aws" and any(x in response_text for x in ["azurerm_", "google_"]):
            return False
        if provider == "azure" and any(x in response_text for x in ["aws_", "google_"]):
            return False
        if provider == "gcp" and any(x in response_text for x in ["aws_", "azurerm_"]):
            return False
        return True


# Code to use LLM to generate terraform files from cloud_context files.


#     def process_framework_with_llm(self, rules, framework, providers):
#         for rule_data in rules:
#             rule = rule_data.get("rule")
#             for provider in providers:
#                 system_prompt = f"""
# You are a cloud security compliance expert.
# You MUST generate only valid Terraform code blocks specific to {provider.upper()}.
# Each rule below is related to the {framework} framework.
#
# ⚠️ DO NOT use services from other cloud providers.
# Only use services and resource types available in {provider.upper()}.
# Only output Terraform resources that enhance:
# - Encryption
# - Identity and Access Management (IAM)
# - Logging & Monitoring
# - Compliance policies
#
# ❌ Do NOT output any unrelated services like networking, compute, or storage provisioning.
# ✅ Only modify existing security configurations.
#
# Respond ONLY in valid Terraform HCL.
# """
#
#                 user_prompt = f"Framework: {framework}\nRule: {rule}"
#
#                 print(f"🔁 Processing rule: {rule[:60]}... for {provider.upper()}") 
#                 response = self.call_openai(system_prompt, user_prompt)
#
#                 if response and self.is_valid_for_provider(provider, response):
#                     self.template_writer.write_terraform_module(
#                         provider,
#                         framework,
#                         rule,
#                         response
#                     )
#                 else:
#                     print(f"⚠️ Skipping rule due to invalid or mismatched response for provider={provider}")
