import os
import json
from .llm_mapper import LLMMapper
from src.utils.templates import TerraformTemplateWriter

class TerraformGenerator:
    def __init__(self):
        self.input_folder = "src/input_files"
        self.output_folder = "src/terraform_output"
        self.user_output_folder = "src/user_outputs"
        self.llm_mapper = LLMMapper()
        self.template_writer = TerraformTemplateWriter()

    def generate_modules(self, selected_frameworks, selected_providers):
        print("🔍 Starting module generation...")

        for filename in os.listdir(self.input_folder):
            if filename.endswith(".json"):
                full_path = os.path.join(self.input_folder, filename)
                with open(full_path) as f:
                    rules = json.load(f)

                raw_framework = filename.split(".")[0]
                framework = raw_framework.split("-")[0].strip().upper()

                print(f"📄 Found file: {filename} → Framework: {framework} ({len(rules)} rules)")

                if framework not in selected_frameworks:
                    print(f"⏭️ Skipping {framework} (not selected)")
                    continue

                try:
                    self.llm_mapper.process_framework_with_llm(rules, framework, selected_providers)
                except Exception as e:
                    print(f"❌ Error processing {framework}: {e}")

        try:
            self.template_writer.merge_user_selected_modules(
                selected_frameworks, selected_providers,
                self.output_folder, self.user_output_folder
            )
        except Exception as e:
            print(f"❌ Error merging final Terraform output: {e}")

        print("✅ Terraform generation complete!")
        return self.user_output_folder
