import React, { createContext, useState } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    file,
    setFile,
    fileName,
    setFileName,
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
