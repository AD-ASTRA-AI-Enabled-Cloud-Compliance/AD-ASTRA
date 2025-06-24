import { useEffect, useState } from "react";

const getModelNames = (modelsAvailable: any): string[] => {
    return modelsAvailable.models?.map((m: any) => m.name) || [];
};

export const useModels = () => {
    const [models, setModels] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const modelsResponse = await fetch("http://localhost:11434/api/tags");
                const modelsAvailable = await modelsResponse.json();
                const modelNames = getModelNames(modelsAvailable);
                setModels(modelNames);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { models, loading, error };
};
