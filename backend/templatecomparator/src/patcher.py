import os
import uuid
from utils import hcl_safe


def render_properties(props, indent=2):
    """
    Recursively renders HCL properties, including nested blocks.
    """
    lines = []
    spacing = " " * indent

    for key, value in props.items():
        if isinstance(value, dict):
            lines.append(f"{spacing}{key} {{")
            lines.extend(render_properties(value, indent + 2))
            lines.append(f"{spacing}}}")
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    lines.append(f"{spacing}{key} {{")
                    lines.extend(render_properties(item, indent + 2))
                    lines.append(f"{spacing}}}")
                else:
                    lines.append(f"{spacing}{key} = {hcl_safe(item)}")
        else:
            lines.append(f"{spacing}{key} = {hcl_safe(value)}")

    return lines


def render_hcl_block(resource_type, resource_name, properties):
    """
    Generates a Terraform resource block in HCL format with nested support.
    Applies hcl_safe formatting for all values.
    """
    lines = [f'resource "{resource_type}" "{resource_name}" {{']
    lines.extend(render_properties(properties, indent=2))
    lines.append("}")
    return "\n".join(lines)


def generate_patch_file(missing_resources, path="output/patch.tf", tfvars=None):
    """
    Writes a patch.tf file from missing resources, substituting variables if provided.
    Ensures each resource has a unique name using a UUID suffix to prevent duplication.
    """
    rendered_blocks = []
    used_names = set()

    for res in missing_resources:
        resource_type = res["type"]
        base_name = res["name"]
        config = res["config"]

        # 🧠 Apply tfvars substitution if available
        if tfvars:
            config = apply_variables_to_patch(config, tfvars)

        # 🆔 Generate a unique resource name
        resource_name = base_name
        if resource_name in used_names:
            suffix = uuid.uuid4().hex[:6]
            resource_name = f"{base_name}_{suffix}"
        used_names.add(resource_name)

        # 🎯 Render Terraform block
        block = render_hcl_block(resource_type, resource_name, config)
        rendered_blocks.append(block)

    # 📄 Join all resource blocks with spacing
    final_content = "\n\n".join(rendered_blocks)

    with open(path, "w") as f:
        f.write(final_content)

    return final_content


def merge_patch_into_actual(actual_path, patch_path, final_output_path):
    """
    Merges patch.tf into the actual Terraform file to produce updated_actual.tf.
    """
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


