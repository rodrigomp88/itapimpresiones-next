'use client';

import { PropsWithChildren } from 'react';

export function CatalogTheme({ children, branding }: PropsWithChildren<{ branding: { primaryColor: string; secondaryColor: string; accentColor: string } }>) {
  return (
    <>
      <style jsx global>{`
        :root {
          --catalog-primary: ${branding.primaryColor};
          --catalog-secondary: ${branding.secondaryColor};
          --catalog-accent: ${branding.accentColor};
        }
        .catalog-primary { color: var(--catalog-primary); }
        .catalog-bg-primary { background-color: var(--catalog-primary); }
        .catalog-border-primary { border-color: var(--catalog-primary); }
        .catalog-text-primary { color: var(--catalog-primary); }
        .catalog-bg-secondary { background-color: var(--catalog-secondary); }
        .catalog-text-accent { color: var(--catalog-accent); }
        .catalog-bg-accent { background-color: var(--catalog-accent); }
      `}</style>
      {children}
    </>
  );
}