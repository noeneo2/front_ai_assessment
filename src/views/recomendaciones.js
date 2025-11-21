import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import { auth } from '../firebase';
import APIService from '../services/api';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

import './recomendaciones.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Recomendaciones = (props) => {
  const { reportData, companyName, setReportData } = useContext(ReportContext);
  const navigate = useNavigate();
  const [selectedRecommendations, setSelectedRecommendations] = useState({});
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [showRadarChart, setShowRadarChart] = useState(false);

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  const handleGoToProjects = () => {
    navigate('/projectpage');
  };

  const toggleRecommendation = (index) => {
    setSelectedRecommendations(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const calculateSimulatedScores = () => {
    if (!reportData || !reportData.puntajes_areas) return [];

    return reportData.puntajes_areas.map(area => {
      // Find if there's a recommendation for this area that is selected
      // Assuming 1-to-1 mapping by index or name. 
      // Since reportData.recommendations might not have 'area' field explicitly in all mocks,
      // we'll assume the order matches or try to match by name if available.
      // For now, let's assume reportData.recommendations has a 'dimension' field matching area.nombre

      const recIndex = reportData.recommendations ? reportData.recommendations.findIndex(r => r.dimension === area.nombre) : -1;
      const isSelected = recIndex !== -1 && selectedRecommendations[recIndex];

      // Rule: Increase level by 1. Levels are 2 points wide. So +2.0 points.
      // Cap at 10.0
      let simulatedScore = area.puntaje;
      let increase = 0;

      if (isSelected) {
        increase = 2.0;
        simulatedScore = Math.min(10, simulatedScore + increase);
      }

      return {
        ...area,
        simulatedScore,
        increasePercentage: isSelected ? Math.round((increase / area.puntaje) * 100) : 0
      };
    });
  };

  const simulatedAreas = calculateSimulatedScores();
  const simulatedTotalScore = simulatedAreas.length > 0
    ? simulatedAreas.reduce((acc, curr) => acc + curr.simulatedScore, 0) / simulatedAreas.length
    : 0;

  const originalTotalScore = reportData && reportData.puntaje_general ? reportData.puntaje_general : 0;
  const totalIncreasePercentage = originalTotalScore > 0
    ? Math.round(((simulatedTotalScore - originalTotalScore) / originalTotalScore) * 100)
    : 0;

  // Prepare Radar Chart Data
  const radarChartData = {
    labels: simulatedAreas.map(area => area.nombre),
    datasets: [
      {
        label: 'Puntuación Actual',
        data: simulatedAreas.map(area => area.puntaje),
        backgroundColor: 'rgba(102, 102, 102, 0.2)',
        borderColor: 'rgba(102, 102, 102, 1)',
        borderWidth: 1,
      },
      {
        label: 'Puntuación Simulada',
        data: simulatedAreas.map(area => area.simulatedScore),
        backgroundColor: 'rgba(0, 0, 51, 0.2)',
        borderColor: '#000033',
        borderWidth: 2,
      },
    ],
  };

  const radarChartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: '#e0e0e0',
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent',
          font: {
            family: 'Montserrat',
            size: 10
          }
        },
        pointLabels: {
          font: {
            size: 11,
            family: 'Montserrat',
            weight: 'bold'
          },
          color: '#333'
        }
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Montserrat',
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="recom-container1">
      <Helmet>
        <title>Recomendaciones - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div className="recom-dashboard-recommendations">
        <div className="recom-content">
          <div className="recom-main-content1">
            <div className="recom-header-dashboard">


              <div className="recom-header-frame">

                <div className="recom-header-1">

                  <div className="recom-nav-buttons">
                    <button className="recom-nav-button" onClick={handleGoToProjects}>
                      <svg className="recom-nav-button-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor" />
                      </svg>
                      <span>Todos los proyectos</span>
                    </button>
                    <button className="recom-nav-button" onClick={handleLogout}>
                      <svg className="recom-nav-button-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>

                <div className="recom-header-2">
                  <div className="recom-titleand-status-container">
                    <div className="recom-title-container">
                      <span className="recom-text10">
                        {companyName}
                      </span>
                    </div>

                    <div className="recom-frame1321316829">
                      <div className="recom-project-status">
                        <img
                          src="/external/statusdot4611-npxr-200h.png"
                          alt="StatusDot4611"
                          className="recom-status-dot"
                        />
                        <span className="recom-text11">Análisis éxitoso</span>
                      </div>
                      <img
                        src="/external/iconrefresh4611-0oe.svg"
                        alt="Iconrefresh4611"
                        className="recom-iconrefresh"
                      />
                    </div>
                  </div>


                  <div className="recom-frame15">
                    <img
                      src="/external/icondownload4611-c77h.svg"
                      alt="Icondownload4611"
                      className="recom-icondownload"
                    />
                    <span className="recom-text12">Descargar PDF</span>
                  </div>
                </div>


              </div>


              <div className="recom-tabs">

                <Link to="/dashboard" className="recom-tabitem1" style={{ textDecoration: 'none' }}>
                  <span className="recom-text13">Resultados</span>
                </Link>


                <div className="recom-tabitem2">
                  <span className="recom-text14">Recomendaciones</span>
                </div>

              </div>
            </div>
            <div className="recom-container2">
              <div className="recom-sidebar">
                <div className="recom-side-panel-menu">
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
                        className={`recom-menuitem1 ${assessment.project_id === currentAssessmentId ? 'active' : ''}`}
                        onClick={() => handleAssessmentClick(assessment)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: assessment.project_id === currentAssessmentId ? 'rgba(51, 51, 51, 0.08)' : 'transparent',
                          borderLeft: assessment.project_id === currentAssessmentId ? '3px solid var(--dl-color-default-neoblue)' : 'none'
                        }}
                      >
                        <span className="recom-text15">
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
              <div className="recom-main-content2">
                <div className="recom-frame1321316841">
                  <span className="recom-text17">
                    Iniciativas recomendadas para subir de nivel
                  </span>
                  <div className="recom-comparison">
                    <div className="recom-frame1321316840">
                      <div className="recom-frame1321316839">
                        <div className="recom-frame1321316842">
                          <span className="recom-text18">Tu nivel actual</span>
                          <div className="recom-frame1321316833">
                            <img
                              src="/external/ellipse54615-xg0p-200h.png"
                              alt="Ellipse54615"
                              className="recom-ellipse51"
                            />
                            <div className="recom-categoria21">
                              <span className="recom-text19">
                                {reportData ? reportData.categoria_general : 'N/A'}
                              </span>
                              <span className="recom-text20">{originalTotalScore.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <img
                          src="/external/iconarrowback4615-w2oh.svg"
                          alt="Iconarrowback4615"
                          className="recom-iconarrowback"
                        />
                        <div className="recom-frame1321316843">
                          <span className="recom-text21">
                            Nivel simulado
                          </span>
                          <div className="recom-frame1321316832">
                            <img
                              src="/external/ellipse54615-and-200h.png"
                              alt="Ellipse54615"
                              className="recom-ellipse52"
                            />
                            <div className="recom-categoria22">
                              <span className="recom-text22">
                                {simulatedTotalScore >= 8 ? 'Transformación' :
                                  simulatedTotalScore >= 6 ? 'Escalamiento' :
                                    simulatedTotalScore >= 4 ? 'Pilotaje' :
                                      simulatedTotalScore >= 2 ? 'Fundamentos' : 'Exploración'}
                              </span>
                              <span className="recom-text23">{simulatedTotalScore.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="recom-frame1321316844">
                        <div className="recom-frame1321316846">
                          <img
                            src="/external/iconbulb4615-pnyd.svg"
                            alt="Iconbulb4615"
                            className="recom-iconbulb"
                          />
                          <span className="recom-text24">
                            {reportData && reportData.recommendations ? reportData.recommendations.length : 0} iniciativas recomendadas
                          </span>
                        </div>
                        <div className="recom-frame13213168451">
                          <img
                            src="/external/iconcalendarminus4615-bjju.svg"
                            alt="Iconcalendarminus4615"
                            className="recom-iconcalendarminus1"
                          />
                          <span className="recom-text25">
                            <span className="recom-text26">Tiempo estimado: </span>
                            <span>2-3 meses</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations mapped from context */}
                {reportData && reportData.recommendations && reportData.recommendations.map((rec, index) => (
                  <div className="recom-card-recommendation1" key={index}>
                    <div className="recom-number-card10">
                      <span className="recom-text28">{rec.title}</span>
                      <div className="recom-frame13213168491">
                        <div className="recom-frame13213168481">
                          <span className="recom-text29">{rec.description}</span>
                          <div className="recom-frame13213168521">
                            <div className="recom-frame13213168452">
                              <img
                                src="/external/iconcalendarminusi461-vuk.svg"
                                alt="IconcalendarminusI461"
                                className="recom-iconcalendarminus2"
                              />
                              <span className="recom-text30">
                                <span className="recom-text31">Tiempo estimado: </span>
                                <span>{rec.estimated_time}</span>
                              </span>
                            </div>
                            <div className="recom-frame13213168301">
                              <span className="recom-text33">{rec.priority}</span>
                            </div>
                          </div>
                        </div>
                        <div className="recom-toggle1">
                          <div
                            className="recom-switch1"
                            onClick={() => toggleRecommendation(index)}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: selectedRecommendations[index] ? 'var(--dl-color-default-neoblue)' : '#ccc',
                              alignItems: selectedRecommendations[index] ? 'flex-end' : 'flex-start'
                            }}
                          >
                            <div className="recom-circle1"></div>
                          </div>
                          <span className="recom-text34">Incluir en simulación</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="recom-scores-categories">
                  <div className="recom-container3">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                      <div className="recom-frame1321316851">
                        <img
                          src="/external/iconcalculator4618-ajzq.svg"
                          alt="Iconcalculator4618"
                          className="recom-iconcalculator"
                        />
                        <span className="recom-text49">Puntuación simulada</span>
                      </div>

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
                      <div className="recom-container-radar" style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center' }}>
                        <div className="recom-frame-radar" style={{ width: '500px', height: '100%' }}>
                          <Radar data={radarChartData} options={radarChartOptions} />
                        </div>
                      </div>
                    ) : (
                      <div className="recom-frame1321316812">
                        <div className="recom-frame13213168151">
                          <div className="recom-frame1321316813">

                            {/* Render simulated areas dynamically */}
                            {simulatedAreas.slice(0, 4).map((area, i) => (
                              <div className={`recom-card-sub-score${i + 1}`} key={i}>
                                <div className={`recom-number-card${13 + i}`}>
                                  <span className="recom-text-area-name">{area.nombre}</span>
                                  <div className={`recom-numberdetail${i + 1}`}>
                                    <div className={`recom-frame1321316811${i + 1}`}>
                                      <span className="recom-text-area-score">{area.simulatedScore.toFixed(2)}</span>
                                      {area.increasePercentage > 0 && (
                                        <div className={`recom-frame1321316830${4 + i}`}>
                                          <span className="recom-text-increase-percentage">+{area.increasePercentage}%</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                          </div>
                          <div className="recom-frame1321316850">
                            <div className="recom-frame1321316847">
                              <div className="recom-frame1321316814">

                                {simulatedAreas.slice(4, 6).map((area, i) => (
                                  <div className={`recom-card-sub-score${5 + i}`} key={i + 4}>
                                    <div className={`recom-number-card${17 + i}`}>
                                      <span className="recom-text-area-name">{area.nombre}</span>
                                      <div className={`recom-numberdetail${5 + i}`}>
                                        <div className={`recom-frame1321316811${5 + i}`}>
                                          <span className="recom-text-area-score">{area.simulatedScore.toFixed(2)}</span>
                                          {area.increasePercentage > 0 && (
                                            <div className={`recom-frame1321316830${7 + i}`}>
                                              <span className="recom-text-increase-percentage">+{area.increasePercentage}%</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              </div>
                            </div>
                            <div className="recom-frame13213168152">
                              <div className="recom-card-sub-score7">
                                <div className="recom-number-card19">
                                  <span className="recom-text67">Total</span>
                                  <div className="recom-numberdetail7">
                                    <div className="recom-frame13213168117">
                                      <span className="recom-text68">{simulatedTotalScore.toFixed(2)}</span>
                                      {totalIncreasePercentage > 0 && (
                                        <div className="recom-frame13213168309">
                                          <span className="recom-text69">+{totalIncreasePercentage}%</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="recom-footer">
            <div className="recom-page-links">
              <div className="recom-logos">
                <div className="recom-logo">
                  <div className="recom-logonegro-neo1">
                    <div className="recom-clippathgroup">
                      <div className="recom-clip0570710460">
                        <img
                          src="/external/vectori461-zvra.svg"
                          alt="VectorI461"
                          className="recom-vector1"
                        />
                      </div>
                      <div className="recom-group">
                        <img
                          src="/external/vectori461-43f.svg"
                          alt="VectorI461"
                          className="recom-vector2"
                        />
                        <img
                          src="/external/vectori461-8hgw.svg"
                          alt="VectorI461"
                          className="recom-vector3"
                        />
                        <img
                          src="/external/vectori461-xpo.svg"
                          alt="VectorI461"
                          className="recom-vector4"
                        />
                        <img
                          src="/external/vectori461-65y.svg"
                          alt="VectorI461"
                          className="recom-vector5"
                        />
                        <img
                          src="/external/vectori461-1d7.svg"
                          alt="VectorI461"
                          className="recom-vector6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="recom-footer-link-column">
                <span className="recom-text70">Neo Consulting. 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recomendaciones;
