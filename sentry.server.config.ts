import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Configuración de traces para el servidor
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  integrations: [
    Sentry.httpIntegration(),
    Sentry.nativeNodeFetchIntegration(),
  ],

  // Configuración específica del servidor
  beforeSend: (event, hint) => {
    // Filtrar errores de base de datos que no son críticos
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage?.includes('ECONNREFUSED') ||
            errorMessage?.includes('ETIMEDOUT')) {
          event.level = 'warning'; // Downgrade network errors
        }
      }
    }

    // Agregar contexto del servidor
    event.tags = {
      ...event.tags,
      component: 'server',
      runtime: 'nodejs',
    };

    return event;
  },

  // Configuración de breadcrumbs para el servidor
  beforeBreadcrumb: (breadcrumb, hint) => {
    // Filtrar breadcrumbs de debugging innecesarios
    if (breadcrumb.category === 'console' &&
        breadcrumb.level === 'debug' &&
        breadcrumb.message?.includes('DEBUG:')) {
      return null;
    }

    return breadcrumb;
  },
});
