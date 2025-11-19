import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import './home.css';

const Home = (props) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      if (result && result.user) {
        const user = result.user;
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // El documento del usuario no existe, así que lo creamos
          await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
          });
        }
        
        navigate('/projectpage');
      }
    } catch (error) {
      console.error("Error during Google popup login:", error.code, error.message);
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
        <div className="home-buttons">
          <button onClick={handleGoogleLogin} className="home-button google-button">
            <span>Iniciar sesión con Google</span>
          </button>
          <button onClick={handleGoogleLogin} className="home-button evaluation-button">
            <span>Empezar evaluación</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
