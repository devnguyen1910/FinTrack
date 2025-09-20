
import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LanguageToggle: React.FC = () => {
    const { language, setLanguage } = useTranslation();
    const handleLanguageChange = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    };
    return (
        <button onClick={handleLanguageChange} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100/10 font-semibold text-gray-200" aria-label="Toggle language">
            {language === 'vi' ? 'EN' : 'VI'}
        </button>
    );
};


export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (username === 'admin' && password === 'admin') {
            onLoginSuccess();
        } else {
            setError(t('login_error_credentials'));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-light dark:bg-dark font-sans">
             <div className="relative hidden lg:flex flex-col items-center justify-center bg-primary p-12 text-white">
                <LanguageToggle />
                 <div className="text-center">
                     <div className="flex items-center justify-center mb-4">
                        <div className="p-4 bg-white/20 rounded-lg inline-block">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold">FinTrack</h1>
                    <p className="text-white/80 mt-4 max-w-sm mx-auto">{t('login_welcome_message')}</p>
                 </div>
                 <div className="absolute bottom-6 text-sm text-white/50">
                     © {new Date().getFullYear()} FinTrack. All Rights Reserved.
                 </div>
             </div>
             <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8 lg:hidden">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">FinTrack</h1>
                    </div>

                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('login_title')}</h2>
                     <p className="text-gray-500 dark:text-gray-400 mb-6">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('username')}</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                                className="mt-1 block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>
                        
                        <div>
                             <div className="flex justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('password')}</label>
                                <a href="#" className="text-sm text-primary hover:underline">{t('forgot_password')}</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full bg-light dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {error && <p className="text-sm text-danger text-center">{error}</p>}
                        
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                                {t('login_button')}
                            </button>
                        </div>
                        
                        <div className="relative flex items-center justify-center my-4">
                            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                            <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">{t('or_continue_with')}</span>
                            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        </div>

                         <div>
                            <button
                                type="button"
                                onClick={() => alert('Chức năng này cần backend để hoạt động.')}
                                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-secondary hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                               <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                <path fill="#34A853" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8V44c5.268 0 10.046-1.947 13.617-5.657l-5.657-5.657z"/>
                                <path fill="#FBBC05" d="M9.961 18.039c-2.859 5.206-2.859 11.718 0 16.924l-5.657 5.657C.954 35.393 0 30.17 0 24s.954-11.393 4.304-16.32L9.961 18.039z"/>
                                <path fill="#EA4335" d="M24 8c5.268 0 10.046 1.947 13.617 5.657l5.657-5.657C34.046 2.053 29.268 0 24 0C18.732 0 13.954 1.947 10.383 5.657l5.657 5.657C18.158 9.154 20.941 8 24 8z"/>
                               </svg>
                                {t('signin_with_google')}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};
