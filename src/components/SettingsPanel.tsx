import React, { useState, useEffect } from 'react';
import { Settings, Check, X, AlertCircle } from 'lucide-react';
import { ReasoningEffort } from '../types';

interface SettingsPanelProps {
  targetCppVersion: '17' | '20' | '23';
  setTargetCppVersion: (version: '17' | '20' | '23') => void;
  includeExplanations: boolean;
  setIncludeExplanations: (include: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  reasoningEffort: ReasoningEffort;
  setReasoningEffort: (effort: ReasoningEffort) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  targetCppVersion,
  setTargetCppVersion,
  includeExplanations,
  setIncludeExplanations,
  apiKey,
  setApiKey,
  reasoningEffort,
  setReasoningEffort,
  isOpen,
  setIsOpen
}) => {
  // Local state for form values
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localTargetVersion, setLocalTargetVersion] = useState(targetCppVersion);
  const [localIncludeExplanations, setLocalIncludeExplanations] = useState(includeExplanations);
  const [localReasoningEffort, setLocalReasoningEffort] = useState(reasoningEffort);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('codefluxSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setTargetCppVersion(settings.targetCppVersion || '20');
      setIncludeExplanations(settings.includeExplanations ?? true);
      setReasoningEffort(settings.reasoningEffort || 'high');
    }
  }, []);

  // Update local state when props change
  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalTargetVersion(targetCppVersion);
    setLocalIncludeExplanations(includeExplanations);
    setLocalReasoningEffort(reasoningEffort);
  }, [apiKey, targetCppVersion, includeExplanations, reasoningEffort]);

  // Check for changes
  useEffect(() => {
    const hasAnyChanges = 
      localApiKey !== apiKey ||
      localTargetVersion !== targetCppVersion ||
      localIncludeExplanations !== includeExplanations ||
      localReasoningEffort !== reasoningEffort;
    
    setHasChanges(hasAnyChanges);
  }, [localApiKey, localTargetVersion, localIncludeExplanations, localReasoningEffort]);

  const handleSave = () => {
    // Update parent state
    setApiKey(localApiKey);
    setTargetCppVersion(localTargetVersion);
    setIncludeExplanations(localIncludeExplanations);
    setReasoningEffort(localReasoningEffort);

    // Save to localStorage
    localStorage.setItem('codefluxSettings', JSON.stringify({
      targetCppVersion: localTargetVersion,
      includeExplanations: localIncludeExplanations,
      reasoningEffort: localReasoningEffort
    }));

    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
      setIsOpen(false);
    }, 1500);
  };

  const handleCancel = () => {
    // Reset local state to prop values
    setLocalApiKey(apiKey);
    setLocalTargetVersion(targetCppVersion);
    setLocalIncludeExplanations(includeExplanations);
    setLocalReasoningEffort(reasoningEffort);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1e293b] rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-[#30363d]">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center">
            <Settings size={20} className="mr-2 text-blue-400" />
            Settings
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              OpenAI API Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                className="block w-full px-4 py-2.5 bg-[#111827] border border-[#30363d] rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="sk-..."
              />
            </div>
            <p className="text-xs text-gray-400">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          {/* Target C++ Version */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Target C++ Version
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['17', '20', '23'] as const).map((version) => (
                <button
                  key={version}
                  onClick={() => setLocalTargetVersion(version)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    localTargetVersion === version
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#111827] text-gray-400 hover:bg-[#1e293b]'
                  }`}
                >
                  C++{version}
                </button>
              ))}
            </div>
          </div>

          {/* Reasoning Effort */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Reasoning Effort
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((effort) => (
                <button
                  key={effort}
                  onClick={() => setLocalReasoningEffort(effort)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    localReasoningEffort === effort
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#111827] text-gray-400 hover:bg-[#1e293b]'
                  }`}
                >
                  {effort}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Higher reasoning effort produces better results but takes longer.
            </p>
          </div>

          {/* Include Explanations */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Include Explanations
              </label>
              <p className="text-xs text-gray-400">
                Get detailed explanations for each code transformation
              </p>
            </div>
            <button
              onClick={() => setLocalIncludeExplanations(!localIncludeExplanations)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localIncludeExplanations ? 'bg-blue-600' : 'bg-[#111827]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localIncludeExplanations ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-[#30363d] bg-[#111827]">
          <div className="flex items-center">
            {showSaveSuccess && (
              <div className="flex items-center text-green-400 text-sm">
                <Check size={16} className="mr-1" />
                Settings saved successfully
              </div>
            )}
            {hasChanges && !showSaveSuccess && (
              <div className="flex items-center text-yellow-400 text-sm">
                <AlertCircle size={16} className="mr-1" />
                You have unsaved changes
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 