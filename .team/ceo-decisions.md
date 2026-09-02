# ITAP Impresiones — Decisiones CEO

**Fecha:** 2026-08-31 · **Alcance:** Web + canal comercial online
**Fuentes:** Perfil de negocio (entrevista ago-2026), Manual de identidad 2026, prompt maestro de diseño.

---

## 1. Visión del producto

La web de ITAP **es el vendedor que nunca duerme**: una tienda donde un comercio, un gimnasio o una persona común entra, entiende qué puede comprar, cuánto cuesta y cuándo llega, y deja el pedido (o la consulta) hecho en menos de 3 minutos.

**No es** un portfolio de diseño, ni un catálogo PDF, ni una landing institucional. Tampoco es "una imprenta más": es el taller que registra sus tintas con oficio — y eso se nota en cómo se ve y cómo se comporta.

Toda decisión se mide contra una pregunta: **¿esto ayuda a que alguien compre o consulte hoy?** Si no, va a fase posterior o se descarta.

---

## 2. Prioridad de negocio #1

**VENDER. Indumentaria + bolsas, en ese orden.**

- La indumentaria es la mayor fuente de ingresos actual → lidera la home y el catálogo.
- Las bolsas son el segundo pilar con mercado estable → segunda puerta de entrada, con el argumento ambiental como diferencial real.
- El segmento a conquistar: el **particular que compra poco** (1 remera, un evento). Hoy se atiende mal por WhatsApp; la web puede capturarlo con experiencia premium sin fricción.
- El CTA del sitio entero es Raspberry Red y dice una sola cosa: comprar o pedir presupuesto. Todo lo demás es soporte.

---

## 3. Jerarquía de funciones (P0 / P1 / P2)

### P0 — Imprescindible para vender ya (Fase 1)
| # | Función | Por qué es P0 |
|---|---------|---------------|
| 1 | Home orientada a venta (indumentaria + bolsas) | Primera impresión = primera venta |
| 2 | Catálogo leído desde Firestore (misma fuente que el sistema interno) | Precios/stock siempre reales, sin doble carga |
| 3 | Ficha de producto con precio, mínimos por técnica y tiempos | Responde las 3 preguntas que siempre llegan por WhatsApp |
| 4 | **Derivación fluida a WhatsApp** (botón con mensaje pre-armado por producto) | Hoy TODO cierra por WhatsApp; la web alimenta ese canal |
| 5 | Checkout/pedido online con seña 50% (Mercado Pago/transferencia) | Venta directa sin intermediario |
| 6 | Formulario de consulta/presupuesto por técnica | Captura al que no terminó de decidir |

### P1 — Confianza y seguimiento (Fase 2)
| # | Función | Por qué |
|---|---------|---------|
| 7 | **Estado del pedido visible** con el flujo real (Confirmado → En Diseño → En Taller → En Producción → Listo → Completado) | Ataca el dolor #1: perdieron clientes por mal seguimiento |
| 8 | Descuento "web" (comisión de vendedor → descuento online) | Gancho comercial del canal |
| 9 | Testimonios + fotos de trabajos reales | Confianza para el que no conoce el taller |
| 10 | Storytelling: origen del nombre (huarpe, "más") + compromiso ambiental | Identidad diferencial, hoy subexplotada |

### P2 — Automatización (Fase 3)
| # | Función |
|---|---------|
| 11 | Precios dinámicos calculados al vuelo desde reglas del sistema interno |
| 12 | WhatsApp Business + bot de catálogo/presupuestos |
| 13 | Envío a todo el país |
| 14 | Remeras en caja personalizada (producto premium) |

### Prohibido mostrar como activo (en desarrollo)
Envío nacional, bot 24/7, bolsa PEAD, cajas impresas, taller de costura. Solo "próximamente" si suma expectativa. **Nunca** publicar dirección exacta — solo "Guaymallén, Mendoza · retiro coordinado".

---

## 4. Alcance por fases

### Fase 1 — "Vender ya" (4 semanas)
Entra: home de venta, catálogo Firestore, ficha de producto, WhatsApp CTA, formulario de consulta, checkout con seña 50%, marca aplicada (prompt maestro).
Queda afuera: seguimiento visible, testimonios, storytelling, descuento web, todo lo "en desarrollo".
**Entregable:** la web genera pedidos sin intervención manual inicial.

### Fase 2 — "Confianza" (2-3 semanas post-lanzamiento)
Entra: seguimiento de pedido (ficha de estados), testimonios, galería de trabajos, historia de marca, descuento por canal web.
**Entregable:** el cliente recurrente consulta su pedido en la web, no por teléfono.

### Fase 3 — "Automatización"
Entra: precios dinámicos, conexión total con sistema interno, bot WhatsApp, envío nacional.
**Entregable:** una sola fuente de verdad (Firestore) alimenta web y mostrador.

---

## 5. Criterios de éxito medibles

| Métrica | Línea base (hoy) | Objetivo Fase 1 | Cómo se mide |
|---|---|---|---|
| Pedidos iniciados online/semana | 0 | ≥ 5 | Pedidos creados vía web |
| Consultas que llegan con contexto (producto + cantidad) | ~20% | ≥ 70% | Mensajes WhatsApp con payload de producto |
| Tiempo hasta presupuesto enviado | horas (manual) | < 1 h hábil | Timestamp consulta → respuesta |
| Abandono en checkout | n/a | < 60% | Embudo analytics |
| Consultas de seguimiento ("¿cómo va mi pedido?") | frecuentes | −50% tras Fase 2 | Conteo semanal WhatsApp |

---

## 6. Riesgos principales

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Precios desactualizados si la web no lee Firestore | Cotizar mal = perder plata o clientes | P0: catálogo conectado desde el día 1; nunca hardcodear precios |
| Prometer lo que está "en desarrollo" | Frustración + pérdida de confianza | Regla de contenido obligatoria en todo PR |
| Checkout que no contempla "sobre pedido" (sin stock propio) | Vender lo que no se puede entregar en fecha | Cada producto muestra tiempo real 5-15 días y mínimo por técnica |
| Diseño genérico que diluye la marca | Indiferenciación | Prompt maestro + manual 2026 como contrato de diseño |
| Duplicar fuente de verdad (web vs. sistema interno) | Caos operativo | Firestore es la única fuente; la app admin escribe, la web lee |

---

## 8. Decisión de arquitectura (2026-08-31)

**La web consume el proyecto Firebase de la app interna: `studio-4130674340-85ea0`.**

- El proyecto `itap-shop` queda descontinuado para datos de negocio (productos, pedidos, precios).
- La web lee directo de Firestore con las reglas públicas ya existentes (`estado in ['a_pedidos','en_stock']`).
- Los tipos se toman de la app: `PublicProduct`, `Budget`, `ORDER_STATUSES`.
- El motor de precios se porta como paquete compartido (TS puro, sin UI): `apparel-pricer-logic`, `bag-pricer-logic`, `catalog-pricing`, `config-schema` → la web calcula **exactamente como el mostrador**.
- `public-budget-requests` es el canal de entrada de consultas web → llegan al sistema interno sin API intermedia.

**Consecuencia:** no hay backend nuevo, no hay API que mantener, no hay doble fuente de verdad. La app escribe, la web lee.

---

## 9. La regla de oro

> **Si una pantalla no acerca una venta o una consulta concreta, no existe.**
> Cada sección responde: ¿qué vende? ¿qué duda resuelve? ¿a dónde lleva al usuario? Sin respuesta clara, se corta.
