# Backend Setup Instructions

## Paso 1: Configurar Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** (⚙️) → **Cuentas de servicio**
4. Haz clic en **"Generar nueva clave privada"**
5. Se descargará un archivo JSON
6. **Renombra el archivo a `firebase-credentials.json`**
7. **Mueve el archivo a `backend/config/firebase-credentials.json`**

⚠️ **IMPORTANTE**: Este archivo NO debe subirse a Git. Ya está en `.gitignore`.

## Paso 2: Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Haz clic en **"Create API Key"**
3. Copia la API key generada

## Paso 3: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza los valores:
   ```env
   GEMINI_API_KEY=tu_api_key_real_aqui
   ```

## Paso 4: Instalar Dependencias y Ejecutar

### Opción A: Con Docker (Recomendado)

```bash
cd backend
docker-compose up --build
```

El servidor estará disponible en: http://localhost:8000

### Opción B: Sin Docker

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Paso 5: Verificar que Funciona

1. Abre tu navegador en: http://localhost:8000
2. Deberías ver: `{"status": "ok", "message": "AI Assessment API is running"}`
3. Ve a la documentación: http://localhost:8000/docs

## Próximos Pasos

Una vez el backend esté corriendo, necesitas modificar el frontend para que envíe los archivos Excel a este backend en lugar de procesarlos localmente.

Los cambios necesarios en el frontend están documentados en el plan de implementación.
