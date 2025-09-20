import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Locale = 'en' | 'vi';
type Translations = { [key: string]: string };
type AllTranslations = Record<Locale, Translations>;

interface LanguageContextType {
    language: Locale;
    setLanguage: (language: Locale) => void;
    translations: Translations;
    allTranslations: AllTranslations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useLocalStorage<Locale>('language', 'vi');
    const [allTranslations, setAllTranslations] = useState<AllTranslations>({ en: {}, vi: {} });

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                // Sử dụng đường dẫn tương đối với file HTML gốc
                const [enRes, viRes] = await Promise.all([
                    fetch('./locales/en.json'),
                    fetch('./locales/vi.json')
                ]);
                if (!enRes.ok || !viRes.ok) {
                    throw new Error(`Failed to fetch translation files: ${enRes.status}, ${viRes.status}`);
                }
                const enData = await enRes.json();
                const viData = await viRes.json();
                setAllTranslations({ en: enData, vi: viData });
            } catch (error) {
                console.error("Failed to load translation files:", error);
            }
        };
        fetchTranslations();
    }, []);

    const value = {
        language,
        setLanguage,
        translations: allTranslations[language] || {},
        allTranslations,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};