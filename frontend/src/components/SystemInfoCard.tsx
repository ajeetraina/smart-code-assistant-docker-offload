import React from 'react';
import { RefreshCw, Cpu, Monitor, Zap, HardDrive } from 'lucide-react';
import { SystemInfo } from '../types';

interface SystemInfoCardProps {
  systemInfo: SystemInfo;
  onRefresh: () => void;
}

const SystemInfoCard: React.FC<SystemInfoCardProps> = ({ systemInfo, onRefresh }) => {
  const isOffload = systemInfo.device.includes('offload') || systemInfo.gpu_enabled;
  
  return (
    <div className={`system-status ${
      isOffload ? 'status-offload' : 'status-local'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          {isOffload ? (
            <Monitor className="h-6 w-6 mr-2 text-green-600" />
          ) : (
            <Cpu className="h-6 w-6 mr-2 text-blue-600" />
          )}
          System Status
        </h2>
        <button
          onClick={onRefresh}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Refresh system info"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isOffload ? 'text-green-600' : 'text-blue-600'
          }`}>
            {systemInfo.model_size.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600">Model Size</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            systemInfo.gpu_available ? 'text-green-600' : 'text-gray-400'
          }`}>
            {systemInfo.gpu_available ? '✓' : '✗'}
          </div>
          <div className="text-sm text-gray-600">GPU Available</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {systemInfo.max_tokens}
          </div>
          <div className="text-sm text-gray-600">Max Tokens</div>
        </div>
        
        <div className="text-center">
          <div className={`text-xl font-semibold ${
            isOffload ? 'text-green-600' : 'text-blue-600'
          }`}>
            {isOffload ? 'CLOUD' : 'LOCAL'}
          </div>
          <div className="text-sm text-gray-600">Environment</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Model:</span>
            <span className="ml-2 text-gray-600">
              {systemInfo.model_name.split('/').pop() || systemInfo.model_name}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Device:</span>
            <span className="ml-2 text-gray-600">{systemInfo.device}</span>
          </div>
          {systemInfo.gpu_name && (
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">GPU:</span>
              <span className="ml-2 text-gray-600">{systemInfo.gpu_name}</span>
            </div>
          )}
        </div>
      </div>
      
      {isOffload && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <div className="flex items-center text-green-800">
            <Zap className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Running on Docker Offload with GPU acceleration!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemInfoCard;