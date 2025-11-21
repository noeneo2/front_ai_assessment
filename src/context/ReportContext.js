import React, { createContext, useState } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [companyName, setCompanyName] = useState(''); // Nuevo estado
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    file,
    setFile,
    fileName,
    setFileName,
    projectName,
    setProjectName,
    companyName,
    setCompanyName,
    reportData,
    setReportData,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
