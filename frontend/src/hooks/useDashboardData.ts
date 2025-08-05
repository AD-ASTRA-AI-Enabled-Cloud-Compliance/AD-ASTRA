// Modified for enhancing management dashboard functionality
// Custom React hooks for managing dashboard data state and API calls
// Provides loading states, error handling, and automatic data fetching for dashboard components
import { useState, useEffect } from 'react';
import { dashboardApi, DocumentStats, RulesStats, Document } from '@/lib/dashboardApi';

export interface DashboardData {
  documentStats: DocumentStats | null;
  rulesStats: RulesStats | null;
  documentsList: Document[] | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    documentStats: null,
    rulesStats: null,
    documentsList: null,
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch all data in parallel
      const [documentStatsResponse, rulesStatsResponse, documentsListResponse] = await Promise.all([
        dashboardApi.getDocumentStats(),
        dashboardApi.getRulesStats(),
        dashboardApi.getDocumentsList(),
      ]);

      // Handle document stats
      if (!documentStatsResponse.success) {
        console.error('Failed to fetch document stats:', documentStatsResponse.error);
      }

      // Handle rules stats
      if (!rulesStatsResponse.success) {
        console.error('Failed to fetch rules stats:', rulesStatsResponse.error);
      }

      // Handle documents list
      if (!documentsListResponse.success) {
        console.error('Failed to fetch documents list:', documentsListResponse.error);
      }

      setData({
        documentStats: documentStatsResponse.data || null,
        rulesStats: rulesStatsResponse.data || null,
        documentsList: documentsListResponse.data?.documents || null,
        isLoading: false,
        error: null,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    ...data,
    refetch,
  };
}

// Hook specifically for document stats
export function useDocumentStats() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dashboardApi.getDocumentStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch document stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
}

// Hook specifically for rules stats
export function useRulesStats() {
  const [stats, setStats] = useState<RulesStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dashboardApi.getRulesStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch rules stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
}
// End Modified for enhancing management dashboard functionality
