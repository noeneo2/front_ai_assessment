import pandas as pd
import io
from datetime import datetime
import logging
from app.utils.calculations import calculate_dimension_score, determine_level

logger = logging.getLogger(__name__)


class ExcelProcessor:
    """Service to process Excel assessment files"""
    
    # Column mappings for the 60 questions (AB to CI)
    # Each dimension has 10 questions
    DIMENSION_COLUMNS = {
        "Personas y Cultura": list(range(27, 37)),  # Columns AB-AK (indices 27-36)
        "Data & Tecnología": list(range(37, 47)),   # Columns AL-AU (indices 37-46)
        "Procesos": list(range(47, 57)),            # Columns AV-BE (indices 47-56)
        "Governance": list(range(57, 67)),          # Columns BF-BO (indices 57-66)
        "Proyectos": list(range(67, 77)),           # Columns BP-BY (indices 67-76)
        "Estrategia": list(range(77, 87)),          # Columns BZ-CI (indices 77-86)
    }
    
    DATE_COLUMN = 2  # Column C (index 2)
    
    def process_excel(self, file_content: bytes) -> dict:
        """
        Process Excel file and extract assessment data
        
        Args:
            file_content: Excel file content as bytes
        
        Returns:
            Dictionary with assessment data including scores and levels
        """
        try:
            # Read Excel file
            df = pd.read_excel(io.BytesIO(file_content))
            logger.info(f"Excel file loaded. Shape: {df.shape}")
            
            # Extract assessment date from first row, column C
            assessment_date = self._extract_date(df)
            
            # Calculate scores for each dimension
            puntajes_areas = []
            for dimension_name, column_indices in self.DIMENSION_COLUMNS.items():
                score = self._calculate_dimension_score(df, column_indices)
                level = determine_level(score)
                
                puntajes_areas.append({
                    "nombre": dimension_name,
                    "puntaje": round(score, 2),
                    "nivel": level
                })
            
            # Calculate general score (average of all dimensions)
            puntaje_general = sum(area["puntaje"] for area in puntajes_areas) / len(puntajes_areas)
            categoria_general = determine_level(puntaje_general)
            
            # Determine category style for UI
            categoria_estilo = self._get_category_style(categoria_general)
            
            # Get level descriptions
            niveles = self._get_level_descriptions()
            
            result = {
                "assessment_date": assessment_date,
                "puntaje_general": round(puntaje_general, 2),
                "categoria_general": categoria_general,
                "categoria_estilo": categoria_estilo,
                "descripcion_general": self._get_category_description(categoria_general),
                "puntajes_areas": puntajes_areas,
                "niveles": niveles
            }
            
            logger.info(f"Assessment processed successfully. General score: {puntaje_general:.2f}")
            return result
            
        except Exception as e:
            logger.error(f"Error processing Excel file: {str(e)}")
            raise
    
    def _extract_date(self, df: pd.DataFrame) -> str:
        """Extract assessment date from first row, column C"""
        try:
            date_value = df.iloc[0, self.DATE_COLUMN]
            
            # Handle different date formats
            if isinstance(date_value, pd.Timestamp):
                return date_value.strftime("%Y-%m-%d")
            elif isinstance(date_value, str):
                # Try to parse string date
                parsed_date = pd.to_datetime(date_value)
                return parsed_date.strftime("%Y-%m-%d")
            else:
                # Default to current date if can't parse
                logger.warning("Could not parse date from Excel, using current date")
                return datetime.now().strftime("%Y-%m-%d")
                
        except Exception as e:
            logger.warning(f"Error extracting date: {str(e)}, using current date")
            return datetime.now().strftime("%Y-%m-%d")
    
    def _calculate_dimension_score(self, df: pd.DataFrame, column_indices: list) -> float:
        """
        Calculate score for a dimension
        
        Formula: sum(10 questions) / 5
        Result range: 1-10
        """
        try:
            # Get all responses for this dimension across all rows (employees)
            dimension_data = df.iloc[:, column_indices]
            
            # Calculate average score across all employees and questions
            # Each question is 1-5, we sum 10 questions and divide by 5 to get 1-10 scale
            total_sum = dimension_data.sum().sum()
            total_count = dimension_data.count().sum()
            
            if total_count == 0:
                return 0.0
            
            # Average score per question
            avg_per_question = total_sum / total_count
            
            # Scale to 1-10 (multiply by 2 since questions are 1-5)
            score = avg_per_question * 2
            
            return score
            
        except Exception as e:
            logger.error(f"Error calculating dimension score: {str(e)}")
            return 0.0
    
    def _get_category_style(self, categoria: str) -> str:
        """Get CSS style class for category"""
        styles = {
            "Exploración": "exploracion",
            "Fundamentos": "fundamentos",
            "Pilotaje": "pilotaje",
            "Escalamiento": "escalamiento",
            "Transformación": "transformacion"
        }
        return styles.get(categoria, "")
    
    def _get_category_description(self, categoria: str) -> str:
        """Get description for category"""
        descriptions = {
            "Exploración": "Tu organización está en las etapas iniciales de adopción de IA Generativa.",
            "Fundamentos": "Tu organización está estableciendo las bases para la adopción de IA Generativa.",
            "Pilotaje": "Tu organización está probando casos de uso de IA Generativa en áreas específicas.",
            "Escalamiento": "Tu organización está escalando el uso de IA Generativa a múltiples áreas.",
            "Transformación": "Tu organización ha integrado completamente la IA Generativa en su operación."
        }
        return descriptions.get(categoria, "No hay descripción disponible.")
    
    def _get_level_descriptions(self) -> list:
        """Get descriptions for all maturity levels"""
        return [
            {
                "nombre": "Exploración (1.0 - 1.9)",
                "descripcion": "Etapa inicial de exploración y experimentación con IA Generativa."
            },
            {
                "nombre": "Fundamentos (2.0 - 3.9)",
                "descripcion": "Establecimiento de bases y capacidades fundamentales en IA Generativa."
            },
            {
                "nombre": "Pilotaje (4.0 - 5.9)",
                "descripcion": "Implementación de pilotos y casos de uso específicos."
            },
            {
                "nombre": "Escalamiento (6.0 - 7.9)",
                "descripcion": "Escalamiento de soluciones a múltiples áreas de la organización."
            },
            {
                "nombre": "Transformación (8.0 - 10.0)",
                "descripcion": "Transformación completa con IA Generativa integrada en toda la operación."
            }
        ]
