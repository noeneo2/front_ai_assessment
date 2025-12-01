import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { ReportContext } from '../context/ReportContext';
import APIService from '../services/api';
import './subiendo.css';

const Subiendo = (props) => {
  const { fileName, file, companyName, companySector, setReportData } = useContext(ReportContext);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Automatically start upload when component mounts
    const uploadFile = async () => {
      if (!file || !companyName) {
        navigate('/newproject');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        console.log('Uploading file to backend...');
        const result = await APIService.uploadAssessment(file, companyName, companySector);
        console.log('Upload successful:', result);

        // Store project_id in context for later use
        setReportData({ project_id: result.project_id });

        // Navigate to cargando page
        setTimeout(() => {
          navigate('/cargando');
        }, 1500);

      } catch (err) {
        console.error('Error uploading file:', err);
        setError(err.message || 'Error al subir el archivo');
        setUploading(false);
      }
    };

    uploadFile();
  }, [file, companyName, navigate, setReportData]);

  return (
    <div className="page-container1">
      <Helmet>
        <title>Archivo Cargado - Madurez Organizacional Gen AI</title>
      </Helmet>

      <div className="page-subiendo">
        <div className="page-content">
          <header className="page-header">
            <img
              className="page-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
          </header>

          <main className="page-main-content">
            <div className="page-upload-module">
              <div className="page-title">
                <span className="page-text1">
                  {error ? 'Error al subir archivo' : uploading ? 'Subiendo archivo...' : 'Archivo cargado exitosamente'}
                </span>
              </div>
              <div className="page-upload">
                <div className="page-frame8">
                  <div className="page-frame4" style={{ alignItems: 'center', width: '100%' }}>
                    <div className="page-frame1321316828">
                      <span className="page-text2">{fileName || 'No se ha seleccionado archivo'}</span>
                    </div>
                    {error && (
                      <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                {!uploading && !error && (
                  <div className="page-frame15" style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => navigate('/cargando')}>
                    <span className="page-text5">
                      Continuar
                    </span>
                  </div>
                )}
              </div>
            </div>
          </main>

          <footer className="page-footer">
            <img
              className="page-footer-logo"
              src="/external/Logo_negro_NEO_footer.svg"
              alt="Logo Neo"
            />
          </footer>

        </div>
      </div>
    </div>
  );
}

export default Subiendo;