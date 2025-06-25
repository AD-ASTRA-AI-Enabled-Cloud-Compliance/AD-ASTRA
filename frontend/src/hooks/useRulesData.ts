import { RulePoint, RuleRow } from '@/app/(management)/explore_rules/components/lib';
import { useEffect, useState, useCallback } from 'react';


export const useRulesData = () => {
  const [dataRules, setDataRules] = useState<RuleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchDataAsync = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch("http://localhost:3001/explore/rules");
      if (!response.ok) throw new Error("Bad response");

      const res = await response.json();
      const points: RulePoint[] = res.points;

      const tableData: RuleRow[] = points.map(point => ({
        id: point.id,
        ...point.payload,
      }));

      setDataRules(tableData);
      console.log(tableData);
    } catch (err) {
      console.error("Failed to fetch rules", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataAsync();
  }, [fetchDataAsync]);

  return { dataRules, loading, error, refetch: fetchDataAsync };
};
