import os
from utils import hcl_safe, apply_variables_to_patch


def render_hcl_block(resource_type, resource_name, properties):
    lines = [f'resource "{resource_type}" "{resource_name}" {{']
    for key, value in properties.items():
        lines.append(f"  {key} = {hcl_safe(value)}")
    lines.append("}")
    return "\n".join(lines)


def generate_patch_file(missing_resources, path="output/patch.tf", tfvars=None):
    rendered_blocks = []

    for res in missing_resources:
        resource_type = res["type"]
        resource_name = res["name"]
        config = res["config"]

        if tfvars:
            config = apply_variables_to_patch(config, tfvars)

        block = render_hcl_block(resource_type, resource_name, config)
        rendered_blocks.append(block)

    final_content = "\n\n".join(rendered_blocks)

    with open(path, "w") as f:
        f.write(final_content)

    return final_content


def merge_patch_into_actual(actual_path, patch_path, final_output_path):
    if not os.path.exists(actual_path):
        raise FileNotFoundError(f"Actual infra file not found: {actual_path}")

    if not os.path.exists(patch_path):
        raise FileNotFoundError(f"Patch file not found: {patch_path}")

    with open(actual_path, 'r') as f1:
        actual = f1.read()

    with open(patch_path, 'r') as f2:
        patch = f2.read()

    with open(final_output_path, 'w') as f_out:
        f_out.write(actual.strip())
        f_out.write("\n\n# --- Patch from PCI Compliance ---\n\n")
        f_out.write(patch.strip())
        f_out.write("\n")

    print(f"✅ Merged file written to: {final_output_path}")
