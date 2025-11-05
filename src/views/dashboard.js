import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';

import './dashboard.css';

const Dashboard = (props) => {
  const { reportData } = useContext(ReportContext);
  const navigate = useNavigate();

  // Se comenta el useEffect para permitir el acceso directo al dashboard para simulación
  /*
  useEffect(() => {
    if (!reportData) {
      navigate('/');
    }
  }, [reportData, navigate]);
  */

  // Datos de simulación
  const mockReportData = {
    puntaje_general: 2.3,
    categoria_general: "Estrategia, Adopción e Integración",
    categoria_estilo: "estrategia-adopcion-e-integracion",
    descripcion_general: "La organización demuestra un uso sofisticado de la IA generativa, con una estrategia clara y un alto nivel de adopción en múltiples áreas.",
    puntajes_areas: [
      { nombre: "Estrategia y Liderazgo", puntaje: 4.2 },
      { nombre: "Cultura y Personas", puntaje: 3.8 },
      { nombre: "Procesos y Gobernanza", puntaje: 3.1 },
      { nombre: "Tecnología y Datos", puntaje: 3.9 },
      { nombre: "Casos de Uso e Impacto", puntaje: 3.5 },
      { nombre: "Ética y Riesgos", puntaje: 2.9 },
    ],
    niveles: [
      { nombre: "Nivel 1: Awareness y Exploración", descripcion: "La organización está comenzando a explorar el potencial de la IA generativa. El conocimiento es limitado y no hay una estrategia formal." },
      { nombre: "Nivel 2: Estrategia, Adopción e Integración", descripcion: "Se han implementado algunas iniciativas de IA generativa de forma aislada. Hay conciencia de los beneficios, pero falta una estrategia cohesiva." },
      { nombre: "Nivel 3: Escalamiento y Optimización", descripcion: "La organización ha definido una estrategia para la adopción de la IA generativa y está estandarizando procesos y mejores prácticas." },
      { nombre: "Nivel 4: Transformación", descripcion: "La IA generativa se utiliza de forma estratégica en toda la organización. Existe una cultura de innovación y experimentación con IA." },
      { nombre: "Nivel 5: Optimizado", descripcion: "La organización utiliza la IA generativa para transformar sus operaciones y modelos de negocio. La IA es una parte integral de la estrategia y la cultura." }
    ]
  };

  const dataToDisplay = reportData || mockReportData;

  const { 
    puntaje_general = 0, 
    categoria_general = "N/A", 
    descripcion_general = "No hay descripción disponible.", 
    puntajes_areas = [], 
    niveles = [] 
  } = dataToDisplay;

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
                    <img
                      src="/external/iconrefresh4611-0oe.svg"
                      alt="Iconrefresh4611"
                      className="recom-iconrefresh"
                    />
                  </div>
                </div>

                <div className="home-frame15">
                  <img
                    src="/external/icondownload4611-c77h.svg"
                    alt="Icondownload4611"
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
                        <img
                          src="/external/ellipse54632-wuko-200h.png"
                          alt="Ellipse54632"
                          className="home-ellipse51"
                        />
                        <div className="home-categoria21">
                          <span className="home-text20">Transformación</span>
                          <span className="home-text21">4.00 - 5.00</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle34633-era-200h.png"
                        alt="Rectangle34633"
                        className="home-rectangle3"
                      />
                    </div>
                    <div className="home-frame1321316819">
                      <div className="home-frame1321316832">
                        <img
                          src="/external/ellipse54633-iuum-200h.png"
                          alt="Ellipse54633"
                          className="home-ellipse52"
                        />
                        <div className="home-categoria22">
                          <span className="home-text22">
                            Escalamiento y Optimización
                          </span>
                          <span className="home-text23">3.00 - 3.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle24633-kw5g-200h.png"
                        alt="Rectangle24633"
                        className="home-rectangle2"
                      />
                    </div>
                    <div className="home-frame1321316818">
                      <div className="home-frame1321316833">
                        <img
                          src="/external/ellipse54634-po4g-200h.png"
                          alt="Ellipse54634"
                          className="home-ellipse53"
                        />
                        <div className="home-categoria23">
                          <span className="home-text24">
                            Estrategia, Adopción e Integración
                          </span>
                          <span className="home-text25">2.00 - 2.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle14634-e4y5-200h.png"
                        alt="Rectangle14634"
                        className="home-rectangle11"
                      />
                    </div>
                    <div className="home-frame1321316817">
                      <div className="home-frame1321316834">
                        <img
                          src="/external/ellipse54634-2nss-200h.png"
                          alt="Ellipse54634"
                          className="home-ellipse54"
                        />
                        <div className="home-categoria1">
                          <span className="home-text26">
                            Awareness y Exploración
                          </span>
                          <span className="home-text27">0.00 - 1.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle14635-p0kd-200h.png"
                        alt="Rectangle14635"
                        className="home-rectangle12"
                      />
                    </div>
                    <img
                      src="/external/rectangle44635-jb8p-200w.png"
                      alt="Rectangle44635"
                      //className={`home-rectangle4 categoria-${categoria_estilo}`}
                      className="home-rectangle4"
                    />
                    <img
                      src="/external/vector14635-go29.svg"
                      alt="Vector14635"
                      className="home-vector1"
                    />
                    <img
                      src="/external/ellipse44635-ujdp-200h.png"
                      alt="Ellipse44635"
                      //className={`home-ellipse4 categoria-${categoria_estilo}`}
                      className="home-ellipse4"
                    />
                  </div>
                  <div className="home-tooltip">
                    <img
                      src="/external/buttoniconhelpcircle4635-onsr.svg"
                      alt="ButtonIconhelpcircle4635"
                      className="home-button-iconhelpcircle"
                    />
                    <span className="home-text28">
                      ¿Cómo se calcula la puntuación?
                    </span>
                  </div>
                </div>


                <div className="home-comparison">
                  <img
                    src="/external/iconbulb4636-dfqs.svg"
                    alt="Iconbulb4636"
                    className="home-iconbulb"
                  />
                  <span className="home-text30">
                    <span className="home-text31">
                      La puntuación de tu organización es
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span className="home-text32">
                      43%
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span>
                      mejor que de las organizaciones que han completado este
                      assessment.
                    </span>
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
                                <span className="home-text38">
                                  Estrategia, Adopción e Integración
                                </span>
                              </div>
                            </div>
                          </div>
                    

                        ))}
                      </div>
                      
                      <div className="home-frame-cards-row">
                        {puntajes_areas.slice(3, 6).map((area, index) => (
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
                              <span className="home-text38">
                                Estrategia, Adopción e Integración
                              </span>
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
                    <div className="home-dashboard">
                      <span className="home-text65">
                        Distribución de Niveles por industría (%)
                      </span>
                      <div className="home-label">
                        <div className="home-frame1321316838">
                          <div className="home-frame1">
                            <span className="home-text66">
                              Ene 2025 - Oct 2025
                            </span>
                          </div>
                          <div className="home-frame131">
                            <div className="home-frame111">
                              <img
                                src="/external/rectangle14642-jiuc-200h.png"
                                alt="Rectangle14642"
                                className="home-rectangle13"
                              />
                              <span className="home-text67">
                                Awareness y Exploración
                              </span>
                            </div>
                            <div className="home-frame12">
                              <img
                                src="/external/rectangle14642-7mrf-200h.png"
                                alt="Rectangle14642"
                                className="home-rectangle14"
                              />
                              <span className="home-text68">
                                Estrategia, Adopción e Integración
                              </span>
                            </div>
                            <div className="home-frame132">
                              <img
                                src="/external/rectangle14642-houb-200h.png"
                                alt="Rectangle14642"
                                className="home-rectangle15"
                              />
                              <span className="home-text69">
                                Escalamiento y Optimización
                              </span>
                            </div>
                            <div className="home-frame14">
                              <img
                                src="/external/rectangle14642-54eu-200h.png"
                                alt="Rectangle14642"
                                className="home-rectangle16"
                              />
                              <span className="home-text70">
                                Transformación
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="home-frame4">
                          <div className="home-frame2">
                            <div className="home-frame81">
                              <div className="home-frame101">
                                <div className="home-frame331">
                                  <span className="home-text71">35</span>
                                </div>
                                <div className="home-frame361">
                                  <span className="home-text72">35</span>
                                </div>
                                <div className="home-frame341">
                                  <span className="home-text73">28</span>
                                </div>
                                <div className="home-frame351">
                                  <span className="home-text74">28</span>
                                </div>
                              </div>
                            </div>
                            <span className="home-text75">Retail</span>
                          </div>
                          <div className="home-frame82">
                            <div className="home-frame83">
                              <div className="home-frame102">
                                <div className="home-frame332">
                                  <span className="home-text76">35</span>
                                </div>
                                <div className="home-frame362">
                                  <span className="home-text77">35</span>
                                </div>
                                <div className="home-frame342">
                                  <span className="home-text78">28</span>
                                </div>
                                <div className="home-frame352">
                                  <span className="home-text79">28</span>
                                </div>
                              </div>
                            </div>
                            <span className="home-text80">Finanzas</span>
                          </div>
                          <div className="home-frame9">
                            <div className="home-frame84">
                              <div className="home-frame103">
                                <div className="home-frame333">
                                  <span className="home-text81">35</span>
                                </div>
                                <div className="home-frame363">
                                  <span className="home-text82">35</span>
                                </div>
                                <div className="home-frame343">
                                  <span className="home-text83">28</span>
                                </div>
                                <div className="home-frame353">
                                  <span className="home-text84">28</span>
                                </div>
                              </div>
                            </div>
                            <span className="home-text85">Seguros</span>
                          </div>
                          <div className="home-frame104">
                            <div className="home-frame85">
                              <div className="home-frame105">
                                <div className="home-frame334">
                                  <span className="home-text86">35</span>
                                </div>
                                <div className="home-frame364">
                                  <span className="home-text87">35</span>
                                </div>
                                <div className="home-frame344">
                                  <span className="home-text88">28</span>
                                </div>
                                <div className="home-frame354">
                                  <span className="home-text89">28</span>
                                </div>
                              </div>
                            </div>
                            <span className="home-text90">Turismo</span>
                          </div>
                          <div className="home-frame112">
                            <div className="home-frame86">
                              <div className="home-frame106">
                                <div className="home-frame335">
                                  <span className="home-text91">35</span>
                                </div>
                                <div className="home-frame365">
                                  <span className="home-text92">35</span>
                                </div>
                                <div className="home-frame345">
                                  <span className="home-text93">28</span>
                                </div>
                                <div className="home-frame355">
                                  <span className="home-text94">28</span>
                                </div>
                              </div>
                            </div>
                            <span className="home-text95">Belleza</span>
                          </div>
                          <div className="home-frame7">
                            <div className="home-frame87">
                              <div className="home-frame107">
                                <div className="home-frame336">
                                  <span className="home-text96">35</span>
                                </div>
                                <div className="home-frame366">
                                  <span className="home-text97">35</span>
                                </div>
                                <div className="home-frame346">
                                  <span className="home-text98">28</span>
                                </div>
                                <div className="home-frame356">
                                  <span className="home-text99">28</span>
                                </div>
                              </div>
                            </div>
                            <span className="home-text100">
                              Home Improvement
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="home-footer">
            {/*
          <img
            className="home-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
