
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/pages/Dashboard';
import { Transactions } from './components/pages/Transactions';
import { Budgets } from './components/pages/Budgets';
import { Goals } from './components/pages/Goals';
import { Advisor } from './components/pages/Advisor';
import { Reports } from './components/pages/Reports';
import { Settings } from './components/pages/Settings';
import { Forecast } from './components/pages/Forecast';
import { Recurring } from './components/pages/Recurring';
import { Market } from './components/pages/Market';
import { MarketAnalysis } from './components/pages/MarketAnalysis';
import { PortfolioManagement } from './components/pages/PortfolioManagement';
import { FinancialProvider } from './context/FinancialContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { LoginPage } from './components/pages/LoginPage';

export type Page = 'dashboard' | 'transactions' | 'budgets' | 'goals' | 'advisor' | 'reports' | 'settings' | 'forecast' | 'recurring' | 'market' | 'market-analysis' | 'portfolio';

interface AppContentProps {
  onLogout: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loader--hidden');
        loader.addEventListener('transitionend', () => {
          if (document.body.contains(loader)) {
              loader.remove();
          }
        });
      }, 500);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'budgets':
        return <Budgets />;
      case 'goals':
        return <Goals />;
      case 'reports':
        return <Reports />;
      case 'forecast':
        return <Forecast />;
      case 'advisor':
        return <Advisor />;
      case 'recurring':
        return <Recurring />;
      case 'market':
        return <Market />;
      case 'market-analysis':
        return <MarketAnalysis />;
      case 'portfolio':
        return <PortfolioManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  
  const pageVariants = {
      initial: { opacity: 0, y: 15 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -15 },
  };

  const pageTransition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.4,
  } as const;

  return (
    <div className="flex h-screen bg-light dark:bg-dark font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light dark:bg-dark p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const AuthWrapper: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return <AppContent onLogout={handleLogout} />;
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FinancialProvider>
          <AuthWrapper />
        </FinancialProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
