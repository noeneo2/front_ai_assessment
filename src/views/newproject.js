import React, { useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import { ReportContext } from '../context/ReportContext';
import './newproject.css';

const NewProject = (props) => {
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
    <div className="newproject-container1">
      <Helmet>
        <title>New Project - Madurez Organizacional Gen AI</title>
      </Helmet>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />

      <div className="newproject-landing-page">
        <div className="newproject-content">

          <header className="newproject-header">
            <img
              className="newproject-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
          </header>
          

          <main className="newproject-main-content">
            <div className="newproject-upload-module">
              <div className="newproject-title">
                <span className="newproject-text1">
                  Crear nuevo proyecto
                </span>
              </div>
              
              <div className="newproject-steps-container">
                <span className="newproject-step-title">
                  Paso 1: Ingresar el nombre del proyecto
                </span>
                <div className="newproject-input-container">
                  <input
                    type="text"
                    placeholder="Ingresa el nombre del proyecto"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    className="newproject-project-name-input"
                  />
                </div>
                <span className="newproject-step-title">
                  Paso 2: Subir el archivo
                </span>
              </div>

              <div className="newproject-upload" onClick={handleUploadAreaClick} style={{cursor: 'pointer'}}>
                
                <div className="newproject-frame17">
                  <div className="newproject-group3">
                    <img alt="VectorI281" src="/external/vectori281-d2v4.svg" className="newproject-vector001"/>
                  </div>
                  <div className="newproject-frame16">
                    <span className="newproject-text2">
                      Seleccione un archivo o arrástrelo aquí.
                    </span>
                     <span className="newproject-text-subtitle">
                      Archivo de Excel de hasta 50 MB
                    </span>
                  </div>
                  <div className="newproject-frame15">
                    <span className="newproject-text4">Examinar archivo</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
          

          <footer className="newproject-footer">
            <img
            className="newproject-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />
          </footer>


        </div>
      </div>
    </div>
  );
};

export default NewProject;
