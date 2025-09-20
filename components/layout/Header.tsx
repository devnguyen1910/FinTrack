
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from '../../hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Toggle theme">
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
        </button>
    );
};

const LanguageToggle: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    const handleLanguageChange = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    };

    return (
        <button onClick={handleLanguageChange} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-gray-600 dark:text-gray-300" aria-label="Toggle language">
            {language === 'vi' ? 'EN' : 'VI'}
        </button>
    );
};

const UserMenu: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // FIX: Add 'as const' to correctly type the variants for Framer Motion, resolving the AnimationGeneratorType error.
    const menuVariants = {
        open: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
        closed: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.1 } },
    } as const;

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark dark:focus:ring-offset-dark-secondary">
                A
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-secondary rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
                    >
                        <button
                            onClick={onLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            {t('logout')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogout }) => {
  const { t } = useTranslation();
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
         <button onClick={onMenuClick} className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Mở menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{t('welcome_back')}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <LanguageToggle />
        <ThemeToggle />
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <UserMenu onLogout={onLogout} />
      </div>
    </header>
  );
};
