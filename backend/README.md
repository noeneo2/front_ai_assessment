# Backend AI Assessment API

API backend para procesar archivos Excel de evaluaciones de madurez organizacional en IA Generativa.

## Tecnologías

- **FastAPI**: Framework web
- **Python 3.11+**: Lenguaje
- **Docker**: Containerización
- **Firebase Admin SDK**: Base de datos (Firestore)
- **Google Gemini**: IA para recomendaciones
- **Pandas**: Procesamiento de Excel

## Estructura del Proyecto

```
backend/
├── app/
│   ├── main.py                 # FastAPI app principal
│   ├── config/
│   │   ├── firebase.py        # Configuración Firebase
│   │   └── settings.py        # Variables de entorno
│   ├── services/
│   │   ├── excel_processor.py # Procesar Excel
│   │   ├── ai_service.py      # Gemini AI
│   │   └── firestore_service.py # Firestore operations
│   ├── models/
│   │   ├── assessment.py      # Modelos Pydantic
│   │   └── recommendation.py
│   └── utils/
│       ├── calculations.py    # Cálculos de puntajes
│       └── validators.py      # Validaciones
├── config/
│   └── firebase-credentials.json  # Credenciales Firebase (NO SUBIR A GIT)
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env                       # Variables de entorno (NO SUBIR A GIT)
├── .env.example              # Ejemplo de .env
├── .gitignore
└── README.md
```

## Configuración Inicial

### 1. Credenciales de Firebase

1. Descarga las credenciales de Firebase Admin SDK (archivo JSON)
2. Guárdalas en `config/firebase-credentials.json`
3. **IMPORTANTE**: Este archivo NO debe subirse a Git

### 2. Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Firebase
FIREBASE_CREDENTIALS_PATH=./config/firebase-credentials.json

# Google Gemini
GEMINI_API_KEY=tu_api_key_aqui

# App
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
```

### 3. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Cópiala en el archivo `.env`

## Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

```bash
# Construir la imagen
docker-compose build

# Iniciar el servidor
docker-compose up

# El servidor estará disponible en http://localhost:8000
```

### Opción 2: Sin Docker (Desarrollo local)

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints de la API

### POST /api/upload-assessment
Sube y procesa un archivo Excel de evaluación.

**Request:**
- `file`: Archivo Excel (multipart/form-data)
- `company_name`: Nombre de la empresa
- `user_id`: ID del usuario autenticado

**Response:**
```json
{
    "status": "success",
    "project_id": "abc123",
    "assessment_date": "2025-10-20",
    "company_name": "Empresa XYZ",
    "puntaje_general": 4.5,
    "categoria_general": "Pilotaje"
}
```

### GET /api/assessment/{project_id}
Obtiene los datos de un assessment específico.

### GET /api/user/{user_id}/companies
Lista todas las empresas de un usuario.

### GET /api/company/{company_name}/assessments
Lista todos los assessments de una empresa.

## Documentación de la API

Una vez el servidor esté corriendo, visita:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Desarrollo

### Ejecutar tests
```bash
pytest
```

### Linting
```bash
flake8 app/
black app/
```

## Estructura de Firestore

```
users/
  └── {user_id}/
      └── companies/
          └── {company_name}/
              └── assessments/
                  └── {assessment_id}/
                      ├── metadata
                      │   ├── date: "2025-10-20"
                      │   ├── created_at: timestamp
                      │   └── user_id: "..."
                      ├── scores
                      │   ├── puntaje_general: 4.5
                      │   ├── categoria_general: "Pilotaje"
                      │   └── dimensiones: [...]
                      └── recommendations: [...]
```

## Notas de Seguridad

- ✅ Las credenciales de Firebase están en `.gitignore`
- ✅ Las API keys están en variables de entorno
- ✅ CORS configurado solo para el frontend
- ✅ Validación de archivos Excel (tamaño máximo 50MB)
- ✅ Autenticación con Firebase Auth tokens

## Troubleshooting

### Error: "Firebase credentials not found"
- Verifica que el archivo `config/firebase-credentials.json` existe
- Verifica que la ruta en `.env` es correcta

### Error: "Gemini API key invalid"
- Verifica que la API key en `.env` es correcta
- Verifica que la API de Gemini está habilitada en tu proyecto

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en `.env` coincide con tu frontend
- Verifica que el frontend está corriendo en el puerto correcto
