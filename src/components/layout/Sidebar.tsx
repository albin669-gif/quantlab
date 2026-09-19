import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  GitMerge, 
  FlaskConical, 
  LineChart, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  ChevronRight,
  Zap,
  Clock,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface NavSection {
  title: string;
  items: {
    id: PageId;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'RESEARCH & MARKETS',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'market-explorer', label: 'Market Explorer', icon: TrendingUp },
      { id: 'quant-analytics', label: 'Quant Analytics', icon: Activity },
      { id: 'correlation', label: 'Correlation Lab', icon: GitMerge },
    ],
  },
  {
    title: 'STRATEGY & EXECUTION',
    items: [
      { id: 'strategy-lab', label: 'Strategy Lab', icon: FlaskConical, badge: 'Core' },
      { id: 'backtesting', label: 'Backtesting', icon: LineChart },
      { id: 'market-regimes', label: 'Market Regimes', icon: Layers },
    ],
  },
  {
    title: 'OUTPUT & AUDIT',
    items: [
      { id: 'reports', label: 'Research Reports', icon: FileText },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, isDemoRunning, launchDemoMode, setIsCopilotOpen } = useApp();

  return (
    <aside className="w-64 bg-[#0d0d15] border-r border-[#1a1a28] flex flex-col justify-between flex-shrink-0 select-none z-30 transition-all duration-300">
      {/* Top Branding & Hackathon Demo CTA */}
      <div>
        {/* Terminal Header */}
        <div className="p-4 border-b border-[#1a1a28] bg-[#0b0b12]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">Quant<span className="text-indigo-400">Lab</span></span>
                  <span className="text-[9px] uppercase font-bold tracking-widest bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>Terminal Engine v2.4</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Demo Mode & AI Copilot */}
        <div className="p-3 border-b border-[#1a1a28] space-y-2">
          <button
            onClick={launchDemoMode}
            disabled={isDemoRunning}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all duration-200 shadow-md ${
              isDemoRunning 
                ? 'bg-indigo-950/90 border-indigo-500 text-indigo-200 animate-pulse' 
                : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white border-indigo-400/30 shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:scale-[1.01]'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="font-bold tracking-tight">{isDemoRunning ? 'Running Pitch Demo...' : 'Launch Pitch Demo'}</span>
            </span>
            <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded uppercase font-mono font-bold tracking-wider">
              2-Min
            </span>
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-950/60 text-cyan-200 transition-all duration-200 shadow-sm hover:shadow-cyan-500/10 cursor-pointer group"
          >
            <span className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold tracking-tight">Quant AI Copilot</span>
            </span>
            <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold border border-cyan-500/30">
              OPEN
            </span>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                {section.title}
              </div>

              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm font-semibold shadow-indigo-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#151522] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-600 text-white' : 'bg-[#181826] text-slate-400 group-hover:text-slate-200'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 font-mono font-semibold">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Area: Data Status, Methodology & System Status */}
      <div className="p-3 border-t border-[#1a1a28] bg-[#09090f] space-y-2">
        <div className="p-2.5 rounded-xl bg-[#12121e] border border-[#1e1e30]">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="flex items-center space-x-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Integrity</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              VERIFIED
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
            <div>Bias: <span className="text-slate-200 font-semibold">0% Lookahead</span></div>
            <div>Slippage: <span className="text-slate-200 font-semibold">0.10% Included</span></div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">HISTORICAL FEED</span>
          </span>
          <span className="text-slate-400">1,250 BARS</span>
        </div>
      </div>
    </aside>
  );
};
