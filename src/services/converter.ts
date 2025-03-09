import { ConversionRequest, ConversionResult, ParallelPattern, ParallelPatternType, ReasoningEffort } from '../types';
import { convertCode, generatePatternKnowledge, PatternKnowledgeRequest, PatternKnowledgeResponse } from './openai';
import { PatternKnowledge } from '../hooks/useExplanation';

/**
 * Parallel pattern database with examples and equivalents
 */
const PARALLEL_PATTERNS: ParallelPattern[] = [
  {
    type: ParallelPatternType.MAP,
    description: 'Apply a function to each element independently',
    openMPEquivalent: '#pragma omp parallel for',
    cppStandardEquivalent: 'std::for_each, std::transform with std::execution::par'
  },
  {
    type: ParallelPatternType.REDUCE,
    description: 'Combine elements using a binary operation',
    mpiEquivalent: 'MPI_Reduce, MPI_Allreduce',
    openMPEquivalent: '#pragma omp parallel for reduction',
    cppStandardEquivalent: 'std::reduce, std::transform_reduce with std::execution::par'
  },
  {
    type: ParallelPatternType.SCAN,
    description: 'Cumulative operation across elements',
    mpiEquivalent: 'MPI_Scan, MPI_Exscan',
    openMPEquivalent: '#pragma omp parallel for with manual scan',
    cppStandardEquivalent: 'std::inclusive_scan, std::exclusive_scan with std::execution::par'
  },
  {
    type: ParallelPatternType.STENCIL,
    description: 'Update elements based on neighboring values',
    openMPEquivalent: '#pragma omp parallel for with array access patterns',
    cppStandardEquivalent: 'Custom algorithm with std::execution::par'
  },
  {
    type: ParallelPatternType.BROADCAST,
    description: 'Distribute data from one source to all targets',
    mpiEquivalent: 'MPI_Bcast',
    cppStandardEquivalent: 'std::for_each with shared data'
  },
  {
    type: ParallelPatternType.GATHER,
    description: 'Collect data from multiple sources to one target',
    mpiEquivalent: 'MPI_Gather, MPI_Gatherv',
    cppStandardEquivalent: 'std::transform_reduce or custom algorithm'
  },
  {
    type: ParallelPatternType.SCATTER,
    description: 'Distribute data from one source to multiple targets',
    mpiEquivalent: 'MPI_Scatter, MPI_Scatterv',
    cppStandardEquivalent: 'std::for_each with partitioned data'
  }
];

export interface ConversionParams {
  sourceCode: string;
  targetCppVersion: '17' | '20' | '23';
  includeExplanations: boolean;
  apiKey: string;
  reasoningEffort: ReasoningEffort;
}

/**
 * Main converter service that handles the conversion process
 */
export class ConverterService {
  private patterns: ParallelPattern[];

  constructor() {
    this.patterns = [
      {
        type: ParallelPatternType.MAP,
        description: 'The map pattern applies the same operation to each element of a collection, producing a new collection of the same size.',
        cppStandardEquivalent: 'std::transform, std::for_each'
      },
      {
        type: ParallelPatternType.REDUCE,
        description: 'The reduce pattern combines all elements of a collection into a single result, using a binary operation.',
        cppStandardEquivalent: 'std::reduce, std::accumulate'
      },
      {
        type: ParallelPatternType.SCAN,
        description: 'The scan pattern computes a running total or prefix sum of a collection.',
        cppStandardEquivalent: 'std::inclusive_scan, std::exclusive_scan'
      },
      {
        type: ParallelPatternType.STENCIL,
        description: 'The stencil pattern updates array elements based on neighboring values in a regular pattern.',
        cppStandardEquivalent: 'std::transform with sliding window'
      },
      {
        type: ParallelPatternType.BROADCAST,
        description: 'The broadcast pattern distributes a value or small set of values to all elements in a collection.',
        cppStandardEquivalent: 'std::fill'
      },
      {
        type: ParallelPatternType.GATHER,
        description: 'The gather pattern collects values from multiple locations in a collection.',
        cppStandardEquivalent: 'std::transform with indexed access'
      },
      {
        type: ParallelPatternType.SCATTER,
        description: 'The scatter pattern distributes values to specified locations in a collection.',
        cppStandardEquivalent: 'std::transform with indexed assignment'
      }
    ];
  }

  /**
   * Get all parallel patterns
   */
  public getParallelPatterns(): ParallelPattern[] {
    return this.patterns;
  }

  /**
   * Convert MPI/OpenMP code to C++ standard parallelism
   */
  public async convert(params: ConversionParams): Promise<ConversionResult> {
    const { sourceCode, targetCppVersion, includeExplanations, apiKey, reasoningEffort } = params;
    
    try {
      const request: ConversionRequest = {
        sourceCode: this.preprocessCode(sourceCode),
        targetCppVersion,
        includeExplanations,
        apiKey,
        reasoningEffort
      };
      
      const result = await convertCode(request);
      
      return {
        convertedCode: result.convertedCode || "// Conversion failed or incomplete",
        explanation: result.explanation || "",
        success: !!result.convertedCode
      };
    } catch (error) {
      console.error("Error in conversion:", error);
      throw error;
    }
  }

  /**
   * Preprocess code to handle large snippets better
   * This can include removing unnecessary comments, formatting, etc.
   */
  private preprocessCode(code: string): string {
    // Remove excessive blank lines
    let processed = code.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove very long comments if code is large
    if (code.length > 2000) {
      processed = processed.replace(/\/\*[\s\S]*?\*\//g, '/* ... */');
      processed = processed.replace(/\/\/.*$/gm, '// ...');
    }
    
    return processed;
  }

  /**
   * Calculate appropriate max tokens based on input size
   */
  private calculateMaxTokens(code: string): number {
    // Rough estimate: 4 chars per token
    const inputTokenEstimate = Math.ceil(code.length / 4);
    
    // Adjust based on input size, with a reasonable cap
    return Math.min(4000, Math.max(1500, inputTokenEstimate * 2));
  }

  /**
   * Identify parallel patterns in code
   */
  public identifyPatterns(code: string): ParallelPatternType[] {
    const patterns: ParallelPatternType[] = [];
    
    // Simple pattern matching for demonstration
    if (code.includes('#pragma omp parallel for') && !code.includes('reduction')) {
      patterns.push(ParallelPatternType.MAP);
    }
    
    if (code.includes('#pragma omp parallel for') && code.includes('reduction')) {
      patterns.push(ParallelPatternType.REDUCE);
    }
    
    if (code.includes('MPI_Reduce') || code.includes('MPI_Allreduce')) {
      patterns.push(ParallelPatternType.REDUCE);
    }
    
    if (code.includes('MPI_Scan') || code.includes('MPI_Exscan')) {
      patterns.push(ParallelPatternType.SCAN);
    }
    
    if (code.includes('MPI_Bcast')) {
      patterns.push(ParallelPatternType.BROADCAST);
    }
    
    if (code.includes('MPI_Gather') || code.includes('MPI_Gatherv')) {
      patterns.push(ParallelPatternType.GATHER);
    }
    
    if (code.includes('MPI_Scatter') || code.includes('MPI_Scatterv')) {
      patterns.push(ParallelPatternType.SCATTER);
    }
    
    // Stencil pattern detection (simplified)
    if (code.match(/\[\s*i\s*[+-]\s*\d+\s*\]/)) {
      patterns.push(ParallelPatternType.STENCIL);
    }
    
    return patterns.length > 0 ? patterns : [ParallelPatternType.UNKNOWN];
  }

  async generatePatternKnowledge(originalCode: string, convertedCode: string, detectedPatterns: ParallelPatternType[], apiKey: string): Promise<PatternKnowledge[]> {
    try {
      if (detectedPatterns.length === 0) {
        return [];
      }

      const request: PatternKnowledgeRequest = {
        originalCode,
        convertedCode,
        detectedPatterns: detectedPatterns.map(pattern => pattern.toString()),
        apiKey
      };

      const response = await generatePatternKnowledge(request);
      
      // Transform the API response into the internal PatternKnowledge format
      return response.patternKnowledge.map(knowledge => {
        // Try to match the pattern string to a ParallelPatternType
        let patternType: ParallelPatternType;
        try {
          // Check if it's a string representation of our enum
          const upperPattern = knowledge.pattern.toUpperCase().replace(/\s+/g, '_');
          patternType = ParallelPatternType[upperPattern as keyof typeof ParallelPatternType] || 
                         ParallelPatternType.UNKNOWN;
        } catch {
          patternType = ParallelPatternType.UNKNOWN;
        }

        return {
          pattern: patternType,
          description: knowledge.description,
          useCases: knowledge.useCases,
          performance: knowledge.performance,
          considerations: knowledge.considerations
        };
      });
    } catch (error: any) {
      console.error('Pattern knowledge generation error:', error);
      throw new Error(`Failed to generate pattern knowledge: ${error.message}`);
    }
  }
} 