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
    
    def save_assessment(self, user_id: str, company_name: str, company_sector: str, assessment_data: dict) -> str:
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
            # Generate unique assessment ID and share token
            assessment_id = str(uuid.uuid4())
            share_token = str(uuid.uuid4())
            
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
                    'share_token': share_token,
                    'date': assessment_data['assessment_date'],
                    'created_at': datetime.now(),
                    'user_id': user_id,
                    'company_name': company_name,
                    'company_sector': company_sector
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
    
    def delete_company(self, user_id: str, company_name: str) -> None:
        """
        Delete a company and all its assessments
        
        Args:
            user_id: Firebase user ID
            company_name: Company name
        """
        try:
            # Get all assessments for this company
            assessments_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('companies')
                .document(company_name)
                .collection('assessments')
            )
            
            # Delete all assessments from hierarchical structure
            assessment_ids = []
            for assessment_doc in assessments_ref.stream():
                assessment_ids.append(assessment_doc.id)
                assessment_doc.reference.delete()
            
            # Delete assessments from global collection
            for assessment_id in assessment_ids:
                global_ref = self.db.collection('assessments').document(assessment_id)
                global_ref.delete()
            
            # Delete company document
            company_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('companies')
                .document(company_name)
            )
            company_ref.delete()
            
            logger.info(f"Company {company_name} and {len(assessment_ids)} assessments deleted successfully")
            
        except Exception as e:
            logger.error(f"Error deleting company: {str(e)}")
            raise
    
    def get_assessment_by_token(self, share_token: str) -> dict:
        """
        Get assessment by public share token (no authentication required)
        
        Args:
            share_token: Public share token
        
        Returns:
            Assessment data or None
        """
        try:
            # Query global assessments collection for share_token
            assessments_ref = self.db.collection('assessments')
            query = assessments_ref.where('metadata.share_token', '==', share_token).limit(1)
            
            results = list(query.stream())
            
            if results:
                assessment_doc = results[0]
                data = assessment_doc.to_dict()
                return {
                    'project_id': assessment_doc.id,
                    **data.get('metadata', {}),
                    **data.get('scores', {}),
                    'recommendations': data.get('recommendations', [])
                }
            
            logger.warning(f"Assessment not found for share_token: {share_token}")
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving assessment by token: {str(e)}")
            raise
