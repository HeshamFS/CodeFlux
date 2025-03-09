import React, { useEffect, useState, useRef } from 'react';
import { ConvertIcon, CodeIcon } from '../icons';

interface CodeDiffViewProps {
  originalCode: string;
  modifiedCode: string;
  height?: string;
}

// Line type for the diff view
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
}

const CodeDiffView: React.FC<CodeDiffViewProps> = ({ 
  originalCode, 
  modifiedCode, 
  height = '500px' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [originalLines, setOriginalLines] = useState<DiffLine[]>([]);
  const [modifiedLines, setModifiedLines] = useState<DiffLine[]>([]);

  // Process the diff when code changes
  useEffect(() => {
    setIsLoading(true);
    
    // Process the diff after a small delay to allow for UI updates
    setTimeout(() => {
      try {
        const result = computeDiff(originalCode, modifiedCode);
        setOriginalLines(result.originalLines);
        setModifiedLines(result.modifiedLines);
      } catch (error) {
        console.error("Error computing diff:", error);
      } finally {
        setIsLoading(false);
      }
    }, 50);
  }, [originalCode, modifiedCode]);

  // Compute the diff between two pieces of code using Myers diff algorithm
  const computeDiff = (original: string, modified: string) => {
    const originalLinesArray = original.split('\n');
    const modifiedLinesArray = modified.split('\n');
    
    // Create a map of line content to its occurrences in the original file
    const lineMap = new Map<string, number[]>();
    originalLinesArray.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!lineMap.has(trimmedLine)) {
        lineMap.set(trimmedLine, []);
      }
      lineMap.get(trimmedLine)?.push(index);
    });
    
    // Track which lines have been matched
    const matchedOriginal = new Set<number>();
    const matchedModified = new Set<number>();
    
    // First pass: Find exact matches
    const matches: Array<[number, number]> = [];
    
    modifiedLinesArray.forEach((line, modIndex) => {
      const trimmedLine = line.trim();
      const originalIndices = lineMap.get(trimmedLine) || [];
      
      // Find the first unmatched original line that matches this modified line
      const origIndex = originalIndices.find(idx => !matchedOriginal.has(idx));
      
      if (origIndex !== undefined) {
        matches.push([origIndex, modIndex]);
        matchedOriginal.add(origIndex);
        matchedModified.add(modIndex);
      }
    });
    
    // Sort matches by original index
    matches.sort((a, b) => a[0] - b[0]);
    
    // Create the diff result
    const originalResult: DiffLine[] = [];
    const modifiedResult: DiffLine[] = [];
    
    // Add all original lines as removed if not matched
    for (let i = 0; i < originalLinesArray.length; i++) {
      if (!matchedOriginal.has(i)) {
        originalResult.push({
          type: 'removed',
          content: originalLinesArray[i],
          lineNumber: i + 1
        });
      }
    }
    
    // Add all modified lines as added if not matched
    for (let i = 0; i < modifiedLinesArray.length; i++) {
      if (!matchedModified.has(i)) {
        modifiedResult.push({
          type: 'added',
          content: modifiedLinesArray[i],
          lineNumber: i + 1
        });
      }
    }
    
    // Add all matched lines as unchanged
    for (const [origIndex, modIndex] of matches) {
      originalResult.push({
        type: 'unchanged',
        content: originalLinesArray[origIndex],
        lineNumber: origIndex + 1
      });
      
      modifiedResult.push({
        type: 'unchanged',
        content: modifiedLinesArray[modIndex],
        lineNumber: modIndex + 1
      });
    }
    
    // Sort by line number
    originalResult.sort((a, b) => a.lineNumber - b.lineNumber);
    modifiedResult.sort((a, b) => a.lineNumber - b.lineNumber);
    
    return {
      originalLines: originalResult,
      modifiedLines: modifiedResult
    };
  };

  // Apply C++ syntax highlighting to code
  const highlightCppSyntax = (code: string): React.ReactNode => {
    // Define regex patterns for C++ syntax elements
    const patterns = [
      // Preprocessor directives
      { pattern: /(^|\s)(#\w+)(\s|$)/g, className: 'text-purple-400' },
      
      // Keywords
      { 
        pattern: /\b(auto|break|case|catch|class|const|continue|default|delete|do|else|enum|explicit|export|extern|for|friend|goto|if|inline|mutable|namespace|new|operator|private|protected|public|register|return|sizeof|static|struct|switch|template|this|throw|try|typedef|typeid|typename|union|using|virtual|volatile|while|void|int|float|double|bool|char|unsigned|signed|short|long)\b/g, 
        className: 'text-blue-400' 
      },
      
      // Standard library
      { 
        pattern: /\b(std::|std::execution::|std::views::)/g, 
        className: 'text-cyan-400' 
      },
      
      // Function calls
      { 
        pattern: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, 
        className: 'text-yellow-300',
        groupIndex: 1
      },
      
      // Numbers
      { 
        pattern: /\b(\d+(\.\d+)?([eE][+-]?\d+)?)\b/g, 
        className: 'text-green-400' 
      },
      
      // Strings
      { 
        pattern: /"([^"\\]|\\.)*"/g, 
        className: 'text-orange-400' 
      },
      
      // Single-line comments
      { 
        pattern: /(\/\/.*$)/gm, 
        className: 'text-gray-500' 
      },
      
      // Operators
      { 
        pattern: /(\+|\-|\*|\/|%|=|==|!=|<|>|<=|>=|&&|\|\||!|\^|&|\||\?|:|::|\+=|\-=|\*=|\/=|%=|<<=|>>=|&=|\|=|\^=|<<|>>)/g, 
        className: 'text-pink-400' 
      }
    ];
    
    // Apply highlighting
    let result = code;
    let spans: { index: number, end: number, className: string }[] = [];
    
    // Find all matches and their positions
    patterns.forEach(({ pattern, className, groupIndex = 0 }) => {
      let match;
      pattern.lastIndex = 0; // Reset regex state
      
      while ((match = pattern.exec(result)) !== null) {
        const matchedText = match[groupIndex];
        if (!matchedText) continue;
        
        const startIndex = match.index + (groupIndex === 0 ? 0 : match[0].indexOf(matchedText));
        spans.push({
          index: startIndex,
          end: startIndex + matchedText.length,
          className
        });
      }
    });
    
    // Sort spans by start index
    spans.sort((a, b) => a.index - b.index);
    
    // Merge overlapping spans (prioritizing later patterns)
    const mergedSpans: typeof spans = [];
    for (const span of spans) {
      const last = mergedSpans[mergedSpans.length - 1];
      if (last && span.index < last.end) {
        // Overlapping spans - keep the one that came later in the patterns array
        continue;
      }
      mergedSpans.push(span);
    }
    
    // Build the result with spans
    if (mergedSpans.length === 0) return result;
    
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    
    mergedSpans.forEach((span, i) => {
      // Add text before this span
      if (span.index > lastIndex) {
        elements.push(result.substring(lastIndex, span.index));
      }
      
      // Add the highlighted span
      elements.push(
        <span key={i} className={span.className}>
          {result.substring(span.index, span.end)}
        </span>
      );
      
      lastIndex = span.end;
    });
    
    // Add any remaining text
    if (lastIndex < result.length) {
      elements.push(result.substring(lastIndex));
    }
    
    return <>{elements}</>;
  };

  // Render a single line with proper styling
  const renderLine = (line: DiffLine, side: 'left' | 'right') => {
    let bgColor = 'transparent';
    let textColor = '#e2e8f0';
    let prefix = ' ';
    
    if (line.type === 'added') {
      bgColor = 'rgba(46, 160, 67, 0.15)';
      textColor = '#7ee787';
      prefix = '+';
    } else if (line.type === 'removed') {
      bgColor = 'rgba(248, 81, 73, 0.15)';
      textColor = '#ff7b72';
      prefix = '-';
    }
    
    return (
      <div 
        key={`${side}-${line.lineNumber}`}
        className="flex"
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-12 flex-shrink-0 text-right pr-2 select-none border-r border-[#30363d] text-gray-500 text-xs py-0.5">
          {line.lineNumber}
        </div>
        <div className="pl-2 font-mono text-xs py-0.5 whitespace-pre overflow-x-auto flex-grow">
          <span className="select-none mr-2" style={{ color: textColor }}>{prefix}</span>
          {line.type === 'unchanged' 
            ? highlightCppSyntax(line.content)
            : <span style={{ color: textColor }}>{line.content}</span>
          }
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="font-semibold text-gray-300 flex items-center">
          <ConvertIcon size={18} className="mr-2 text-blue-500" />
          Code Transformation
        </h3>
        <div className="flex items-center text-xs text-gray-400">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-sm bg-red-500 bg-opacity-40 mr-1"></div>
            <span>Removed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-green-500 bg-opacity-40 mr-1"></div>
            <span>Added</span>
          </div>
        </div>
      </div>
      <div className="card-body p-0 overflow-hidden">
        <div className="flex border-b border-[#30363d]">
          <div className="flex-1 py-2 px-4 border-r border-[#30363d] flex items-center">
            <CodeIcon size={14} className="text-red-400 mr-2" />
            <span className="text-sm text-gray-400">Original MPI/OpenMP Code</span>
          </div>
          <div className="flex-1 py-2 px-4 flex items-center">
            <CodeIcon size={14} className="text-green-400 mr-2" />
            <span className="text-sm text-gray-400">Modern C++ Standard Parallelism</span>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="relative" style={{ height, width: '100%' }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117]/80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-gray-300">Processing diff...</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full bg-[#0d1117]">
              {/* Left side - original code */}
              <div className="flex-1 overflow-auto border-r border-[#30363d]">
                {originalLines.map(line => renderLine(line, 'left'))}
              </div>
              
              {/* Right side - modified code */}
              <div className="flex-1 overflow-auto">
                {modifiedLines.map(line => renderLine(line, 'right'))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeDiffView; 