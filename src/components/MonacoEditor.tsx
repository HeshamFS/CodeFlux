import React, { useRef, useEffect } from 'react';
import Editor, { Monaco, OnMount, OnChange, loader } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
  language?: string;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = '400px',
  language = 'cpp',
  theme = 'cppConverter',
  options = {}
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Define custom theme when Monaco is loaded
  useEffect(() => {
    // This will run once when the component mounts
    loader.init().then(monaco => {
      monaco.editor.defineTheme('cppConverter', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          // Keywords (if, else, for, while, etc.)
          { token: 'keyword', foreground: '60a5fa' },
          // Types (int, char, void, etc.)
          { token: 'type', foreground: '34d399' },
          // Functions
          { token: 'function', foreground: 'fcd34d' },
          // Preprocessor directives (#include, #define, etc.)
          { token: 'keyword.directive', foreground: 'c084fc' },
          // Numbers
          { token: 'number', foreground: '4ade80' },
          // Strings
          { token: 'string', foreground: 'fb923c' },
          // Comments
          { token: 'comment', foreground: '6b7280' },
          // Variables and identifiers
          { token: 'identifier', foreground: 'e2e8f0' },
          // Operators
          { token: 'operator', foreground: 'f472b6' },
          // Namespaces (std::)
          { token: 'namespace', foreground: '22d3ee' },
          // OpenMP directives
          { token: 'keyword.directive.omp', foreground: 'c084fc' },
          // MPI functions
          { token: 'function.mpi', foreground: 'fcd34d' },
          // Delimiters
          { token: 'delimiter.curly', foreground: 'f472b6' },
          { token: 'delimiter.square', foreground: 'f472b6' },
          { token: 'delimiter.parenthesis', foreground: 'f472b6' },
          { token: 'delimiter.angle', foreground: 'f472b6' },
        ],
        colors: {
          'editor.background': '#111827',
          'editor.foreground': '#e2e8f0',
          'editorCursor.foreground': '#60a5fa',
          'editor.lineHighlightBackground': '#1e293b',
          'editorLineNumber.foreground': '#6b7280',
          'editorLineNumber.activeForeground': '#e2e8f0',
          'editor.selectionBackground': '#2563eb33',
          'editor.inactiveSelectionBackground': '#3730a333',
          'editorIndentGuide.background': '#374151',
        }
      });
    });
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Define custom theme
    monaco.editor.defineTheme('cppConverter', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // Keywords (if, else, for, while, etc.)
        { token: 'keyword', foreground: '60a5fa' },
        // Types (int, char, void, etc.)
        { token: 'type', foreground: '34d399' },
        // Functions
        { token: 'function', foreground: 'fcd34d' },
        // Preprocessor directives (#include, #define, etc.)
        { token: 'keyword.directive', foreground: 'c084fc' },
        // Numbers
        { token: 'number', foreground: '4ade80' },
        // Strings
        { token: 'string', foreground: 'fb923c' },
        // Comments
        { token: 'comment', foreground: '6b7280' },
        // Variables and identifiers
        { token: 'identifier', foreground: 'e2e8f0' },
        // Operators
        { token: 'operator', foreground: 'f472b6' },
        // Namespaces (std::)
        { token: 'namespace', foreground: '22d3ee' },
        // OpenMP directives
        { token: 'keyword.directive.omp', foreground: 'c084fc' },
        // MPI functions
        { token: 'function.mpi', foreground: 'fcd34d' },
        // Delimiters
        { token: 'delimiter.curly', foreground: 'f472b6' },
        { token: 'delimiter.square', foreground: 'f472b6' },
        { token: 'delimiter.parenthesis', foreground: 'f472b6' },
        { token: 'delimiter.angle', foreground: 'f472b6' },
      ],
      colors: {
        'editor.background': '#111827',
        'editor.foreground': '#e2e8f0',
        'editorCursor.foreground': '#60a5fa',
        'editor.lineHighlightBackground': '#1e293b',
        'editorLineNumber.foreground': '#6b7280',
        'editorLineNumber.activeForeground': '#e2e8f0',
        'editor.selectionBackground': '#2563eb33',
        'editor.inactiveSelectionBackground': '#3730a333',
        'editorIndentGuide.background': '#374151',
      }
    });
    
    // Set the theme
    monaco.editor.setTheme('cppConverter');
    
    // Configure C++ language features
    configureCppLanguage(monaco);
    
    // Focus the editor if it's not read-only
    if (!readOnly) {
      editor.focus();
    }
  };

  const configureCppLanguage = (monaco: Monaco) => {
    // Add C++ keywords and snippets for auto-completion
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: (model, position, context, token) => {
        const wordInfo = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: wordInfo.startColumn,
          endColumn: wordInfo.endColumn
        };

        const suggestions = [
          // C++ Standard Parallelism Keywords
          {
            label: 'std::execution::par',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'std::execution::par',
            detail: 'Parallel execution policy',
            range
          },
          {
            label: 'std::execution::seq',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'std::execution::seq',
            detail: 'Sequential execution policy',
            range
          },
          {
            label: 'std::execution::par_unseq',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'std::execution::par_unseq',
            detail: 'Parallel unsequenced execution policy',
            range
          },
          // C++ Standard Algorithms
          {
            label: 'std::transform',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'std::transform(${1:std::execution::par}, ${2:first}, ${3:last}, ${4:result}, ${5:[](auto x) { return x; }});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Apply function to range and store result',
            range
          },
          {
            label: 'std::for_each',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'std::for_each(${1:std::execution::par}, ${2:first}, ${3:last}, ${4:[](auto& x) { }});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Apply function to range',
            range
          },
          {
            label: 'std::reduce',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'std::reduce(${1:std::execution::par}, ${2:first}, ${3:last}, ${4:init}, ${5:std::plus<>{}});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Reduce range to single value',
            range
          },
          {
            label: 'std::transform_reduce',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'std::transform_reduce(${1:std::execution::par}, ${2:first}, ${3:last}, ${4:init}, ${5:std::plus<>{}}, ${6:[](auto x) { return x; }});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Transform and reduce range',
            range
          },
          // Headers
          {
            label: '#include <execution>',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '#include <execution>',
            detail: 'Include execution policies header',
            range
          },
          {
            label: '#include <algorithm>',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '#include <algorithm>',
            detail: 'Include algorithms header',
            range
          },
          {
            label: '#include <numeric>',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '#include <numeric>',
            detail: 'Include numeric algorithms header',
            range
          },
          // OpenMP directives for input code
          {
            label: '#pragma omp parallel for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '#pragma omp parallel for\nfor (${1:int} ${2:i} = ${3:0}; ${2:i} < ${4:n}; ++${2:i}) {\n\t${5}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'OpenMP parallel for loop',
            range
          },
          {
            label: '#pragma omp parallel for reduction',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '#pragma omp parallel for reduction(${1:+}:${2:sum})\nfor (${3:int} ${4:i} = ${5:0}; ${4:i} < ${6:n}; ++${4:i}) {\n\t${2:sum} ${1:+}= ${7};\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'OpenMP parallel for loop with reduction',
            range
          }
        ];
        
        return { suggestions };
      }
    });

    // Register custom tokenizer for better syntax highlighting
    monaco.languages.setMonarchTokensProvider('cpp', {
      defaultToken: 'invalid',
      tokenPostfix: '.cpp',

      brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '<', close: '>', token: 'delimiter.angle' }
      ],

      // C++ specific types
      typeKeywords: [
        'bool', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float',
        'unsigned', 'signed', 'const', 'static', 'inline', 'auto', 'size_t',
        'int8_t', 'int16_t', 'int32_t', 'int64_t',
        'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t',
        'Real_t', 'Index_t', // Domain-specific types from the example
      ],

      keywords: [
        'abstract', 'alignas', 'alignof', 'and', 'and_eq', 'asm',
        'bitand', 'bitor', 'break', 'case', 'catch', 'char16_t',
        'char32_t', 'class', 'compl', 'concept', 'constexpr', 'const_cast',
        'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete',
        'do', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern',
        'false', 'final', 'for', 'friend', 'goto', 'if', 'import',
        'module', 'mutable', 'namespace', 'new', 'noexcept', 'not',
        'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'override', 'private', 'protected',
        'public', 'register', 'reinterpret_cast', 'requires', 'return',
        'sizeof', 'static_assert', 'static_cast', 'struct',
        'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
        'typedef', 'typeid', 'typename', 'union', 'using', 'virtual',
        'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
      ],

      directives: [
        '#include', '#define', '#undef', '#if', '#ifdef', '#ifndef', '#else',
        '#elif', '#endif', '#line', '#pragma', '#error', '_OPENMP'
      ],

      operators: [
        '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
        '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
        '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
        '%=', '<<=', '>>=', '>>>='
      ],

      // Symbols that can appear in various contexts
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      integersuffix: /(ll|LL|l|L|u|U|i64|i32|i16|i8)?(ll|LL|l|L|u|U)?/,
      floatsuffix: /[fFlL]?/,

      // The main tokenizer for our languages
      tokenizer: {
        root: [
          // Functions
          [/[a-zA-Z_]\w*(?=\s*\()/, {
            cases: {
              '@typeKeywords': 'type',
              '@keywords': 'keyword',
              '@default': 'function'
            }
          }],

          // Identifiers and keywords
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@typeKeywords': 'type',
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],

          // Preprocessor directives
          [/^\s*#\s*\w+/, {
            cases: {
              '@directives': 'keyword.directive',
              '@default': 'keyword.directive'
            }
          }],

          // OpenMP directives
          [/^\s*#\s*pragma\s+omp/, 'keyword.directive.omp'],

          // MPI functions
          [/MPI_[A-Za-z0-9_]+/, 'function.mpi'],

          // Namespaces (std::)
          [/std::/, 'namespace'],

          // Whitespace
          { include: '@whitespace' },

          // Delimiters and operators
          [/[{}()\[\]]/, '@brackets'],
          [/[<>](?!@symbols)/, '@brackets'],
          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': ''
            }
          }],

          // Numbers
          [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float'],
          [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float'],
          [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex'],
          [/0[0-7']*[0-7](@integersuffix)/, 'number.octal'],
          [/0[bB][0-1']*[0-1](@integersuffix)/, 'number.binary'],
          [/\d[\d']*\d(@integersuffix)/, 'number'],
          [/\d(@integersuffix)/, 'number'],

          // Character literals
          [/'([^'\\]|\\.)'/, 'string'],

          // String literals
          [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
          [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
        ],

        comment: [
          [/[^\/*]+/, 'comment'],
          [/\/\*/, 'comment', '@push'],    // nested comment
          ["\\*/", 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],

        string: [
          [/[^\\"]+/, 'string'],
          [/@escapes/, 'string.escape'],
          [/\\./, 'string.escape.invalid'],
          [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        whitespace: [
          [/[ \t\r\n]+/, 'white'],
          [/\/\*/, 'comment', '@comment'],
          [/\/\/.*$/, 'comment'],
        ],
      }
    });
  };

  // Handle editor value changes
  const handleEditorChange: OnChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  // Default editor options
  const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    folding: true,
    matchBrackets: 'always',
    automaticLayout: true,
    readOnly,
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    ...options
  };

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      theme="cppConverter"
      options={defaultOptions}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default MonacoEditor; 