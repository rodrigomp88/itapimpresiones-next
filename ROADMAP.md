# 🚀 Roadmap - ITAP Impresiones

## ✅ v2.1.0 - Completado (Diciembre 2025)

### Seguridad y Robustez
- [x] Sanitización del carrito (prevención XSS)
- [x] Validación de esquemas con Zod en Server Actions
- [x] Seguridad en webhooks de MercadoPago

### SEO y Rendimiento
- [x] Metadatos dinámicos con OpenGraph y JSON-LD
- [x] Optimización de imágenes con SkeletonLoader y blur placeholder
- [x] Eliminación de console.log en producción

### Experiencia de Usuario
- [x] Sistema de feedback de errores (ErrorFeedback.tsx)
- [x] Accesibilidad WCAG 2.1 AA (navegación teclado, skip links, ARIA)
- [x] Botonera móvil rediseñada

---

## 🔮 Futuras Mejoras (Backlog)

### Performance
- [x] Implementar ISR para páginas de productos (revalidate=3600)
- [x] Optimizar bundle size (modularizeImports, tree shaking, compress)
- [x] Caché de consultas Firebase (firebase-cache.ts con TTL configurable)

### Funcionalidades
- [x] Sistema de cupones de descuento (tipos, API validación, UI checkout)
- [x] Notificaciones push (FCM, servicio, API suscripción, componente prompt)
- [x] Múltiples métodos de pago (MercadoPago, transferencia, efectivo)

### Monitoreo
- [x] Dashboard de métricas de ventas (ya existente + AlertsPanel)
- [x] Alertas automáticas de errores (lib/alerts.ts + AlertTemplates)
- [x] Análisis de comportamiento de usuarios (AnalyticsDashboard existente)

---

*Última actualización: 21/12/2025*
