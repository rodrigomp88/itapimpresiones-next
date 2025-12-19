# 🔧 Configuración de Variables de Entorno para Vercel

## 📋 Variables a Configurar

**En Vercel Dashboard > Settings > Environment Variables, agrega estas variables:**

### **🔐 Autenticación**
```
NEXTAUTH_SECRET=tu_secret_generado_aqui
NEXTAUTH_URL=https://tu-proyecto.vercel.app

GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### **🔥 Firebase (Frontend)**
```
NEXT_PUBLIC_FIREBASE_APIKEY=tu_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECTID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APPID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

### **👤 Admin**
```
NEXT_PUBLIC_USER_ADMIN=tu_email_admin@ejemplo.com
NEXT_PUBLIC_ADMIN_UID=tu_admin_uid
```

### **💳 MercadoPago**
```
MERCADO_PAGO_ACCESS_TOKEN=tu_access_token_de_mp
NEXT_PUBLIC_BASE_URL=https://tu-proyecto.vercel.app
```

### **🔥 Firebase Admin (JSON)**
```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"tu_project_id","private_key_id":"tu_private_key_id","private_key":"-----BEGIN PRIVATE KEY-----\n...tu_private_key_aqui...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxx@tu_proyecto.iam.gserviceaccount.com","client_id":"tu_client_id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx%40tu_proyecto.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

## 🔑 Cómo Obtener las Credenciales

### **Firebase:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Project Settings > General > Your apps
4. Copia la configuración

### **Google OAuth:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services > Credentials
3. Crea o selecciona una credencial OAuth 2.0

### **MercadoPago:**
1. Ve a tu panel de [MercadoPago](https://www.mercadopago.com.ar/developers)
2. Credenciales > Copia tu Access Token

### **Firebase Admin:**
1. Firebase Console > Project Settings > Service Accounts
2. Generate new private key

## ⚠️ **IMPORTANTE: Seguridad**

**❌ NUNCA compartas estas credenciales públicamente**
**✅ Usa solo valores reales en tu entorno de producción**
**✅ Mantén el archivo `.env.local` en `.gitignore`**

## 🚀 **Pasos para Vercel**

1. **Crea tu proyecto en Vercel**
2. **Importa desde GitHub**
3. **Configura cada variable de entorno EXACTAMENTE como están arriba**
4. **Reemplaza `tu_*` con tus valores reales**
5. **Haz clic en "Deploy"**

## ✅ **Confirmación**

**✅ Todas las variables necesarias están documentadas**
**✅ Guía segura sin exponer credenciales reales**
**✅ Instrucciones claras para obtener cada credencial**

---

*Para deployment seguro en producción*
