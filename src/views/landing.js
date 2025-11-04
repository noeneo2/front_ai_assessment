
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
    <div className="page1-container1">
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

      <div className="page1-landing-page">
        <div className="page1-content">
          <div className="page1-header">
            <img
              className="page1-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
          </div>
          
          <div className="page1-main-content">
            <div className="page1-upload-module">
              <div className="page1-title">
                <span className="page1-text1">
                  Transforma tu excel en un dashboard de Madurez Organizacional en Gen AI
                </span>
              </div>
              
              <div className="page1-upload" onClick={handleUploadAreaClick} style={{cursor: 'pointer'}}>
                
                <div className="page1-frame17">
                  <div className="page1-group3">
                    <img alt="VectorI281" src="/external/vectori281-d2v4.svg" className="page1-vector001"/>
                  </div>
                  <div className="page1-frame16">
                    <span className="page1-text2">
                      Seleccione un archivo o arrástrelo aquí.
                    </span>
                  </div>
                  <div className="page1-frame15">
                    <span className="page1-text4">Examinar archivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="page1-footer">
            <img
            className="page1-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
