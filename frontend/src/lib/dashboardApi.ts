// Modified for enhancing management dashboard functionality
// API service for dashboard statistics and document management
// Provides centralized API calls for fetching document counts, rules statistics, and download functionality

const API_BASE_URL = process.env.NEXT_PUBLIC_DOCUMENT_API_URL || 'http://localhost:3030';

export interface DocumentStats {
  total_documents: number;
  pdf_documents: number;
  documents: string[];
}

export interface Document {
  filename: string;
  size: number;
  modified: number;
  type: string;
}

export interface RulesStats {
  total_rules: number;
  frameworks: string[];
  frameworks_count: number;
  models: string[];
  models_count: number;
  collection_exists: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class DashboardApiService {
  private async makeRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Document-related API calls
  async getDocumentStats(): Promise<ApiResponse<DocumentStats>> {
    return this.makeRequest<DocumentStats>('/api/documents/stats');
  }

  async getDocumentsList(): Promise<ApiResponse<{ documents: Document[]; count: number }>> {
    return this.makeRequest<{ documents: Document[]; count: number }>('/api/documents/list');
  }

  getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/api/documents/download/${encodeURIComponent(filename)}`;
  }

  // Rules-related API calls
  async getRulesStats(): Promise<ApiResponse<RulesStats>> {
    return this.makeRequest<RulesStats>('/api/rules/stats');
  }

  async getFrameworksList(): Promise<ApiResponse<{ frameworks: string[]; count: number }>> {
    return this.makeRequest<{ frameworks: string[]; count: number }>('/api/rules/frameworks');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.makeRequest<{ status: string; message: string }>('/');
  }
}

// Export singleton instance
export const dashboardApi = new DashboardApiService();

// Export individual functions for convenience
export const {
  getDocumentStats,
  getDocumentsList,
  getDownloadUrl,
  getRulesStats,
  getFrameworksList,
  healthCheck
} = dashboardApi;
// End Modified for enhancing management dashboard functionality
