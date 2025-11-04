import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';

import './dashboard.css';

const Dashboard = (props) => {
  const { reportData } = useContext(ReportContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reportData) {
      navigate('/');
    }
  }, [reportData, navigate]);

  if (!reportData) {
    return <div>Cargando reporte...</div>;
  }

  const {
    puntaje_general = 0,
    categoria_general = "N/A",
    descripcion_general = "No hay descripción disponible.",
    puntajes_areas = [],
    niveles = []
  } = reportData;

  return (
    <div className="home-container1">
      <Helmet>
        <title>Dashboard - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div className="home-dashboard-score-animating">
        <div className="home-content">
          <div className="home-main-content1">
            <div className="home-header-dashboard">
               <div className="home-header-frame">
                <div className="home-titleand-status-container">
                  <div className="home-title-container">
                    <span className="home-text10">
                      Madurez Organizacional en Gen AI
                    </span>
                  </div>
                  <div className="home-frame1321316829">
                    <div className="home-project-status">
                      <img
                        src="/external/statusdot4628-j2h5-200h.png"
                        alt="StatusDot4628"
                        className="home-status-dot"
                      />
                      <span className="home-text11">Análisis éxitoso</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-tabs">
                <div className="home-tabitem1">
                  <span className="home-text13">Resultados</span>
                </div>
                <Link to="/recomendaciones" className="home-tabitem2" style={{ textDecoration: 'none' }}>
                  <span className="home-text14">Recomendaciones</span>
                </Link>
              </div>
            </div>
            <div className="home-container2">
              <div className="home-sidebar"></div>
              <div className="home-main-content2">
                
                <div className="home-frame1321316835">
                  <div className="home-frame1321316837">
                    <div className="home-frame1321316836">
                      <span className="home-text17">{puntaje_general.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="home-score">
                    <span className="home-text18">{categoria_general}</span>
                    <span className="home-text19">{descripcion_general}</span>
                  </div>
                </div>
                
                <div className="home-scores-categories">
                  <div className="home-container3">
                    <span className="home-text34">Puntuación de madurez por áreas</span>
                    <div className="home-frame1321316812">
                      <div className="home-frame1321316815">
                        {puntajes_areas.slice(0, 3).map((area, index) => (
                          <div className="home-card-sub-score1" key={index}>
                            <div className="home-number-card1">
                              <span className="home-text35">{area.nombre}</span>
                              <div className="home-numberdetail1">
                                <span className="home-text36">{area.puntaje.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="home-frame1321316814">
                         {puntajes_areas.slice(3, 6).map((area, index) => (
                          <div className="home-card-sub-score1" key={index}>
                            <div className="home-number-card1">
                              <span className="home-text35">{area.nombre}</span>
                              <div className="home-numberdetail1">
                                <span className="home-text36">{area.puntaje.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="home-frame1321316826">
                  <span className="home-text59">¿Qué implica cada nivel?</span>
                  <div className="home-accordion-list">
                    {niveles.map((nivel, index) => (
                      <div className="home-accordion-item1" key={index}>
                        <div className="home-question1">
                          <span className="home-text60">{nivel.nombre}</span>
                        </div>
                        <div className="home-answer">
                          <span className="home-text61">{nivel.descripcion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="home-footer"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
