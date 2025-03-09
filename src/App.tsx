import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { ConverterService } from './services/converter';
import { ConversionResult, ParallelPatternType, ReasoningEffort } from './types';
import SettingsPanel from './components/SettingsPanel';
import PatternInfo from './components/PatternInfo';
import ExplanationPanel from './components/ExplanationPanel';
import Footer from './components/Footer';
import { 
  ConvertIcon,
  ParallelIcon, 
  AlgorithmIcon, 
  ReasoningIcon
} from './components/icons';
import HistoryPanel from './components/HistoryPanel';
import VisualizationsPanel from './components/VisualizationsPanel';
import CodeEditorPanel from './components/CodeEditorPanel';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import { useConverter } from './hooks/useConverter';
import { usePatternDetection, PerformanceData as PatternPerformanceData } from './hooks/usePatternDetection';
import { useHistoryManagement, HistoryItem } from './hooks/useHistoryManagement';
import { useExplanation, PatternKnowledge } from './hooks/useExplanation';

// Initialize the converter service
const converterService = new ConverterService();

// Default example code
const DEFAULT_INPUT_CODE = `#pragma omp parallel for reduction(+:sum)
for (int i = 0; i < N; ++i) {
    sum += compute_heavy(i);
}`;

function App() {
  // State for code input and output
  const [inputCode, setInputCode] = useState(DEFAULT_INPUT_CODE);
  const [outputCode, setOutputCode] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Settings state
  const [targetCppVersion, setTargetCppVersion] = useState<'17' | '20' | '23'>('20');
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>('high');

  // Tab state
  const [activeTab, setActiveTab] = useState<'converter' | 'visualizations' | 'history'>('converter');
  
  // Add state to preserve code for visualization
  const [visualizationKey, setVisualizationKey] = useState(0);
  const [preservedInputCode, setPreservedInputCode] = useState('');
  const [preservedOutputCode, setPreservedOutputCode] = useState('');

  // Use custom hooks
  const {
    detectedPatterns,
    performanceData,
    patternDetails,
    allPatterns,
    detectPatterns,
    generatePerformanceData,
    setDetectedPatterns
  } = usePatternDetection(converterService);

  const {
    conversionExplanation,
    setConversionExplanation,
    generalKnowledge,
    setGeneralKnowledge,
    getFormattedKnowledge,
    knowledgeLoading,
    setKnowledgeLoading,
    clearKnowledge
  } = useExplanation({
    detectedPatterns
  });

  const handleHistoryItemLoad = (item: HistoryItem) => {
    setPreservedInputCode(item.inputCode);
    setPreservedOutputCode(item.outputCode);
    setDetectedPatterns(item.patterns);
    
    // Set explanation if available
    if (item.explanation) {
      setConversionExplanation(item.explanation);
    }
    
    // Set pattern knowledge if available
    if (item.patternKnowledge && item.patternKnowledge.length > 0) {
      setGeneralKnowledge(item.patternKnowledge);
    } else {
      clearKnowledge();
    }
    
    setTimeout(() => setVisualizationKey(Date.now()), 100);
  };

  const handleHistoryItemApply = (item: HistoryItem) => {
    setInputCode(item.inputCode);
    setOutputCode(item.outputCode);
    setDetectedPatterns(item.patterns);
    setTargetCppVersion(item.targetCppVersion);
    
    // Set explanation if available
    if (item.explanation) {
      setConversionExplanation(item.explanation);
    }
    
    // Set pattern knowledge if available
    if (item.patternKnowledge && item.patternKnowledge.length > 0) {
      setGeneralKnowledge(item.patternKnowledge);
    } else {
      clearKnowledge();
    }
    
    setTimeout(() => setActiveTab('converter'), 50);
  };

  const handleHistoryItemAnalyze = (item: HistoryItem) => {
    setPreservedInputCode(item.inputCode);
    setPreservedOutputCode(item.outputCode);
    setDetectedPatterns(item.patterns);
    
    // Set explanation if available
    if (item.explanation) {
      setConversionExplanation(item.explanation);
    }
    
    // Set pattern knowledge if available
    if (item.patternKnowledge && item.patternKnowledge.length > 0) {
      setGeneralKnowledge(item.patternKnowledge);
    } else {
      clearKnowledge();
    }
    
    handleTabChange('visualizations');
  };

  const {
    conversionHistory,
    selectedHistoryItem,
    setConversionHistory,
    setSelectedHistoryItem,
    addToHistory,
    handleLoadHistory,
    handleApplyHistory,
    handleViewAnalysis,
    clearSelectedHistoryItem
  } = useHistoryManagement({
    onHistoryItemLoad: handleHistoryItemLoad,
    onHistoryItemApply: handleHistoryItemApply,
    onHistoryItemAnalyze: handleHistoryItemAnalyze
  });

  const handleConversionSuccess = (result: ConversionResult) => {
    setOutputCode(result.convertedCode);
    setPreservedInputCode(inputCode);
    setPreservedOutputCode(result.convertedCode);
    
    // Generate performance data and capture the returned value
    const generatedPerformanceData = generatePerformanceData(result.convertedCode);
    
    // Set explanation if available
    if (result.explanation) {
      setConversionExplanation(result.explanation);
    }
    
    // Add to history initially without pattern knowledge
    const historyId = Date.now().toString(); // Create a unique ID for this history item
    
    addToHistory(
      inputCode, 
      result.convertedCode, 
      detectedPatterns, 
      targetCppVersion,
      result.explanation,
      generatedPerformanceData
    );
    
    // Generate pattern knowledge if there are detected patterns
    if (detectedPatterns.length > 0) {
      console.log("Starting pattern knowledge generation for patterns:", detectedPatterns);
      setKnowledgeLoading(true);
      
      converterService.generatePatternKnowledge(
        inputCode, 
        result.convertedCode, 
        detectedPatterns, 
        apiKey
      )
      .then(knowledge => {
        console.log("Pattern knowledge generated successfully:", knowledge);
        // Update the state for current view
        setGeneralKnowledge(knowledge);
        
        // Update the history item with the generated knowledge
        setConversionHistory(prev => {
          // Find the history item we just added (should be the first one)
          if (prev.length > 0) {
            const updatedHistory = [...prev];
            updatedHistory[0] = {
              ...updatedHistory[0],
              patternKnowledge: knowledge
            };
            return updatedHistory;
          }
          return prev;
        });
      })
      .catch(error => {
        console.error('Failed to generate pattern knowledge:', error);
      })
      .finally(() => {
        setKnowledgeLoading(false);
      });
    }
  };

  const {
    isLoading,
    error,
    handleConvert,
    setError
  } = useConverter({
    onConversionSuccess: handleConversionSuccess,
    converterService
  });

  // Detect patterns when input code changes
  useEffect(() => {
    detectPatterns(inputCode);
  }, [inputCode]);

  // Load API key from local storage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to local storage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
    }
  }, [apiKey]);

  // Preserve code state when switching tabs
  useEffect(() => {
    if (activeTab === 'visualizations' && outputCode) {
      // Make sure we're not overwriting existing values with empty ones
      if (outputCode.trim()) {
        setPreservedInputCode(inputCode);
        setPreservedOutputCode(outputCode);
        
        // Force remount of visualization components with a delay to ensure DOM is ready
        setTimeout(() => {
          setVisualizationKey(Date.now());
        }, 100);
      }
    } else if (activeTab === 'history') {
      // Reset selected history item when switching to history tab
      clearSelectedHistoryItem();
    }
  }, [activeTab, inputCode, outputCode]);

  // Handle tab switching with code preservation
  const handleTabChange = (tab: 'converter' | 'visualizations' | 'history') => {
    setActiveTab(tab);
    
    if (tab === 'visualizations') {
      if (outputCode) {
        setPreservedInputCode(inputCode);
        setPreservedOutputCode(outputCode);
        setTimeout(() => setVisualizationKey(Date.now()), 100);
      } else if (selectedHistoryItem) {
        setPreservedInputCode(selectedHistoryItem.inputCode);
        setPreservedOutputCode(selectedHistoryItem.outputCode);
        setTimeout(() => setVisualizationKey(Date.now()), 100);
      }
    } else if (tab === 'history') {
      clearSelectedHistoryItem();
    }
  };

  const handleConvertClick = () => {
    handleConvert({
      inputCode,
      targetCppVersion,
      includeExplanations,
      apiKey,
      reasoningEffort
    });
  };

  // Add a new function to handle resetting the state for a new conversion
  const handleNewConversion = () => {
    // Reset code state
    setInputCode(DEFAULT_INPUT_CODE);
    setOutputCode('');
    
    // Reset explanation state
    setConversionExplanation('');
    clearKnowledge();
    
    // Reset detected patterns
    setDetectedPatterns([]);
    
    // Reset any error state
    setError(null);
    
    // Switch to converter tab if not already there
    if (activeTab !== 'converter') {
      setActiveTab('converter');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <Header />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        historyCount={conversionHistory.length}
        isVisualizationEnabled={!!outputCode || conversionHistory.length > 0}
      />

      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {activeTab === 'converter' && (
          <div className="w-full">
            <CodeEditorPanel
              inputCode={inputCode}
              outputCode={outputCode}
              isLoading={isLoading}
              reasoningEffort={reasoningEffort}
              onInputChange={setInputCode}
              onSettingsOpen={() => setSettingsOpen(true)}
              apiKey={apiKey}
              error={error}
            />

            <div className="flex justify-center mb-8 animate-slide-in">
              <button
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isLoading || !apiKey
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={handleConvertClick}
                disabled={isLoading || !apiKey}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <ConvertIcon size={20} />
                    <span>Convert Code</span>
                  </>
                )}
              </button>
              
              {/* New Conversion button */}
              <button
                className="ml-4 inline-flex items-center gap-2 px-6 py-2.5 text-base font-medium rounded-lg transition-colors bg-gray-600 hover:bg-gray-700 text-white"
                onClick={handleNewConversion}
                disabled={isLoading}
              >
                <span>New Conversion</span>
              </button>
            </div>

            <div className="section-divider"></div>

            {/* Pattern Information */}
            <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <PatternInfo patterns={detectedPatterns} allPatterns={allPatterns} />
            </div>
            
            {/* Enhanced Explanation Panel */}
            <div className="animate-slide-in" style={{ animationDelay: '0.5s' }}>
              <ExplanationPanel
                explanation={conversionExplanation}
                generalKnowledge={getFormattedKnowledge()}
                isLoading={isLoading || knowledgeLoading}
              />
            </div>

            <div className="section-divider"></div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Smart Analysis',
                  description: 'Advanced pattern recognition for optimal parallel algorithm selection',
                  icon: <AlgorithmIcon className="text-blue-500" size={24} />
                },
                {
                  title: 'Modern C++',
                  description: 'Converts to C++17/20/23 standard parallel algorithms',
                  icon: <ParallelIcon className="text-blue-500" size={24} />
                },
                {
                  title: 'Detailed Explanations',
                  description: 'Get insights into each code transformation',
                  icon: <ReasoningIcon className="text-blue-500" size={24} />
                }
              ].map((feature, i) => (
                <div key={i} className="card p-6 animate-slide-in" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                  {feature.icon}
                  <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                  <p className="text-gray-400 mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'visualizations' && (
          <VisualizationsPanel
            preservedInputCode={preservedInputCode}
            preservedOutputCode={preservedOutputCode}
            selectedHistoryItem={selectedHistoryItem}
            performanceData={performanceData}
            visualizationKey={visualizationKey}
            onSwitchTab={handleTabChange}
            conversionHistory={conversionHistory}
            onNewConversion={handleNewConversion}
          />
        )}
        
        {activeTab === 'history' && (
          <HistoryPanel
            conversionHistory={conversionHistory}
            setConversionHistory={setConversionHistory}
            selectedHistoryItem={selectedHistoryItem}
            setSelectedHistoryItem={setSelectedHistoryItem}
            onApplyHistory={handleApplyHistory}
            onViewAnalysis={handleViewAnalysis}
            onNewConversion={handleNewConversion}
          />
        )}
      </main>

      <SettingsPanel
        targetCppVersion={targetCppVersion}
        setTargetCppVersion={setTargetCppVersion}
        includeExplanations={includeExplanations}
        setIncludeExplanations={setIncludeExplanations}
        apiKey={apiKey}
        setApiKey={setApiKey}
        reasoningEffort={reasoningEffort}
        setReasoningEffort={setReasoningEffort}
        isOpen={settingsOpen}
        setIsOpen={setSettingsOpen}
      />

      <Footer />
    </div>
  );
}

export default App;
