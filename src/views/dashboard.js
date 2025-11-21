import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import { auth } from '../firebase';
import APIService from '../services/api';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

import './dashboard.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Dashboard = (props) => {
  const { reportData, companyName, setReportData } = useContext(ReportContext);
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [showRadarChart, setShowRadarChart] = useState(true);

  useEffect(() => {
    if (!reportData) {
      navigate('/projectpage');
      return;
    }

    // Set current assessment ID
    if (reportData.project_id) {
      setCurrentAssessmentId(reportData.project_id);
    }

    // Load all assessments for this company
    const loadAssessments = async () => {
      const user = auth.currentUser;
      if (!user || !companyName) return;

      try {
        setLoadingAssessments(true);
        const companyAssessments = await APIService.getCompanyAssessments(companyName, user.uid);
        setAssessments(companyAssessments);
        setLoadingAssessments(false);
      } catch (error) {
        console.error('Error loading assessments:', error);
        setLoadingAssessments(false);
      }
    };

    loadAssessments();
  }, [reportData, navigate, companyName]);

  const toggleAccordion = (index) => {
    setExpandedAccordions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleAssessmentClick = async (assessment) => {
    if (assessment.project_id === currentAssessmentId) return; // Already selected

    try {
      const assessmentData = await APIService.getAssessment(assessment.project_id);
      setReportData(assessmentData);
      setCurrentAssessmentId(assessment.project_id);
    } catch (error) {
      console.error('Error loading assessment:', error);
      alert('Error al cargar el assessment');
    }
  };

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
        backgroundColor: 'rgba(19, 19, 178, 0.1)',
        borderColor: 'var(--dl-color-default-neoblue)',
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
          stepSize: 2,
          font: {
            family: 'Montserrat',
            size: 12
          }
        },
        pointLabels: {
          font: {
            family: 'Montserrat',
            size: 14,
            weight: 'bold'
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Montserrat',
            size: 14
          }
        }
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

                <div className="home-header-1">
                  <div className="home-nav-buttons">
                    <button className="home-nav-button" onClick={() => navigate('/projectpage')}>
                      <svg className="home-nav-button-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
                      </svg>
                      <span>Todos los proyectos</span>
                    </button>
                    <button className="home-nav-button" onClick={async () => {
                      try {
                        await auth.signOut();
                        navigate('/');
                      } catch (error) {
                        console.error('Error al cerrar sesión:', error);
                      }
                    }}>
                      <svg className="home-nav-button-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>

                <div className="home-header-2">
                  <div className="home-titleand-status-container">
                    <div className="home-title-container">
                      <span className="home-text10">
                        {companyName}
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
                  {loadingAssessments ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Cargando...</span>
                    </div>
                  ) : assessments.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>No hay assessments</span>
                    </div>
                  ) : (
                    assessments.map((assessment) => (
                      <div
                        key={assessment.project_id}
                        className={`home-menuitem1 ${assessment.project_id === currentAssessmentId ? 'active' : ''}`}
                        onClick={() => handleAssessmentClick(assessment)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: assessment.project_id === currentAssessmentId ? 'rgba(51, 51, 51, 0.08)' : 'transparent',
                          borderLeft: assessment.project_id === currentAssessmentId ? '3px solid var(--dl-color-default-neoblue)' : 'none'
                        }}
                      >
                        <span className="home-text15">
                          {new Date(assessment.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    ))
                  )}
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
                    {/* Nivel 5: Transformación */}
                    <div
                      className="home-frame1321316820"
                      style={{
                        backgroundColor: categoria_general === 'Transformación' ? 'rgba(19, 19, 178, 0.1)' : 'transparent',
                        border: categoria_general === 'Transformación' ? '1px solid rgba(0, 0, 51, 1)' : '1px solid transparent',

                      }}
                    >
                      <div className="home-frame1321316831">
                        <img
                          src="/external/ellipse54632-wuko-200h.png"
                          alt="Ellipse5"
                          className="home-ellipse51"
                          style={{ opacity: categoria_general === 'Transformación' ? 1 : 0.4 }}
                        />
                        <div className="home-categoria21">
                          <span className="home-text20" style={{
                            fontWeight: categoria_general === 'Transformación' ? 'bold' : 'normal',
                            color: categoria_general === 'Transformación' ? 'var(--dl-color-default-neoblue)' : 'var(--dl-color-default-gris)'
                          }}>
                            Transformación
                          </span>
                          <span className="home-text21">8.00 - 10.00</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle34633-era-200h.png"
                        alt="Rectangle3"
                        className="home-rectangle3"
                        style={{ opacity: categoria_general === 'Transformación' ? 1 : 0.3 }}
                      />
                    </div>

                    {/* Nivel 4: Escalamiento */}
                    <div
                      className="home-frame1321316819"
                      style={{
                        backgroundColor: categoria_general === 'Escalamiento' ? 'rgba(19, 19, 178, 0.1)' : 'transparent',
                        border: categoria_general === 'Escalamiento' ? '1px solid rgba(0, 0, 51, 1)' : '1px solid transparent',

                      }}
                    >
                      <div className="home-frame1321316832">
                        <img
                          src="/external/ellipse54633-iuum-200h.png"
                          alt="Ellipse5"
                          className="home-ellipse52"
                          style={{ opacity: categoria_general === 'Escalamiento' ? 1 : 0.4 }}
                        />
                        <div className="home-categoria22">
                          <span className="home-text22" style={{
                            fontWeight: categoria_general === 'Escalamiento' ? 'bold' : 'normal'
                            , color: categoria_general === 'Escalamiento' ? 'var(--dl-color-default-neoblue)' : 'var(--dl-color-default-gris)'
                          }}>
                            Escalamiento
                          </span>
                          <span className="home-text23">6.00 - 7.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle24633-kw5g-200h.png"
                        alt="Rectangle2"
                        className="home-rectangle2"
                        style={{ opacity: categoria_general === 'Escalamiento' ? 1 : 0.3 }}
                      />
                    </div>

                    {/* Nivel 3: Pilotaje */}
                    <div
                      className="home-frame1321316818"
                      style={{
                        backgroundColor: categoria_general === 'Pilotaje' ? 'rgba(19, 19, 178, 0.1)' : 'transparent',
                        border: categoria_general === 'Pilotaje' ? '1px solid rgba(0, 0, 51, 1)' : '1px solid transparent',

                      }}
                    >
                      <div className="home-frame1321316833">
                        <img
                          src="/external/ellipse54634-po4g-200h.png"
                          alt="Ellipse5"
                          className="home-ellipse53"
                          style={{ opacity: categoria_general === 'Pilotaje' ? 1 : 0.4 }}
                        />
                        <div className="home-categoria23">
                          <span className="home-text24" style={{
                            fontWeight: categoria_general === 'Pilotaje' ? 'bold' : 'normal',
                            color: categoria_general === 'Pilotaje' ? 'var(--dl-color-default-neoblue)' : 'var(--dl-color-default-gris)'
                          }}>
                            Pilotaje
                          </span>
                          <span className="home-text25">4.00 - 5.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle14634-e4y5-200h.png"
                        alt="Rectangle1"
                        className="home-rectangle11"
                        style={{ opacity: categoria_general === 'Pilotaje' ? 1 : 0.3 }}
                      />
                    </div>

                    {/* Nivel 2: Fundamentos */}
                    <div
                      className="home-frame1321316817"
                      style={{
                        backgroundColor: categoria_general === 'Fundamentos' ? 'rgba(19, 19, 178, 0.1)' : 'transparent',
                        border: categoria_general === 'Fundamentos' ? '1px solid rgba(0, 0, 51, 1)' : '1px solid transparent',

                      }}
                    >
                      <div className="home-frame1321316834">
                        <img
                          src="/external/ellipse54634-2nss-200h.png"
                          alt="Ellipse5"
                          className="home-ellipse54"
                          style={{ opacity: categoria_general === 'Fundamentos' ? 1 : 0.4 }}
                        />
                        <div className="home-categoria1">
                          <span className="home-text26" style={{
                            fontWeight: categoria_general === 'Fundamentos' ? 'bold' : 'normal',
                            color: categoria_general === 'Fundamentos' ? 'var(--dl-color-default-neoblue)' : 'var(--dl-color-default-gris)'
                          }}>
                            Fundamentos
                          </span>
                          <span className="home-text27">2.00 - 3.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle14635-p0kd-200h.png"
                        alt="Rectangle1"
                        className="home-rectangle12"
                        style={{ opacity: categoria_general === 'Fundamentos' ? 1 : 0.3 }}
                      />
                    </div>

                    {/* Nivel 1: Exploración */}
                    <div
                      className="home-frame-exploracion"
                      style={{
                        backgroundColor: categoria_general === 'Exploración' ? 'rgba(19, 19, 178, 0.1)' : 'transparent',
                        border: categoria_general === 'Exploración' ? '1px solid rgba(0, 0, 51, 1)' : '1px solid transparent',

                      }}
                    >
                      <div className="home-frame-exploracion-content">
                        <img
                          src="/external/ellipse54634-2nss-200h.png"
                          alt="Ellipse5"
                          className="home-ellipse54"
                          style={{ opacity: categoria_general === 'Exploración' ? 1 : 0.4 }}
                        />
                        <div className="home-categoria1">
                          <span className="home-text26" style={{
                            fontWeight: categoria_general === 'Exploración' ? 'bold' : 'normal',
                            color: categoria_general === 'Exploración' ? 'var(--dl-color-default-neoblue)' : 'var(--dl-color-default-gris)'
                          }}>
                            Exploración
                          </span>
                          <span className="home-text27">0.00 - 1.99</span>
                        </div>
                      </div>
                      <img
                        src="/external/rectangle14635-p0kd-200h.png"
                        alt="Rectangle1"
                        className="home-rectangle12"
                        style={{ opacity: categoria_general === 'Exploración' ? 1 : 0.3 }}
                      />
                    </div>
                    <img
                      src="/external/rectangle44635-jb8p-200w.png"
                      alt="Rectangle4"
                      className={`home-rectangle4 categoria-${categoria_estilo}`}
                      style={{
                        left: categoria_general === 'Exploración' ? '302px' :
                          categoria_general === 'Fundamentos' ? '407px' :
                            categoria_general === 'Pilotaje' ? '687px' :
                              categoria_general === 'Escalamiento' ? '827px' :
                                categoria_general === 'Transformación' ? '902px' : '302px'
                      }}
                    />
                    <img src="/external/vector14635-go29.svg" alt="Vector1" className="home-vector1" />
                    <img
                      src="/external/ellipse44635-ujdp-200h.png"
                      alt="Ellipse4"
                      className={`home-ellipse4 categoria-${categoria_estilo}`}
                      style={{
                        top: categoria_general === 'Exploración' ? '380px' :
                          categoria_general === 'Fundamentos' ? '295px' :
                            categoria_general === 'Pilotaje' ? '215px' :
                              categoria_general === 'Escalamiento' ? '125px' :
                                categoria_general === 'Transformación' ? '40px' : '380px',
                        left: categoria_general === 'Exploración' ? '325px' :
                          categoria_general === 'Fundamentos' ? '430px' :
                            categoria_general === 'Pilotaje' ? '710px' :
                              categoria_general === 'Escalamiento' ? '850px' :
                                categoria_general === 'Transformación' ? '925px' : '325px'
                      }}
                    />
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span className="home-text34">Puntuación de madurez por áreas</span>

                      <div className="view-switch" style={{ display: 'flex', gap: '4px', backgroundColor: '#f0f0f0', borderRadius: '8px', padding: '4px' }}>
                        <button
                          onClick={() => setShowRadarChart(true)}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: showRadarChart ? 'var(--dl-color-default-neoblue)' : 'transparent',
                            transition: 'background-color 0.3s ease'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={showRadarChart ? '#ffffff' : '#666666'}>
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        </button>

                        <button
                          onClick={() => setShowRadarChart(false)}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            backgroundColor: !showRadarChart ? 'var(--dl-color-default-neoblue)' : 'transparent',
                            transition: 'background-color 0.3s ease'
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={!showRadarChart ? '#ffffff' : '#666666'}>
                            <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>


                    {showRadarChart ? (
                      <div className="home-container-radar" style={{ width: '500px', height: '500px' }}>
                        <div className="home-frame-radar" style={{ width: '100%', height: '100%' }}>
                          <Radar data={radarChartData} options={radarChartOptions} />
                        </div>
                      </div>
                    ) : (
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
                    )}

                  </div>
                </div>

                <div className="home-frame1321316826">
                  <span className="home-text59">¿Qué implica cada nivel?</span>

                  <div className="home-accordion-list">
                    {niveles.map((nivel, index) => (
                      <div className="home-accordion-item1" key={index}>
                        <div
                          className="home-question1"
                          onClick={() => toggleAccordion(index)}
                          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span className="home-text60">{nivel.nombre}</span>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{
                              transform: expandedAccordions.includes(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }}
                          >
                            <path d="M7 10l5 5 5-5z" fill="currentColor" />
                          </svg>
                        </div>
                        {expandedAccordions.includes(index) && (
                          <div className="home-answer">
                            <span className="home-text61">{nivel.descripcion}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>


                </div>

                <div className="home-container4">
                  <div className="home-dashboard-chart">
                    <span className="home-text65">Distribución de Niveles por área</span>


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