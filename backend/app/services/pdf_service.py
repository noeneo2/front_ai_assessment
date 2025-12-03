from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class PDFService:
    """Service for generating PDF reports from assessment data"""

    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#000033'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))

        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#000033'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        ))

        # Body style
        self.styles.add(ParagraphStyle(
            name='CustomBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        ))

    def generate_assessment_pdf(self, assessment_data: dict, company_name: str) -> BytesIO:
        """
        Generate a PDF report from assessment data
        
        Args:
            assessment_data: Dictionary containing assessment results
            company_name: Name of the company
            
        Returns:
            BytesIO object containing the PDF
        """
        try:
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4,
                                    rightMargin=72, leftMargin=72,
                                    topMargin=72, bottomMargin=18)

            # Container for the 'Flowable' objects
            elements = []

            # Add header
            elements.extend(self._create_header(company_name, assessment_data))

            # Add executive summary
            elements.extend(self._create_executive_summary(assessment_data))

            # Add scores by area
            elements.extend(self._create_areas_section(assessment_data))

            # Add maturity levels explanation
            elements.extend(self._create_levels_section(assessment_data))

            # Page break before recommendations
            elements.append(PageBreak())

            # Add recommendations
            elements.extend(self._create_recommendations_section(assessment_data))

            # Build PDF
            doc.build(elements)

            buffer.seek(0)
            return buffer

        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}")
            raise

    def _create_header(self, company_name: str, assessment_data: dict):
        """Create PDF header"""
        elements = []

        # Title
        title = Paragraph(f"Reporte de Madurez Organizacional<br/>Gen AI", 
                         self.styles['CustomTitle'])
        elements.append(title)
        elements.append(Spacer(1, 12))

        # Company name and date
        company_para = Paragraph(f"<b>Empresa:</b> {company_name}", 
                                self.styles['CustomBody'])
        elements.append(company_para)

        date_str = assessment_data.get('assessment_date', datetime.now().strftime('%Y-%m-%d'))
        date_para = Paragraph(f"<b>Fecha de evaluación:</b> {date_str}", 
                             self.styles['CustomBody'])
        elements.append(date_para)
        elements.append(Spacer(1, 20))

        return elements

    def _create_executive_summary(self, assessment_data: dict):
        """Create executive summary section"""
        elements = []

        elements.append(Paragraph("Resumen Ejecutivo", self.styles['CustomSubtitle']))

        # Overall score
        puntaje_general = assessment_data.get('puntaje_general', 0)
        categoria_general = assessment_data.get('categoria_general', 'N/A')
        descripcion_general = assessment_data.get('descripcion_general', '')

        score_para = Paragraph(
            f"<b>Puntuación General:</b> {puntaje_general:.2f}/10.0<br/>"
            f"<b>Nivel de Madurez:</b> {categoria_general}<br/><br/>"
            f"{descripcion_general}",
            self.styles['CustomBody']
        )
        elements.append(score_para)
        elements.append(Spacer(1, 20))

        return elements

    def _create_areas_section(self, assessment_data: dict):
        """Create areas scores section"""
        elements = []

        elements.append(Paragraph("Puntuación por Áreas", self.styles['CustomSubtitle']))

        puntajes_areas = assessment_data.get('puntajes_areas', [])

        # Create table data
        data = [['Área', 'Puntuación', 'Nivel']]
        for area in puntajes_areas:
            data.append([
                area.get('nombre', 'N/A'),
                f"{area.get('puntaje', 0):.2f}",
                area.get('nivel', 'N/A')
            ])

        # Create table
        table = Table(data, colWidths=[3*inch, 1.5*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#000033')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey])
        ]))

        elements.append(table)
        elements.append(Spacer(1, 20))

        return elements

    def _create_levels_section(self, assessment_data: dict):
        """Create maturity levels explanation section"""
        elements = []

        elements.append(Paragraph("¿Qué implica cada nivel?", self.styles['CustomSubtitle']))

        niveles = assessment_data.get('niveles', [])
        for nivel in niveles:
            nombre = nivel.get('nombre', 'N/A')
            descripcion = nivel.get('descripcion', '')

            nivel_para = Paragraph(
                f"<b>{nombre}</b><br/>{descripcion}",
                self.styles['CustomBody']
            )
            elements.append(nivel_para)
            elements.append(Spacer(1, 10))

        return elements

    def _create_recommendations_section(self, assessment_data: dict):
        """Create recommendations section"""
        elements = []

        elements.append(Paragraph("Recomendaciones", self.styles['CustomSubtitle']))

        recommendations = assessment_data.get('recommendations', [])

        if not recommendations:
            elements.append(Paragraph("No hay recomendaciones disponibles.", 
                                    self.styles['CustomBody']))
            return elements

        for idx, rec in enumerate(recommendations, 1):
            title = rec.get('title', 'N/A')
            description = rec.get('description', '')
            dimension = rec.get('dimension', 'N/A')
            estimated_time = rec.get('estimated_time', 'N/A')
            priority = rec.get('priority', 'N/A')

            rec_para = Paragraph(
                f"<b>{idx}. {title}</b><br/>"
                f"<b>Dimensión:</b> {dimension}<br/>"
                f"{description}<br/>"
                f"<b>Tiempo estimado:</b> {estimated_time} | <b>Prioridad:</b> {priority}",
                self.styles['CustomBody']
            )
            elements.append(rec_para)
            elements.append(Spacer(1, 15))

        return elements
