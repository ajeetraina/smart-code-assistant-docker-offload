import { SystemInfo, CodeRequest, CodeResponse, HealthStatus } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          errorData.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          'Unable to connect to the API. Please ensure the backend is running.'
        );
      }
      throw error;
    }
  }

  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async getSystemInfo(): Promise<SystemInfo> {
    return this.request<SystemInfo>('/info');
  }

  async completeCode(request: CodeRequest): Promise<CodeResponse> {
    return this.request<CodeResponse>('/complete', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateCode(request: CodeRequest): Promise<CodeResponse> {
    return this.request<CodeResponse>('/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService();