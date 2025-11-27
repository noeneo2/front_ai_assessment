import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import './home.css';
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

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Home = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.email);

        // Navigate immediately to project page
        console.log("Navigating to /projectpage...");
        navigate('/projectpage');

        // Save user to Firestore in background (non-blocking)
        const saveUserToFirestore = async () => {
          try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
              console.log("Creating new user in Firestore...");
              await setDoc(userRef, {
                displayName: user.displayName,
                email: user.email,
              });
              console.log("User saved to Firestore");
            } else {
              console.log("User already exists in Firestore");
            }
          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
          }
        };

        saveUserToFirestore();
      } else {
        console.log("No user authenticated");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    if (loading) return; // Prevent multiple clicks

    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      setError(null);
      console.log("Starting Google sign-in with popup...");

      // Use popup but don't wait for Firestore operations
      const result = await signInWithPopup(auth, provider);
      console.log("Popup authentication successful:", result.user.email);

      // onAuthStateChanged will handle the navigation

    } catch (error) {
      console.error("Error detallado de autenticación de Google:", error);

      // Check if it's the popup closed error
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Popup cerrado. Por favor, intenta de nuevo.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError("Solicitud cancelada. Por favor, intenta de nuevo.");
      } else {
        setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      }

      setLoading(false);
    }
  };

  // Fixed data for Home Radar Chart
  const radarChartData = {
    labels: ['Estrategia', 'Procesos', 'Governance', 'Personas y Cultura', 'Data & Tecnología', 'Proyectos'],
    datasets: [
      {
        label: 'Nivel de Madurez',
        data: [3.5, 4.0, 3.0, 4.5, 3.8, 4.2], // Example high scores
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
        display: false // Hide legend for cleaner look on home
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="home-container">
      <Helmet>
        <title>Home - Evaluación de Madurez Digital & Gen AI</title>
        <meta property="og:title" content="Evaluación de Madurez Digital & Gen AI" />
      </Helmet>

      {/* Header */}
      <header className="home-header">
        <img alt="Logo" src="/external/Logo_negro_NEO_header.svg" className="home-logo" />
        <button
          onClick={handleGoogleLogin}
          className="home-login-button"
          disabled={loading}
        >
          {loading ? 'Autenticando...' : 'Iniciar sesión'}
        </button>
      </header>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Evalúa tu nivel de<br />madurez digital & Gen AI
          </h1>
          <p className="home-hero-subtitle">
            Diagnóstico dinámico con scoring automatizado, dashboard ejecutivo<br />
            y roadmap priorizado.
          </p>
          <button
            onClick={handleGoogleLogin}
            className="home-cta-button"
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Iniciar evaluación'}
          </button>
          {error && (
            <div className="home-error-message">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <div className="home-features-grid">
          {/* Left side - Platform description */}
          <div className="home-feature-main">
            <div className="home-feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="home-feature-title">Tu plataforma de diagnóstico</h3>
            <p className="home-feature-description">
              El AI & Digital Maturity Assessment mide la madurez digital de tu organización en 6 dimensiones clave y genera un dashboard automatizado con brechas, insights y roadmap de evolución.
            </p>
          </div>

          {/* Right side - Benefits */}
          <div className="home-features-list">
            <div className="home-feature-item">
              <div className="home-feature-icon-small">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="var(--dl-color-default-neoblue)" />
                </svg>
              </div>
              <div>
                <h4 className="home-feature-item-title">Aceleración de adopción de Gen AI</h4>
                <p className="home-feature-item-description">
                  Identifica las palancas clave para integrar la IA generativa de forma rápida y efectiva.
                </p>
              </div>
            </div>

            <div className="home-feature-item">
              <div className="home-feature-icon-small">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h4 className="home-feature-item-title">Priorización basada en impacto</h4>
                <p className="home-feature-item-description">
                  Enfoca los recursos hacia las iniciativas con mayor retorno alineadas a la estrategia sistémica.
                </p>
              </div>
            </div>

            <div className="home-feature-item">
              <div className="home-feature-icon-small">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" />
                  <path d="M4 10h16M10 4v16" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h4 className="home-feature-item-title">Base sólida para proyectos</h4>
                <p className="home-feature-item-description">
                  Crea una fundación robusta para futuras automatizaciones y proyectos de transformación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions Section */}
      <section className="home-dimensions">
        <div className="home-dimensions-content">
          <h2 className="home-dimensions-title">Dimensiones evaluadas</h2>
          <p className="home-dimensions-subtitle">
            Un análisis 360° de tu capacidad de IA y digital.
          </p>

          <div className="home-radar-container">
            {/* Radar Chart - Simplified representation */}
            {/* Radar Chart - Dynamic with fixed data */}
            <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center' }}>
              <Radar
                data={radarChartData}
                options={radarChartOptions}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Process Steps Section */}
      <section className="home-process">
        <div className="home-process-content">
          <h2 className="home-process-title">Un proceso simple para un diagnóstico completo</h2>
          <p className="home-process-subtitle">
            Sigue estos pasos para obtener tu análisis de madurez de IA.
          </p>

          <div className="home-steps-container">
            {/* Step 1 */}
            <div className="home-step">
              <div className="home-step-number">1</div>
              <div className="home-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="home-step-title">Ingresa a alchemer</h3>
              <p className="home-step-description">
                Accede a la plataforma y selecciona la evaluación.
              </p>
            </div>

            {/* Step 2 */}
            <div className="home-step">
              <div className="home-step-number">2</div>
              <div className="home-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="home-step-title">Descarga el archivo</h3>
              <p className="home-step-description">
                Exporta los resultados en formato CSV o Excel.
              </p>
            </div>

            {/* Step 3 */}
            <div className="home-step">
              <div className="home-step-number">3</div>
              <div className="home-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="home-step-title">Sube tu archivo</h3>
              <p className="home-step-description">
                Carga el documento en nuestra plataforma segura.
              </p>
            </div>

            {/* Step 4 */}
            <div className="home-step">
              <div className="home-step-number">4</div>
              <div className="home-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="var(--dl-color-default-neoblue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="home-step-title">Procesamiento automático</h3>
              <p className="home-step-description">
                Calculamos el scoring para cada dimensión clave.
              </p>
            </div>

            {/* Step 5 */}
            <div className="home-step">
              <div className="home-step-number">5</div>
              <div className="home-step-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" fill="var(--dl-color-default-neoblue)" />
                </svg>
              </div>
              <h3 className="home-step-title">Generación del dashboard</h3>
              <p className="home-step-description">
                Visualiza tus brechas, insights y oportunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="home-final-cta">
        <div className="home-final-cta-content">
          <h2 className="home-final-cta-title">
            Transforma tu organización hacia un<br />modelo AI-ready
          </h2>
          <button
            onClick={handleGoogleLogin}
            className="home-cta-button"
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Subir archivo y obtener diagnóstico'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
