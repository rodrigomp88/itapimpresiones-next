"use client";

import React from "react";
import SkeletonLoader from "./SkeletonLoader";

/**
 * Componentes de Skeleton específicos para diferentes tipos de contenido
 */

// Skeleton para cards de productos en grid
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <SkeletonLoader variant="product" className="h-64" />
        <div className="p-4 space-y-3">
          <SkeletonLoader variant="text" width="80%" height="1.25rem" />
          <SkeletonLoader variant="text" width="60%" height="1rem" />
          <div className="flex justify-between items-center">
            <SkeletonLoader variant="text" width="30%" height="1.5rem" />
            <SkeletonLoader variant="button" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton para cards de productos en scroll horizontal (móvil)
export const ProductHorizontalSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 snap-x">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="min-w-[240px] bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 snap-center">
        <SkeletonLoader variant="product" className="h-32 rounded-t-xl" />
        <div className="p-4 space-y-3">
          <SkeletonLoader variant="text" width="90%" height="1rem" />
          <SkeletonLoader variant="text" width="70%" height="0.875rem" />
          <div className="flex justify-between items-center">
            <SkeletonLoader variant="text" width="40%" height="1.125rem" />
            <SkeletonLoader variant="button" width="2rem" height="2rem" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton para formularios
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 3 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonLoader variant="text" width="30%" height="1rem" />
        <SkeletonLoader variant="text" width="100%" height="2.5rem" />
      </div>
    ))}
    <SkeletonLoader variant="button" width="40%" height="2.5rem" />
  </div>
);

// Skeleton para listas
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <SkeletonLoader variant="avatar" width="3rem" height="3rem" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="text" width="60%" height="1rem" />
          <SkeletonLoader variant="text" width="80%" height="0.875rem" />
        </div>
        <SkeletonLoader variant="button" width="5rem" height="2rem" />
      </div>
    ))}
  </div>
);

// Skeleton para banners/hero sections
export const BannerSkeleton: React.FC = () => (
  <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl bg-gradient-to-r from-slate-100 to-white dark:from-slate-900 dark:to-black">
    <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-12">
      <div className="h-full grid md:grid-cols-2 items-center">
        <div className="space-y-6">
          <SkeletonLoader variant="text" width="80%" height="3rem" />
          <SkeletonLoader variant="text" width="90%" height="1.5rem" />
          <SkeletonLoader variant="text" width="70%" height="1.125rem" />
          <SkeletonLoader variant="button" width="10rem" height="3rem" />
        </div>
        <div className="hidden md:flex justify-center">
          <SkeletonLoader variant="banner" width="20rem" height="20rem" />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton para tablas
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
      <SkeletonLoader variant="text" width="40%" height="1.5rem" />
    </div>
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center space-x-4">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonLoader 
              key={j} 
              variant="text" 
              width={j === 0 ? "60%" : "30%"} 
              height="1rem" 
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para dashboards/cards analytics
export const AnalyticsCardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonLoader variant="text" width="60%" height="1rem" />
            <SkeletonLoader variant="text" width="40%" height="1.5rem" />
          </div>
          <SkeletonLoader variant="avatar" width="3rem" height="3rem" />
        </div>
        <div className="mt-4">
          <SkeletonLoader variant="text" width="80%" height="0.875rem" />
        </div>
      </div>
    ))}
  </div>
);

export default {
  ProductGridSkeleton,
  ProductHorizontalSkeleton,
  FormSkeleton,
  ListSkeleton,
  BannerSkeleton,
  TableSkeleton,
  AnalyticsCardSkeleton
};
