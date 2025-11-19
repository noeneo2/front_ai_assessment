import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

import './home.css';

const Home = (props) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log('Attempting sign in with popup...');
      const result = await signInWithPopup(auth, provider);
      
      if (result && result.user) {
        // User is signed in. The user object is in result.user
        console.log('User successfully signed in with popup:', result.user);
        // ¡Ahora sí debería aparecer un usuario en la consola de Firebase!
        navigate('/dashboard'); // Navigate to dashboard on successful login
      } else {
          console.log('No user found in popup result.');
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
          <button onClick={() => navigate('/nuevoproyecto')} className="home-button evaluation-button">
            <span>Empezar evaluación</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
