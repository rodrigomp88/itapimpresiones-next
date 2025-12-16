'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  message
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Cargando"
      />
      {message && (
        <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

// Componente específico para loading de página completa
export const PageLoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Cargando...'
}) => (
  <div className="flex-grow flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="lg" message={message} />
  </div>
);

// Componente para loading de secciones
export const SectionLoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Cargando...'
}) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="md" message={message} />
  </div>
);

export default LoadingSpinner;
