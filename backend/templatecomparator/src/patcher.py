import os

def generate_patch_file(missing_resources, path="output/patch.tf"):
    with open(path, "w") as f:
        for res in missing_resources:
            f.write(f'resource "{res["type"]}" "{res["name"]}" {{\n')
            for k, v in res["config"].items():
                f.write(f'  {k} = {repr(v)}\n')
            f.write("}\n\n")


def merge_patch_into_actual(actual_path, patch_path, final_output_path):
    """
    Combines the original infra Terraform with patch.tf into a single updated file.
    """
    actual = ""
    patch = ""

    if os.path.exists(actual_path):
        with open(actual_path, 'r') as f1:
            actual = f1.read()
