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
                variables[key.strip()] = value.strip().strip('"')
    return variables


def apply_variables_to_patch(patch_text, variables):
    if patch_text is None:
        raise ValueError("Patch text is None. Cannot perform variable substitution.")
    
    pattern = re.compile(r'\${var\.([a-zA-Z0-9_]+)}')
    return pattern.sub(lambda m: str(variables.get(m.group(1), m.group(0))), patch_text)
