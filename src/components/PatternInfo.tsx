import React from 'react';
import { ParallelPattern, ParallelPatternType } from '../types';
import { PatternIcon, MPIIcon, OpenMPIcon, CppIcon } from './icons';

interface PatternInfoProps {
  patterns: ParallelPatternType[];
  allPatterns: ParallelPattern[];
}

const PatternInfo: React.FC<PatternInfoProps> = ({ patterns, allPatterns }) => {
  if (patterns.length === 0 || (patterns.length === 1 && patterns[0] === ParallelPatternType.UNKNOWN)) {
    return null;
  }

  const patternDetails = patterns.map(patternType => 
    allPatterns.find(p => p.type === patternType)
  ).filter(Boolean) as ParallelPattern[];

  return (
    <div className="card mt-6">
      <div className="card-header">
        <h3 className="font-semibold text-gray-300 flex items-center">
          <PatternIcon size={18} className="mr-2 text-yellow-500" />
          Detected Patterns
        </h3>
      </div>
      <div className="card-body">
        <div className="space-y-4">
          {patternDetails.map((pattern, index) => (
            <div key={index} className="bg-[#1e293b] rounded-md p-4 transition-all duration-200 hover:bg-[#2d3748]">
              <h4 className="font-medium text-blue-400 mb-2 capitalize flex items-center">
                {getPatternIcon(pattern.type)}
                <span className="ml-2">{pattern.type} Pattern</span>
              </h4>
              <p className="text-gray-300 text-sm mb-3">{pattern.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {pattern.mpiEquivalent && (
                  <div className="bg-[#0f172a] p-3 rounded flex items-start">
                    <MPIIcon size={16} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 block mb-1 scientific-label">MPI Equivalent</span>
                      <code className="text-green-400 font-mono">{pattern.mpiEquivalent}</code>
                    </div>
                  </div>
                )}
                
                {pattern.openMPEquivalent && (
                  <div className="bg-[#0f172a] p-3 rounded flex items-start">
                    <OpenMPIcon size={16} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 block mb-1 scientific-label">OpenMP Equivalent</span>
                      <code className="text-green-400 font-mono">{pattern.openMPEquivalent}</code>
                    </div>
                  </div>
                )}
                
                <div className="bg-[#0f172a] p-3 rounded md:col-span-2 flex items-start">
                  <CppIcon size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 block mb-1 scientific-label">C++ Standard Equivalent</span>
                    <code className="text-blue-400 font-mono">{pattern.cppStandardEquivalent}</code>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get the appropriate icon for each pattern type
function getPatternIcon(patternType: string) {
  switch (patternType) {
    case ParallelPatternType.MAP:
      return <PatternIcon size={16} className="text-blue-400" />;
    case ParallelPatternType.REDUCE:
      return <PatternIcon size={16} className="text-purple-400" />;
    case ParallelPatternType.SCAN:
      return <PatternIcon size={16} className="text-green-400" />;
    case ParallelPatternType.STENCIL:
      return <PatternIcon size={16} className="text-yellow-400" />;
    case ParallelPatternType.BROADCAST:
      return <PatternIcon size={16} className="text-red-400" />;
    case ParallelPatternType.GATHER:
      return <PatternIcon size={16} className="text-indigo-400" />;
    case ParallelPatternType.SCATTER:
      return <PatternIcon size={16} className="text-pink-400" />;
    default:
      return <PatternIcon size={16} className="text-gray-400" />;
  }
}

export default PatternInfo; 