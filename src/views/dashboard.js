import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

import './dashboard.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Dashboard = (props) => {
  const { reportData, companyName } = useContext(ReportContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reportData) {
      navigate('/projectpage');
    }
  }, [reportData, navigate]);

  // Mientras reportData no esté disponible, no renderizar nada o un spinner
  if (!reportData) {
    return <div>Cargando...</div>;
  }

  const { 
    puntaje_general = 0, 
    categoria_general = "N/A",
    categoria_estilo = "",
    descripcion_general = "No hay descripción disponible.", 
    puntajes_areas = [], 
    niveles = [] 
  } = reportData;

  const radarChartData = {
    labels: puntajes_areas.map(area => area.nombre),
    datasets: [
      {
        label: 'Puntaje de Madurez',
        data: puntajes_areas.map(area => area.puntaje),
        backgroundColor: 'rgba(34, 205, 238, 0.2)',
        borderColor: 'rgb(0, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const radarChartOptions = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
            stepSize: 2
        }
      },
    },
    plugins: {
        legend: {
            position: 'top',
        },
    }
  };

  return (
    <div className="home-container1">
      <Helmet>
        <title>Dashboard - {companyName}</title>
      </Helmet>
      <div className="home-dashboard-score-animating">
        <div className="home-content">
          <div className="home-main-content1">
            <div className="home-header-dashboard">
              <div className="home-header-frame">
                <div className="home-titleand-status-container">
                  <div className="home-title-container">
                    <span className="home-text10">
                      {companyName} - Madurez Organizacional en Gen AI
                    </span>
                  </div>
                  <div className="home-frame1321316829">
                    <div className="home-project-status">
                      <img
                        src="/external/statusdot4628-j2h5-200h.png"
                        alt="StatusDot"
                        className="home-status-dot"
                      />
                      <span className="home-text11">Análisis éxitoso</span>
                    </div>
                    <img
                      src="/external/iconrefresh4611-0oe.svg"
                      alt="Iconrefresh"
                      className="recom-iconrefresh"
                    />
                  </div>
                </div>
                <div className="home-frame15">
                  <img
                    src="/external/icondownload4611-c77h.svg"
                    alt="Icondownload"
                    className="home-icondownload"
                  />
                  <span className="home-text12">Descargar PDF</span>
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
              <div className="home-sidebar">
                <div className="home-side-panel-menu">
                  {/* Esto debería ser dinámico en un futuro, mostrando los tests de la empresa */}
                  <div className="home-menuitem1">
                    <span className="home-text15">20 de octubre 2025</span>
                  </div>
                  <div className="home-menuitem2">
                    <span className="home-text16">3 de marzo 2025</span>
                  </div>
                </div>
              </div>
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

                <div className="home-graphic-explanation">
                  <div className="home-score-graphic">
                      <div className="home-frame1321316820">
                          <div className="home-frame1321316831">
                              <img src="/external/ellipse54632-wuko-200h.png" alt="Ellipse5" className="home-ellipse51" />
                              <div className="home-categoria21">
                                  <span className="home-text20">Transformación</span>
                                  <span className="home-text21">8.00 - 10.00</span>
                              </div>
                          </div>
                          <img src="/external/rectangle34633-era-200h.png" alt="Rectangle3" className="home-rectangle3" />
                      </div>
                      <div className="home-frame1321316819">
                          <div className="home-frame1321316832">
                              <img src="/external/ellipse54633-iuum-200h.png" alt="Ellipse5" className="home-ellipse52" />
                              <div className="home-categoria22">
                                  <span className="home-text22">Escalamiento</span>
                                  <span className="home-text23">6.00 - 7.99</span>
                              </div>
                          </div>
                          <img src="/external/rectangle24633-kw5g-200h.png" alt="Rectangle2" className="home-rectangle2" />
                      </div>
                      <div className="home-frame1321316818">
                          <div className="home-frame1321316833">
                              <img src="/external/ellipse54634-po4g-200h.png" alt="Ellipse5" className="home-ellipse53" />
                              <div className="home-categoria23">
                                  <span className="home-text24">Pilotaje</span>
                                  <span className="home-text25">4.00 - 5.99</span>
                              </div>
                          </div>
                          <img src="/external/rectangle14634-e4y5-200h.png" alt="Rectangle1" className="home-rectangle11" />
                      </div>
                      <div className="home-frame1321316817">
                          <div className="home-frame1321316834">
                              <img src="/external/ellipse54634-2nss-200h.png" alt="Ellipse5" className="home-ellipse54" />
                              <div className="home-categoria1">
                                  <span className="home-text26">Fundamentos</span>
                                  <span className="home-text27">2.00 - 3.99</span>
                              </div>
                          </div>
                          <img src="/external/rectangle14635-p0kd-200h.png" alt="Rectangle1" className="home-rectangle12" />
                      </div>
                      <div className="home-frame-exploracion">
                          <div className="home-frame-exploracion-content">
                              <img src="/external/ellipse54634-2nss-200h.png" alt="Ellipse5" className="home-ellipse54" />
                              <div className="home-categoria1">
                                  <span className="home-text26">Exploración</span>
                                  <span className="home-text27">0.00 - 1.99</span>
                              </div>
                          </div>
                          <img src="/external/rectangle14635-p0kd-200h.png" alt="Rectangle1" className="home-rectangle12" />
                      </div>
                      <img src="/external/rectangle44635-jb8p-200w.png" alt="Rectangle4" className={`home-rectangle4 categoria-${categoria_estilo}`} />
                      <img src="/external/vector14635-go29.svg" alt="Vector1" className="home-vector1" />
                      <img src="/external/ellipse44635-ujdp-200h.png" alt="Ellipse4" className={`home-ellipse4 categoria-${categoria_estilo}`} />
                  </div>
                  <div className="home-tooltip">
                      <img src="/external/buttoniconhelpcircle4635-onsr.svg" alt="ButtonIconhelpcircle" className="home-button-iconhelpcircle" />
                  </div>
                </div>

                <div className="home-comparison">
                  <img src="/external/iconbulb4636-dfqs.svg" alt="Iconbulb" className="home-iconbulb" />
                  <span className="home-text30">
                    <span className="home-text31">La puntuación de tu organización es </span>
                    <span className="home-text32">43% mejor </span>
                    <span>que el de las organizaciones que han completado este assessment.</span>
                  </span>
                </div>

                <div className="home-scores-categories">
                  <div className="home-container3">
                    <span className="home-text34">Puntuación de madurez por áreas</span>
                    <div className="home-frame-cards-all">
                        <div className="home-frame-cards-row">
                            {puntajes_areas.slice(0, 3).map((area, index) => (
                                <div className="home-card-sub-score1" key={index}>
                                    <div className="home-number-card1">
                                        <span className="home-text35">{area.nombre}</span>
                                        <div className="home-numberdetail1">
                                            <div className="home-frame13213168111">
                                                <span className="home-text36">{area.puntaje.toFixed(2)}</span>
                                                <div className="home-frame13213168301">
                                                    <span className="home-text37">+3%</span>
                                                </div>
                                            </div>
                                            <span className="home-text38">{area.nivel}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="home-frame-cards-row">
                            {puntajes_areas.slice(3, 6).map((area, index) => (
                                <div className="home-card-sub-score1" key={index + 3}>
                                    <div className="home-number-card1">
                                        <span className="home-text35">{area.nombre}</span>
                                        <div className="home-numberdetail1">
                                            <div className="home-frame13213168111">
                                                <span className="home-text36">{area.puntaje.toFixed(2)}</span>
                                                <div className="home-frame13213168301">
                                                    <span className="home-text37">+3%</span>
                                                </div>
                                            </div>
                                            <span className="home-text38">{area.nivel}</span>
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

                <div className="home-container4">
                  <div className="home-dashboard-chart">
                    <span className="home-text65">Distribución de Niveles por área</span>
                    <div className="home-container5" style={{width: '500px', height: '500px'}}>
                        <Radar data={radarChartData} options={radarChartOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-footer">
            <img
              className="home-footer-logo"
              src="/external/Logo_negro_NEO_footer.svg"
              alt="Logo Neo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
