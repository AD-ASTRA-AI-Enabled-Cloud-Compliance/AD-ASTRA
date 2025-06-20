import hcl2

def load_terraform_file(path):
    with open(path, 'r') as f:
        return hcl2.load(f)
