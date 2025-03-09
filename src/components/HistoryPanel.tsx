import React from 'react';
import { HistoryItem } from '../hooks/useHistoryManagement';
import { Calendar, Clock, Code, ArrowRight, BookOpen, BarChart2, BookText, PlusCircle } from 'lucide-react';

interface HistoryPanelProps {
  conversionHistory: HistoryItem[];
  setConversionHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  selectedHistoryItem: HistoryItem | null;
  setSelectedHistoryItem: React.Dispatch<React.SetStateAction<HistoryItem | null>>;
  onApplyHistory: (item: HistoryItem) => void;
  onViewAnalysis: (item: HistoryItem) => void;
  onNewConversion: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  conversionHistory,
  setConversionHistory,
  selectedHistoryItem,
  setSelectedHistoryItem,
  onApplyHistory,
  onViewAnalysis,
  onNewConversion
}) => {
  if (conversionHistory.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Conversion History</h2>
        <p className="text-gray-400 mb-6">No conversion history yet. Convert some code to see it here.</p>
        <button 
          onClick={onNewConversion}
          className="inline-flex items-center gap-2 px-4 py-2 text-base font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle size={18} />
          <span>New Conversion</span>
        </button>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversion history?')) {
      setConversionHistory([]);
      localStorage.removeItem('conversionHistory');
    }
  };

  return (
    <div className="history-panel animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Conversion History</h2>
        <div className="flex gap-3">
          <button 
            onClick={onNewConversion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle size={16} />
            <span>New Conversion</span>
          </button>
          <button 
            onClick={clearHistory} 
            className="px-3 py-1.5 text-sm text-red-400 border border-red-500/30 rounded hover:bg-red-500/10"
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* History List */}
        <div className="history-list space-y-4">
          {conversionHistory.map((item) => (
            <div 
              key={item.id} 
              className={`history-item p-4 rounded-lg cursor-pointer transition-colors ${
                selectedHistoryItem?.id === item.id 
                  ? 'bg-blue-900/30 border border-blue-500/50' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedHistoryItem(item)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm flex items-center gap-1 text-gray-400">
                  <Calendar size={14} />
                  <span>{formatDate(item.timestamp)}</span>
                  <Clock size={14} className="ml-2" />
                  <span>{formatTime(item.timestamp)}</span>
                </div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                  C++{item.targetCppVersion}
                </div>
              </div>
              
              <div className="code-preview mb-3 text-sm font-mono bg-gray-900 p-2 rounded overflow-hidden text-ellipsis max-h-20">
                <div className="overflow-hidden max-h-full" style={{ maxHeight: '4rem' }}>
                  {item.inputCode.substring(0, 150)}{item.inputCode.length > 150 ? '...' : ''}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <Code size={14} className="text-green-400" />
                  <span>{item.patterns.length} Patterns</span>
                </div>
                
                {item.explanation && (
                  <div className="flex items-center gap-1 ml-2">
                    <BookOpen size={14} className="text-yellow-400" />
                    <span>Explanation</span>
                  </div>
                )}
                
                {item.performanceData && item.performanceData.length > 0 && (
                  <div className="flex items-center gap-1 ml-2">
                    <BarChart2 size={14} className="text-purple-400" />
                    <span>Performance</span>
                  </div>
                )}

                {item.patternKnowledge && item.patternKnowledge.length > 0 && (
                  <div className="flex items-center gap-1 ml-2">
                    <BookText size={14} className="text-blue-400" />
                    <span>Knowledge</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* History Detail */}
        {selectedHistoryItem && (
          <div className="history-detail bg-gray-800 rounded-lg p-6 animate-fade-in">
            <h3 className="text-xl font-semibold mb-3">Conversion Details</h3>
            
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(selectedHistoryItem.timestamp)}</span>
                <Clock size={14} className="ml-3 mr-1" />
                <span>{formatTime(selectedHistoryItem.timestamp)}</span>
                <div className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                  C++{selectedHistoryItem.targetCppVersion}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1 flex items-center">
                <span>Patterns Detected</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                  {selectedHistoryItem.patterns.length}
                </span>
              </div>
              {selectedHistoryItem.patterns.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedHistoryItem.patterns.map((pattern, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 rounded bg-gray-700"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No patterns detected</p>
              )}
            </div>

            {selectedHistoryItem.explanation && (
              <div className="mb-4">
                <div className="text-sm font-semibold mb-1 flex items-center">
                  <BookOpen size={16} className="mr-1 text-yellow-400" />
                  <span>Explanation Available</span>
                </div>
                <p className="text-gray-400 text-sm italic">
                  View detailed code transformation explanations by clicking "View Analysis"
                </p>
              </div>
            )}
            
            {selectedHistoryItem.performanceData && selectedHistoryItem.performanceData.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold mb-1 flex items-center">
                  <BarChart2 size={16} className="mr-1 text-purple-400" />
                  <span>Performance Analysis Available</span>
                </div>
                <p className="text-gray-400 text-sm italic">
                  View performance metrics by clicking "View Analysis"
                </p>
              </div>
            )}

            {selectedHistoryItem.patternKnowledge && selectedHistoryItem.patternKnowledge.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-semibold mb-1 flex items-center">
                  <BookText size={16} className="mr-1 text-blue-400" />
                  <span>Pattern Knowledge Available</span>
                </div>
                <p className="text-gray-400 text-sm italic">
                  View detailed pattern knowledge by clicking "View Analysis"
                </p>
              </div>
            )}
            
            <div className="action-buttons mt-6 flex gap-3">
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={() => onApplyHistory(selectedHistoryItem)}
              >
                <ArrowRight size={16} />
                <span>Apply to Editor</span>
              </button>
              
              <button 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => onViewAnalysis(selectedHistoryItem)}
              >
                <BarChart2 size={16} />
                <span>View Analysis</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel; 