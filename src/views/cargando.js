import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { ReportContext } from '../context/ReportContext';
import './cargando.css';

const Cargando = (props) => {
  const { file, setReportData, setIsLoading, setError } = useContext(ReportContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!file) {
      navigate('/');
      return;
    }

    const processFile = async () => {
      setIsLoading(true);
      setError(null);
      setErrorMessage('');

      // const formData = new FormData();
      // formData.append('file', file);

      try {
        // SIMULACIÓN DE DATOS: Se comenta la llamada al backend y se usan datos de ejemplo
        /*
        const response = await axios.post('http://127.0.0.1:8000/process-excel/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setReportData(response.data);
        */

        const mockReportData = {
          puntaje_general: 2.3,
          categoria_general: "Estrategia, Adopción e Integración",
          categoria_estilo: "estrategia-adopcion-e-integracion",
          descripcion_general: "La organización demuestra un uso sofisticado de la IA generativa, con una estrategia clara y un alto nivel de adopción en múltiples áreas.",
          puntajes_areas: [
            { nombre: "Estrategia y Liderazgo", puntaje: 4.2 },
            { nombre: "Cultura y Personas", puntaje: 3.8 },
            { nombre: "Procesos y Gobernanza", puntaje: 3.1 },
            { nombre: "Tecnología y Datos", puntaje: 3.9 },
            { nombre: "Casos de Uso e Impacto", puntaje: 3.5 },
            { nombre: "Ética y Riesgos", puntaje: 2.9 },
          ],
          niveles: [
            { nombre: "Nivel 1: Inicial", descripcion: "La organización está comenzando a explorar el potencial de la IA generativa. El conocimiento es limitado y no hay una estrategia formal." },
            { nombre: "Nivel 2: En Desarrollo", descripcion: "Se han implementado algunas iniciativas de IA generativa de forma aislada. Hay conciencia de los beneficios, pero falta una estrategia cohesiva." },
            { nombre: "Nivel 3: Definido", descripcion: "La organización ha definido una estrategia para la adopción de la IA generativa y está estandarizando procesos y mejores prácticas." },
            { nombre: "Nivel 4: Avanzado", descripcion: "La IA generativa se utiliza de forma estratégica en toda la organización. Existe una cultura de innovación y experimentación con IA." },
            { nombre: "Nivel 5: Optimizado", descripcion: "La organización utiliza la IA generativa para transformar sus operaciones y modelos de negocio. La IA es una parte integral de la estrategia y la cultura." }
          ]
        };

        setTimeout(() => {
          setReportData(mockReportData);
          setIsLoading(false);
          navigate('/dashboard');
        }, 2000); // Simula una carga de 2 segundos
        
        // navigate('/dashboard');

      } catch (err) {
        console.error("Error al procesar el archivo:", err);
        setError(err);
        setErrorMessage('Hubo un error al procesar tu archivo. Por favor, inténtalo de nuevo.');
      } finally {
        // setIsLoading(false);
      }
    };

    processFile();
  }, [file, navigate, setError, setIsLoading, setReportData]);

  return (
    <div className="page1-container1">
      <Helmet>
        <title>Procesando - Madurez Organizacional Gen AI</title>
      </Helmet>
      <div className="page1-cargando">
        <div className="page1-content">
        <div className="page1-header">
          <img
              className="page1-header-logo"
              src="/external/Logo_negro_NEO_header.svg"
              alt="Logo Neo"
            />
        </div>
          <div className="page1-main-content">
            <div className="page1-upload-module">
              <div className="page1-title">
                <span className="page1-text1">
                  {errorMessage ? errorMessage : 'Creando las visualizaciones de datos y recomendaciones...'}
                </span>
              </div>
              {!errorMessage && (
                <img
                  src="/external/loadinganimation12812-96i-400h.png"
                  alt="Animación de carga"
                  className="page1-loading-animation1"
                />
              )}
            </div>
          </div>
          <div className="page1-footer">
            <img
            className="page1-footer-logo"
            src="/external/Logo_negro_NEO_footer.svg"
            alt="Logo Neo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cargando;
