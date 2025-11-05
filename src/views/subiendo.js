import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { ReportContext } from '../context/ReportContext';
import './subiendo.css';

const Subiendo = (props) => {
  const { fileName } = useContext(ReportContext);

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
                    Archivo cargado exitosamente
                  </span>
                </div>
                <div className="page-upload">
                  <div className="page-frame8">
                    <div className="page-frame4" style={{ alignItems: 'center', width: '100%' }}>
                      <div className="page-frame1321316828">
                        <span className="page-text2">{fileName || 'No se ha seleccionado archivo'}</span>
                      </div>
                    </div>
                </div>
                
              <Link to="/cargando" className="page-frame15" style={{ textDecoration: 'none' }}>
                <span className="page-text5">
                Continuar
                </span>
              </Link>
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    