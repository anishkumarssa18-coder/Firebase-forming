'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = {
  value: string;
  label: string;
};

export const languages: Language[] = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिन्दी' },
  { value: 'Marathi', label: 'मराठी' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Tamil', label: 'தமிழ்' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('English');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
