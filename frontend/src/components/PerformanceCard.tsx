import React from 'react';
import { BarChart, Clock, Hash, Zap } from 'lucide-react';
import { PerformanceMetrics } from '../types';

interface PerformanceCardProps {
  metrics: PerformanceMetrics[];
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ metrics }) => {
  if (metrics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-purple-500" />
          Performance Metrics
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Clock className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-gray-600 text-sm">No metrics yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Generate some code to see performance data
          </p>
        </div>
      </div>
    );
  }

  const latestMetric = metrics[0];
  const averageResponseTime = metrics.reduce((sum, m) => sum + m.response_time, 0) / metrics.length;
  const averageTokensPerSecond = metrics.reduce((sum, m) => sum + m.tokens_per_second, 0) / metrics.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart className="h-5 w-5 mr-2 text-purple-500" />
        Performance Metrics
      </h3>
      
      <div className="space-y-4">
        {/* Latest Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Latest Generation</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="metric-card">
              <div className="metric-value">
                {latestMetric.response_time.toFixed(2)}s
              </div>
              <div className="metric-label flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Response Time
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-value">
                {latestMetric.tokens_generated}
              </div>
              <div className="metric-label flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                Tokens
              </div>
            </div>
            
            <div className="metric-card col-span-2">
              <div className="metric-value">
                {latestMetric.tokens_per_second.toFixed(1)} t/s
              </div>
              <div className="metric-label flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Tokens per Second
              </div>
            </div>
          </div>
        </div>
        
        {/* Averages */}
        {metrics.length > 1 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Average ({metrics.length} runs)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {averageResponseTime.toFixed(2)}s
                </div>
                <div className="text-xs text-gray-600">Avg Response</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {averageTokensPerSecond.toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Avg Tokens/s</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Model Comparison */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Model Performance</h4>
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Current Model:</span>
              <span className="font-medium">
                {latestMetric.model_size === 'large' ? 'Large (GPU)' : 'Small (CPU)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="font-medium">
                {latestMetric.device.includes('cuda') ? 'Docker Offload' : 'Local'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Performance History */}
        {metrics.length > 1 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent History</h4>
            <div className="space-y-2">
              {metrics.slice(0, 3).map((metric, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-gray-600">Run {metrics.length - index}</span>
                  <span className="font-medium">
                    {metric.response_time.toFixed(2)}s ({metric.tokens_generated} tokens)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCard;