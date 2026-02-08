
import React, { useContext, useState, type ReactNode } from 'react';
import { translations, LanguageCode, LANGUAGE_LABELS } from './locales';

// Helper to get nested object values
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  cycleLanguage: () => void;
  t: (key: string) => string;
}

// Use React.createContext to ensure 'React' import is used
const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export interface LanguageProviderProps {
  children?: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language] = useState<LanguageCode>('zh-MO');

  const setLanguage = (_lang: LanguageCode) => {
    // No-op: Language is locked to zh-MO
  };

  const cycleLanguage = () => {
    // No-op: Language is locked to zh-MO
  };

  const t = (key: string) => {
    const langData = translations[language];
    return getNestedValue(langData, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, cycleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { LANGUAGE_LABELS };
