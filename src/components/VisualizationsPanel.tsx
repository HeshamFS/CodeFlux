import React from 'react';
import { BarChart2, PlusCircle } from 'lucide-react';
import { CodeDiffView, PerformanceGraph } from './visualizations';
import { HistoryItem } from '../hooks/useHistoryManagement';
import { PerformanceData } from '../hooks/usePatternDetection';

interface VisualizationsPanelProps {
  preservedInputCode: string;
  preservedOutputCode: string;
  selectedHistoryItem: HistoryItem | null;
  performanceData: PerformanceData[];
  visualizationKey: number;
  onSwitchTab: (tab: 'converter' | 'visualizations' | 'history') => void;
  conversionHistory: HistoryItem[];
  onNewConversion: () => void;
}

const VisualizationsPanel: React.FC<VisualizationsPanelProps> = ({
  preservedInputCode,
  preservedOutputCode,
  selectedHistoryItem,
  performanceData,
  visualizationKey,
  onSwitchTab,
  conversionHistory,
  onNewConversion
}) => {
  // If no code is available for visualization, prompt the user to convert code first
  if (!preservedInputCode && !preservedOutputCode && !selectedHistoryItem && conversionHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">No Visualizations Available</h2>
        <p className="text-gray-400 mb-6">Convert some code first to see visualizations and performance metrics.</p>
        <button 
          onClick={() => onSwitchTab('converter')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Go to Converter
        </button>
      </div>
    );
  }

  // Use performance data from history item if available, otherwise use current performance data
  const activePerformanceData = selectedHistoryItem?.performanceData || performanceData || [];
  
  // Ensure we have valid performance data
  const hasPerformanceData = activePerformanceData && activePerformanceData.length > 0;
  
  // Get input and output code, prioritizing the history item if selected
  const inputCode = selectedHistoryItem?.inputCode || preservedInputCode;
  const outputCode = selectedHistoryItem?.outputCode || preservedOutputCode;

  return (
    <div className="visualizations-panel space-y-8 animate-fade-in" key={visualizationKey}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Code Analysis</h2>
        <div className="flex gap-4">
          <button 
            onClick={onNewConversion}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gray-600 hover:bg-gray-700 text-white"
          >
            <PlusCircle size={16} />
            <span>New Conversion</span>
          </button>
          <button 
            onClick={() => onSwitchTab('converter')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white"
          >
            <span>Back to Editor</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-4">
          Visualize the differences between your original code and the parallelized version.
        </p>
        
        {/* Render Code Diff component */}
        <div className="card p-0 overflow-hidden rounded-lg bg-gray-800">
          <CodeDiffView 
            originalCode={inputCode} 
            modifiedCode={outputCode}
          />
        </div>
      </div>

      {/* Performance Analysis Section - Always show this section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Performance Analysis</h2>
        <p className="text-gray-400 mb-4">
          Estimated performance improvements with the parallelized code implementation.
        </p>
        
        {/* Render Performance Graph component */}
        <div className="card p-6 rounded-lg bg-gray-800">
          {hasPerformanceData ? (
            <PerformanceGraph data={activePerformanceData} />
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-400">Performance data is being generated. 
                Please try converting your code again if this persists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationsPanel; 