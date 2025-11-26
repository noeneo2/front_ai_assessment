import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import './home.css';

const Home = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    console.log("Setting up auth state listener...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user.email);

        // Save user to Firestore if needed
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

        // Navigate to project page
        console.log("Navigating to /projectpage...");
        navigate('/projectpage');
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

  return (
    <div className="home-container">
      <Helmet>
        <title>Home - Evaluación de Madurez Digital & Gen AI</title>
        <meta property="og:title" content="Evaluación de Madurez Digital & Gen AI" />
      </Helmet>

      {/* Header */}
      <header className="home-header">
        <div className="home-logo">NEO</div>
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
            <svg className="home-radar-chart" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              {/* Background circles */}
              <circle cx="200" cy="200" r="150" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="90" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="60" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="200" cy="200" r="30" fill="none" stroke="#e5e7eb" strokeWidth="1" />

              {/* Axes */}
              <line x1="200" y1="200" x2="200" y2="50" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="200" y1="200" x2="330" y2="125" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="200" y1="200" x2="330" y2="275" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="200" y1="200" x2="200" y2="350" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="200" y1="200" x2="70" y2="275" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="200" y1="200" x2="70" y2="125" stroke="#e5e7eb" strokeWidth="1" />

              {/* Data polygon */}
              <polygon
                points="200,80 290,140 290,260 200,310 110,260 110,140"
                fill="rgba(0, 0, 51, 0.2)"
                stroke="var(--dl-color-default-neoblue)"
                strokeWidth="2"
              />

              {/* Labels */}
              <text x="200" y="35" textAnchor="middle" fontSize="14" fontFamily="Montserrat" fill="var(--dl-color-default-neoblue)">Estrategia</text>
              <text x="355" y="125" textAnchor="start" fontSize="14" fontFamily="Montserrat" fill="var(--dl-color-default-neoblue)">Procesos</text>
              <text x="355" y="285" textAnchor="start" fontSize="14" fontFamily="Montserrat" fill="var(--dl-color-default-neoblue)">Governance</text>
              <text x="200" y="375" textAnchor="middle" fontSize="14" fontFamily="Montserrat" fill="var(--dl-color-default-neoblue)">Cultura</text>
              <text x="45" y="285" textAnchor="end" fontSize="14" fontFamily="Montserrat" fill="var(--dl-color-default-neoblue)">Tecnología</text>
              <text x="45" y="125" textAnchor="end" fontSize="14" fontFamily="Montserrat" fill="var(--dl-color-default-neoblue)">Proyectos</text>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
