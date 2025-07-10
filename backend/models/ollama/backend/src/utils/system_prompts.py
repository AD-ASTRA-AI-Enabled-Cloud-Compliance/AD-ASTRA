## RAG config
chunk_size = 1000
chunk_overlap = 100
temperature = 0.3

top_k=30
max_token_limit = 6000



# Prompts to extract_compliance_rules_from_text
text_summmarization_system_prompt = "You are a document summarization assistant. Summarize key actionable security and compliance concepts."
text_summmarization_user_prompt = f"""
Summarize the following document into bullet points highlighting rules, requirements, or obligations:
"""

# PROMPT TO EXTRACT RULES FROM THE DOCUMENT SUMMARY
rules_from_text_sys_prompt = "You are a cybersecurity compliance rule extraction AI."
rules_from_text_user_prompt = f"""Your job is to extract clear, cloud-agnostic security compliance rules from the summary of a security document. These rules should be specific, actionable best practices.
Here are a few examples:
[{{
"rule": "Encrypt all sensitive data at rest and in transit.",
"category": "Data Protection",
"framework": "framework"
}},]

Now extract more rules from the following summary and return them as a valid JSON array (no explanations or formatting):

"""


# TERRAFOROM GENERATION PROMPT
TF_sys_prompt = "Generate a terraform template, without additional explanations. add a variables block and map to the terraform body"
TF_user_prompt = f"""
From the following rules, generate the terraform template for the following services: VM, storage and databases
in azure.

# azure-blanket-iac/
# ├── main.tf
# ├── variables.tf
# ├── outputs.tf
# ├── modules/
# │   ├── security-monitoring/
# │   │   ├── main.tf
# │   │   ├── variables.tf
# │   │   └── outputs.tf
# │   ├── data-encryption/
# │   │   ├── main.tf
# │   │   ├── variables.tf
# │   │   └── outputs.tf
# │   ├── access-management/
# │   │   ├── main.tf
# │   │   ├── variables.tf
# │   │   └── outputs.tf
# │   └── disaster-recovery/
# │       ├── main.tf
# │       ├── variables.tf
# │       └── outputs.tf
# └── README.md
#
"""
