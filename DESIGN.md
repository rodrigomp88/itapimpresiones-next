---
name: ITAP Impresiones
description: Imprenta online de personalización textil e impresa — serigrafía, DTF, sublimado
colors:
  ocean-blue: "#0185C1"
  ocean-mist: "#02AE9C"
  raspberry-red: "#E01358"
  prussian-blue: "#1A2333"
  deep-saffron: "#FE900B"
  neutral-50: "#f9fafb"
  neutral-100: "#f3f4f6"
  neutral-200: "#e5e7eb"
  neutral-300: "#d1d5db"
  neutral-400: "#9ca3af"
  neutral-500: "#6b7280"
  neutral-600: "#4b5563"
  neutral-700: "#374151"
  neutral-800: "#1f2937"
  neutral-900: "#111827"
  white: "#ffffff"
  black: "#000000"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.1
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.025em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ocean-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#016fa3"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.prussian-blue}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-cta:
    backgroundColor: "{colors.raspberry-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.neutral-800}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: ITAP Impresiones

## Overview

**Creative North Star: "El Socio de Confianza"**

ITAP no es una imprenta más — es el socio creativo que acompaña al cliente desde la primera idea hasta el producto final. El sistema visual transmite cercanía sin perder profesionalismo: colores frescos de la identidad oficial, tipografía moderna y limpia, y una interfaz que invita a actuar sin intimidar.

La personalidad es **profesional pero humana**. No habla desde lo técnico ni desde lo frío corporativo. Habla como alguien que entiende de impresión y quiere ayudarte a materializar tu idea. Los colores del isotipo (Ocean Blue, Ocean Mist, Raspberry Red) conectan lo digital con lo físico — como la serigrafía que deja huella en cada prenda.

**Key Characteristics:**
- Colores oficiales del Manual de Identidad Visual como sistema normativo
- Tipografía Plus Jakarta Sans: moderna, redondeada, cercana
- Superficies limpias con profundidad sutil (sombras y blur, no gradientes agresivos)
- CTAs en Raspberry Red para generar acción
- Dark mode completo con Prussian Blue como base
- Movimiento purposeful: hover suave, transiciones de 200ms

## Colors

La paleta proviene del Manual de Identidad Visual 2026 de ITAP. Cada color tiene un rol definido que se respeta en toda la interfaz.

### Primary — Ocean Blue
- **Ocean Blue** (#0185C1): Color principal del isotipo. Se usa en botones primarios, enlaces, focus rings, elementos de navegación activos, y cualquier elemento que deba destacar como acción principal.

### Secondary — Ocean Mist
- **Ocean Mist** (#02AE9C): Segundo color del isotipo. Acentos frescos, elementos digitales, destacados web. Se usa en progreso de envío gratis, estados de éxito, y elementos de apoyo.

### Tertiary — Raspberry Red
- **Raspberry Red** (#E01358): Color de acción y urgencia. CTAs de compra, precios, promociones, badge del carrito, y elementos que requieren atención inmediata.

### Dark — Prussian Blue
- **Prussian Blue** (#1A2333): Textos principales, títulos, fondos oscuros. Base del dark mode. Transmite seriedad y profesionalismo sin ser negro puro.

### Accent — Deep Saffron
- **Deep Saffron** (#FE900B): Acento cálido para comunicaciones. Promociones, etiquetas destacadas, llamadas visuales. No es parte del isotipo — se usa con moderación.

### Neutral
- **Neutral-50** (#f9fafb): Fondos sutiles, superficies elevadas
- **Neutral-100** (#f3f4f6): Skeleton loaders, fondos de sección
- **Neutral-200** (#e5e7eb): Bordes estándar, divisores
- **Neutral-300** (#d1d5db): Bordes de inputs
- **Neutral-400** (#9ca3af): Placeholders, iconos inactivos
- **Neutral-500** (#6b7280): Texto muted
- **Neutral-600** (#4b5563): Texto secundario
- **Neutral-700** (#374151): Texto oscuro
- **Neutral-800** (#1f2937): Texto principal light mode, superficies dark
- **Neutral-900** (#111827): Background dark mode

### Named Rules

**The Raspberry Red Rule.** El rojo Raspberry se usa solo para acciones de compra y urgencia. No es color de fondo ni de texto. Su rareza en la pantalla es lo que le da poder.

**The Ocean Blue–Ocean Mist Handoff.** Ocean Blue lleva la acción principal; Ocean Mist acompaña el estado de éxito o progreso. Nunca compiten en el mismo elemento.

## Typography

**Display Font:** Plus Jakarta Sans (con system-ui, sans-serif fallback)
**Body Font:** Plus Jakarta Sans (misma familia, pesos distintos)

**Character:** Tipografía geométrica-redondeada que transmite modernidad y cercanía. Los bordes suaves de las letras refuerzan la personalidad "socio de confianza" — profesional pero nunca intimidante.

### Hierarchy
- **Display** (800, clamp(2.5rem, 5vw, 4rem), 1.1): Hero headlines, títulos de página. Solo para impacto inicial.
- **Headline** (700, clamp(1.75rem, 3vw, 2.5rem), 1.2): Títulos de sección. Estructura la página.
- **Title** (700, 1.5rem, 1.3): Títulos de componente, cards, modales.
- **Body** (400, 1rem, 1.6): Texto corrido, descripciones, contenido general. Longitud máxima: 65–75ch.
- **Label** (600, 0.875rem, 0.025em tracking): Botones, chips, etiquetas de categoría, navigation links.

### Named Rules

**The One Weight Rule.** Un elemento nunca usa más de 2 pesos. Display+Bold para hero, Headline+Regular para secciones, Title+Regular para contenido. Más pesos crean ruido visual.

## Layout

**Grid:** Sistema de 12 columnas con max-width de 1440px para layout principal, 1280px para tienda, 1280px para admin.

**Spacing rhythm:** Escala de 8px base. Componentes usan 16px (md), 24px (lg), 32px (xl), 48px (2xl) para padding y márgenes.

**Density:** Modo normal por defecto. Admin panel permite densidad alta con spacing reducido. Mobile-first: breakpoints en sm (640px), md (768px), lg (1024px), xl (1280px).

**Container behavior:** Contenedores centrados con `mx-auto`. Padding lateral: `px-6 lg:px-12`. El navbar y footer se extienden full-width con contenido centrado.

## Elevation & Depth

El sistema usa **sombras sutiles + backdrop-blur** para crear profundidad, no gradientes agresivos. Las superficies se elevan con blur y sombra ligera, no con bordes gruesos.

### Shadow Vocabulary
- **Subtle** (`shadow-sm`): Cards en reposo, inputs, elementos planos
- **Interactive** (`shadow-md`): Hover states, dropdowns
- **Elevated** (`shadow-lg`): CTAs, cards hover, modales pequeños
- **Overlay** (`shadow-xl`, `shadow-2xl`): Modales, sidebars, navigation fixed
- **Colored glow** (`shadow-blue-500/20`): Focus rings, CTA primarios

### Named Rules

**The Blur-By-Default Rule.** Navbar y elementos fixed usan `backdrop-blur-md` + fondo semi-transparente. Nunca fondo sólido opaco en elementos flotantes.

## Shapes

**Corner strategy:** Bordes redondeados progresivos — más pequeño para elementos funcionales (inputs: 8px), más grande para cards y contenedores (12-16px), full para badges y pills.

**Recurring geometry:** Formas rectangulares con esquinas suaves. No hay círculos perfectos excepto badges y avatares. Los bordes dan calidez sin ser infantiles.

**Borders:** Mínimos. Solo para separar (dividers con `border-neutral-200`) o delimitar inputs. Cards usan sombra, no bordes, para elevarse.

## Components

### Buttons
- **Shape:** Rounded-lg (12px radius)
- **Primary:** Ocean Blue background, white text, shadow-blue glow. Padding 12px 24px.
- **Hover:** Background darken 10%, shadow increase, translateY(-1px)
- **Secondary/Outline:** White background, Prussian Blue text, neutral-200 border
- **CTA (Purchase):** Raspberry Red background, white text. Se usa solo para "Comprar", "Agregar al carrito", "Finalizar compra"
- **Sizes:** Large (h-12 px-8), Medium (h-10 px-6), Small (px-4 py-2)

### Cards
- **Corner Style:** Rounded-xl (16px)
- **Background:** White (light) / Neutral-900 (dark)
- **Shadow Strategy:** shadow-sm en reposo, shadow-lg en hover. Colored shadow en dark mode (`shadow-primary/10`)
- **Border:** Neutral-200 en light, neutral-800 en dark
- **Internal Padding:** 24px (lg)
- **Hover effect:** translateY(-4px) con Framer Motion

### Inputs
- **Style:** Border neutral-300, rounded-lg, padding 12px 16px
- **Focus:** Ring-2 ocean-blue/20 + border ocean-blue
- **Error:** Border red-500, text red-600
- **Dark mode:** Background neutral-800, border neutral-700

### Navigation
- **Desktop:** Sticky top, backdrop-blur-md, white/95 background. Links: neutral-600 hover ocean-blue. CTA: rounded-full pill button.
- **Mobile:** Bottom nav fixed, backdrop-blur-xl, gradient background. Active: gradient text (blue→purple). Height: h-20.

### Price Display
- **Color:** Prussian Blue (light) / White (dark)
- **Weight:** font-black (900) para impacto visual
- **Discount:** Raspberry Red with line-through on original

## Do's and Don'ts

### Do:
- **Do** use Ocean Blue for primary actions — it's the brand anchor
- **Do** use Raspberry Red sparingly — only for purchase/urgency CTAs
- **Do** use Plus Jakarta Sans at weight 700-800 for headings
- **Do** apply backdrop-blur on fixed/sticky elements
- **Do** use shadow-sm for resting cards, shadow-lg for hover states
- **Do** maintain 8px spacing rhythm across all components
- **Do** use Prussian Blue as the dark mode base, not pure black

### Don't:
- **Don't** use Raspberry Red for non-purchase actions — it loses power
- **Don't** mix more than 2 font weights in a single component
- **Don't** use gradients on buttons — keep them flat and solid
- **Don't** apply thick borders on cards — use shadows for elevation
- **Don't** use pure black (#000) for text — always use Prussian Blue or neutral-800
- **Don't** nest cards inside cards — use spacing and shadows instead
- **Don't** use bounce or elastic easing — keep transitions subtle and professional
