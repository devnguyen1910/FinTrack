import React, { useState, useEffect } from 'react';
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
import { FinancialProvider } from './context/FinancialContext';

export type Page = 'dashboard' | 'transactions' | 'budgets' | 'goals' | 'advisor' | 'reports' | 'settings' | 'forecast' | 'recurring';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.classList.add('loader--hidden');
      loader.addEventListener('transitionend', () => {
        if (document.body.contains(loader)) {
            loader.remove();
        }
      });
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
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <FinancialProvider>
      <div className="flex h-screen bg-light dark:bg-dark font-sans">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light dark:bg-dark p-4 md:p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </FinancialProvider>
  );
};

export default App;