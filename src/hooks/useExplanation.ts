import { useState, useEffect } from 'react';
import { ParallelPatternType } from '../types';

interface UseExplanationProps {
  detectedPatterns: ParallelPatternType[];
}

export interface PatternKnowledge {
  pattern: ParallelPatternType;
  description: string;
  useCases: string[];
  performance: string;
  considerations: string[];
}

const PATTERN_KNOWLEDGE: Record<ParallelPatternType, PatternKnowledge> = {
  [ParallelPatternType.MAP]: {
    pattern: ParallelPatternType.MAP,
    description: 'The Map pattern applies the same operation to each element of a collection independently, making it highly parallelizable.',
    useCases: [
      'Image processing (applying filters)',
      'Vector/matrix element-wise operations',
      'Data transformation tasks'
    ],
    performance: 'Typically achieves linear speedup with number of cores due to minimal data dependencies.',
    considerations: [
      'Data locality can impact performance',
      'Consider chunk size for optimal cache usage',
      'Beware of false sharing in adjacent memory locations'
    ]
  },
  [ParallelPatternType.REDUCE]: {
    pattern: ParallelPatternType.REDUCE,
    description: 'The Reduce pattern combines elements of a collection into a single result using an associative operation.',
    useCases: [
      'Computing sums or products',
      'Finding min/max values',
      'String concatenation'
    ],
    performance: 'Logarithmic time complexity with sufficient parallel resources, limited by the associative operation.',
    considerations: [
      'Operation must be associative for correctness',
      'Consider tree-based reduction for better parallelism',
      'Balance work distribution across threads'
    ]
  },
  [ParallelPatternType.SCAN]: {
    pattern: ParallelPatternType.SCAN,
    description: 'The Scan (prefix sum) pattern computes running totals of a sequence, useful for cumulative operations.',
    useCases: [
      'Cumulative sums/products',
      'Line-of-sight calculations',
      'Dynamic programming problems'
    ],
    performance: 'Can achieve O(log n) time with sufficient processors using work-efficient parallel scan.',
    considerations: [
      'Consider using exclusive vs. inclusive scan',
      'Memory access patterns affect performance',
      'May require multiple passes for work efficiency'
    ]
  },
  [ParallelPatternType.STENCIL]: {
    pattern: ParallelPatternType.STENCIL,
    description: 'The Stencil pattern updates array elements based on neighboring values, common in scientific computing.',
    useCases: [
      'Finite difference methods',
      'Convolution operations',
      'Cellular automata'
    ],
    performance: 'Performance heavily dependent on data locality and memory access patterns.',
    considerations: [
      'Ghost cells may be needed for boundary conditions',
      'Consider tiling for cache efficiency',
      'Memory bandwidth can be a bottleneck'
    ]
  },
  [ParallelPatternType.BROADCAST]: {
    pattern: ParallelPatternType.BROADCAST,
    description: 'The Broadcast pattern distributes data from one source to multiple destinations efficiently.',
    useCases: [
      'Sharing configuration data',
      'Distributing work parameters',
      'Updating shared state'
    ],
    performance: 'Logarithmic time with tree-based implementation, can be bottlenecked by network.',
    considerations: [
      'Consider data size vs. communication overhead',
      'Network topology affects performance',
      'May require synchronization after broadcast'
    ]
  },
  [ParallelPatternType.GATHER]: {
    pattern: ParallelPatternType.GATHER,
    description: 'The Gather pattern collects distributed data into a single location.',
    useCases: [
      'Collecting partial results',
      'Centralized logging',
      'Data aggregation'
    ],
    performance: 'Limited by network bandwidth and single destination bottleneck.',
    considerations: [
      'Consider data ordering requirements',
      'Memory capacity at destination',
      'Network congestion at receiver'
    ]
  },
  [ParallelPatternType.SCATTER]: {
    pattern: ParallelPatternType.SCATTER,
    description: 'The Scatter pattern distributes portions of data to different processors for parallel processing.',
    useCases: [
      'Data partitioning',
      'Load balancing',
      'Distributed algorithms'
    ],
    performance: 'Can achieve good speedup with balanced distribution and minimal communication.',
    considerations: [
      'Balance data distribution',
      'Consider data locality',
      'Communication overhead vs. computation'
    ]
  },
  [ParallelPatternType.UNKNOWN]: {
    pattern: ParallelPatternType.UNKNOWN,
    description: 'Pattern could not be clearly identified or matches multiple patterns.',
    useCases: ['N/A'],
    performance: 'Performance characteristics cannot be determined.',
    considerations: ['Consider refactoring for clearer pattern matching']
  }
};

export function useExplanation({ detectedPatterns }: UseExplanationProps) {
  const [conversionExplanation, setConversionExplanation] = useState('');
  const [generalKnowledge, setGeneralKnowledge] = useState<PatternKnowledge[]>([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);

  // Format the general knowledge into a readable string with proper markdown
  const getFormattedKnowledge = () => {
    if (generalKnowledge.length === 0) {
      return '';
    }
    
    return generalKnowledge.map(knowledge => {
      // Format use cases as individual list items
      const useCasesMarkdown = knowledge.useCases
        .map(useCase => `* ${useCase}`)
        .join('\n');
      
      // Format considerations as individual list items
      const considerationsMarkdown = knowledge.considerations
        .map(consideration => `* ${consideration}`)
        .join('\n');
      
      // Return properly formatted markdown with correct nesting
      return `
## ${knowledge.pattern} Pattern

${knowledge.description}

### Common Use Cases:
${useCasesMarkdown}

### Performance Characteristics:
${knowledge.performance}

### Key Considerations:
${considerationsMarkdown}
`;
    }).join('\n\n');
  };

  // Clear all knowledge when needed
  const clearKnowledge = () => {
    setGeneralKnowledge([]);
  };

  return {
    conversionExplanation,
    setConversionExplanation,
    generalKnowledge,
    setGeneralKnowledge,
    getFormattedKnowledge,
    knowledgeLoading,
    setKnowledgeLoading,
    clearKnowledge
  };
} 