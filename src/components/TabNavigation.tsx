import React from 'react';
import { BarChart2, History } from 'lucide-react';
import { ConvertIcon } from './icons';

interface TabNavigationProps {
  activeTab: 'converter' | 'visualizations' | 'history';
  onTabChange: (tab: 'converter' | 'visualizations' | 'history') => void;
  historyCount: number;
  isVisualizationEnabled: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  historyCount,
  isVisualizationEnabled
}) => {
  return (
    <div className="bg-[#111827] border-b border-[#1e293b]">
      <div className="container mx-auto px-4">
        <div className="flex">
          <button
            onClick={() => onTabChange('converter')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'converter'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <ConvertIcon size={16} />
              Converter
            </span>
          </button>
          <button
            onClick={() => onTabChange('visualizations')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'visualizations'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            disabled={!isVisualizationEnabled}
          >
            <span className="flex items-center gap-2">
              <BarChart2 size={16} />
              Code Analysis
            </span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <History size={16} />
              History {historyCount > 0 && `(${historyCount})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation; 