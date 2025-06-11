interface ModelDetails {
    parent_model: string;
    format: string;
    family: string;
    families: any;
    parameter_size: string;
    quantization_level: string;
}

interface Model {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: ModelDetails;
}

interface ModelResponse {
    models: Model[];
}

export function getModelNames(response: ModelResponse): string[] {
    return response.models.map((model) => model.name);
}
