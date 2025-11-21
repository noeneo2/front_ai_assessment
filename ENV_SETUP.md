# Configuración de Variables de Entorno

Este proyecto requiere configurar variables de entorno para funcionar correctamente. Sigue estos pasos:

## Frontend

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza los valores de ejemplo con tus credenciales reales de Firebase:
   ```
   REACT_APP_FIREBASE_API_KEY=tu_api_key_aqui
   REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   REACT_APP_FIREBASE_APP_ID=tu_app_id
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   npm start
   ```

## Backend

1. Navega a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edita el archivo `.env` y reemplaza los valores:
   ```
   GEMINI_API_KEY=tu_gemini_api_key_aqui
   ```

4. Coloca tu archivo de credenciales de Firebase en `backend/config/firebase-credentials.json`

5. Reinicia el backend:
   ```bash
   docker-compose up --build
   ```

## Archivos Protegidos

Los siguientes archivos están en `.gitignore` y **NO se subirán a GitHub**:
- `.env` (frontend y backend)
- `backend/config/firebase-credentials.json`

**IMPORTANTE**: Nunca subas estos archivos a GitHub. Solo comparte los archivos `.env.example` como plantilla.

## Obtener Credenciales

### Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a Project Settings > General
4. Copia las credenciales de "Your apps" > "SDK setup and configuration"

### Google Gemini
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala en `GEMINI_API_KEY`
