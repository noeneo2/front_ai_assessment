import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { ReportContext } from '../context/ReportContext';
import APIService from '../services/api';
import './projectpage.css';

const ProjectPage = (props) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setReportData, setCompanyName } = useContext(ReportContext);

  useEffect(() => {
    const fetchCompanies = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);

        // Get all companies for the user
        const userCompanies = await APIService.getUserCompanies(user.uid);

        // For each company, get assessments
        const companiesData = await Promise.all(
          userCompanies.map(async (companyName) => {
            const assessments = await APIService.getCompanyAssessments(companyName, user.uid);

            return {
              id: companyName,
              companyName: companyName,
              assessments: assessments.length,
              lastTest: assessments.length > 0
                ? new Date(assessments[0].date).toLocaleDateString()
                : 'N/A',
              latestAssessment: assessments.length > 0 ? assessments[0] : null
            };
          })
        );

        setCompanies(companiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchCompanies();
      } else {
        setCompanies([]);
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCompanyClick = async (company) => {
    if (company.latestAssessment) {
      try {
        // Fetch full assessment data from backend
        const assessmentData = await APIService.getAssessment(company.latestAssessment.project_id);

        setCompanyName(company.companyName);
        setReportData(assessmentData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error loading assessment:', error);
        alert('Error al cargar el assessment. Por favor, intenta de nuevo.');
      }
    } else {
      // No assessments, go to new project
      setCompanyName(company.companyName);
      navigate('/newproject');
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="projectpage-container">
      <Helmet>
        <title>Mis Proyectos</title>
        <meta property="og:title" content="Mis Proyectos" />
      </Helmet>
      <div className="projectpage-header">
        <img alt="Logo" src="/external/Logo_negro_NEO_header.svg" className="projectpage-header-logo" />
        <div className="projectpage-header-button" onClick={handleLogout}>
          <img alt="Logout Icon" src="/external/iconlogoutea4f.svg" className="projectpage-logout-icon" />
          <span className="projectpage-button-text">Logout</span>
        </div>
      </div>
      <div className="projectpage-main-content">
        <div className="projectpage-title-container">
          <div className="projectpage-title">
            <h1>Proyectos Recientes</h1>
            <p>Aquí puedes ver tus proyectos recientes y crear nuevos.</p>
          </div>
          <button className="projectpage-create-button" onClick={() => navigate('/newproject')}>Crear nuevo proyecto</button>
        </div>
        <div className="projectpage-company-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Cargando proyectos...</p>
            </div>
          ) : companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No tienes proyectos aún. ¡Crea tu primer proyecto!</p>
            </div>
          ) : (
            companies.map((company) => (
              <div key={company.id} className="projectpage-company-item" onClick={() => handleCompanyClick(company)}>
                <div className="projectpage-company-info">
                  <img alt="File Icon" src="/external/icon4638-y3ej.svg" className="projectpage-file-icon" />
                  <div className="projectpage-company-details">
                    <span className="projectpage-company-name">{company.companyName}</span>
                    <span className="projectpage-company-meta">
                      {company.assessments} assessments • Último {company.lastTest}
                    </span>
                  </div>
                </div>
                <img alt="Arrow Icon" src="/external/arrow14636-poci.svg" className="projectpage-arrow-icon" />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="projectpage-footer">
        <img alt="Logo Neo" src="/external/Logo_negro_NEO_footer.svg" className="projectpage-footer-logo" />
        <span className="projectpage-footer-text">Neo Consulting, 2025</span>
      </div>
    </div>
  );
};

export default ProjectPage;
