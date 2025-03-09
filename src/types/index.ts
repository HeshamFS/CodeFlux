export interface ConversionResult {
  convertedCode: string;
  explanation: string;
  success: boolean;
  error?: string;
}

export interface ParallelPattern {
  type: string;
  description: string;
  mpiEquivalent?: string;
  openMPEquivalent?: string;
  cppStandardEquivalent: string;
}

export type ReasoningEffort = 'low' | 'medium' | 'high';

export interface ConversionRequest {
  sourceCode: string;
  targetCppVersion: '17' | '20' | '23';
  includeExplanations: boolean;
  apiKey: string;
  reasoningEffort: ReasoningEffort;
  options?: {
    maxTokens?: number;
    temperature?: number;
  };
}

export enum ParallelPatternType {
  MAP = 'map',
  REDUCE = 'reduce',
  SCAN = 'scan',
  STENCIL = 'stencil',
  BROADCAST = 'broadcast',
  GATHER = 'gather',
  SCATTER = 'scatter',
  UNKNOWN = 'unknown'
} 