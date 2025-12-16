'use client';

import React from 'react';

// Componente base de skeleton
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded h-4',
    rectangular: 'rounded',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Simplified wave animation
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Skeleton específico para productos
export const ProductSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
    <div className="flex flex-col gap-4">
      {/* Imagen del producto */}
      <Skeleton variant="rectangular" height={200} className="w-full" />

      {/* Título */}
      <Skeleton variant="text" height={24} width="80%" />

      {/* Descripción */}
      <div className="space-y-2">
        <Skeleton variant="text" height={16} width="100%" />
        <Skeleton variant="text" height={16} width="90%" />
        <Skeleton variant="text" height={16} width="60%" />
      </div>

      {/* Precio */}
      <Skeleton variant="text" height={32} width="40%" />

      {/* Botón */}
      <Skeleton variant="rectangular" height={48} className="w-full" />
    </div>
  </div>
);

// Skeleton para lista de productos
export const ProductListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

// Skeleton para dashboard
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton variant="text" height={36} width={300} />
        <Skeleton variant="text" height={20} width={400} />
      </div>
      <div className="flex gap-3">
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <Skeleton variant="circular" width={40} height={40} />
          </div>
          <Skeleton variant="text" height={16} width={120} className="mb-1" />
          <Skeleton variant="text" height={32} width={80} className="mb-2" />
          <Skeleton variant="text" height={12} width={100} />
        </div>
      ))}
    </div>

    {/* Content */}
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
      <Skeleton variant="text" height={28} width={200} className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="space-y-2">
                <Skeleton variant="text" height={18} width={200} />
                <Skeleton variant="text" height={14} width={150} />
              </div>
            </div>
            <Skeleton variant="text" height={16} width={80} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton para formulario
export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton variant="text" height={16} width={120} />
      <Skeleton variant="rectangular" height={48} className="w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" height={16} width={100} />
      <Skeleton variant="rectangular" height={48} className="w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" height={16} width={140} />
      <Skeleton variant="rectangular" height={96} className="w-full" />
    </div>
    <Skeleton variant="rectangular" height={48} className="w-full" />
  </div>
);

// Skeleton para tabla
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
    {/* Header */}
    <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" height={16} />
        ))}
      </div>
    </div>

    {/* Rows */}
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" height={14} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
