import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, Info, Zap, Cpu, Monitor, Clock, Hash } from 'lucide-react';
import { SystemInfo, CodeResponse, PerformanceMetrics } from '../types';
import { apiService } from '../services/api';
import SystemInfoCard from './SystemInfoCard';
import PerformanceCard from './PerformanceCard';
import CodeEditor from './CodeEditor';
import ResultDisplay from './ResultDisplay';
import ExamplePrompts from './ExamplePrompts';

const CodeAssistant: React.FC = () => {
  const [code, setCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [activeTab, setActiveTab] = useState<'complete' | 'generate'>('complete');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const info = await apiService.getSystemInfo();
      setSystemInfo(info);
      setError(null);
    } catch (err) {
      setError('Failed to fetch system information');
      console.error('System info error:', err);
    }
  };

  const handleCodeCompletion = async () => {
    if (!code.trim()) {
      setError('Please enter some code to complete');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = Date.now();
      const response: CodeResponse = await apiService.completeCode({
        code,
        prompt: activeTab === 'generate' ? prompt : undefined,
        max_tokens: systemInfo?.model_size === 'large' ? 500 : 100,
        temperature: 0.7
      });
      
      setResult(response.completion);
      
      // Update performance metrics
      const endTime = Date.now();
      const newMetric: PerformanceMetrics = {
        response_time: response.response_time,
        tokens_generated: response.tokens_generated,
        tokens_per_second: response.tokens_generated / response.response_time,
        model_size: response.model_info.model_size,
        device: response.model_info.device
      };
      
      setPerformanceMetrics(prev => [newMetric, ...prev.slice(0, 4)]); // Keep last 5 metrics
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate completion');
      console.error('Code completion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (example: { code: string; prompt?: string }) => {
    setCode(example.code);
    if (example.prompt) {
      setPrompt(example.prompt);
      setActiveTab('generate');
    } else {
      setActiveTab('complete');
    }
  };

  const clearAll = () => {
    setCode('');
    setPrompt('');
    setResult('');
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* System Information */}
      {systemInfo && (
        <SystemInfoCard 
          systemInfo={systemInfo} 
          onRefresh={fetchSystemInfo}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-600">⚠️</div>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Code Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('complete')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'complete'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Code Completion</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'generate'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4" />
                    <span>Code Generation</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'generate' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Natural Language Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to create (e.g., 'Create a React component for a shopping cart')"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <CodeEditor
                value={code}
                onChange={setCode}
                placeholder={
                  activeTab === 'complete'
                    ? "Enter your code here (e.g., 'def fibonacci(')..."
                    : "Optional: Add existing code context..."
                }
              />

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-3">
                  <button
                    onClick={handleCodeCompletion}
                    disabled={isLoading || (!code.trim() && activeTab === 'complete') || (!prompt.trim() && activeTab === 'generate')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 loading-spinner" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>
                      {isLoading
                        ? 'Processing...'
                        : activeTab === 'complete'
                        ? 'Complete Code'
                        : 'Generate Code'
                      }
                    </span>
                  </button>
                  
                  <button
                    onClick={clearAll}
                    className="btn-secondary"
                  >
                    Clear All
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Model: {systemInfo?.model_size || 'loading...'} | 
                  Device: {systemInfo?.device || 'unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <ResultDisplay result={result} isLoading={isLoading} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <PerformanceCard metrics={performanceMetrics} />

          {/* Example Prompts */}
          <ExamplePrompts 
            onExampleSelect={handleExampleSelect}
            modelSize={systemInfo?.model_size || 'small'}
          />

          {/* Decision Guide */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              When to Use What?
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💻 Local (Small Model)</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Quick code completion</li>
                  <li>• Syntax suggestions</li>
                  <li>• Fast iteration cycles</li>
                  <li>• Offline development</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">☁️ Docker Offload (Large Model)</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Complex code generation</li>
                  <li>• Architecture suggestions</li>
                  <li>• Advanced refactoring</li>
                  <li>• Large context understanding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAssistant;