import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ExplanationPanelProps {
  explanation: string;
  generalKnowledge: string;
  isLoading: boolean;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  generalKnowledge,
  isLoading
}) => {
  if (!explanation && !generalKnowledge && !isLoading) return null;

  const markdownComponents = {
    code({ inline, className, children, ...props }: CodeProps) {
      return !inline ? (
        <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className="bg-gray-900 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Explanations & Insights</h2>
      
      <div className="explanation-section mb-6">
        <h3 className="text-xl font-semibold mb-3">Code Transformation Explanation</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          {isLoading && !explanation ? (
            <div className="flex items-center gap-2 text-gray-400 py-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Generating explanation...</span>
            </div>
          ) : explanation ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {explanation}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-400">
              No explanation available. Convert some code to see an explanation of the transformation.
            </p>
          )}
        </div>
      </div>
      
      {(generalKnowledge || isLoading) && (
        <div className="pattern-knowledge-section">
          <h3 className="text-xl font-semibold mb-3">Pattern Knowledge Base</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            {isLoading && !generalKnowledge ? (
              <div className="flex flex-col gap-2 text-gray-400 py-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Generating pattern knowledge...</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We're analyzing the detected patterns in your code and generating detailed knowledge about them.
                  This may take a moment as we consult our AI to provide you with the most accurate information.
                </p>
              </div>
            ) : generalKnowledge ? (
              <div className="pattern-knowledge-content prose prose-invert max-w-none prose-headings:text-blue-400 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-green-400 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-li:mb-1 prose-p:mb-3">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {generalKnowledge}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400">
                No pattern knowledge available. Convert some code with detectable patterns to see detailed information.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel; 