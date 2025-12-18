# 🖨️ Itap Impresiones - E-commerce de Productos Personalizados

## 📋 **Descripción del Proyecto**

Itap Impresiones es un e-commerce completo desarrollado en Next.js para venta de productos personalizados como gorras, remeras, buzos, bolsas y más. Incluye sistema de autenticación, gestión de productos, carrito de compras, checkout con MercadoPago y panel de administración.

---

## 🚀 **Tecnologías Utilizadas**

### **Frontend:**
- **Next.js 16** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animaciones
- **Redux Toolkit** - Estado global
- **React Redux** - Gestión de estado

### **Backend/Servicios:**
- **Firebase Firestore** - Base de datos
- **Firebase Auth** - Autenticación
- **Firebase Functions** - Serverless functions
- **MercadoPago** - Procesamiento de pagos
- **NextAuth.js** - Autenticación Next.js

### **Testing y Calidad:**
- **Jest** - Testing framework
- **Playwright** - E2E testing
- **Lighthouse** - Performance testing

---

## 📦 **Instalación y Configuración**

### **Prerrequisitos:**
- Node.js 18+
- npm o pnpm
- Cuenta Firebase
- Cuenta MercadoPago (para pagos)

### **Instalación:**

```bash
# Clonar el repositorio
git clone https://github.com/rodrigomp88/itapimpresiones-next.git
cd itapimpresiones-next

# Instalar dependencias
npm install
# o
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### **Variables de Entorno Requeridas:**

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin (para server-side)
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY=tu_private_key
FIREBASE_CLIENT_EMAIL=tu_client_email

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_nextauth_secret

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# MercadoPago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_mp_public_key
MERCADOPAGO_ACCESS_TOKEN=tu_mp_access_token
```

---

## 🎯 **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Testing
npm run test         # Ejecuta tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con coverage
npm run e2e          # Tests E2E con Playwright

# Linting y Quality
npm run lint         # ESLint
npm run type-check   # Verificación de tipos
```

---

## 🏗️ **Estructura del Proyecto**

```
📁 src/
├── 📁 app/                    # App Router de Next.js
│   ├── 📁 (public)/          # Rutas públicas
│   │   ├── 📁 page.tsx       # Página de inicio
│   │   ├── 📁 tienda/        # Catálogo de productos
│   │   ├── 📁 producto/      # Detalle de producto
│   │   ├── 📁 bolsas/        # Productos bolsas
│   │   └── 📁 indumentaria/  # Productos indumentaria
│   ├── 📁 (checkout)/        # Proceso de compra
│   ├── 📁 auth/              # Páginas de autenticación
│   ├── 📁 admin/             # Panel de administración
│   └── 📁 api/               # API routes
├── 📁 components/            # Componentes React
│   ├── 📁 Mobile/           # Componentes móviles
│   ├── 📁 NavBar/           # Navegación
│   ├── 📁 Shop/             # Componentes de tienda
│   └── 📁 Admin/            # Componentes admin
├── 📁 hooks/                # Custom hooks
├── 📁 lib/                  # Utilidades y configuraciones
├── 📁 redux/                # Estado global Redux
├── 📁 types/                # Definiciones de tipos
└── 📁 utils/                # Funciones utilitarias
```

---

## 🎨 **Características Principales**

### **🛒 E-commerce:**
- Catálogo de productos con filtros
- Carrito de compras
- Checkout con MercadoPago
- Gestión de inventario
- Sistema de favoritos

### **👤 Autenticación:**
- Login con email/contraseña
- Google OAuth
- Registro de usuarios
- Gestión de sesiones

### **📱 Responsive:**
- Diseño mobile-first
- Botonera móvil optimizada
- Progressive Web App (PWA)

### **🔧 Administración:**
- Panel de administración
- Gestión de productos
- Análisis de ventas
- Gestión de pedidos

---

## 🧪 **Testing**

### **Tests Unitarios:**
```bash
npm run test
```

### **Tests E2E:**
```bash
npm run e2e
```

### **Performance:**
```bash
npm run lighthouse
```

---

## 🚀 **Deployment**

### **Vercel (Recomendado):**
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### **Manual:**
```bash
npm run build
npm run start
```

---

## 📊 **Estado del Proyecto**

### **✅ Completado:**
- Botonera móvil rediseñada con efectos modernos
- Sistema de autenticación completo
- E-commerce funcional
- Panel de administración
- Tests unitarios y E2E
- PWA configurada

### **🔄 En Desarrollo:**
- Optimizaciones de performance
- Nuevas funcionalidades
- Mejoras de UX/UI

---

## 🤝 **Contribución**

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 **Licencia**

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

## 📞 **Contacto**

- **Desarrollador:** Rodrigo Pérez
- **Email:** rodrigomp88@gmail.com
- **Repositorio:** https://github.com/rodrigomp88/itapimpresiones-next

---

## 📝 **Changelog**

### **v2.0.0** (Actual)
- ✅ Botonera móvil rediseñada
- ✅ Optimizaciones de performance
- ✅ Tests E2E con Playwright
- ✅ PWA mejorada

### **v1.0.0**
- ✅ E-commerce básico
- ✅ Autenticación Firebase
- ✅ MercadoPago integration
- ✅ Panel de administración

---

*Última actualización: 18/12/2025*
