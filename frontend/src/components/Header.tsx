import React from 'react';
import { Code, Cpu, Cloud } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
              <Cloud className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Code Assistant
              </h1>
              <p className="text-sm text-gray-600">
                Docker Offload Demo: Local vs Cloud-Powered AI
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Cpu className="h-4 w-4" />
              <span>Intelligent Model Scaling</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            🚀 Demo Overview
          </h2>
          <p className="text-blue-800 text-sm leading-relaxed">
            This application demonstrates when to use <strong>local development</strong> vs 
            <strong> Docker Offload</strong>. Start with basic code completion using small local models, 
            then experience the power of large GPU-accelerated models in the cloud.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;