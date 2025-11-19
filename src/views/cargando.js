import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ReportContext } from '../context/ReportContext';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

import './cargando.css';

const Cargando = (props) => {
  const { file, companyName, setReportData, setIsLoading, setError } = useContext(ReportContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!file || !companyName) {
      navigate('/newproject');
      return;
    }

    const processFile = async () => {
      setIsLoading(true);
      setError(null);
      setErrorMessage('');
      const user = auth.currentUser;

      if (!user) {
        setError("No hay un usuario autenticado.");
        navigate('/');
        return;
      }

      try {
        // Simulación de procesamiento de archivo y obtención de datos de reporte
        const mockReportData = {
          puntaje_general: 2.3,
          categoria_general: "Estrategia, Adopción e Integración",
          categoria_estilo: "estrategia-adopcion-e-integracion",
          descripcion_general: "La organización demuestra un uso sofisticado de la IA generativa, con una estrategia clara y un alto nivel de adopción en múltiples áreas.",
          puntajes_areas: [
            { nombre: "Personas y Cultura", puntaje: 4.2, nivel: "Estrategia, Adopción e Integración" },
            { nombre: "Governance", puntaje: 3.8, nivel: "Escalamiento y Optimización"  },
            { nombre: "Data & Tecnología", puntaje: 3.1, nivel: "Escalamiento y Optimización" },
            { nombre: "Procesos", puntaje: 3.9, nivel: "Escalamiento y Optimización" },
            { nombre: "Proyectos", puntaje: 3.5, nivel: "Escalamiento y Optimización" },
            { nombre: "Estrategia", puntaje: 2.9, nivel: "Estrategia, Adopción e Integración" },
          ],
          niveles: [
            { nombre: "Nivel 1: Exploración", descripcion: "La organización está comenzando a explorar el potencial de la IA generativa. El conocimiento es limitado y no hay una estrategia formal." },
            { nombre: "Nivel 2: Fundamentos", descripcion: "Se han implementado algunas iniciativas de IA generativa de forma aislada. Hay conciencia de los beneficios, pero falta una estrategia cohesiva." },
            { nombre: "Nivel 3: Pilotaje", descripcion: "La organización ha definido una estrategia para la adopción de la IA generativa y está estandarizando procesos y mejores prácticas." },
            { nombre: "Nivel 4: Escalamiento", descripcion: "La IA generativa se utiliza de forma estratégica en toda la organización. Existe una cultura de innovación y experimentación con IA." },
            { nombre: "Nivel 5: Transformación", descripcion: "La organización utiliza la IA generativa para transformar sus operaciones y modelos de negocio. La IA es una parte integral de la estrategia y la cultura." }
          ]
        };

        // Lógica para guardar en Firestore
        const companiesRef = collection(db, 'users', user.uid, 'companies');
        const q = query(companiesRef, where("companyName", "==", companyName));
        const querySnapshot = await getDocs(q);

        let companyId;
        if (querySnapshot.empty) {
          const companyDocRef = await addDoc(companiesRef, { companyName: companyName });
          companyId = companyDocRef.id;
        } else {
          companyId = querySnapshot.docs[0].id;
        }

        const testsRef = collection(db, 'users', user.uid, 'companies', companyId, 'tests');
        await addDoc(testsRef, {
          generalResult: mockReportData,
          testDate: serverTimestamp()
        });

        setReportData(mockReportData);

        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 2000);

      } catch (err) {
        console.error("Error al procesar el archivo:", err);
        setError(err);
        setErrorMessage('Hubo un error al procesar tu archivo. Por favor, inténtalo de nuevo.');
        setIsLoading(false);
      }
    };

    processFile();
  }, [file, companyName, navigate, setError, setIsLoading, setReportData]);

  return (
    <div class="cargando-container1">
      <Helmet>
        <title>Procesando - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div class="cargando-cargando">
        <div class="cargando-content">
        <div class="cargando-header">
          <img
              class="cargando-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
        </div>
          <div class="cargando-main-content">
            <div class="cargando-upload-module">
              <div class="cargando-title">
                <span class="cargando-text1">
                  {errorMessage ? errorMessage : 'Creando las visualizaciones de datos y recomendaciones...'}
                </span>
              </div>
              {!errorMessage && (
                <img
                  src="/external/loadinganimation12812-96i-400h.png"
                  alt="Animación de carga"
                  class="cargando-loading-animation1"
                />
              )}
            </div>
          </div>
          <div class="cargando-footer">
            <img
            class="cargando-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />
             <span class="login-footer-text">Neo Consulting, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cargando;
