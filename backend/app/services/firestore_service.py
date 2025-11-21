from app.config.firebase import FirebaseConfig
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)


class FirestoreService:
    """Service to interact with Firestore database"""
    
    def __init__(self):
        """Initialize Firestore service"""
        self.db = FirebaseConfig.get_db()
    
    def save_assessment(self, user_id: str, company_name: str, assessment_data: dict) -> str:
        """
        Save assessment to Firestore
        
        Structure:
        users/{user_id}/companies/{company_name}/assessments/{assessment_id}
        
        Args:
            user_id: Firebase user ID
            company_name: Company name
            assessment_data: Assessment data dictionary
        
        Returns:
            Assessment ID (project_id)
        """
        try:
            # Generate unique assessment ID
            assessment_id = str(uuid.uuid4())
            
            # Reference to assessment document
            assessment_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('companies')
                .document(company_name)
                .collection('assessments')
                .document(assessment_id)
            )
            
            # Prepare data
            data = {
                'metadata': {
                    'assessment_id': assessment_id,
                    'date': assessment_data['assessment_date'],
                    'created_at': datetime.now(),
                    'user_id': user_id,
                    'company_name': company_name
                },
                'scores': {
                    'puntaje_general': assessment_data['puntaje_general'],
                    'categoria_general': assessment_data['categoria_general'],
                    'categoria_estilo': assessment_data['categoria_estilo'],
                    'descripcion_general': assessment_data['descripcion_general'],
                    'puntajes_areas': assessment_data['puntajes_areas'],
                    'niveles': assessment_data['niveles']
                },
                'recommendations': assessment_data.get('recommendations', [])
            }
            
            # Save to Firestore in hierarchical structure
            assessment_ref.set(data)
            
            # Ensure company document exists
            company_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('companies')
                .document(company_name)
            )
            
            # Check if company exists, if not create it
            if not company_ref.get().exists:
                company_ref.set({
                    'name': company_name,
                    'created_at': datetime.now()
                })
            
            # Also save to global assessments collection for easy retrieval
            global_ref = self.db.collection('assessments').document(assessment_id)
            global_ref.set({
                **data,
                'user_id': user_id,
                'company_name': company_name
            })
            
            logger.info(f"Assessment saved successfully. ID: {assessment_id}")
            return assessment_id
            
        except Exception as e:
            logger.error(f"Error saving assessment to Firestore: {str(e)}")
            raise
    
    def get_assessment(self, project_id: str) -> dict:
        """
        Get assessment by project ID
        
        Args:
            project_id: Assessment ID
        
        Returns:
            Assessment data or None
        """
        try:
            # Get from global assessments collection
            assessment_doc = self.db.collection('assessments').document(project_id).get()
            
            if assessment_doc.exists:
                data = assessment_doc.to_dict()
                return {
                    'project_id': project_id,
                    **data.get('metadata', {}),
                    **data.get('scores', {}),
                    'recommendations': data.get('recommendations', [])
                }
            
            logger.warning(f"Assessment not found: {project_id}")
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving assessment: {str(e)}")
            raise
    
    def get_user_companies(self, user_id: str) -> list:
        """
        Get all companies for a user
        
        Args:
            user_id: Firebase user ID
        
        Returns:
            List of company names
        """
        try:
            companies_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('companies')
            )
            
            companies = []
            for company_doc in companies_ref.stream():
                companies.append(company_doc.id)
            
            return companies
            
        except Exception as e:
            logger.error(f"Error retrieving companies: {str(e)}")
            raise
    
    def get_company_assessments(self, user_id: str, company_name: str) -> list:
        """
        Get all assessments for a company
        
        Args:
            user_id: Firebase user ID
            company_name: Company name
        
        Returns:
            List of assessments with basic info
        """
        try:
            assessments_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('companies')
                .document(company_name)
                .collection('assessments')
            )
            
            assessments = []
            for assessment_doc in assessments_ref.stream():
                data = assessment_doc.to_dict()
                assessments.append({
                    'project_id': assessment_doc.id,
                    'date': data['metadata']['date'],
                    'puntaje_general': data['scores']['puntaje_general'],
                    'categoria_general': data['scores']['categoria_general']
                })
            
            # Sort by date (most recent first)
            assessments.sort(key=lambda x: x['date'], reverse=True)
            
            return assessments
            
        except Exception as e:
            logger.error(f"Error retrieving assessments: {str(e)}")
            raise
