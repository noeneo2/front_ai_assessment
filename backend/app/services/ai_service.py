import google.generativeai as genai
from app.config.settings import settings
import logging
import json

logger = logging.getLogger(__name__)


class AIService:
    """Service to generate recommendations using Google Gemini"""
    
    def __init__(self):
        """Initialize Gemini AI"""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini AI initialized")
    
    async def generate_recommendations(self, puntajes_areas: list) -> list:
        """
        Generate recommendations based on dimension scores
        
        Args:
            puntajes_areas: List of dimension scores
        
        Returns:
            List of recommendations
        """
        try:
            # Create prompt for Gemini
            prompt = self._create_prompt(puntajes_areas)
            
            # Generate recommendations
            logger.info("Calling Gemini API...")
            response = self.model.generate_content(prompt)
            
            # Parse response
            recommendations = self._parse_response(response.text, puntajes_areas)
            
            logger.info(f"Generated {len(recommendations)} recommendations")
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            # Return default recommendations if AI fails
            return self._get_default_recommendations(puntajes_areas)
    
    def _create_prompt(self, puntajes_areas: list) -> str:
        """Create prompt for Gemini"""
        
        # Format scores for prompt
        scores_text = "\n".join([
            f"- {area['nombre']}: {area['puntaje']:.2f}/10 (Nivel: {area['nivel']})"
            for area in puntajes_areas
        ])
        
        prompt = f"""
Eres un consultor experto en transformación digital e IA Generativa. Basándote en los siguientes puntajes de madurez organizacional en IA Generativa, genera 6 recomendaciones específicas y accionables (una por cada dimensión).

**Puntajes actuales:**
{scores_text}

**Niveles de madurez:**
- Exploración (1.0-1.9): Etapa inicial
- Fundamentos (2.0-3.9): Estableciendo bases
- Pilotaje (4.0-5.9): Probando casos de uso
- Escalamiento (6.0-7.9): Escalando soluciones
- Transformación (8.0-10.0): Integración completa

Para cada dimensión, genera una recomendación en formato JSON con los siguientes campos:
- dimension: nombre de la dimensión
- title: título accionable y específico (máximo 80 caracteres)
- description: descripción detallada de la acción recomendada (máximo 200 caracteres)
- estimated_time: tiempo estimado en formato "X-Y semanas" o "X-Y meses"
- priority: "Alta", "Media" o "Baja" basado en el puntaje actual

Las recomendaciones deben ser:
1. Específicas y accionables
2. Apropiadas para el nivel actual de madurez
3. Enfocadas en subir al siguiente nivel
4. Realistas en términos de tiempo y recursos

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional.
"""
        return prompt
    
    def _parse_response(self, response_text: str, puntajes_areas: list) -> list:
        """Parse Gemini response into recommendations"""
        try:
            # Try to extract JSON from response
            # Gemini sometimes adds markdown formatting
            response_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON
            recommendations = json.loads(response_text)
            
            # Validate and ensure we have 6 recommendations
            if not isinstance(recommendations, list) or len(recommendations) != 6:
                logger.warning("Invalid number of recommendations from AI, using defaults")
                return self._get_default_recommendations(puntajes_areas)
            
            return recommendations
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON from Gemini: {str(e)}")
            logger.error(f"Response text: {response_text}")
            return self._get_default_recommendations(puntajes_areas)
    
    def _get_default_recommendations(self, puntajes_areas: list) -> list:
        """Get default recommendations if AI fails"""
        
        default_templates = {
            "Personas y Cultura": {
                "title": "Desarrollar programa de capacitación en IA Generativa",
                "description": "Implementar programa de formación para equipos en uso de herramientas de IA Generativa y mejores prácticas.",
                "estimated_time": "2-3 meses",
            },
            "Data & Tecnología": {
                "title": "Establecer infraestructura de datos para IA",
                "description": "Consolidar fuentes de datos y establecer pipelines para alimentar modelos de IA Generativa.",
                "estimated_time": "3-4 meses",
            },
            "Procesos": {
                "title": "Rediseñar procesos clave con IA",
                "description": "Identificar y rediseñar 3-5 procesos críticos integrando capacidades de IA Generativa.",
                "estimated_time": "2-3 meses",
            },
            "Governance": {
                "title": "Implementar marco de gobernanza de IA",
                "description": "Establecer políticas, roles y responsabilidades para el uso ético y seguro de IA Generativa.",
                "estimated_time": "1-2 meses",
            },
            "Proyectos": {
                "title": "Lanzar pilotos de IA en áreas prioritarias",
                "description": "Identificar casos de uso de alto impacto y ejecutar pilotos con métricas claras de éxito.",
                "estimated_time": "3-4 meses",
            },
            "Estrategia": {
                "title": "Definir roadmap estratégico de IA",
                "description": "Crear plan estratégico a 12-18 meses con objetivos, inversiones y KPIs para IA Generativa.",
                "estimated_time": "1-2 meses",
            }
        }
        
        recommendations = []
        for area in puntajes_areas:
            template = default_templates.get(area['nombre'], {
                "title": f"Mejorar {area['nombre']}",
                "description": f"Implementar iniciativas para mejorar la madurez en {area['nombre']}.",
                "estimated_time": "2-3 meses",
            })
            
            # Determine priority based on score
            if area['puntaje'] < 3.0:
                priority = "Alta"
            elif area['puntaje'] < 6.0:
                priority = "Media"
            else:
                priority = "Baja"
            
            recommendations.append({
                "dimension": area['nombre'],
                "title": template['title'],
                "description": template['description'],
                "estimated_time": template['estimated_time'],
                "priority": priority
            })
        
        return recommendations
