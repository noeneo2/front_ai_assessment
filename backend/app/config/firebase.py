import firebase_admin
from firebase_admin import credentials, firestore
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class FirebaseConfig:
    """Firebase configuration and initialization"""
    
    _initialized = False
    _db = None
    
    @classmethod
    def initialize(cls):
        """Initialize Firebase Admin SDK"""
        if not cls._initialized:
            try:
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                cls._db = firestore.client()
                cls._initialized = True
                logger.info("Firebase initialized successfully")
            except Exception as e:
                logger.error(f"Error initializing Firebase: {str(e)}")
                raise
    
    @classmethod
    def get_db(cls):
        """Get Firestore database instance"""
        if not cls._initialized:
            cls.initialize()
        return cls._db


# Initialize Firebase on module import
FirebaseConfig.initialize()
