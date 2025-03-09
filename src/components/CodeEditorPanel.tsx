import React, { useState } from 'react';
import { Settings as SettingsIcon, Loader2, Copy, Download, Check } from 'lucide-react';
import MonacoEditor from './MonacoEditor';
import { CppIcon, OpenMPIcon, ConvertIcon } from './icons';

interface CodeEditorPanelProps {
  inputCode: string;
  outputCode: string;
  isLoading: boolean;
  reasoningEffort: string;
  onInputChange: (value: string) => void;
  onSettingsOpen: () => void;
  apiKey: string | null;
  error: string | null;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  inputCode,
  outputCode,
  isLoading,
  reasoningEffort,
  onInputChange,
  onSettingsOpen,
  apiKey,
  error
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    if (outputCode) {
      navigator.clipboard.writeText(outputCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadCode = () => {
    if (outputCode) {
      const blob = new Blob([outputCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_code.cpp';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 bg-red-900/30 border border-red-700/50 text-red-100 px-4 py-3 rounded-lg flex items-start animate-fade-in">
          <div className="mr-3 mt-0.5">⚠️</div>
          <div>
            <h3 className="font-semibold mb-1">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!apiKey && (
        <div className="mb-6 bg-yellow-900/30 border border-yellow-700/50 text-yellow-100 px-4 py-3 rounded-lg flex items-start animate-fade-in">
          <div className="mr-3 mt-0.5">ℹ️</div>
          <div>
            <h3 className="font-semibold mb-1">API Key Required</h3>
            <p>Please enter your OpenAI API key in the settings to use the converter.</p>
            <button 
              onClick={onSettingsOpen}
              className="mt-2 btn btn-secondary"
            >
              Open Settings
            </button>
          </div>
        </div>
      )}

      <div className="card mb-8 animate-slide-in">
        <div className="card-header flex justify-between items-center bg-[#1e293b] border-b border-[#30363d] p-4">
          <div className="flex items-center">
            <ConvertIcon size={18} className="mr-2 text-blue-500" />
            <h3 className="font-semibold text-gray-300">Code Conversion</h3>
          </div>
          <div className="flex items-center gap-3">
            {outputCode && (
              <>
                <button 
                  onClick={handleCopyCode} 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] hover:bg-[#2d3748] border border-[#30363d] rounded-md transition-colors"
                  aria-label="Copy code"
                >
                  {copySuccess ? (
                    <>
                      <Check size={16} className="text-green-400" />
                      <span className="text-sm text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">Copy</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleDownloadCode} 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] hover:bg-[#2d3748] border border-[#30363d] rounded-md transition-colors"
                  aria-label="Download code"
                >
                  <Download size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400">Download</span>
                </button>
              </>
            )}
            <button
              onClick={onSettingsOpen}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e293b] hover:bg-[#2d3748] border border-[#30363d] rounded-md transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">Settings</span>
            </button>
          </div>
        </div>
        <div className="card-body p-0 overflow-hidden">
          <div className="flex border-b border-[#30363d]">
            <div className="flex-1 py-2 px-4 border-r border-[#30363d] flex items-center">
              <OpenMPIcon size={14} className="text-blue-400 mr-2" />
              <span className="text-sm text-gray-400">MPI/OpenMP Code</span>
            </div>
            <div className="flex-1 py-2 px-4 flex items-center">
              <CppIcon size={14} className="text-green-400 mr-2" />
              <span className="text-sm text-gray-400">Modern C++ Standard Parallelism</span>
            </div>
          </div>
          
          <div className="flex" style={{ height: '450px' }}>
            {/* Left side - Input code */}
            <div className="flex-1 border-r border-[#30363d]">
              <MonacoEditor
                value={inputCode}
                onChange={(value: string | undefined) => onInputChange(value || '')}
                height="100%"
                language="cpp"
                theme="cppConverter"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: '"Fira Code", monospace',
                  lineNumbers: 'on',
                }}
              />
            </div>
            
            {/* Right side - Output code */}
            <div className="flex-1">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 size={24} className="text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400 text-sm">Converting code...</p>
                    <p className="text-gray-500 text-xs mt-2">Using reasoning effort: {reasoningEffort}</p>
                  </div>
                </div>
              ) : (
                <MonacoEditor
                  value={outputCode}
                  readOnly={true}
                  height="100%"
                  language="cpp"
                  theme="cppConverter"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: '"Fira Code", monospace',
                    lineNumbers: 'on',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel; 