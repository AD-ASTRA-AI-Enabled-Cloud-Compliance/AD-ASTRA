# file_comparator.py

class TerraformComparator:
    def __init__(self, file1_path, file2_path):
        self.file1_path = file1_path
        self.file2_path = file2_path
        self.file1_lines = self._read_file(file1_path)
        self.file2_lines = self._read_file(file2_path)

    def _read_file(self, path):
        with open(path, 'r') as file:
            return file.readlines()

    def compare_files(self):
        max_len = max(len(self.file1_lines), len(self.file2_lines))
        differences = []

        for i in range(max_len):
            line1 = self.file1_lines[i].strip() if i < len(self.file1_lines) else ""
            line2 = self.file2_lines[i].strip() if i < len(self.file2_lines) else ""
            if line1 != line2:
                differences.append((i + 1, line1, line2))

        return differences

    def generate_merged_file(self, output_path="output/final.tf"):
        # Currently preferring file2 content
        with open(output_path, 'w') as f:
            f.writelines(self.file2_lines)
        return output_path
