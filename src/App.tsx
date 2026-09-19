import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { SimulationModal } from './components/ui/SimulationModal';
import { QuantCopilot } from './components/copilot/QuantCopilot';
import { ExplainModal } from './components/ui/ExplainModal';
import { Bot } from 'lucide-react';

import { Overview } from './pages/Overview';
import { MarketExplorer } from './pages/MarketExplorer';
import { QuantAnalytics } from './pages/QuantAnalytics';
import { Correlation } from './pages/Correlation';
import { StrategyLab } from './pages/StrategyLab';
import { Backtesting } from './pages/Backtesting';
import { MarketRegimes } from './pages/MarketRegimes';
import { Reports } from './pages/Reports';

const MainLayout: React.FC = () => {
  const { activePage, activeExplainMetric, setActiveExplainMetric, isCopilotOpen, setIsCopilotOpen } = useApp();

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

      {/* Floating Quick Copilot Trigger (Bottom-Right, Always Visible & Unmissable) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 text-white text-xs font-bold shadow-2xl shadow-cyan-500/25 border border-cyan-400/40 hover:scale-105 transition-all cursor-pointer group animate-pulse hover:animate-none"
          title="Open Quant AI Copilot"
        >
          <Bot className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
          <span className="font-mono tracking-wide">Ask Quant AI Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-1 shadow-sm" />
        </button>
      )}

      {/* Quant AI Copilot Drawer */}
      <QuantCopilot />

      {/* Structured 4-Part Metric Explanation Modal */}
      <ExplainModal
        metricId={activeExplainMetric}
        onClose={() => setActiveExplainMetric(null)}
      />
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
