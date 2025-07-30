# --------------------------------------------------------------------------------------------------------------------
# Updated by Harsimran Kaur
# This file is part of pipeline 3.
# This file defines the TerraformTemplateWriter class, which provides utilities to render Terraform resource blocks
# from Python dictionaries. It supports nested dictionaries, lists, and various value types, enabling dynamic
# generation of Terraform configuration code for compliance automation workflows.
# --------------------------------------------------------------------------------------------------------------------

import json


class TerraformTemplateWriter:
    @staticmethod
    def render_tf_resource(resource_type, resource_name, settings, framework):
        """
        Render a Terraform resource block.
        """
        tf_lines = [f"# ====== {framework} Compliance Resource ======"]
        tf_lines.append(f'resource "{resource_type}" "{resource_name}" {{')

        def render_value(key, val, indent=2):
            spaces = " " * indent
            if isinstance(val, dict):
                if key == "labels":
                    # Special case: labels must be an argument map
                    label_items = ", ".join(
                        f'{json.dumps(k)} = {json.dumps(v)}'
                        for k, v in val.items()
                    )
                    return f'{spaces}{key} = {{{label_items}}}'
                else:
                    # Nested dict as block
                    lines = [f"{spaces}{key} {{"]
                    for k, v in val.items():
                        lines.append(render_value(k, v, indent + 2))
                    lines.append(f"{spaces}}}")
                    return "\n".join(lines)
            elif isinstance(val, list):
                if all(isinstance(i, dict) for i in val):
                    # Multiple nested blocks
                    blocks = []
                    for item in val:
                        block_lines = [f"{spaces}{key} {{"]
                        for k, v in item.items():
                            block_lines.append(render_value(k, v, indent + 2))
                        block_lines.append(f"{spaces}}}")
                        blocks.append("\n".join(block_lines))
                    return "\n".join(blocks)
                else:
                    # Simple list
                    items = ", ".join(json.dumps(i) for i in val)
                    return f"{spaces}{key} = [{items}]"
            elif isinstance(val, bool):
                return f"{spaces}{key} = {'true' if val else 'false'}"
            elif isinstance(val, (int, float)):
                return f"{spaces}{key} = {val}"
            elif isinstance(val, str):
                if val.startswith("${") and val.endswith("}"):
                    varname = val[2:-1]
                    if "json" in varname.lower():
                        return f"{spaces}{key} = jsondecode({varname})"
                    return f"{spaces}{key} = {varname}"
                # Escape inner double quotes for all providers
                val = val.replace('"', '\\"')
                return f'{spaces}{key} = "{val}"'
            else:
                return f'{spaces}{key} = "{str(val)}"'

        for k, v in settings.items():
            if k == "settings":
                # Ensure settings is rendered as nested block
                tf_lines.append(render_value("settings", v))
            else:
                tf_lines.append(render_value(k, v))

        tf_lines.append("}\n")
        return "\n".join(tf_lines)
