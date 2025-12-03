from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from datetime import datetime
import logging

from app.config.settings import settings
from app.services.excel_processor import ExcelProcessor
from app.services.ai_service import AIService
from app.services.firestore_service import FirestoreService
from app.services.pdf_service import PDFService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Assessment API",
    description="API para procesar evaluaciones de madurez organizacional en IA",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://ai-assessment-7e545.web.app",
    settings.FRONTEND_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
excel_processor = ExcelProcessor()
ai_service = AIService()
firestore_service = FirestoreService()
pdf_service = PDFService()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "AI Assessment API is running",
        "version": "1.0.0"
    }


@app.post("/api/upload-assessment")
async def upload_assessment(
    file: UploadFile = File(...),
    company_name: str = Form(...),
    company_sector: str = Form("Seguros"),
    user_id: str = Form(...)
):
    """
    Upload and process an Excel assessment file
    
    Args:
        file: Excel file with assessment data
        company_name: Name of the company
        user_id: Firebase user ID
    
    Returns:
        Assessment results with scores and recommendations
    """
    try:
        logger.info(f"Processing assessment for company: {company_name}, sector: {company_sector}, user: {user_id}")
        
        # Validate file
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="File must be an Excel file (.xlsx or .xls)")
        
        # Read file content
        content = await file.read()
        
        # Process Excel file
        logger.info("Processing Excel file...")
        assessment_data = excel_processor.process_excel(content)
        
        # Generate recommendations with AI
        logger.info("Generating recommendations with AI...")
        recommendations = await ai_service.generate_recommendations(
            assessment_data['puntajes_areas'],
            company_sector
        )
        
        # Add recommendations to assessment data
        assessment_data['recommendations'] = recommendations
        
        # Save to Firestore
        logger.info("Saving to Firestore...")
        project_id = firestore_service.save_assessment(
            user_id=user_id,
            company_name=company_name,
            company_sector=company_sector,
            assessment_data=assessment_data
        )
        
        logger.info(f"Assessment processed successfully. Project ID: {project_id}")
        
        return {
            "status": "success",
            "project_id": project_id,
            "assessment_date": assessment_data['assessment_date'],
            "company_name": company_name,
            "puntaje_general": assessment_data['puntaje_general'],
            "categoria_general": assessment_data['categoria_general']
        }
        
    except Exception as e:
        logger.error(f"Error processing assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/assessment/{project_id}")
async def get_assessment(project_id: str):
    """
    Get assessment data by project ID
    
    Args:
        project_id: Assessment project ID
    
    Returns:
        Complete assessment data
    """
    try:
        assessment = firestore_service.get_assessment(project_id)
        
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        return assessment
        
    except Exception as e:
        logger.error(f"Error retrieving assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/user/{user_id}/companies")
async def get_user_companies(user_id: str):
    """
    Get all companies for a user
    
    Args:
        user_id: Firebase user ID
    
    Returns:
        List of companies
    """
    try:
        companies = firestore_service.get_user_companies(user_id)
        return {"companies": companies}
        
    except Exception as e:
        logger.error(f"Error retrieving companies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/company/{company_name}/assessments")
async def get_company_assessments(company_name: str, user_id: str):
    """
    Get all assessments for a company
    
    Args:
        company_name: Name of the company
        user_id: Firebase user ID
    
    Returns:
        List of assessments
    """
    try:
        assessments = firestore_service.get_company_assessments(user_id, company_name)
        return {"assessments": assessments}
        
    except Exception as e:
        logger.error(f"Error retrieving assessments: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/company/{company_name}")
async def delete_company(company_name: str, user_id: str):
    """
    Delete a company and all its assessments
    
    Args:
        company_name: Name of the company
        user_id: Firebase user ID
    
    Returns:
        Deletion confirmation
    """
    try:
        logger.info(f"Deleting company: {company_name} for user: {user_id}")
        
        # Delete company and all assessments
        firestore_service.delete_company(user_id, company_name)
        
        logger.info(f"Company {company_name} deleted successfully")
        
        return {
            "status": "success",
            "message": f"Company {company_name} and all its assessments have been deleted"
        }
        
    except Exception as e:
        logger.error(f"Error deleting company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/assessment/{project_id}/download-pdf")
async def download_assessment_pdf(project_id: str):
    """
    Generate and download PDF report for an assessment
    
    Args:
        project_id: Assessment project ID
    
    Returns:
        PDF file as streaming response
    """
    try:
        logger.info(f"Generating PDF for project: {project_id}")
        
        # Get assessment data
        assessment = firestore_service.get_assessment(project_id)
        
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        # Extract company name
        company_name = assessment.get('company_name', 'Company')
        
        # Generate PDF
        pdf_buffer = pdf_service.generate_assessment_pdf(assessment, company_name)
        
        # Create filename
        date_str = assessment.get('assessment_date', datetime.now().strftime('%Y-%m-%d'))
        filename = f"{company_name.replace(' ', '_')}_Assessment_{date_str}.pdf"
        
        logger.info(f"PDF generated successfully for project: {project_id}")
        
        # Return as streaming response
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
        
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/public/assessment/{share_token}")
async def get_public_assessment(share_token: str):
    """
    Get assessment data by public share token (no authentication required)
    
    Args:
        share_token: Public share token
    
    Returns:
        Assessment data
    """
    try:
        logger.info(f"Fetching public assessment for token: {share_token}")
        
        assessment = firestore_service.get_assessment_by_token(share_token)
        
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        return assessment
        
    except Exception as e:
        logger.error(f"Error retrieving public assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.BACKEND_PORT)
