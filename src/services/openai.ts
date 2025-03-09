import OpenAI from 'openai';
import { ConversionRequest, ConversionResult } from '../types';

// System prompt that guides the model on how to convert MPI/OpenMP code to C++ standard parallelism
const SYSTEM_PROMPT = `
You are an expert C++ developer specializing in parallel programming. 
Your task is to convert MPI and OpenMP code to modern C++ using standard parallelism features.

Follow these guidelines:
1. Identify parallel patterns in the input code (map, reduce, scan, stencil, etc.)
2. Convert MPI/OpenMP constructs to equivalent C++ standard parallel algorithms
3. Use appropriate execution policies (std::execution::seq, std::execution::par, std::execution::par_unseq)
4. Provide explanations for each transformation
5. Ensure the converted code maintains the same semantics and correctness
6. IMPORTANT: Produce concise, elegant code that uses modern C++ idioms
7. Avoid creating unnecessary helper structures or functions unless absolutely required
8. Prefer using lambda expressions directly in algorithm calls rather than separate functions
9. Use standard library features like counting_iterator when appropriate

For C++17, use:
- <execution> header with execution policies
- parallel algorithms like for_each, transform, reduce, etc.

For C++20, also consider:
- Ranges library with parallel execution
- std::jthread for joining threads
- counting_iterator from <iterator>

For C++23, additionally use:
- Extended execution policies
- Improved parallel algorithms

EXAMPLES:

Original OpenMP code:
\`\`\`cpp
#pragma omp parallel for
for (int i = 0; i < n; i++) {
    result[i] = process(data[i]);
}
\`\`\`

Good conversion (concise):
\`\`\`cpp
std::transform(
    std::execution::par,
    data, data + n,
    result,
    [](auto x) { return process(x); }
);
\`\`\`

Bad conversion (too verbose):
\`\`\`cpp
// Create a helper function
auto processElement = [](auto x) { return process(x); };

// Process elements in parallel
std::transform(
    std::execution::par,
    data, data + n,
    result,
    processElement
);
\`\`\`

Original OpenMP reduction code:
\`\`\`cpp
Real_t minVal = initialVal;
#pragma omp parallel for reduction(min:minVal)
for (Index_t i = 0; i < length; ++i) {
    Index_t idx = regElemList[i];
    Real_t val = compute(domain, idx);
    if (val < minVal) minVal = val;
}
\`\`\`

Good conversion (concise):
\`\`\`cpp
minVal = std::transform_reduce(
    std::execution::par,
    counting_iterator(0), counting_iterator(length),
    initialVal,
    [](Real_t a, Real_t b) { return std::min(a, b); },
    [&domain, regElemList](Index_t i) {
        return compute(domain, regElemList[i]);
    }
);
\`\`\`

Bad conversion (too verbose with unnecessary structures):
\`\`\`cpp
struct Result {
    Real_t value;
};

Result initialResult { initialVal };

auto result = std::transform_reduce(
    std::execution::par,
    regElemList, regElemList + length,
    initialResult,
    [](const Result& a, const Result& b) {
        return Result { std::min(a.value, b.value) };
    },
    [&domain](Index_t idx) {
        return Result { compute(domain, idx) };
    }
);

minVal = result.value;
\`\`\`

Original OpenMP hydro constraint code:
\`\`\`cpp
static inline
void CalcHydroConstraintForElems(Domain &domain, Index_t length,
                                 Index_t *regElemList, Real_t dvovmax, Real_t &dthydro)
{
  #if _OPENMP
    const Index_t threads = omp_get_max_threads();
    Index_t hydro_elem_per_thread[threads];
    Real_t dthydro_per_thread[threads];
  #else
    Index_t threads = 1;
    Index_t hydro_elem_per_thread[1];
    Real_t dthydro_per_thread[1];
  #endif
  
  #pragma omp parallel firstprivate(length, dvovmax)
  {
    Real_t dthydro_tmp = dthydro ;
    Index_t hydro_elem = -1 ;
    
    #if _OPENMP
      Index_t thread_num = omp_get_thread_num();
    #else
      Index_t thread_num = 0;
    #endif
    
    #pragma omp for
    for (Index_t i = 0 ; i < length ; ++i) {
      Index_t indx = regElemList[i] ;
      
      if (domain.vdov(indx) != Real_t(0.)) {
        Real_t dtdvov = dvovmax / (FABS(domain.vdov(indx))+Real_t(1.e-20)) ;
        
        if ( dthydro_tmp > dtdvov ) {
          dthydro_tmp = dtdvov ;
          hydro_elem = indx ;
        }
      }
    }
    
    dthydro_per_thread[thread_num] = dthydro_tmp ;
    hydro_elem_per_thread[thread_num] = hydro_elem ;
  }
  
  for (Index_t i = 1; i < threads; ++i) {
    if(dthydro_per_thread[i] < dthydro_per_thread[0]) {
      dthydro_per_thread[0] = dthydro_per_thread[i];
      hydro_elem_per_thread[0] = hydro_elem_per_thread[i];
    }
  }
  
  if (hydro_elem_per_thread[0] != -1) {
    dthydro = dthydro_per_thread[0] ;
  }
}
\`\`\`

Good conversion (concise):
\`\`\`cpp
static inline
void CalcHydroConstraintForElems(Domain &domain, Index_t length,
    Index_t *regElemList, Real_t dvovmax, Real_t &dthydro)
{
    dthydro = std::transform_reduce(
        std::execution::par, counting_iterator(0), counting_iterator(length),
        dthydro, [](Real_t a, Real_t b) { return a < b ? a : b; },
        [=, &domain](Index_t i)
        {
            Index_t indx = regElemList[i];
            if (domain.vdov(indx) == Real_t(0.0)) {
                return std::numeric_limits<Real_t>::max();
            } else {
                return dvovmax / (std::abs(domain.vdov(indx)) + Real_t(1.e-20));
            }
        });
}
\`\`\`

Bad conversion (too verbose):
\`\`\`cpp
struct Candidate {
   Real_t dthydro;
   Index_t hydro_elem;
};

static inline
void CalcHydroConstraintForElems(Domain &domain, Index_t length,
                                 Index_t *regElemList, Real_t dvovmax, Real_t &dthydro)
{
    Candidate initCandidate { dthydro, -1 };

    auto result = std::transform_reduce(
        std::execution::par,
        regElemList, regElemList + length,
        initCandidate,
        [](const Candidate &a, const Candidate &b) {
            if (a.hydro_elem == -1) return b;
            if (b.hydro_elem == -1) return a;
            return (a.dthydro < b.dthydro) ? a : b;
        },
        [&](Index_t indx) -> Candidate {
            Real_t vdov = domain.vdov(indx);
            if (vdov != Real_t(0.)) {
                Real_t dtdov = dvovmax / (std::abs(vdov) + Real_t(1.e-20));
                return Candidate { dtdov, indx };
            } else {
                return Candidate { dthydro, -1 };
            }
        }
    );

    if (result.hydro_elem != -1) {
        dthydro = result.dthydro;
    }
}
\`\`\`
`;

/**
 * Converts MPI/OpenMP code to C++ standard parallelism using OpenAI's o3-mini model
 */
export async function convertCode(request: ConversionRequest): Promise<ConversionResult> {
  try {
    const { 
      sourceCode, 
      targetCppVersion = '20', 
      includeExplanations = true, 
      apiKey,
      reasoningEffort = 'high' // Default to high reasoning effort
    } = request;

    // Check if API key is provided
    if (!apiKey) {
      return {
        convertedCode: '',
        explanation: '',
        success: false,
        error: 'OpenAI API key is missing. Please provide your API key in the settings.'
      };
    }

    // Initialize the OpenAI client with the provided API key
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });

    // Create the user prompt with the source code and target C++ version
    const userPrompt = `
Convert the following MPI/OpenMP code to C++${targetCppVersion} using standard parallelism features:

\`\`\`cpp
${sourceCode}
\`\`\`

${includeExplanations ? 'Please provide explanations for each transformation.' : ''}
Return your answer in the following format:
1. First, provide the converted code in a code block with cpp syntax highlighting
2. Then, provide a detailed explanation of the transformations you made
`;

    // Call the OpenAI API with the o3-mini model and reasoning_effort parameter
    const response = await openai.chat.completions.create({
      model: 'o3-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: 8000,
      reasoning_effort: reasoningEffort // Using the reasoning effort from the request
    });

    // Extract the response content
    const content = response.choices[0]?.message?.content || '';

    // Log token usage details if available
    if (response.usage?.completion_tokens_details) {
      console.log('Reasoning tokens used:', response.usage.completion_tokens_details.reasoning_tokens);
      console.log('Total completion tokens:', response.usage.completion_tokens);
    }

    // Parse the response to extract the converted code and explanation
    const { convertedCode, explanation } = parseResponse(content);

    return {
      convertedCode,
      explanation,
      success: true
    };
  } catch (error) {
    console.error('Error converting code:', error);
    return {
      convertedCode: '',
      explanation: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Parses the response from the OpenAI API to extract the converted code and explanation
 */
function parseResponse(content: string): { convertedCode: string; explanation: string } {
  // Default values
  let convertedCode = '';
  let explanation = '';

  // Try to extract code blocks
  const codeBlockRegex = /```(?:cpp)?\s*([\s\S]*?)```/g;
  const codeBlocks = [...content.matchAll(codeBlockRegex)];

  if (codeBlocks.length > 0) {
    // The first code block is usually the converted code
    convertedCode = codeBlocks[0][1].trim();
    
    // The rest of the content is likely the explanation
    // Remove all code blocks from the content to get the explanation
    explanation = content.replace(codeBlockRegex, '').trim();
  } else {
    // If no code blocks found, use the entire content as the explanation
    explanation = content;
  }

  return { convertedCode, explanation };
}

export interface PatternKnowledgeRequest {
  originalCode: string;
  convertedCode: string;
  detectedPatterns: string[];
  apiKey: string;
}

export interface PatternKnowledgeResponse {
  patternKnowledge: {
    pattern: string;
    description: string;
    useCases: string[];
    performance: string;
    considerations: string[];
  }[];
}

export async function generatePatternKnowledge(request: PatternKnowledgeRequest): Promise<PatternKnowledgeResponse> {
  const { originalCode, convertedCode, detectedPatterns, apiKey } = request;
  
  if (!apiKey) {
    throw new Error('API key is required');
  }

  console.log("Generating pattern knowledge for patterns:", detectedPatterns);

  const systemPrompt = `You are a C++ parallelism expert. Analyze the provided original and converted code snippets, focusing on the parallel patterns that were detected. 
For each pattern, provide detailed knowledge that would be helpful for developers understanding these patterns. 
Structure your response in JSON format containing the following for each pattern:
- pattern: The name of the pattern (exactly as provided in the detected patterns list)
- description: A technical description of what the pattern does and how it works
- useCases: Array of common use cases where this pattern is effective
- performance: Performance characteristics and expected speedups
- considerations: Array of key implementation considerations or potential pitfalls

Your response should help developers understand each pattern deeply in the context of C++ parallelism.`;

  const userPrompt = `Original Code:
\`\`\`cpp
${originalCode}
\`\`\`

Converted Code:
\`\`\`cpp
${convertedCode}
\`\`\`

Detected Patterns: ${detectedPatterns.join(', ')}

Provide pattern knowledge that would help a developer understand these patterns in the context of the code conversion.
Focus only on the detected patterns. Return your response in valid JSON format without any additional text.`;

  try {
    console.log("Sending request to OpenAI API for pattern knowledge");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error response:", errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log("OpenAI API response received:", data);
    
    const content = data.choices[0].message.content;
    console.log("Raw content from OpenAI:", content);
    
    const result = parseKnowledgeResponse(content, detectedPatterns);
    console.log("Parsed knowledge response:", result);
    
    return result;
  } catch (error: any) {
    console.error('Error generating pattern knowledge:', error);
    throw error;
  }
}

function parseKnowledgeResponse(content: string, patternsList: string[]): PatternKnowledgeResponse {
  try {
    console.log("Parsing knowledge response, content length:", content.length);
    
    // Extract JSON if it's wrapped in markdown code blocks
    let jsonContent = content;
    
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      console.log("Found JSON in code block");
      jsonContent = jsonMatch[1];
    }
    
    // Parse the JSON content
    console.log("Attempting to parse JSON content");
    const parsed = JSON.parse(jsonContent);
    console.log("Successfully parsed JSON:", parsed);
    
    // Handle different possible JSON structures
    if (Array.isArray(parsed)) {
      console.log("Response is an array");
      return { patternKnowledge: parsed };
    } 
    
    if (parsed.patternKnowledge && Array.isArray(parsed.patternKnowledge)) {
      console.log("Response has patternKnowledge array");
      return parsed;
    }
    
    if (parsed.patterns && Array.isArray(parsed.patterns)) {
      console.log("Response has patterns array");
      return { patternKnowledge: parsed.patterns };
    }

    // If we have a direct object with pattern information
    if (parsed.pattern && parsed.description && 
        (parsed.useCases || parsed.use_cases) && 
        parsed.performance && 
        (parsed.considerations || parsed.key_considerations)) {
      console.log("Response is a single pattern object");
      return { 
        patternKnowledge: [{
          pattern: parsed.pattern,
          description: parsed.description,
          useCases: parsed.useCases || parsed.use_cases || [],
          performance: parsed.performance,
          considerations: parsed.considerations || parsed.key_considerations || []
        }] 
      };
    }
    
    // If none of the expected structures, try to extract from whatever we have
    console.log("Trying to extract pattern knowledge from unexpected structure");
    const knowledge = [];
    
    // Check if we have a patterns object with pattern names as keys
    for (const key in parsed) {
      if (typeof parsed[key] === 'object' && parsed[key] !== null) {
        const patternObj = parsed[key];
        
        // If it has the required fields, treat it as a pattern
        if (patternObj.description && 
            (patternObj.useCases || patternObj.use_cases) && 
            patternObj.performance && 
            (patternObj.considerations || patternObj.key_considerations)) {
          
          knowledge.push({
            pattern: key,
            description: patternObj.description,
            useCases: patternObj.useCases || patternObj.use_cases || [],
            performance: patternObj.performance,
            considerations: patternObj.considerations || patternObj.key_considerations || []
          });
        }
      }
    }
    
    if (knowledge.length > 0) {
      console.log("Extracted pattern knowledge from object keys");
      return { patternKnowledge: knowledge };
    }
    
    // Last resort: create a default pattern knowledge object
    if (patternsList && patternsList.length > 0) {
      console.log("Creating default pattern knowledge for detected patterns");
      const defaultKnowledge = patternsList.map((pattern: string) => ({
        pattern,
        description: `The ${pattern} pattern is a common parallel programming pattern.`,
        useCases: ["General parallel programming"],
        performance: "Performance depends on specific implementation details.",
        considerations: ["Consider hardware capabilities", "Consider data dependencies"]
      }));
      
      return { patternKnowledge: defaultKnowledge };
    }
    
    console.error("Could not parse pattern knowledge response:", parsed);
    throw new Error('Could not parse pattern knowledge response');
  } catch (error: any) {
    console.error('Error parsing pattern knowledge:', error);
    throw new Error(`Failed to parse pattern knowledge: ${error.message}`);
  }
} 