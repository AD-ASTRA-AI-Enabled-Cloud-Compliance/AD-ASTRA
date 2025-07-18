import hcl2

def load_terraform_file(path):
    with open(path, 'r') as f:
        return hcl2.load(f)

def load_terraform_file_with_comments(path):
    resources = []
    current_comment_lines = []

    with open(path, 'r') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        if line.startswith('#'):
            current_comment_lines.append(line.lstrip('#').strip())
            i += 1
            continue

        if line.startswith('resource'):
            parts = line.split()
            if len(parts) >= 3:
                resource_type = parts[1].strip('"')
                resource_name = parts[2].strip('"')

                block_lines = [lines[i]]
                brace_count = lines[i].count('{') - lines[i].count('}')
                j = i + 1
                while j < len(lines) and brace_count > 0:
                    block_lines.append(lines[j])
                    brace_count += lines[j].count('{') - lines[j].count('}')
                    j += 1

                resources.append({
                    'type': resource_type,
                    'name': resource_name,
                    'block': ''.join(block_lines),
                    'comment': ' '.join(current_comment_lines) if current_comment_lines else None
                })

                current_comment_lines = []
                i = j
                continue

        current_comment_lines = []
        i += 1

    return resources
