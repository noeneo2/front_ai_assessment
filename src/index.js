import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Routes, // Use Routes instead of Switch
} from 'react-router-dom';

import './style.css';
import { ReportProvider } from './context/ReportContext'; // Import the provider

import Recom from './views/recom';
import Dashboard from './views/dashboard';
import Landing from './views/landing';
import Subiendo from './views/subiendo';
import Cargando from './views/cargando';
import NotFound from './views/not-found';

const App = () => {
  return (
    <Router>
      {/* Wrap the entire app with the ReportProvider */}
      <ReportProvider>
        <Routes>
          {/* Use the element prop with JSX for v6 */}
          <Route path="/" element={<Landing />} />
          <Route path="/subiendo" element={<Subiendo />} />
          <Route path="/cargando" element={<Cargando />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recom" element={<Recom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ReportProvider>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
