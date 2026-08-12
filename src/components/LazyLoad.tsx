"use client";

import { Suspense, lazy, ComponentType, createElement } from "react";
import LoadingSpinner, { SectionLoadingSpinner } from "./LoadingSpinner";

// Hook para lazy loading de componentes
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense
      fallback={fallback ? createElement(fallback) : <SectionLoadingSpinner />}
    >
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Componente específico para lazy loading con skeleton personalizado
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  className = "",
}) => (
  <Suspense fallback={fallback || <SectionLoadingSpinner />}>
    {children}
  </Suspense>
);

export default LazyWrapper;
