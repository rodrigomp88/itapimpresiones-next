# 🔐 Verificación de Variables de Entorno NextAuth

## Variables Requeridas para NextAuth:

### Google OAuth:
```env
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
```

### NextAuth:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_nextauth_secret_aqui
```

### Firebase Admin (si usas):
```env
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY=tu_private_key
FIREBASE_CLIENT_EMAIL=tu_client_email
```

## 📍 Ubicación del archivo .env:
- `.env.local` (desarrollo)
- `.env` (producción)

## 🔍 Para verificar si están configuradas:
```bash
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET
```

## ✅ Solución:
1. Verificar que todas las variables estén configuradas
2. Reiniciar el servidor de desarrollo
3. Limpiar cache: `npm run dev -- --turbo`
