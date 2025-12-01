import React, { useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import './newproject.css';

const NewProject = (props) => {
  const { setFile, setFileName, companyName, setCompanyName, companySector, setCompanySector } = useContext(ReportContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const SECTORS = [
    "Seguros", "Banca", "Finanzas", "Salud", "Retail", "Tecnología",
    "Telecomunicaciones", "Energía", "Minería", "Construcción", "Transporte",
    "Logística", "Farmacéutico", "Alimentación", "Moda y Textiles",
    "Government / Sector público", "Consultoría", "Legal / Servicios jurídicos",
    "Medios de comunicación", "Publicidad y marketing", "Manufactura",
    "Agroindustria", "Inmobiliario", "Educación", "Turismo"
  ];

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }

    if (!companyName.trim()) {
      alert("Por favor, ingresa el nombre de la empresa antes de subir el archivo.");
      return;
    }

    if (!companySector) {
      alert("Por favor, selecciona el sector de la empresa antes de subir el archivo.");
      return;
    }

    // Store file info in context
    setFile(selectedFile);
    setFileName(selectedFile.name);

    // Navigate to subiendo page
    navigate('/subiendo');
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleCompanyNameChange = (event) => {
    setCompanyName(event.target.value);
  };

  const handleSectorChange = (event) => {
    setCompanySector(event.target.value);
  };

  return (
    <div className="newproject-container1">
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
                  Paso 1: Ingresa los datos de la empresa
                </span>
                <div className="newproject-input-row">
                  <div className="newproject-input-container">
                    <input
                      type="text"
                      placeholder="Nombre de la empresa"
                      value={companyName}
                      onChange={handleCompanyNameChange}
                      className="newproject-project-name-input"
                    />
                  </div>
                  <div className="newproject-input-container">
                    <select
                      value={companySector}
                      onChange={handleSectorChange}
                      className="newproject-project-name-input"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <option value="" disabled>Selecciona el sector</option>
                      {SECTORS.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <span className="newproject-step-title">
                  Paso 2: Subir el archivo de evaluación
                </span>
              </div>

              <div className="newproject-upload" onClick={handleUploadAreaClick} style={{ cursor: 'pointer' }}>

                <div className="newproject-frame17">
                  <div className="newproject-group3">
                    <img alt="VectorI281" src="/external/vectori281-d2v4.svg" className="newproject-vector001" />
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
