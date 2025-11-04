import React, { useContext, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

import { ReportContext } from '../context/ReportContext';
import './landing.css';

const Landing = (props) => {
  const { setReportData, setLoading } = useContext(ReportContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // --- Basic Processing ---
        // TODO: Replace this with your actual data processing logic
        console.log("Datos del Excel:", json);
        
        // Example: Assume we calculate a score and generate recommendations
        const processedData = {
          score: (Math.random() * 4 + 1).toFixed(2), // Random score between 1 and 5
          recommendations: [
            "Implementar un repositorio central de datos.",
            "Capacitar al equipo en herramientas de IA.",
            "Definir KPIs claros para proyectos de Gen AI.",
          ],
          rawData: json,
        };
        
        setReportData(processedData);
        navigate('/subiendo');

      } catch (error) {
        console.error("Error processing file:", error);
        alert("Hubo un error al procesar el archivo. Asegúrate de que sea un Excel válido.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="page1-container1">
      <Helmet>
        <title>Subir Excel - Madurez Organizacional Gen AI</title>
        <meta property="og:title" content="Subir Excel - Madurez Organizacional Gen AI" />
      </Helmet>
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFile}
        style={{ display: 'none' }}
        accept=".xlsx, .xls"
      />

      <div className="page1-landing-page">
        <div className="page1-content">
          <div className="page1-header">{/* Header content remains the same */}</div>
          <div className="page1-main-content">
            <div className="page1-upload-module">
              <div className="page1-title">
                <span className="page1-text1">
                  Transforma tu excel en un dashboard de Madurez Organizacional en Gen AI
                </span>
              </div>
              {/* This entire div is now clickable */}
              <div className="page1-upload" onClick={handleUploadClick} style={{cursor: 'pointer'}}>
                <div className="page1-frame17">
                  <div className="page1-group3">{/* Icon remains the same */}</div>
                  <div className="page1-frame16">
                    <span className="page1-text2">
                      Seleccione un archivo o arrástrelo aquí.
                    </span>
                    <span className="page1-text3">
                      Archivo de Excel de hasta 50 MB
                    </span>
                  </div>
                  <div className="page1-frame15">
                    <span className="page1-text4">Examinar archivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="page1-footer">{/* Footer content remains the same */}</div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
