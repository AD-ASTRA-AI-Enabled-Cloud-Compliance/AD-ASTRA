import os
import re

def parse_tfvars_file(path):
    if not path or not os.path.exists(path):
        return {}
    variables = {}
    with open(path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and '=' in line and not line.startswith('#'):
                key, value = line.split('=', 1)
                value = value.strip().strip('"')
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
                elif re.match(r'^\d+$', value):
                    value = int(value)
                elif re.match(r'^\d+\.\d+$', value):
                    value = float(value)
                variables[key.strip()] = value
    return variables


def hcl_safe(value):
    """Convert a Python value to HCL-compatible syntax."""
    if isinstance(value, str):
        if value.startswith("${") and value.endswith("}"):
            return value  # Terraform interpolation
        return f'"{value}"'
    elif isinstance(value, bool):
        return str(value).lower()
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, list):
        return f"[{', '.join(hcl_safe(v) for v in value)}]"
    elif isinstance(value, dict):
        return "{\n" + "\n".join(f"  {k} = {hcl_safe(v)}" for k, v in value.items()) + "\n}"
    return str(value)


def apply_variables_to_patch(properties, tfvars):
    updated = {}
    for key, value in properties.items():
        if isinstance(value, str) and value.startswith("${") and value.endswith("}"):
            var_name = value.strip("${}").replace("var.", "")
            updated[key] = tfvars.get(var_name, value)
        elif isinstance(value, dict):
            updated[key] = apply_variables_to_patch(value, tfvars)
        elif isinstance(value, list):
            updated[key] = [apply_variables_to_patch(v, tfvars) if isinstance(v, dict) else v for v in value]
        else:
            updated[key] = value
    return updated


def apply_variables_to_patch_text(patch_text, variables):
    if patch_text is None:
        raise ValueError("Patch text is None. Cannot perform variable substitution.")
    
    pattern = re.compile(r'\${var\.([a-zA-Z0-9_]+)}')
    return pattern.sub(lambda m: str(variables.get(m.group(1), m.group(0))), patch_text)
