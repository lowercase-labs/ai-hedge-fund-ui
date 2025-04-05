export interface Analysis {
  id: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  results: Record<string, any> | null;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  errorMessage?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const analysisService = {
  createAnalysis: async (data: Partial<Analysis>): Promise<Analysis> => {
    const response = await fetch(`${API_BASE_URL}/analyses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create analysis');
    }
    
    return response.json();
  },
  
  getAnalyses: async (): Promise<Analysis[]> => {
    const response = await fetch(`${API_BASE_URL}/analyses`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch analyses');
    }
    
    return response.json();
  },
  
  getAnalysis: async (id: string): Promise<Analysis> => {
    const response = await fetch(`${API_BASE_URL}/analyses/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }
    
    return response.json();
  },
  
  deleteAnalysis: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/analyses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete analysis');
    }
  },
  
  updateAnalysis: async (id: string, data: Partial<Analysis>): Promise<Analysis> => {
    const response = await fetch(`${API_BASE_URL}/analyses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update analysis');
    }
    
    return response.json();
  },
}; 