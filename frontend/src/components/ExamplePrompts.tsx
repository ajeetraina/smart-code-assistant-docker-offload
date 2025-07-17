import React from 'react';
import { Lightbulb, Play } from 'lucide-react';

interface Example {
  title: string;
  description: string;
  code: string;
  prompt?: string;
  category: 'completion' | 'generation';
  complexity: 'simple' | 'advanced';
}

interface ExamplePromptsProps {
  onExampleSelect: (example: { code: string; prompt?: string }) => void;
  modelSize: 'small' | 'large';
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onExampleSelect, modelSize }) => {
  const examples: Example[] = [
    // Simple examples for local/small model
    {
      title: "Python Function",
      description: "Basic function completion",
      code: "def fibonacci(",
      category: 'completion',
      complexity: 'simple'
    },
    {
      title: "JavaScript Arrow Function",
      description: "ES6 function syntax",
      code: "const calculateSum = (",
      category: 'completion',
      complexity: 'simple'
    },
    {
      title: "React Hook",
      description: "useState hook setup",
      code: "const [count, setCount] = useState(",
      category: 'completion',
      complexity: 'simple'
    },
    {
      title: "Class Method",
      description: "Python class method",
      code: "class Calculator:\n    def add(self,",
      category: 'completion',
      complexity: 'simple'
    },
    
    // Advanced examples for large model
    {
      title: "React Shopping Cart",
      description: "Complete component with state management",
      code: "",
      prompt: "Create a React TypeScript component for a shopping cart with add/remove items, quantity updates, and total calculation",
      category: 'generation',
      complexity: 'advanced'
    },
    {
      title: "Python API Client",
      description: "HTTP client with error handling",
      code: "",
      prompt: "Create a Python class for making HTTP API requests with retry logic, timeout handling, and proper error responses",
      category: 'generation',
      complexity: 'advanced'
    },
    {
      title: "Database Schema",
      description: "SQL table design",
      code: "",
      prompt: "Design SQL tables for a blog application with users, posts, comments, and tags relationships",
      category: 'generation',
      complexity: 'advanced'
    },
    {
      title: "Algorithm Implementation",
      description: "Binary search tree",
      code: "",
      prompt: "Implement a binary search tree in Python with insert, search, delete, and in-order traversal methods",
      category: 'generation',
      complexity: 'advanced'
    },
    {
      title: "Express.js Route",
      description: "RESTful API endpoint",
      code: "",
      prompt: "Create Express.js routes for a user management API with CRUD operations, validation, and JWT authentication",
      category: 'generation',
      complexity: 'advanced'
    },
    {
      title: "Docker Configuration",
      description: "Multi-stage Dockerfile",
      code: "",
      prompt: "Create a multi-stage Dockerfile for a Node.js application with optimization for production deployment",
      category: 'generation',
      complexity: 'advanced'
    }
  ];

  // Filter examples based on model size
  const availableExamples = examples.filter(example => {
    if (modelSize === 'small') {
      return example.complexity === 'simple';
    }
    return true; // Large model can handle both simple and advanced
  });

  const simpleExamples = availableExamples.filter(e => e.complexity === 'simple');
  const advancedExamples = availableExamples.filter(e => e.complexity === 'advanced');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
        Example Prompts
      </h3>
      
      <div className="space-y-6">
        {/* Simple Examples */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Code Completion
          </h4>
          <div className="space-y-2">
            {simpleExamples.map((example, index) => (
              <button
                key={`simple-${index}`}
                onClick={() => onExampleSelect({ code: example.code, prompt: example.prompt })}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {example.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {example.description}
                    </div>
                  </div>
                  <Play className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Advanced Examples (only show for large model) */}
        {modelSize === 'large' && advancedExamples.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Code Generation
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                GPU Powered
              </span>
            </h4>
            <div className="space-y-2">
              {advancedExamples.slice(0, 4).map((example, index) => (
                <button
                  key={`advanced-${index}`}
                  onClick={() => onExampleSelect({ code: example.code, prompt: example.prompt })}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {example.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {example.description}
                      </div>
                    </div>
                    <Play className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Model Recommendation */}
        <div className="pt-4 border-t border-gray-200">
          <div className={`p-3 rounded-lg ${
            modelSize === 'large' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="text-sm">
              <div className={`font-medium mb-1 ${
                modelSize === 'large' ? 'text-green-900' : 'text-blue-900'
              }`}>
                {modelSize === 'large' ? '☁️ Current: Large Model' : '💻 Current: Small Model'}
              </div>
              <div className={`text-xs ${
                modelSize === 'large' ? 'text-green-800' : 'text-blue-800'
              }`}>
                {modelSize === 'large' 
                  ? 'Perfect for complex code generation and advanced features'
                  : 'Great for quick completions and basic code assistance'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplePrompts;