import * as Sentry from '@sentry/nextjs';

// Configuración de Sentry para el cliente
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.httpIntegration(),
      Sentry.nativeFetchIntegration(),
    ],

    // Configuración de performance monitoring
    beforeSend: (event, hint) => {
      // Filtrar errores de navegación que no son críticos
      if (event.exception) {
        const error = hint.originalException as Error;
        if (error?.message?.includes('Loading chunk') ||
            error?.message?.includes('ChunkLoadError')) {
          return null; // Ignorar errores de chunks que se resuelven solos
        }
      }

      // Agregar contexto adicional
      event.tags = {
        ...event.tags,
        component: 'frontend',
      };

      return event;
    },

    // Configuración de breadcrumbs
    beforeBreadcrumb: (breadcrumb, hint) => {
      // Filtrar breadcrumbs innecesarios
      if (breadcrumb.category === 'console' &&
          breadcrumb.level === 'log') {
        return null;
      }

      return breadcrumb;
    },
  });
};

// Función helper para capturar errores con contexto
export const captureError = (
  error: Error,
  context?: Record<string, any>,
  userId?: string
) => {
  Sentry.withScope((scope) => {
    if (userId) {
      scope.setUser({ id: userId });
    }

    if (context) {
      Object.keys(context).forEach(key => {
        scope.setTag(key, context[key]);
      });
    }

    scope.setTag('component', 'frontend');
    Sentry.captureException(error);
  });
};

// Función helper para capturar mensajes
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach(key => {
        scope.setTag(key, context[key]);
      });
    }

    scope.setTag('component', 'frontend');
    Sentry.captureMessage(message, level);
  });
};

// Función para trackear performance
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({
    name,
    op,
  });
};

// Función para trackear navegación
export const trackNavigation = (from: string, to: string) => {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Navigation from ${from} to ${to}`,
    level: 'info',
  });
};

// Función para trackear user actions
export const trackUserAction = (
  action: string,
  details?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    category: 'user',
    message: `User action: ${action}`,
    level: 'info',
    data: details,
  });
};

export default Sentry;
