import * as Sentry from "@sentry/nextjs";

// Configuraciรณn de Sentry para el cliente
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    integrations: [
      Sentry.httpIntegration(),
      Sentry.nativeNodeFetchIntegration(),
    ],

    // Configuraciรณn de performance monitoring
    beforeSend: (event, hint) => {
      // Filtrar errores de navegaciรณn que no son crรญticos
      if (event.exception) {
        const error = hint.originalException as Error;
        if (
          error?.message?.includes("Loading chunk") ||
          error?.message?.includes("ChunkLoadError")
        ) {
          return null; // Ignorar errores de chunks que se resuelven solos
        }
      }

      // Agregar contexto adicional
      event.tags = {
        ...event.tags,
        component: "frontend",
      };

      return event;
    },

    // Configuraciรณn de breadcrumbs
    beforeBreadcrumb: (breadcrumb) => {
      // Filtrar breadcrumbs innecesarios
      if (breadcrumb.category === "console" && breadcrumb.level === "log") {
        return null;
      }

      return breadcrumb;
    },
  });
};

// Funciรณn helper para capturar errores con contexto
export const captureError = (
  error: Error,
  context?: Record<string, unknown>,
  userId?: string
) => {
  Sentry.withScope((scope) => {
    if (userId) {
      scope.setUser({ id: userId });
    }

    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setTag(key, String(context[key]));
      });
    }

    scope.setTag("component", "frontend");
    Sentry.captureException(error);
  });
};

// Funciรณn helper para capturar mensajes
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, unknown>
) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setTag(key, String(context[key]));
      });
    }

    scope.setTag("component", "frontend");
    Sentry.captureMessage(message, level);
  });
};

// Funciรณn para trackear performance (no disponible en esta versiรณn de Sentry)
export const startTransaction = (name: string, op: string) => {
  // Performance tracking se maneja automรกticamente por Sentry
};

// Funciรณn para trackear navegaciรณn
export const trackNavigation = (from: string, to: string) => {
  Sentry.addBreadcrumb({
    category: "navigation",
    message: `Navigation from ${from} to ${to}`,
    level: "info",
  });
};

// Funciรณn para trackear user actions
export const trackUserAction = (
  action: string,
  details?: Record<string, unknown>
) => {
  Sentry.addBreadcrumb({
    category: "user",
    message: `User action: ${action}`,
    level: "info",
    data: details,
  });
};

export default Sentry;
