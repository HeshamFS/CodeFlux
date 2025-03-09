import { useState } from 'react';
import { ConverterService } from '../services/converter';
import { ConversionResult, ReasoningEffort } from '../types';

interface UseConverterProps {
  onConversionSuccess: (result: ConversionResult) => void;
  converterService: ConverterService;
}

interface ConvertParams {
  inputCode: string;
  targetCppVersion: '17' | '20' | '23';
  includeExplanations: boolean;
  apiKey: string;
  reasoningEffort: ReasoningEffort;
}

export function useConverter({ onConversionSuccess, converterService }: UseConverterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState('');

  const validateApiKey = (apiKey: string | null): boolean => {
    if (!apiKey) {
      setError('Please enter your API key in the settings.');
      return false;
    }
    return true;
  };

  const validateInputCode = (code: string): boolean => {
    if (!code.trim()) {
      setError('Please enter some code to convert.');
      return false;
    }
    return true;
  };

  const handleConvert = async ({
    inputCode,
    targetCppVersion,
    includeExplanations,
    apiKey,
    reasoningEffort
  }: ConvertParams) => {
    if (!validateApiKey(apiKey) || !validateInputCode(inputCode)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation('');

    try {
      const result = await converterService.convert({
        sourceCode: inputCode,
        targetCppVersion,
        includeExplanations,
        apiKey,
        reasoningEffort
      });

      if (result.success) {
        if (includeExplanations && result.explanation) {
          setExplanation(result.explanation);
        }
        onConversionSuccess(result);
      } else {
        setError('Conversion failed. Please try again with a different code snippet or settings.');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    explanation,
    handleConvert,
    setError
  };
} 