
import React from 'react';
import { Helmet } from 'react-helmet';
import './projectpage.css';

const ProjectPage = (props) => {
  // Datos de ejemplo de empresas
  const companies = [
    { name: 'Empresa A', assessments: 2, lastTest: 'hace 3 días' },
    { name: 'Empresa B', assessments: 1, lastTest: '30 de Octubre 2025' }
  ];

  return (
    <div className="projectpage-container">
      <Helmet>
        <title>Project Page</title>
        <meta property="og:title" content="Project Page" />
      </Helmet>
      <div className="projectpage-header">
        <img
          alt="Logo"
          src="/external/Logo_negro_NEO_header.svg"
          className="projectpage-header-logo"
        />
        <div className="projectpage-header-button">
          <img
            alt="Logout Icon"
            src="/external/iconlogoutea4f.svg"
            className="projectpage-logout-icon"
          />
          <span className="projectpage-button-text">Logout</span>
        </div>
      </div>
      <div className="projectpage-main-content">
        <div className="projectpage-title-container">
            <div className="projectpage-title">
                <h1>Proyectos Recientes</h1>
                <p>Aquí puedes ver tus proyectos recientes y crear nuevos.</p>
            </div>
            <button className="projectpage-create-button">Crear nuevo proyecto</button>
        </div>
        <div className="projectpage-company-list">
          {companies.map((company, index) => (
            <div key={index} className="projectpage-company-item">
                <div className="projectpage-company-info">
                    <img
                        alt="File Icon"
                        src="/external/icon4638-y3ej.svg"
                        className="projectpage-file-icon"
                    />
                    <div className="projectpage-company-details">
                        <span className="projectpage-company-name">{company.name}</span>
                        <span className="projectpage-company-meta">
                            {company.assessments} assessments • Último {company.lastTest}
                        </span>
                    </div>
                </div>
                <img
                    alt="Arrow Icon"
                    src="/external/arrow14636-poci.svg"
                    className="projectpage-arrow-icon"
                />
            </div>
          ))}
        </div>
      </div>
      <div className="projectpage-footer">
        <img
          alt="Logo Neo"
          src="/external/Logo_negro_NEO_footer.svg"
          className="projectpage-footer-logo"
        />
        <span className="projectpage-footer-text">Neo Consulting, 2025</span>
      </div>
    </div>
  );
};

export default ProjectPage;
