import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { ReportContext } from '../context/ReportContext';
import './projectpage.css';

const ProjectPage = (props) => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const { setReportData, setCompanyName } = useContext(ReportContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const companiesCollection = collection(db, 'users', user.uid, 'companies');
        
        const unsub = onSnapshot(companiesCollection, async (companiesSnapshot) => {
          const companiesData = await Promise.all(companiesSnapshot.docs.map(async (companyDoc) => {
            const company = { id: companyDoc.id, ...companyDoc.data() };
            
            // Consultar el último test para cada compañía
            const testsQuery = query(
              collection(db, 'users', user.uid, 'companies', companyDoc.id, 'tests'), 
              orderBy('testDate', 'desc'), 
              limit(1)
            );
            const testsSnapshot = await getDocs(testsQuery);
            
            let lastTestDate = 'N/A';
            let testCount = 0;

            if (!testsSnapshot.empty) {
              const lastTest = testsSnapshot.docs[0].data();
              lastTestDate = lastTest.testDate?.toDate().toLocaleDateString() || 'Fecha inválida';
              
              // Para contar todos los tests, necesitamos otra consulta sin el limit
              const allTestsQuery = collection(db, 'users', user.uid, 'companies', companyDoc.id, 'tests');
              const allTestsSnapshot = await getDocs(allTestsQuery);
              testCount = allTestsSnapshot.size;
            }
            
            return {
              ...company,
              assessments: testCount,
              lastTest: lastTestDate
            };
          }));
          setCompanies(companiesData);
        });

        return () => unsub();
      } else {
        setCompanies([]);
        navigate('/'); // Si no hay usuario, redirigir al home
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCompanyClick = (company) => {
    // Aquí asumimos que queremos cargar el último test de la empresa al ir al dashboard
    // Esto se puede refinar si se quiere permitir elegir un test específico
    const user = auth.currentUser;
    if (user) {
      const testsQuery = query(
        collection(db, 'users', user.uid, 'companies', company.id, 'tests'),
        orderBy('testDate', 'desc'),
        limit(1)
      );
      getDocs(testsQuery).then((testsSnapshot) => {
        if (!testsSnapshot.empty) {
          const lastTest = testsSnapshot.docs[0].data();
          setCompanyName(company.companyName); // Guardamos el nombre de la empresa
          setReportData(lastTest.generalResult); // Guardamos los datos del reporte
          navigate('/dashboard');
        } else {
          // Si no hay tests, tal vez queramos ir a la página de nuevo proyecto
          // para esa empresa o simplemente mostrar un mensaje.
          console.log("No hay tests para esta empresa. Creando uno nuevo...");
          setCompanyName(company.companyName);
          navigate('/newproject');
        }
      });
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="projectpage-container">
      <Helmet>
        <title>Mis Proyectos</title>
        <meta property="og:title" content="Mis Proyectos" />
      </Helmet>
      <div className="projectpage-header">
        <img alt="Logo" src="/external/Logo_negro_NEO_header.svg" className="projectpage-header-logo" />
        <div className="projectpage-header-button" onClick={handleLogout}>
          <img alt="Logout Icon" src="/external/iconlogoutea4f.svg" className="projectpage-logout-icon" />
          <span className="projectpage-button-text">Logout</span>
        </div>
      </div>
      <div className="projectpage-main-content">
        <div className="projectpage-title-container">
            <div className="projectpage-title">
                <h1>Proyectos Recientes</h1>
                <p>Aquí puedes ver tus proyectos recientes y crear nuevos.</p>
            </div>
            <button className="projectpage-create-button" onClick={() => navigate('/newproject')}>Crear nuevo proyecto</button>
        </div>
        <div className="projectpage-company-list">
          {companies.map((company) => (
            <div key={company.id} className="projectpage-company-item" onClick={() => handleCompanyClick(company)}>
                <div className="projectpage-company-info">
                    <img alt="File Icon" src="/external/icon4638-y3ej.svg" className="projectpage-file-icon" />
                    <div className="projectpage-company-details">
                        <span className="projectpage-company-name">{company.companyName}</span>
                        <span className="projectpage-company-meta">
                            {company.assessments} assessments • Último {company.lastTest}
                        </span>
                    </div>
                </div>
                <img alt="Arrow Icon" src="/external/arrow14636-poci.svg" className="projectpage-arrow-icon" />
            </div>
          ))}
        </div>
      </div>
      <div className="projectpage-footer">
        <img alt="Logo Neo" src="/external/Logo_negro_NEO_footer.svg" className="projectpage-footer-logo" />
        <span className="projectpage-footer-text">Neo Consulting, 2025</span>
      </div>
    </div>
  );
};

export default ProjectPage;
