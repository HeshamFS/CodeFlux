import React from 'react';
import { Github, Code2, ExternalLink, Mail, BookOpen, Shield, Cpu } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1e293b] mt-16 py-12 bg-[#111827]">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Code2 className="text-blue-500 mr-2" size={24} />
              <span className="text-gray-200 font-semibold">CodeFlux</span>
            </div>
            <p className="text-gray-400 text-sm">
              Transform your parallel code into modern C++ with intelligent pattern detection and optimization.
              Seamlessly convert MPI/OpenMP to standard C++ parallel algorithms.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/codeflux-ai/codeflux" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="View on GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:contact@codeflux.ai" 
                className="text-gray-400 hover:text-white transition-colors"
                title="Contact Us"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400 hover:text-gray-300 transition-colors">
                <a href="#" className="flex items-center">
                  <Cpu size={16} className="mr-2" />
                  Smart Pattern Detection
                </a>
              </li>
              <li className="text-gray-400 hover:text-gray-300 transition-colors">
                <a href="#" className="flex items-center">
                  <Shield size={16} className="mr-2" />
                  Modern C++ Standards
                </a>
              </li>
              <li className="text-gray-400 hover:text-gray-300 transition-colors">
                <a href="#" className="flex items-center">
                  <BookOpen size={16} className="mr-2" />
                  Performance Analysis
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://en.cppreference.com/w/cpp/algorithm" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors inline-flex items-center"
                >
                  C++ Standard Algorithms
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.open-mpi.org/doc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors inline-flex items-center"
                >
                  OpenMPI Documentation
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.openmp.org/specifications/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors inline-flex items-center"
                >
                  OpenMP Specifications
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technology Section */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4">Technology</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>AI-Powered Code Analysis</p>
              <p>Built with React & TypeScript</p>
              <p>Monaco Editor Integration</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1e293b] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CodeFlux. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Documentation</a>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            This tool is for educational and research purposes. Always review and test the converted code thoroughly before using in production environments.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 