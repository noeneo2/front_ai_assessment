import logging
import json
from google import genai
from app.config.settings import settings

logger = logging.getLogger(__name__)


class AIService:
    """Service to generate recommendations using Google Gemini"""
    
    def __init__(self):
        """Initialize Gemini AI"""
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = 'gemini-2.5-flash'
        logger.info(f"Gemini AI initialized with {self.model_name}")
    
    async def generate_recommendations(self, puntajes_areas: list, company_sector: str) -> list:
        """
        Generate recommendations based on dimension scores
        
        Args:
            puntajes_areas: List of dimension scores
        
        Returns:
            List of recommendations
        """
        try:
            # Create prompt for Gemini
            prompt = self._create_prompt(puntajes_areas, company_sector)
            
            # Generate recommendations
            logger.info(f"Calling Gemini API for sector: {company_sector}")
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            # Log the raw response for debugging
            logger.info(f"Gemini raw response: {response.text[:500]}...")  # First 500 chars
            
            # Parse response
            recommendations = self._parse_response(response.text, puntajes_areas)
            
            logger.info(f"Generated {len(recommendations)} recommendations")
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            # Return default recommendations if AI fails
            return self._get_default_recommendations(puntajes_areas)
    
    def _create_prompt(self, puntajes_areas: list, company_sector: str) -> str:
        """Create prompt for Gemini"""
        
        # Format scores for prompt
        scores_text = "\n".join([
            f"- {area['nombre']}: {area['puntaje']:.2f}/10 (Nivel: {area['nivel']})"
            for area in puntajes_areas
        ])
        
        prompt = f"""
Eres un consultor experto en transformación digital e IA Generativa especializado en el sector de {company_sector}. Basándote en los siguientes puntajes de madurez organizacional en IA Generativa de una empresa de {company_sector}, genera 6 recomendaciones específicas y accionables (una por cada dimensión).

**Puntajes actuales:**
{scores_text}

**Niveles de madurez:**
- Nivel 1 - Exploración (1.0-1.9): Etapa inicial
- Nivel 2 - Fundamentos (2.0-3.9): Estableciendo bases
- Nivel 3 - Pilotaje (4.0-5.9): Probando casos de uso
- Nivel 4 - Escalamiento (6.0-7.9): Escalando soluciones
- Nivel 5 - Transformación (8.0-10.0): Integración completa

**MATRIZ DE RECOMENDACIONES POR DIMENSIÓN Y NIVEL:**

**ESTRATEGIA:**
- Nivel 1: Sensibilización en IA y diagnóstico inicial para cada área. Workshops "Vision AI" para líderes sobre aplicaciones en el sector (suscripción automatizada, detección de fraude, servicio al cliente).
- Nivel 2: Diseño de estrategia de Gen AI y objetivos de negocio enfocados en mejorar la experiencia del usuario y eficiencia operativa.
- Nivel 3: Creación de Gen AI Lab para pilotos en áreas clave del sector (claims processing, underwriting, customer service).
- Nivel 4: Generación de Dashboards de ROI y KPIs de IA específicos para el sector (reducción de tiempo de claims, precisión en suscripción, satisfacción del cliente).
- Nivel 5: AI-first mindset y cultura data-driven total. Incorporar IA en la Planeación estratégica anual (OKRs, KPIs). Establecer un AI Steering Committee que defina prioridades y KPIs de impacto global en el negocio del sector.

**PERSONAS Y CULTURA:**
- Nivel 1: Talleres de awareness en Gen AI. Buscar generar conciencia inicial sobre qué es IA y generar cultura de datos y oportunidades en el sector.
- Nivel 2: AI Literacy Path (Ruta de Alfabetización en IA). Diseño e implementación de una ruta de aprendizaje modular que nivele a la organización, combinando formación técnica (prompting, herramientas) con habilidades blandas (pensamiento crítico, ética) aplicadas a casos del sector.
- Nivel 3: Product Innovation AI Battle / Hackatones. Programa de AI Champions (AI Circles): comunidades de práctica inter-funcionales enfocadas en innovación en productos del sector.
- Nivel 4: Entrenamiento en Vibe Coding y adopción técnica para equipos de TI y actuariales.
- Nivel 5: Upskilling permanente y adopción organizacional total en todas las áreas.

**GOVERNANCE:**
- Nivel 1: Identificación de roles clave para gobierno. Taller introductorio de Riesgos y sesgos en IA aplicados al sector (discriminación en pricing, sesgos en claims).
- Nivel 2: Definición de políticas y estructura de gobierno. Creación de Comité de AI Governance enfocado en cumplimiento regulatorio del sector.
- Nivel 3: Playbook Responsable Gen AI (riesgos, sesgos, fuga). Auditorías de uso de IA para cumplir con regulaciones del sector y protección de datos.
- Nivel 4: Compliance automatizada en despliegues agénticos para asegurar cumplimiento normativo continuo.
- Nivel 5: Gobierno autónomo y ético basado en IA para toda la operación del sector.

**DATA Y TECNOLOGÍA:**
- Nivel 1: Evaluación de infraestructura y data disponible (datos de pólizas, claims, clientes, actuariales).
- Nivel 2: Habilitación de conectores internos y control de costos. Habilitación de sandbox de experimentación IA para pruebas seguras con datos del sector.
- Nivel 3: Implementación de RAG interno o GPT corporativo con datos históricos de la empresa para consultas y análisis.
- Nivel 4: LLMOps para escalamiento y monitoreo de modelos en producción (detección de fraude, pricing dinámico).
- Nivel 5: Plataforma agnóstica no-code y monitoreo predictivo. Arquitectura híbrida multi-cloud + autoescalamiento cognitivo para soportar picos de demanda (ej. catástrofes naturales).

**PROCESOS:**
- Nivel 1: Workshop mapeo de procesos críticos del negocio del sector (suscripción, emisión, claims, renovaciones).
- Nivel 2: Diseño de roadmap de automatización (HAS) enfocado en procesos de alto volumen del sector.
- Nivel 3: Automatización de procesos prioritarios. Automatización de procesos cross-funcionales (ej. desde cotización hasta emisión de póliza).
- Nivel 4: Integración de agentes en flujos de negocio para automatización inteligente de claims y underwriting.
- Nivel 5: IA integrada al core del negocio. Crear un marco operativo (agentOps Framework) que asegura la automatización del ciclo de vida de agentes y la observabilidad completa de su rendimiento en procesos críticos del sector.

**PROYECTOS:**
- Nivel 1: Identificación de quick wins y pilotos simples (chatbot de atención al cliente, automatización de documentos).
- Nivel 2: Prototipos básicos de valor rápido en áreas como servicio al cliente o procesamiento de documentos.
- Nivel 3: Automatización de la generación de Contenido AI. Analítica de Viabilidad con Plataformas de IA: Monitoreo del posicionamiento de IA en el mercado dentro de un marco de asesores (Lossit Corporation) enfocado en el sector.
- Nivel 4: Conversational E-commerce y Lossit Corporation para proyectos estratégicos de transformación digital en el sector.
- Nivel 5: IA integrada al core del negocio. Crear proyectos estratégicos de IA que generen proyectos estratégicos de IA. Medir valor de negocio continuo (Business Impact Loop) por proyecto para optimización constante.

**INSTRUCCIONES:**
1. Para cada dimensión, identifica el nivel actual según el puntaje
2. Usa la recomendación de la matriz correspondiente como BASE
3. Adapta la recomendación específicamente para una empresa de {company_sector}, considerando:
   - Procesos típicos del sector {company_sector}
   - Desafíos del sector {company_sector}
   - Datos relevantes para {company_sector}
4. Genera una recomendación en formato JSON con los siguientes campos:
   - dimension: nombre de la dimensión
   - title: título accionable y específico para {company_sector} (máximo 80 caracteres)
   - description: descripción detallada de la acción recomendada aplicada al contexto de {company_sector} (máximo 200 caracteres)
   - estimated_time: tiempo estimado en formato "X-Y semanas" o "X-Y meses"
   - priority: "Alta", "Media" o "Baja" basado en el puntaje actual

Las recomendaciones deben ser:
1. Específicas para el sector de {company_sector}
2. Apropiadas para el nivel actual de madurez
3. Enfocadas en subir al siguiente nivel
4. Realistas en términos de tiempo y recursos para una empresa del sector

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
