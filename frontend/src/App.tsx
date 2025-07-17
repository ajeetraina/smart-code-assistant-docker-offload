import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Zap, Cloud } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

interface ModelInfo {
  current_model: string;
  model_display: string;
  model_size: string;
  status: string;
}

const SimpleChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your smart coding assistant with Docker Offload capabilities. I can scale from fast local models to powerful cloud models automatically. Ask me anything about programming!",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch model info on component mount
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/model-info');
      const data = await response.json();
      setModelInfo(data);
    } catch (error) {
      console.error('Failed to fetch model info:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          stream: true 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedContent = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim()) {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    accumulatedContent += parsed.content;
                    
                    // Update the streaming message
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: accumulatedContent }
                          : msg
                      )
                    );
                  } else if (parsed.error) {
                    accumulatedContent = `Error: ${parsed.error}`;
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: accumulatedContent, isStreaming: false }
                          : msg
                      )
                    );
                    break;
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e);
                }
              }
            }
          }
        }

        // Mark streaming as complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Update with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { 
                ...msg, 
                content: \"Sorry, I'm having trouble connecting to the model. Please check if Docker Model Runner is running.\",
                isStreaming: false 
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getModelIcon = (size: string) => {
    if (size === 'large') return <Cloud className=\"h-4 w-4 text-purple-500\" />;
    if (size === 'medium') return <Zap className=\"h-4 w-4 text-orange-500\" />;
    return <Cpu className=\"h-4 w-4 text-green-500\" />;
  };

  const getModelBadge = (size: string) => {
    if (size === 'large') return 'bg-purple-100 text-purple-700';
    if (size === 'medium') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  const getModelLabel = (size: string) => {
    if (size === 'large') return 'Docker Offload';
    if (size === 'medium') return 'GPU Accelerated';
    return 'Local GPU';
  };

  return (
    <div className=\"flex flex-col h-screen max-w-4xl mx-auto bg-white\">
      {/* Header with Model Info */}
      <div className=\"border-b border-gray-200 p-4 bg-gradient-to-r from-blue-50 to-indigo-50\">
        <div className=\"flex items-center justify-between\">
          <h1 className=\"text-xl font-semibold text-gray-800 flex items-center gap-2\">
            <Bot className=\"h-6 w-6 text-blue-500\" />
            Smart Code Assistant
          </h1>
          
          {modelInfo && (
            <div className=\"flex items-center gap-3 text-sm\">
              <div className=\"flex items-center gap-1\">
                {getModelIcon(modelInfo.model_size)}
                <span className=\"text-gray-600\">
                  {modelInfo.model_display}
                </span>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getModelBadge(modelInfo.model_size)}`}>
                {getModelLabel(modelInfo.model_size)}
              </div>
              
              <div className={`w-2 h-2 rounded-full ${
                modelInfo.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className=\"flex-1 overflow-y-auto p-4 space-y-4\">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className=\"w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0\">
                <Bot className=\"h-4 w-4 text-white\" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className=\"text-sm whitespace-pre-wrap\">
                {message.content}
                {message.isStreaming && (
                  <span className=\"inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse\"></span>
                )}
              </p>
              <div className=\"flex items-center justify-between mt-1\">
                <p className={`text-xs ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                {message.role === 'assistant' && !message.isStreaming && modelInfo && (
                  <div className=\"flex items-center gap-1\">
                    {getModelIcon(modelInfo.model_size)}
                  </div>
                )}
              </div>
            </div>

            {message.role === 'user' && (
              <div className=\"w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0\">
                <User className=\"h-4 w-4 text-white\" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className=\"flex gap-3 justify-start\">
            <div className=\"w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0\">
              <Bot className=\"h-4 w-4 text-white\" />
            </div>
            <div className=\"bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none\">
              <div className=\"flex space-x-1\">
                <div className=\"w-2 h-2 bg-gray-400 rounded-full animate-bounce\"></div>
                <div className=\"w-2 h-2 bg-gray-400 rounded-full animate-bounce\" style={{ animationDelay: '0.1s' }}></div>
                <div className=\"w-2 h-2 bg-gray-400 rounded-full animate-bounce\" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className=\"border-t border-gray-200 p-4 bg-gray-50\">
        <div className=\"flex gap-2\">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder=\"Ask me about coding, algorithms, debugging, or any programming question...\"
            className=\"flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white\"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className=\"bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
          >
            <Send className=\"h-5 w-5\" />
          </button>
        </div>
        <div className=\"flex items-center justify-between mt-2\">
          <p className=\"text-xs text-gray-500\">
            Press Enter to send, Shift+Enter for new line
          </p>
          <p className=\"text-xs text-gray-500 flex items-center gap-1\">
            {modelInfo && (
              <>
                {getModelIcon(modelInfo.model_size)}
                Powered by {modelInfo.model_display} • {getModelLabel(modelInfo.model_size)}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatbot;