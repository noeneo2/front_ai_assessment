
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import auth from your firebase config
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './login.css';

const Login = (props) => {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        navigate('/projectpage'); // Redirect on successful login
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Login failed:", errorMessage);
        // ...
      });
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>Login - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div className="login-login">
        <div className="login-header">
          <img
            className="login-header-logo"
            src="/external/Logo_negro_NEO_header.svg"
            alt="Logo Neo"
          />
          <div className="login-header-button" onClick={signInWithGoogle} style={{cursor: 'pointer'}}>
            <img
              src="/external/google-icon.svg"
              alt="Google icon"
              className="login-google-icon"
            />
            <span className="login-button-text">Iniciar sesión con Google</span>
          </div>
        </div>
        <div className="login-main-content">
          <div className="login-module">
            <img
              src="/external/google-icon.svg"
              alt="Google icon"
              className="login-google-icon-large"
            />
            <span className="login-module-title">Iniciar sesión con Google</span>
            <span className="login-module-text">
              para ir a Madurez Organizacional de NEO
            </span>
            <div className="login-account-selector">
              {/* This would be dynamically rendered based on signed-in accounts */}
            </div>
            <div className="login-actions">
              <button className="login-button" onClick={signInWithGoogle}>Iniciar sesión</button>
            </div>
          </div>
        </div>
        <div className="login-footer">
          <img
            className="login-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
          />
          <span className="login-footer-text">
            Neo Consulting, 2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
