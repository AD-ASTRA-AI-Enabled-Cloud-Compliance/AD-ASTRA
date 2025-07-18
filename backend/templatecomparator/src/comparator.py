def find_resource_gaps(reference, actual):
    def normalize(resources):
        result = {}
        if isinstance(resources, list):
            # New format: list of resource dicts with type, name, config
            for item in resources:
                r_type = item.get("type")
                r_name = item.get("name")
                r_config = item.get("config", {})
                if r_type and r_name:
                    if r_type not in result:
                        result[r_type] = {}
                    result[r_type][r_name] = r_config
        elif isinstance(resources, dict):
            # Old format: {"resource": [{"aws_s3_bucket": {...}}]}
            for item in resources.get("resource", []):
                for r_type, blocks in item.items():
                    if r_type not in result:
                        result[r_type] = {}
                    for r_name, r_config in blocks.items():
                        result[r_type][r_name] = r_config
        return result

    ref_resources = normalize(reference)
    actual_resources = normalize(actual)

    missing_resources = []

    for r_type, blocks in ref_resources.items():
        for r_name, r_config in blocks.items():
            if r_type not in actual_resources or r_name not in actual_resources[r_type]:
                missing_resources.append({
                    "type": r_type,
                    "name": r_name,
                    "config": r_config
                })

    return missing_resources
