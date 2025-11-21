import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import APIService from '../services/api';

import './cargando.css';

const Cargando = (props) => {
  const { reportData, setReportData, setIsLoading, setError } = useContext(ReportContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!reportData || !reportData.project_id) {
      navigate('/newproject');
      return;
    }

    const fetchAssessmentData = async () => {
      setIsLoading(true);
      setError(null);
      setErrorMessage('');

      try {
        console.log('Fetching assessment data from backend...');
        console.log('Project ID:', reportData.project_id);

        // Poll for assessment data (backend might still be processing)
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds max

        const pollData = async () => {
          try {
            console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
            const data = await APIService.getAssessment(reportData.project_id);

            if (data) {
              console.log('Assessment data received:', data);
              setReportData(data);
              setIsLoading(false);

              // Navigate to dashboard after a short delay
              setTimeout(() => {
                navigate('/dashboard');
              }, 1000);
            }
          } catch (err) {
            attempts++;
            console.log(`Attempt ${attempts} failed:`, err.message);

            if (attempts < maxAttempts) {
              // Try again after 1 second
              setTimeout(pollData, 1000);
            } else {
              throw new Error('Timeout esperando datos del assessment. Revisa los logs del backend (docker-compose logs).');
            }
          }
        };

        // Start polling
        pollData();

      } catch (err) {
        console.error("Error al obtener datos del assessment:", err);
        setError(err);
        setErrorMessage('Hubo un error al procesar tu archivo. Por favor, inténtalo de nuevo.');
        setIsLoading(false);
      }
    };

    fetchAssessmentData();
  }, [reportData, navigate, setError, setIsLoading, setReportData]);

  return (
    <div className="cargando-container1">
      <Helmet>
        <title>Procesando - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div className="cargando-cargando">
        <div className="cargando-content">
          <div className="cargando-header">
            <img
              className="cargando-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
          </div>
          <div className="cargando-main-content">
            <div className="cargando-upload-module">
              <div className="cargando-title">
                <span className="cargando-text1">
                  {errorMessage ? errorMessage : 'Creando las visualizaciones de datos y recomendaciones...'}
                </span>
              </div>
              {!errorMessage && (
                <img
                  src="/external/loadinganimation12812-96i-400h.png"
                  alt="Animación de carga"
                  className="cargando-loading-animation1"
                />
              )}
            </div>
          </div>
          <div className="cargando-footer">
            <img
              className="cargando-footer-logo"
              src="/external/Logo_negro_NEO_footer.svg"
              alt="Logo Neo"
            />
            <span className="login-footer-text">Neo Consulting, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cargando;
