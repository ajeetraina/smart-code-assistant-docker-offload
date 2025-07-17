import React from 'react';
import { Github, Twitter, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Smart Code Assistant</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A demonstration of Docker Offload capabilities for AI/ML workloads.
              Experience the seamless transition from local to cloud-powered development.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://docs.docker.com/offload/" 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Docker Offload Docs
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/ajeetraina/smart-code-assistant-docker-offload" 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Performance Benchmarks
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Author</h3>
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                <strong className="text-white">Ajeet Singh Raina</strong><br />
                Docker Captain, ARM Innovator
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/ajeetraina" 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/ajeetsraina" 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="http://www.collabnix.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Ajeet Singh Raina. Licensed under MIT License.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Powered by Docker Offload & React
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;