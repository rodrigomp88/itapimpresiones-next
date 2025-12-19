# 🚀 Guía de Deployment en Vercel - Itap Impresiones

## 📋 Pasos para Deploy en Producción

### **Paso 1: Preparación del Repositorio**
✅ **Ya completado**: Tu código está en GitHub y sincronizado
- Repositorio: `https://github.com/rodrigomp88/itapimpresiones-next.git`
- Rama principal: `desarrollo`
- Último commit: v2.1.0 con mejoras de accesibilidad

### **Paso 2: Crear Cuenta en Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub
3. Autoriza acceso a tus repositorios

### **Paso 3: Crear Nuevo Proyecto**
1. En Vercel Dashboard, haz clic en "New Project"
2. Selecciona "Import Git Repository"
3. Busca y selecciona `itapimpresiones-next`
4. Haz clic en "Import"

### **Paso 4: Configuración del Proyecto**
**Configuración Automática (Recomendada):**
- **Framework Preset**: Next.js (detectado automáticamente)
- **Root Directory**: `/` (raíz del proyecto)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### **Paso 5: Variables de Entorno CRÍTICAS**
**En Vercel Dashboard > Settings > Environment Variables, agrega:**

```env
# === FIREBASE CONFIGURATION ===
NEXT_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# === AUTHENTICATION ===
NEXTAUTH_SECRET=genera_una_secret_aleatoria_aqui
NEXTAUTH_URL=https://tu-proyecto.vercel.app

# === MERCADOPAGO ===
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=tu_public_key_de_mp
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_de_mp

# === ADMIN ===
NEXT_PUBLIC_USER_ADMIN=tu_email_admin@ejemplo.com

# === SITE ===
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
SITE_URL=https://tu-proyecto.vercel.app
```

**⚠️ IMPORTANTE**: Necesitas obtener estas variables de:
- **Firebase**: Console > Project Settings > General > Your apps
- **MercadoPago**: Panel de MercadoPago > Credenciales
- **NEXTAUTH_SECRET**: Genera una cadena aleatoria de 32+ caracteres

### **Paso 6: Deploy**
1. Haz clic en "Deploy" 
2. Vercel ejecutará el build automáticamente
3. Duración estimada: 3-5 minutos
4. Obtendrás una URL: `https://tu-proyecto-abc123.vercel.app`

### **Paso 7: Verificación Post-Deploy**
**Prueba estas funcionalidades:**
- ✅ Página de inicio carga correctamente
- ✅ Navegación entre secciones
- ✅ Registro/Login de usuarios
- ✅ Carrito de compras
- ✅ Panel de administración (`/admin`)
- ✅ Pagos con MercadoPago (en modo test)

## 🔧 Configuraciones Adicionales

### **Dominio Personalizado (Opcional)**
1. Vercel Dashboard > Settings > Domains
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones de Vercel

### **Variables de Entorno para Producción**
- Production: Variables del paso 5
- Preview: Mismas variables
- Development: Variables locales

### **Configuración de Firebase Admin (Para funciones server-side)**
Si usas Firebase Functions, necesitas:
1. Firebase Console > Project Settings > Service Accounts
2. Generar nueva private key
3. Agregar como variable de entorno: `FIREBASE_SERVICE_ACCOUNT`

## 🔄 Updates Automáticos

**Cada vez que hagas commit y push a la rama `desarrollo`:**
1. Vercel detectará los cambios automáticamente
2. Ejecutará el build y deploy
3. Actualizará la URL de producción
4. Notificaciones por email si hay errores

## 🚨 Troubleshooting Común

### **Build Failures**
```bash
# Limpiar y reinstalar
rm -rf .next node_modules
npm install
npm run build
```

### **Variables de Entorno**
- Verifica que todas las variables estén configuradas
- Revisa que no haya espacios extra
- NEXTAUTH_URL debe coincidir con el dominio de producción

### **Firebase Connection**
- Verifica que las credenciales sean correctas
- Asegúrate de que el proyecto Firebase esté activo
- Revisa las reglas de Firestore

### **MercadoPago**
- Usa credenciales de test para desarrollo
- Para producción, cambia a credenciales reales

## 📊 Monitoreo Post-Deploy

### **Vercel Analytics**
- Ve a Analytics tab en tu proyecto
- Monitorea performance y errores

### **Logs**
- Vercel Dashboard > Functions > View Function Logs
- Revisa errores en tiempo real

### **Lighthouse Scores**
- Vercel incluye análisis automático de performance
- Busca scores >90 para todas las métricas

## ✅ Checklist Final

- [ ] Cuenta de Vercel creada y conectada a GitHub
- [ ] Proyecto importado desde GitHub
- [ ] Todas las variables de entorno configuradas
- [ ] Build exitoso sin errores
- [ ] Sitio accesible en URL de producción
- [ ] Funcionalidades básicas probadas
- [ ] Panel de administración accesible
- [ ] Configuración de dominio personalizado (opcional)

---

**🎉 ¡Tu aplicación estará disponible en producción en menos de 10 minutos!**

*Guía creada: 19/12/2025*
