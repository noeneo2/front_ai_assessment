import React, { useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { ReportContext } from '../context/ReportContext';
import './landing.css';

const Landing = (props) => {
  const { setFile, setFileName } = useContext(ReportContext);
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);

    navigate('/subiendo');
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="landing-container1">
      <Helmet>
        <title>Subir Excel - Madurez Organizacional Gen AI</title>
      </Helmet>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />

      <div className="landing-landing-page">
        <div className="landing-content">

          <header className="landing-header">
            <img
              className="landing-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
          </header>
          

          <main className="landing-main-content">
            <div className="landing-upload-module">
              <div className="landing-title">
                <span className="landing-text1">
                  Transforma tu excel en un dashboard de Madurez Organizacional en Gen AI
                </span>
              </div>
              
              <div className="landing-upload" onClick={handleUploadAreaClick} style={{cursor: 'pointer'}}>
                
                <div className="landing-frame17">
                  <div className="landing-group3">
                    <img alt="VectorI281" src="/external/vectori281-d2v4.svg" className="landing-vector001"/>
                  </div>
                  <div className="landing-frame16">
                    <span className="landing-text2">
                      Seleccione un archivo o arrástrelo aquí.
                    </span>
                    <span className="landing-text-subtitle">
                      Archivo de Excel de hasta 50 MB
                    </span>
                  </div>
                  <div className="landing-frame15">
                    <span className="landing-text4">Examinar archivo</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
          

          <footer className="landing-footer">
            <img
            className="landing-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />
          </footer>


        </div>
      </div>
    </div>
  );
};

export default Landing;
