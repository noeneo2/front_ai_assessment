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
        <title>Home</title>
        <meta property="og:title" content="Home" />
      </Helmet>
      <div className="home-content">
        <h1>Mide la madurez de tu organización en IA Generativa</h1>
        {error && (
          <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        <div className="home-buttons">
          <button
            onClick={handleGoogleLogin}
            className="home-button google-button"
            disabled={loading}
          >
            <span>{loading ? 'Autenticando...' : 'Iniciar sesión con Google'}</span>
          </button>
          <button
            onClick={handleGoogleLogin}
            className="home-button evaluation-button"
            disabled={loading}
          >
            <span>{loading ? 'Autenticando...' : 'Empezar evaluación'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
