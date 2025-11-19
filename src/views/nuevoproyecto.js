import React, { useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { ReportContext } from '../context/ReportContext';
import './nuevoproyecto.css';

const NuevoProyecto = (props) => {
  const { setFile, setFileName, projectName, setProjectName } = useContext(ReportContext);
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
  
  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <div className="nuevoproyecto-container1">
      <Helmet>
        <title>Nuevo Proyecto - Madurez Organizacional Gen AI</title>
      </Helmet>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />

      <div className="nuevoproyecto-landing-page">
        <div className="nuevoproyecto-content">

          <header className="nuevoproyecto-header">
            <img
              className="nuevoproyecto-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
          </header>
          

          <main className="nuevoproyecto-main-content">
            <div className="nuevoproyecto-upload-module">
              <div className="nuevoproyecto-title">
                <span className="nuevoproyecto-text1">
                  Crear nuevo proyecto
                </span>
              </div>
              
              <div className="nuevoproyecto-steps-container">
                <span className="nuevoproyecto-step-title">
                  Paso 1: Ingresar el nombre del proyecto
                </span>
                <div className="nuevoproyecto-input-container">
                  <input
                    type="text"
                    placeholder="Ingresa el nombre del proyecto"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    className="nuevoproyecto-project-name-input"
                  />
                </div>
                <span className="nuevoproyecto-step-title">
                  Paso 2: Subir el archivo
                </span>
              </div>

              <div className="nuevoproyecto-upload" onClick={handleUploadAreaClick} style={{cursor: 'pointer'}}>
                
                <div className="nuevoproyecto-frame17">
                  <div className="nuevoproyecto-group3">
                    <img alt="VectorI281" src="/external/vectori281-d2v4.svg" className="nuevoproyecto-vector001"/>
                  </div>
                  <div className="nuevoproyecto-frame16">
                    <span className="nuevoproyecto-text2">
                      Seleccione un archivo o arrástrelo aquí.
                    </span>
                     <span className="nuevoproyecto-text-subtitle">
                      Archivo de Excel de hasta 50 MB
                    </span>
                  </div>
                  <div className="nuevoproyecto-frame15">
                    <span className="nuevoproyecto-text4">Examinar archivo</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
          

          <footer className="nuevoproyecto-footer">
            <img
            className="nuevoproyecto-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />
          </footer>


        </div>
      </div>
    </div>
  );
};

export default NuevoProyecto;
