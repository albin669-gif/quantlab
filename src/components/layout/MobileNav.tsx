import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  GitMerge, 
  FlaskConical, 
  LineChart, 
  Layers, 
  FileText 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage } = useApp();

  const primaryMobileNav: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'market-explorer', label: 'Markets', icon: TrendingUp },
    { id: 'quant-analytics', label: 'Quant', icon: Activity },
    { id: 'strategy-lab', label: 'Strategy', icon: FlaskConical },
    { id: 'backtesting', label: 'Backtest', icon: LineChart },
    { id: 'market-regimes', label: 'Regimes', icon: Layers },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0d16]/95 backdrop-blur-lg border-t border-[#1f1f2e] px-2 py-1 flex justify-around items-center">
      {primaryMobileNav.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-mono">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
