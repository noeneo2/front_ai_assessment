import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes, // Use Routes instead of Switch
} from 'react-router-dom';

import './style.css';
import { ReportProvider } from './context/ReportContext'; // Import the provider

import Recom from './views/recomendaciones';
import Dashboard from './views/dashboard';
import Landing from './views/landing';
import Subiendo from './views/subiendo';
import Cargando from './views/cargando';
import NotFound from './views/not-found';
import ProjectPage from './views/projectpage';
import NewProject from './views/newproject';
import Home from './views/home';

const App = () => {
  return (
    <Router>
      {/* Wrap the entire app with the ReportProvider */}
      <ReportProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/subiendo" element={<Subiendo />} />
          <Route path="/cargando" element={<Cargando />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recomendaciones" element={<Recom />} />
          <Route path="/projectpage" element={<ProjectPage />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ReportProvider>
    </Router>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
