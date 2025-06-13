import os

class TerraformTemplateWriter:
    def write_terraform_module(self, provider, framework, rule, llm_response):
        folder = f"src/terraform_output/{provider.lower()}"
        os.makedirs(folder, exist_ok=True)
        filename = os.path.join(folder, f"{framework.lower()}_{provider.lower()}.tf")
        with open(filename, "a") as f:
            f.write(f"// Rule: {rule}\n")
            f.write(llm_response + "\n\n")

    def merge_user_selected_modules(self, frameworks, providers, output_folder, user_output_folder):
        os.makedirs(user_output_folder, exist_ok=True)
        main_tf = os.path.join(user_output_folder, "main.tf")
        with open(main_tf, "w") as main_file:
            for provider in providers:
                for framework in frameworks:
                    tf_path = os.path.join(output_folder, provider.lower(), f"{framework.lower()}_{provider.lower()}.tf")
                    if os.path.exists(tf_path):
                        with open(tf_path) as tf:
                            main_file.write(tf.read())

        with open(os.path.join(user_output_folder, "variables.tf"), "w") as v:
            v.write('variable "project_id" { type = string }\n')
        with open(os.path.join(user_output_folder, "terraform.tfvars"), "w") as t:
            t.write('project_id = "example-project"\n')