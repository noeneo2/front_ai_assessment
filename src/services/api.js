import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * API Service for communicating with FastAPI backend
 */
class APIService {
    /**
     * Upload and process an Excel assessment file
     * @param {File} file - Excel file
     * @param {string} companyName - Company name
     * @param {string} companySector - Company sector
     * @returns {Promise<Object>} Assessment result
     */
    async uploadAssessment(file, companyName, companySector) {
        try {
            // Get current user
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('company_name', companyName);
            formData.append('company_sector', companySector);
            formData.append('user_id', user.uid);

            // Send to backend
            const response = await fetch(`${API_BASE_URL}/api/upload-assessment`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error uploading assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading assessment:', error);
            throw error;
        }
    }

    /**
     * Get assessment by project ID
     * @param {string} projectId - Assessment project ID
     * @returns {Promise<Object>} Assessment data
     */
    async getAssessment(projectId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/assessment/${projectId}`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error fetching assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching assessment:', error);
            throw error;
        }
    }

    /**
     * Get all companies for a user
     * @param {string} userId - Firebase user ID
     * @returns {Promise<Array>} List of companies
     */
    async getUserCompanies(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}/companies`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error fetching companies');
            }

            const data = await response.json();
            return data.companies;
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    }

    /**
     * Get all assessments for a company
     * @param {string} companyName - Company name
     * @param {string} userId - Firebase user ID
     * @returns {Promise<Array>} List of assessments
     */
    async getCompanyAssessments(companyName, userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/company/${companyName}/assessments?user_id=${userId}`
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error fetching assessments');
            }

            const data = await response.json();
            return data.assessments;
        } catch (error) {
            console.error('Error fetching assessments:', error);
            throw error;
        }
    }

    /**
     * Delete a company and all its assessments
     * @param {string} companyName - Company name
     * @param {string} userId - Firebase user ID
     * @returns {Promise<Object>} Deletion result
     */
    async deleteCompany(companyName, userId) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/company/${companyName}?user_id=${userId}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error deleting company');
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting company:', error);
            throw error;
        }
    }

    /**
     * Download PDF report for an assessment
     * @param {string} projectId - Assessment project ID
     * @param {string} companyName - Company name for filename
     * @returns {Promise<void>}
     */
    async downloadAssessmentPDF(projectId, companyName) {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/assessment/${projectId}/download-pdf`
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error generating PDF');
            }

            // Get the blob from response
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary anchor element and trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `${companyName.replace(/\s+/g, '_')}_Assessment_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            throw error;
        }
    }

    /**
     * Get assessment by public share token (no authentication required)
     * @param {string} shareToken - Public share token
     * @returns {Promise<Object>} Assessment data
     */
    async getPublicAssessment(shareToken) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/public/assessment/${shareToken}`);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error fetching public assessment');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching public assessment:', error);
            throw error;
        }
    }
}

export default new APIService();
