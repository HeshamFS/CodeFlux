import { useState, useEffect } from 'react';
import { ParallelPatternType } from '../types';
import { PerformanceData } from './usePatternDetection';
import { PatternKnowledge } from './useExplanation';

// Define history item type
export interface HistoryItem {
  id: string;
  timestamp: number;
  inputCode: string;
  outputCode: string;
  patterns: ParallelPatternType[];
  targetCppVersion: '17' | '20' | '23';
  explanation?: string;
  performanceData?: PerformanceData[];
  patternKnowledge?: PatternKnowledge[];
}

interface UseHistoryManagementProps {
  onHistoryItemLoad: (item: HistoryItem) => void;
  onHistoryItemApply: (item: HistoryItem) => void;
  onHistoryItemAnalyze: (item: HistoryItem) => void;
}

export function useHistoryManagement({
  onHistoryItemLoad,
  onHistoryItemApply,
  onHistoryItemAnalyze
}: UseHistoryManagementProps) {
  const [conversionHistory, setConversionHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  // Load conversion history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('conversionHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as HistoryItem[];
        setConversionHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse conversion history:", e);
      }
    }
  }, []);

  // Save conversion history to localStorage when it changes
  useEffect(() => {
    if (conversionHistory.length > 0) {
      localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    }
  }, [conversionHistory]);

  // Add new item to history
  const addToHistory = (
    inputCode: string,
    outputCode: string,
    patterns: ParallelPatternType[],
    targetCppVersion: '17' | '20' | '23',
    explanation?: string,
    performanceData?: PerformanceData[],
    patternKnowledge?: PatternKnowledge[]
  ) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputCode,
      outputCode,
      patterns,
      targetCppVersion,
      explanation,
      performanceData,
      patternKnowledge
    };
    
    // Add to start of array, limit to 20 items
    setConversionHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
  };

  // Handle loading a history item
  const handleLoadHistory = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    onHistoryItemLoad(item);
  };

  // Handle applying a history item to the converter
  const handleApplyHistory = (item: HistoryItem) => {
    onHistoryItemApply(item);
  };

  // Handle viewing analysis of a history item
  const handleViewAnalysis = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    onHistoryItemAnalyze(item);
  };

  // Clear selected history item
  const clearSelectedHistoryItem = () => {
    setSelectedHistoryItem(null);
  };

  return {
    conversionHistory,
    selectedHistoryItem,
    setConversionHistory,
    setSelectedHistoryItem,
    addToHistory,
    handleLoadHistory,
    handleApplyHistory,
    handleViewAnalysis,
    clearSelectedHistoryItem
  };
} 