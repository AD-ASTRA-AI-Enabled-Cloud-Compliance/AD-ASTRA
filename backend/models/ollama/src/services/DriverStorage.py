import os


class StoragePaths:
    def __init__(self, upload, output, terraform):
        self.upload_folder = upload
        self.output_folder = output
        self.terraform_folder = terraform

class DriverStorage:
    def __init__(self, folder_group: str = "documents_a", dynamic: bool = False):
        prefix = 'storage'
        base_path = os.path.join(os.path.dirname(__file__), f"../{prefix}/{folder_group}")
        
        self.upload_folder = os.path.join(base_path, "uploads")
        self.output_folder = os.path.join(base_path, "cloud_outputs")
        self.terraform_folder = os.path.join(base_path, "terraform")

        os.makedirs(self.upload_folder, exist_ok=True)
        os.makedirs(self.output_folder, exist_ok=True)
        os.makedirs(self.terraform_folder, exist_ok=True)

    def directories(self):
        return StoragePaths(
            self.upload_folder,
            self.output_folder,
            self.terraform_folder
        )
