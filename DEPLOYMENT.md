# 🚀 Guía de Deployment - Itap Impresiones

## 📋 Requisitos Previos

### 🔐 Variables de Entorno
Asegúrate de configurar estas variables en tu plataforma de deployment:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# Admin Configuration
NEXT_PUBLIC_USER_ADMIN=admin@example.com

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=your_access_token

# Mailchimp
MAILCHIMP_API_KEY=your_api_key
MAILCHIMP_SERVER_PREFIX=your_server_prefix
MAILCHIMP_AUDIENCE_ID=your_audience_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SITE_URL=https://yourdomain.com
```

### 🗄️ Firebase Admin SDK
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a Project Settings > Service Accounts
4. Genera una nueva private key
5. Coloca el archivo JSON en `functions/service-account.json`

## 🌐 Platforms de Deployment

### Vercel (Recomendado)

#### Deploy Automático con GitHub
1. Conecta tu repositorio de GitHub a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. El CI/CD se ejecutará automáticamente en cada push

#### Deploy Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Netlify

#### Deploy Automático
1. Conecta tu repositorio de GitHub a Netlify
2. Configura las variables de entorno en Netlify Dashboard
3. Configura el build command: `npm run build`
4. Configura el publish directory: `.next`

### Otros Providers

#### Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway deploy
```

#### Render
1. Conecta tu repositorio de Git
2. Selecciona "Static Site"
3. Configura build command: `npm run build`
4. Configura publish directory: `.next`

## 🔧 Configuración del Build

### Next.js Configuration
El proyecto incluye optimizaciones avanzadas en `next.config.ts`:
- ✅ Content Security Policy
- ✅ Bundle splitting optimizado
- ✅ Compresión automática
- ✅ Headers de seguridad

### PWA Configuration
- ✅ Service Worker automático
- ✅ Manifest.json configurado
- ✅ Cache strategies implementadas

## 📊 Monitoreo Post-Deployment

### Google Analytics 4
- ✅ E-commerce tracking configurado
- ✅ Conversión tracking implementado
- ✅ Dashboard administrativo disponible

### Lighthouse CI
- ✅ Tests automáticos configurados en CI/CD
- ✅ Métricas de performance monitoreadas
- ✅ Alertas para scores bajos

### Error Monitoring
Para producción, considera agregar:
```bash
npm install @sentry/nextjs
```

## 🔄 Actualizaciones y Rollback

### Con Vercel
```bash
# Ver deployments
vercel deployments ls

# Rollback a versión anterior
vercel rollback [deployment-id]
```

### Con GitHub Actions
- ✅ CI/CD automático configurado
- ✅ Tests automáticos en cada PR
- ✅ Deploy automático a staging/develop

## 🚨 Troubleshooting

### Problemas Comunes

#### Build Fails
```bash
# Limpiar cache
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables
```bash
# Verificar variables en deployment
vercel env ls
```

#### Firebase Connection
```bash
# Verificar Firebase config
firebase projects:list
```

### Logs de Deployment
```bash
# Vercel logs
vercel logs

# GitHub Actions logs
# Ve a Actions tab en tu repositorio
```

## 📈 Optimizaciones de Performance

### CDN Configuration
- ✅ Assets estáticos optimizados
- ✅ Images con WebP/AVIF
- ✅ Cache headers configurados

### Database Optimization
- ✅ Firestore indexes optimizados
- ✅ Queries eficientes implementadas
- ✅ Caching implementado

## 🔒 Seguridad

### Headers Implementados
- ✅ Content Security Policy
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ XSS Protection
- ✅ Referrer Policy

### Rate Limiting
Considera implementar rate limiting a nivel de servidor o CDN.

## 📞 Soporte

Para problemas de deployment:
1. Revisa los logs de la plataforma
2. Verifica las variables de entorno
3. Revisa la configuración de Firebase
4. Consulta la documentación de Next.js

---

**¡Tu aplicación está lista para producción! 🚀**
