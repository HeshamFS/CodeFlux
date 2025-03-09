import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const CppIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
      fill="currentColor" 
    />
    <path 
      d="M11 7H13V17H11V7Z" 
      fill="currentColor" 
    />
    <path 
      d="M7 11H17V13H7V11Z" 
      fill="currentColor" 
    />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6Z" 
      fill="currentColor" 
    />
    <path 
      d="M14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z" 
      fill="currentColor" 
    />
  </svg>
);

export const ParallelIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M4 4H8V20H4V4Z" 
      fill="currentColor" 
    />
    <path 
      d="M10 4H14V20H10V4Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 4H20V20H16V4Z" 
      fill="currentColor" 
    />
  </svg>
);

export const AlgorithmIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM7 7H9V9H7V7ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM17 17H11V15H17V17ZM17 13H11V11H17V13ZM17 9H11V7H17V9Z" 
      fill="currentColor" 
    />
  </svg>
);

export const ConvertIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M7.5 3L7.5 9L9 9L9 5.87L14.13 11L9 16.13L9 13L7.5 13L7.5 19L13.5 19L13.5 17.5L10.37 17.5L16.5 11.37L16.5 14.5L18 14.5L18 8.5L12 8.5L12 10L15.13 10L9 16.13L9 13L7.5 13L7.5 19L13.5 19L13.5 17.5L10.37 17.5L16.5 11.37L16.5 14.5L18 14.5L18 8.5L12 8.5L12 10L15.13 10L10 4.87L10 3L7.5 3Z" 
      fill="currentColor" 
    />
  </svg>
);

export const OpenMPIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
      fill="currentColor" 
    />
    <path 
      d="M12 8L8 12L12 16L16 12L12 8Z" 
      fill="currentColor" 
    />
  </svg>
);

export const MPIIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M4 4V20H20V4H4ZM18 18H6V6H18V18Z" 
      fill="currentColor" 
    />
    <path 
      d="M8 8H10V16H8V8Z" 
      fill="currentColor" 
    />
    <path 
      d="M12 8H14V16H12V8Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 8H18V10H16V8Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 12H18V14H16V12Z" 
      fill="currentColor" 
    />
  </svg>
);

export const PatternIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M4 4H8V8H4V4Z" 
      fill="currentColor" 
    />
    <path 
      d="M10 4H14V8H10V4Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 4H20V8H16V4Z" 
      fill="currentColor" 
    />
    <path 
      d="M4 10H8V14H4V10Z" 
      fill="currentColor" 
    />
    <path 
      d="M10 10H14V14H10V10Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 10H20V14H16V10Z" 
      fill="currentColor" 
    />
    <path 
      d="M4 16H8V20H4V16Z" 
      fill="currentColor" 
    />
    <path 
      d="M10 16H14V20H10V16Z" 
      fill="currentColor" 
    />
    <path 
      d="M16 16H20V20H16V16Z" 
      fill="currentColor" 
    />
  </svg>
);

export const ExecutionIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" 
      fill="currentColor" 
    />
  </svg>
);

export const ReasoningIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
      fill="currentColor" 
    />
    <path 
      d="M12 11C12.55 11 13 10.55 13 10C13 9.45 12.55 9 12 9C11.45 9 11 9.45 11 10C11 10.55 11.45 11 12 11Z" 
      fill="currentColor" 
    />
    <path 
      d="M12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 16C14.7 16 17.8 17.29 18 18H6C6.23 17.28 9.31 16 12 16ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
      fill="currentColor" 
    />
  </svg>
);

export const PerformanceIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" 
      fill="currentColor" 
    />
  </svg>
); 