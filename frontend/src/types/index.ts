export interface SystemInfo {
  model_size: 'small' | 'large';
  gpu_enabled: boolean;
  gpu_available: boolean;
  device: string;
  model_name: string;
  max_tokens: number;
  torch_version?: string;
  cuda_available?: boolean;
  cuda_version?: string | null;
  gpu_count?: number;
  gpu_name?: string | null;
}

export interface CodeRequest {
  code: string;
  prompt?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface CodeResponse {
  completion: string;
  model_info: SystemInfo;
  response_time: number;
  tokens_generated: number;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  model_size: 'small' | 'large';
  gpu_enabled: boolean;
  gpu_available: boolean;
  device: string;
}

export interface PerformanceMetrics {
  response_time: number;
  tokens_generated: number;
  tokens_per_second: number;
  model_size: 'small' | 'large';
  device: string;
}