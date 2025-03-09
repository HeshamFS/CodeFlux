import React from 'react';
import { CppIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="border-b border-[#1e293b]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <CppIcon size={32} className="text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">CodeFlux</h1>
            <p className="text-sm text-gray-400">Intelligent C++ Code Transformation</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;