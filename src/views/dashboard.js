import React, { useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

import './dashboard.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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
    puntaje_general: 5.3,
          categoria_general: "Pilotaje",
          categoria_estilo: "pilotaje",
          descripcion_general: "La organización ha definido una estrategia para la adopción de la IA generativa y está estandarizando procesos y mejores prácticas.",
          puntajes_areas: [
            { nombre: "Personas y Cultura", puntaje: 8.2, nivel: "Escalamiento" },
            { nombre: "Governance", puntaje: 7.8, nivel: "Escalamiento"  },
            { nombre: "Data & Tecnología", puntaje: 6.1, nivel: "Escalamiento" },
            { nombre: "Procesos", puntaje: 7.9, nivel: "Escalamiento" },
            { nombre: "Proyectos", puntaje: 7.5, nivel: "Escalamiento" },
            { nombre: "Estrategia", puntaje: 5.9, nivel: "Pilotaje" },
          ],
          niveles: [
            { nombre: "Nivel 1: Exploración", descripcion: "La organización está comenzando a explorar el potencial de la IA generativa. El conocimiento es limitado y no hay una estrategia formal." },
            { nombre: "Nivel 2: Fundamentos", descripcion: "Se han implementado algunas iniciativas de IA generativa de forma aislada. Hay conciencia de los beneficios, pero falta una estrategia cohesiva." },
            { nombre: "Nivel 3: Pilotaje", descripcion: "La organización ha definido una estrategia para la adopción de la IA generativa y está estandarizando procesos y mejores prácticas." },
            { nombre: "Nivel 4: Escalamiento", descripcion: "La IA generativa se utiliza de forma estratégica en toda la organización. Existe una cultura de innovación y experimentación con IA." },
            { nombre: "Nivel 5: Transformación", descripcion: "La organización utiliza la IA generativa para transformar sus operaciones y modelos de negocio. La IA es una parte integral de la estrategia y la cultura." }
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

  const radarChartData = {
    labels: ['Personas y Cultura', 'Governance', 'Data & Tecnología', 'Procesos', 'Proyectos', 'Estrategia'],
    datasets: [
      {
        label: 'Puntaje de Madurez',
        data: [8, 7, 6, 9, 7, 5],
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
      },
    },
  };

  return (
    <div class="home-container1">
      <Helmet>
        <title>Dashboard - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div class="home-dashboard-score-animating">
        <div class="home-content">
          <div class="home-main-content1">
            <div class="home-header-dashboard">

              <div class="home-header-frame">
                
                <div class="home-titleand-status-container">
                  <div class="home-title-container">
                    <span class="home-text10">
                      Madurez Organizacional en Gen AI
                    </span>
                  </div>

                  <div class="home-frame1321316829">
                    <div class="home-project-status">
                      <img
                        src="/external/statusdot4628-j2h5-200h.png"
                        alt="StatusDot4628"
                        class="home-status-dot"
                      />
                      <span class="home-text11">Análisis éxitoso</span>
                    </div>
                    <img
                      src="/external/iconrefresh4611-0oe.svg"
                      alt="Iconrefresh4611"
                      class="recom-iconrefresh"
                    />
                  </div>
                </div>

                <div class="home-frame15">
                  <img
                    src="/external/icondownload4611-c77h.svg"
                    alt="Icondownload4611"
                    class="home-icondownload"
                  />
                  <span class="home-text12">Descargar PDF</span>
                </div>

              </div>


              <div class="home-tabs">

                <div class="home-tabitem1">
                  <span class="home-text13">Resultados</span>
                </div>

                <Link to="/recomendaciones" class="home-tabitem2" style={{ textDecoration: 'none' }}>
                  <span class="home-text14">Recomendaciones</span>
                </Link>

              </div>
            </div>
            <div class="home-container2">
              <div class="home-sidebar">
                <div class="home-side-panel-menu">
                  <div class="home-menuitem1">
                    <span class="home-text15">20 de octubre 2025</span>
                  </div>
                  <div class="home-menuitem2">
                    <span class="home-text16">3 de marzo 2025</span>
                  </div>
                </div>
              </div>
              <div class="home-main-content2">
                <div class="home-frame1321316835">
                  <div class="home-frame1321316837">
                    <div class="home-frame1321316836">
                      <span class="home-text17">{puntaje_general.toFixed(2)}</span>
                    </div>
                  </div>
                  <div class="home-score">
                    <span class="home-text18">{categoria_general}</span>
                    <span class="home-text19">{descripcion_general}</span>
                  </div>
                </div>


                <div class="home-graphic-explanation">
                <div class="home-score-graphic">
                  <div class="home-frame1321316820">
                    <div class="home-frame1321316831">
                      <img
                        src="/external/ellipse54632-wuko-200h.png"
                        alt="Ellipse54632"
                        class="home-ellipse51"
                      />
                      <div class="home-categoria21">
                        <span class="home-text20">Transformación</span>
                        <span class="home-text21">8.00 - 10.00</span>
                      </div>
                    </div>
                    <img
                      src="/external/rectangle34633-era-200h.png"
                      alt="Rectangle34633"
                      class="home-rectangle3"
                    />
                  </div>
                  <div class="home-frame1321316819">
                    <div class="home-frame1321316832">
                      <img
                        src="/external/ellipse54633-iuum-200h.png"
                        alt="Ellipse54633"
                        class="home-ellipse52"
                      />
                      <div class="home-categoria22">
                        <span class="home-text22">
                          Escalamiento
                        </span>
                        <span class="home-text23">6.00 - 7.99</span>
                      </div>
                    </div>
                    <img
                      src="/external/rectangle24633-kw5g-200h.png"
                      alt="Rectangle24633"
                      class="home-rectangle2"
                    />
                  </div>
                  <div class="home-frame1321316818">
                    <div class="home-frame1321316833">
                      <img
                        src="/external/ellipse54634-po4g-200h.png"
                        alt="Ellipse54634"
                        class="home-ellipse53"
                      />
                      <div class="home-categoria23">
                        <span class="home-text24">
                          Pilotaje
                        </span>
                        <span class="home-text25">4.00 - 5.99</span>
                      </div>
                    </div>
                    <img
                      src="/external/rectangle14634-e4y5-200h.png"
                      alt="Rectangle14634"
                      class="home-rectangle11"
                    />
                  </div>
                  <div class="home-frame1321316817">
                    <div class="home-frame1321316834">
                      <img
                        src="/external/ellipse54634-2nss-200h.png"
                        alt="Ellipse54634"
                        class="home-ellipse54"
                      />
                      <div class="home-categoria1">
                        <span class="home-text26">
                          Fundamentos
                        </span>
                        <span class="home-text27">2.00 - 3.99</span>
                      </div>
                    </div>
                    <img
                      src="/external/rectangle14635-p0kd-200h.png"
                      alt="Rectangle14635"
                      class="home-rectangle12"
                    />
                  </div>
                  <div class="home-frame-exploracion">
                    <div class="home-frame-exploracion-content">
                      <img
                        src="/external/ellipse54634-2nss-200h.png"
                        alt="Ellipse54634"
                        class="home-ellipse54"
                      />
                      <div class="home-categoria1">
                        <span class="home-text26">
                          Exploración
                        </span>
                        <span class="home-text27">0.00 - 1.99</span>
                      </div>
                    </div>
                    <img
                      src="/external/rectangle14635-p0kd-200h.png"
                      alt="Rectangle14635"
                      class="home-rectangle12"
                    />
                  </div>
                  <img
                    src="/external/rectangle44635-jb8p-200w.png"
                    alt="Rectangle44635"
                    //class={`home-rectangle4 categoria-${categoria_estilo}`}
                    class="home-rectangle4"
                  />
                  <img
                    src="/external/vector14635-go29.svg"
                    alt="Vector14635"
                    class="home-vector1"
                  />
                  <img
                    src="/external/ellipse44635-ujdp-200h.png"
                    alt="Ellipse44635"
                    //class={`home-ellipse4 categoria-${categoria_estilo}`}
                    class="home-ellipse4"
                  />
                </div>
                  <div class="home-tooltip">
                    <img
                      src="/external/buttoniconhelpcircle4635-onsr.svg"
                      alt="ButtonIconhelpcircle4635"
                      class="home-button-iconhelpcircle"
                    />
                    {/*
                    <span class="home-text28">
                      ¿Cómo se calcula la puntuación?
                    </span>
                    */}
                  </div>
                </div>


                <div class="home-comparison">
                  <img
                    src="/external/iconbulb4636-dfqs.svg"
                    alt="Iconbulb4636"
                    class="home-iconbulb"
                  />
                  <span class="home-text30">
                    <span class="home-text31">
                      La puntuación de tu organización es
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span class="home-text32">
                      43% mejor
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </span>
                    <span>
                       que de las organizaciones que han completado este
                      assessment.
                    </span>
                  </span>
                </div>

                <div class="home-scores-categories">
                  <div class="home-container3">
                    <span class="home-text34">Puntuación de madurez por áreas</span>
                    <div class="home-frame-cards-all">

                      <div class="home-frame-cards-row">
                        {puntajes_areas.slice(0, 3).map((area, index) => (
                          
                          
                          <div class="home-card-sub-score1" key={index}>
                            <div class="home-number-card1">
                              <span class="home-text35">{area.nombre}</span>
                              <div class="home-numberdetail1">
                                <div class="home-frame13213168111">
                                  <span class="home-text36">{area.puntaje.toFixed(2)}</span>
                                  <div class="home-frame13213168301">
                                    <span class="home-text37">+3%</span>
                                    </div>
                                </div>
                                <span class="home-text38">
                                  {area.nivel}
                                </span>
                              </div>
                            </div>
                          </div>
                    

                        ))}
                      </div>
                      
                      <div class="home-frame-cards-row">
                        {puntajes_areas.slice(3, 6).map((area, index) => (
                          <div class="home-card-sub-score1" key={index}>
                          <div class="home-number-card1">
                            <span class="home-text35">{area.nombre}</span>
                            <div class="home-numberdetail1">
                              <div class="home-frame13213168111">
                                <span class="home-text36">{area.puntaje.toFixed(2)}</span>
                                <div class="home-frame13213168301">
                                  <span class="home-text37">+3%</span>
                                  </div>
                              </div>
                              <span class="home-text38">
                                {area.nivel}
                              </span>
                            </div>
                          </div>
                        </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="home-frame1321316826">
                  <span class="home-text59">¿Qué implica cada nivel?</span>
                  <div class="home-accordion-list">
                    {niveles.map((nivel, index) => (
                      <div class="home-accordion-item1" key={index}>
                        <div class="home-question1">
                          <span class="home-text60">{nivel.nombre}</span>
                        </div>
                        <div class="home-answer">
                          <span class="home-text61">{nivel.descripcion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                <div class="home-container4">
                  <div class="home-dashboard-chart">
                    <div class="home-dashboard">
                      <span class="home-text65">
                        Distribución de Niveles por industría (%)
                      </span>
                      <div class="home-label">
                        <div class="home-frame1321316838">
                          <div class="home-frame1">
                            <span class="home-text66">
                              Ene 2025 - Oct 2025
                            </span>
                          </div>
                          <div class="home-frame131">
                            <div class="home-frame111">
                              <img
                                src="/external/rectangle14642-jiuc-200h.png"
                                alt="Rectangle14642"
                                class="home-rectangle13"
                              />
                              <span class="home-text67">
                                Awareness y Exploración
                              </span>
                            </div>
                            <div class="home-frame12">
                              <img
                                src="/external/rectangle14642-7mrf-200h.png"
                                alt="Rectangle14642"
                                class="home-rectangle14"
                              />
                              <span class="home-text68">
                                Estrategia, Adopción e Integración
                              </span>
                            </div>
                            <div class="home-frame132">
                              <img
                                src="/external/rectangle14642-houb-200h.png"
                                alt="Rectangle14642"
                                class="home-rectangle15"
                              />
                              <span class="home-text69">
                                Escalamiento y Optimización
                              </span>
                            </div>
                            <div class="home-frame14">
                              <img
                                src="/external/rectangle14642-54eu-200h.png"
                                alt="Rectangle14642"
                                class="home-rectangle16"
                              />
                              <span class="home-text70">
                                Transformación
                              </span>
                            </div>
                          </div>
                        </div>


                        <div class="home-container5" style={{width: '500px', height: '500px'}}>
                          <Radar data={radarChartData} options={radarChartOptions} />
                        </div>
                        
                        <div class="home-frame4">
                          <div class="home-frame2">
                            <div class="home-frame81">
                              <div class="home-frame101">
                                <div class="home-frame331">
                                  <span class="home-text71">35</span>
                                </div>
                                <div class="home-frame361">
                                  <span class="home-text72">35</span>
                                </div>
                                <div class="home-frame341">
                                  <span class="home-text73">28</span>
                                </div>
                                <div class="home-frame351">
                                  <span class="home-text74">28</span>
                                </div>
                              </div>
                            </div>
                            <span class="home-text75">Retail</span>
                          </div>
                          <div class="home-frame82">
                            <div class="home-frame83">
                              <div class="home-frame102">
                                <div class="home-frame332">
                                  <span class="home-text76">35</span>
                                </div>
                                <div class="home-frame362">
                                  <span class="home-text77">35</span>
                                </div>
                                <div class="home-frame342">
                                  <span class="home-text78">28</span>
                                </div>
                                <div class="home-frame352">
                                  <span class="home-text79">28</span>
                                </div>
                              </div>
                            </div>
                            <span class="home-text80">Finanzas</span>
                          </div>
                          <div class="home-frame9">
                            <div class="home-frame84">
                              <div class="home-frame103">
                                <div class="home-frame333">
                                  <span class="home-text81">35</span>
                                </div>
                                <div class="home-frame363">
                                  <span class="home-text82">35</span>
                                </div>
                                <div class="home-frame343">
                                  <span class="home-text83">28</span>
                                </div>
                                <div class="home-frame353">
                                  <span class="home-text84">28</span>
                                </div>
                              </div>
                            </div>
                            <span class="home-text85">Seguros</span>
                          </div>
                          <div class="home-frame104">
                            <div class="home-frame85">
                              <div class="home-frame105">
                                <div class="home-frame334">
                                  <span class="home-text86">35</span>
                                </div>
                                <div class="home-frame364">
                                  <span class="home-text87">35</span>
                                </div>
                                <div class="home-frame344">
                                  <span class="home-text88">28</span>
                                </div>
                                <div class="home-frame354">
                                  <span class="home-text89">28</span>
                                </div>
                              </div>
                            </div>
                            <span class="home-text90">Turismo</span>
                          </div>
                          <div class="home-frame112">
                            <div class="home-frame86">
                              <div class="home-frame106">
                                <div class="home-frame335">
                                  <span class="home-text91">35</span>
                                </div>
                                <div class="home-frame365">
                                  <span class="home-text92">35</span>
                                </div>
                                <div class="home-frame345">
                                  <span class="home-text93">28</span>
                                </div>
                                <div class="home-frame355">
                                  <span class="home-text94">28</span>
                                </div>
                              </div>
                            </div>
                            <span class="home-text95">Belleza</span>
                          </div>
                          <div class="home-frame7">
                            <div class="_home-frame87">
                              <div class="home-frame107">
                                <div class="home-frame336">
                                  <span class="home-text96">35</span>
                                </div>
                                <div class="home-frame366">
                                  <span class="home-text97">35</span>
                                </div>
                                <div class="home-frame346">
                                  <span class="home-text98">28</span>
                                </div>
                                <div class="home-frame356">
                                  <span class="home-text99">28</span>
                                </div>
                              </div>
                            </div>
                            <span class="home-text100">
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
          <div class="home-footer">
            <img
            class="home-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />
            {/*<span class="login-footer-text">Neo Consulting, 2025</span>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
