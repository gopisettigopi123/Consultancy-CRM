import { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

const COMPANIES = ['BNS', 'CQ', 'TB', 'ALICE'];

export const CompanyProvider = ({ children }) => {
  const [activeCompany, setActiveCompany] = useState(() => {
    return localStorage.getItem('crm_active_company') || 'BNS';
  });

  useEffect(() => {
    localStorage.setItem('crm_active_company', activeCompany);
  }, [activeCompany]);

  return (
    <CompanyContext.Provider value={{ activeCompany, setActiveCompany, companies: COMPANIES }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
