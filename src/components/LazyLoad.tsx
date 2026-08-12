"use client";

import { Suspense, lazy, ComponentType, createElement } from "react";
import { SectionLoadingSpinner } from "./LoadingSpinner";

// Hook para lazy loading de componentes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fallback?: ComponentType<any>
) {
  const LazyComponent = lazy(importFunc);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: React.ComponentProps<any>) => (
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
}) => (
  <Suspense fallback={fallback || <SectionLoadingSpinner />}>
    {children}
  </Suspense>
);

export default LazyWrapper;
