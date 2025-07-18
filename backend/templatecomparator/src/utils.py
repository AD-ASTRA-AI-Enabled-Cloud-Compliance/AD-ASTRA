import os
import re

# --- TFVARS Parsing ---
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

# --- HCL Conversion ---
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

# --- Patch Text Variable Interpolation ---
def apply_variables_to_patch_text(patch_text, variables):
    if patch_text is None:
        raise ValueError("Patch text is None.")

    print("Variables for substitution:", variables)

    # --- Replace ${var.xyz} format ---
    patch_text = re.sub(r'\${var\.([a-zA-Z0-9_]+)}', lambda m: substitute_variable(m.group(1), variables, quoted=True), patch_text)

    # --- Replace var.xyz format ---
    patch_text = re.sub(r'\bvar\.([a-zA-Z0-9_]+)\b', lambda m: substitute_variable(m.group(1), variables, quoted=False), patch_text)

    print("Result after substitution:\n", patch_text[:500])  # preview
    return patch_text

# --- Substitution logic for individual variable ---
def substitute_variable(var_name, variables, quoted=False):
    val = variables.get(var_name)
    print(f"Replacing var.{var_name} with {val}")
    if val is None:
        return f'var.{var_name}' if not quoted else f'${{var.{var_name}}}'  # Keep as-is

    if isinstance(val, str):
        return f'"{val}"' if not quoted else val
    elif isinstance(val, bool):
        return str(val).lower()
    else:
        return str(val)
