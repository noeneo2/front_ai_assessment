import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import APIService from '../services/api';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

import '../views/dashboard.css'; // Reusing dashboard styles

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const SharedAssessment = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAccordions, setExpandedAccordions] = useState([]);
    const [showRadarChart, setShowRadarChart] = useState(true);
    const [activeTab, setActiveTab] = useState('results'); // 'results' or 'recommendations'

    useEffect(() => {
        const loadAssessment = async () => {
            try {
                setLoading(true);
                const data = await APIService.getPublicAssessment(token);
                setReportData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error loading public assessment:', err);
                setError('No se pudo cargar el assessment. El enlace puede ser inválido o haber expirado.');
                setLoading(false);
            }
        };

        loadAssessment();
    }, [token]);

    const toggleAccordion = (index) => {
        setExpandedAccordions(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Cargando assessment...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!reportData) {
        return null;
    }

    const {
        puntaje_general = 0,
        categoria_general = "N/A",
        categoria_estilo = "",
        descripcion_general = "No hay descripción disponible.",
        puntajes_areas = [],
        niveles = [],
        company_name = "Empresa",
        recommendations = []
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
                display: false,
            },
        }
    };

    return (
        <div className="home-container1">
            <Helmet>
                <title>Assessment - {company_name}</title>
            </Helmet>
            <div className="home-dashboard-score-animating">
                <div className="home-content">
                    <div className="home-main-content1">
                        <div className="home-header-dashboard">
                            <div className="home-header-frame">
                                <div className="home-header-1">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <img
                                            src="/external/Logo_negro_NEO_header.svg"
                                            alt="Logo Neo"
                                            style={{ height: '40px' }}
                                        />
                                        <span style={{ fontSize: '14px', color: '#666' }}>Vista Pública</span>
                                    </div>
                                </div>

                                <div className="home-header-2">
                                    <div className="home-titleand-status-container">
                                        <div className="home-title-container">
                                            <span className="home-text10">{company_name}</span>
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
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="home-tabs">
                                <div
                                    className={activeTab === 'results' ? 'home-tabitem1' : 'home-tabitem2'}
                                    onClick={() => setActiveTab('results')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className={activeTab === 'results' ? 'home-text13' : 'home-text14'}>Resultados</span>
                                </div>
                                <div
                                    className={activeTab === 'recommendations' ? 'home-tabitem1' : 'home-tabitem2'}
                                    onClick={() => setActiveTab('recommendations')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className={activeTab === 'recommendations' ? 'home-text13' : 'home-text14'}>Recomendaciones</span>
                                </div>
                            </div>
                        </div>

                        {/* Results Tab */}
                        {activeTab === 'results' && (
                            <div className="home-container2" style={{ marginTop: '20px' }}>
                                <div className="home-main-content2" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
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
                                            {/* Visual representation of maturity levels */}
                                            {/* Simplified version - you can copy the full implementation from dashboard.jsx if needed */}
                                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                                <h3>Nivel de Madurez: {categoria_general}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="home-scores-categories">
                                        <div className="home-container3">
                                            <span className="home-text34">Puntuación de madurez por áreas</span>
                                            {showRadarChart ? (
                                                <div className="home-container-radar" style={{ width: '500px', height: '500px', margin: '20px auto' }}>
                                                    <Radar data={radarChartData} options={radarChartOptions} />
                                                </div>
                                            ) : (
                                                <div className="home-frame-cards-all">
                                                    {puntajes_areas.map((area, index) => (
                                                        <div key={index} style={{ padding: '20px', border: '1px solid #ddd', margin: '10px', borderRadius: '8px' }}>
                                                            <h4>{area.nombre}</h4>
                                                            <p>Puntaje: {area.puntaje.toFixed(2)}</p>
                                                            <p>Nivel: {area.nivel}</p>
                                                        </div>
                                                    ))}
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
                                </div>
                            </div>
                        )}

                        {/* Recommendations Tab */}
                        {activeTab === 'recommendations' && (
                            <div className="home-container2" style={{ marginTop: '20px' }}>
                                <div className="home-main-content2" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                                    <h2>Iniciativas recomendadas para subir de nivel</h2>
                                    {recommendations && recommendations.length > 0 ? (
                                        recommendations.map((rec, index) => (
                                            <div key={index} style={{
                                                padding: '20px',
                                                border: '1px solid #ddd',
                                                margin: '20px 0',
                                                borderRadius: '8px',
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <h3>{rec.title}</h3>
                                                <p><strong>Dimensión:</strong> {rec.dimension}</p>
                                                <p>{rec.description}</p>
                                                <p><strong>Tiempo estimado:</strong> {rec.estimated_time}</p>
                                                <p><strong>Prioridad:</strong> {rec.priority}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay recomendaciones disponibles.</p>
                                    )}
                                </div>
                            </div>
                        )}
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

export default SharedAssessment;
