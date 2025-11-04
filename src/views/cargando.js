import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ReportContext } from '../context/ReportContext';
import './cargando.css';

const Cargando = (props) => {
  const { file, setReportData, setIsLoading, setError } = useContext(ReportContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!file) {
      navigate('/');
      return;
    }

    const processFile = async () => {
      setIsLoading(true);
      setError(null);
      setErrorMessage('');

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://127.0.0.1:8000/process-excel/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setReportData(response.data);
        
        navigate('/dashboard');

      } catch (err) {
        console.error("Error al procesar el archivo:", err);
        setError(err);
        setErrorMessage('Hubo un error al procesar tu archivo. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    processFile();
  }, [file, navigate, setError, setIsLoading, setReportData]);

  return (
    <div className="page1-container1">
      <Helmet>
        <title>Procesando - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div className="page1-cargando">
        <div className="page1-content">
        <div className="page1-header"></div>
          <div className="page1-main-content">
            <div className="page1-upload-module">
              <div className="page1-title">
                <span className="page1-text1">
                  {errorMessage ? errorMessage : 'Creando las visualizaciones de datos y recomendaciones...'}
                </span>
              </div>
              {!errorMessage && (
                <img
                  src="/external/loadinganimation12812-96i-400h.png"
                  alt="Animación de carga"
                  className="page1-loading-animation1"
                />
              )}
            </div>
          </div>
          <div className="page1-footer"></div>
        </div>
      </div>
    </div>
  );
};

export default Cargando;
