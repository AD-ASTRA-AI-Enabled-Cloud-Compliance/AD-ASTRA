def find_resource_gaps(reference, actual):
    # Normalize to dicts
    def normalize(resources):
        result = {}
        if isinstance(resources, list):
            for item in resources:
                for r_type, blocks in item.items():
                    if r_type not in result:
                        result[r_type] = {}
                    for r_name, r_config in blocks.items():
                        result[r_type][r_name] = r_config
        elif isinstance(resources, dict):
            return resources
        return result

    ref_resources = normalize(reference.get("resource", []))
    actual_resources = normalize(actual.get("resource", []))

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
