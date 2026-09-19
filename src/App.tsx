import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { SimulationModal } from './components/ui/SimulationModal';

import { Overview } from './pages/Overview';
import { MarketExplorer } from './pages/MarketExplorer';
import { QuantAnalytics } from './pages/QuantAnalytics';
import { Correlation } from './pages/Correlation';
import { StrategyLab } from './pages/StrategyLab';
import { Backtesting } from './pages/Backtesting';
import { MarketRegimes } from './pages/MarketRegimes';
import { Reports } from './pages/Reports';

const MainLayout: React.FC = () => {
  const { activePage } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'market-explorer':
        return <MarketExplorer />;
      case 'quant-analytics':
        return <QuantAnalytics />;
      case 'correlation':
        return <Correlation />;
      case 'strategy-lab':
        return <StrategyLab />;
      case 'backtesting':
        return <Backtesting />;
      case 'market-regimes':
        return <MarketRegimes />;
      case 'reports':
        return <Reports />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* High-tech Simulation Progress Modal */}
      <SimulationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
