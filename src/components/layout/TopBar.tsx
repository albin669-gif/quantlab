import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Play, 
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_ASSETS } from '../../data/mockData';
import { AssetInfo } from '../../types';

export const TopBar: React.FC = () => {
  const { 
    selectedAssetId, 
    setSelectedAssetId, 
    runBacktest, 
    isSimulating,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    toastMessage,
    activePage
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);

  const filteredAssets = AVAILABLE_ASSETS.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageTitles: Record<string, string> = {
    'overview': 'Executive Overview',
    'market-explorer': 'Market Explorer',
    'quant-analytics': 'Quantitative Analytics',
    'correlation': 'Cross-Asset Correlation Lab',
    'strategy-lab': 'Strategy Lab & Architecture',
    'backtesting': 'Backtesting Workspace',
    'market-regimes': 'Market Regimes & Robustness',
    'reports': 'Research Summary Reports',
  };

  return (
    <header className="bg-[#0b0b12]/95 backdrop-blur-md border-b border-[#1a1a28] sticky top-0 z-20 px-6 py-2.5">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="mb-2 py-1.5 px-3.5 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-xs text-indigo-100 flex items-center justify-between shadow-xl shadow-indigo-950/50 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-mono">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Breadcrumb & Workspace Title */}
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-slate-400">QuantLab /</span>
              <h1 className="text-sm md:text-base font-bold text-white tracking-tight">
                {pageTitles[activePage] || 'Overview'}
              </h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>ONLINE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center & Right Controls: Asset Selector Pills + Date Range + Simulation CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Asset Universe Selector Pills */}
          <div className="flex items-center bg-[#131320] p-1 rounded-xl border border-[#202034]">
            {AVAILABLE_ASSETS.map((asset: AssetInfo) => {
              const isSelected = asset.id === selectedAssetId;
              return (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1b1b2c]'
                  }`}
                >
                  <span>{asset.id}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    ${asset.price >= 1000 ? `${(asset.price / 1000).toFixed(1)}k` : asset.price.toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Date Range Selector */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#131320] px-3 py-1 rounded-xl border border-[#202034] text-xs font-mono text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={`${startYear}-${endYear}`}
              onChange={(e) => {
                const [start, end] = e.target.value.split('-').map(Number);
                setStartYear(start);
                setEndYear(end);
              }}
              className="bg-transparent text-slate-200 border-none outline-none cursor-pointer text-xs"
            >
              <option value="2020-2026" className="bg-[#131320]">2020 — 2026 (Full 5Y)</option>
              <option value="2022-2026" className="bg-[#131320]">2022 — 2026 (Macro Post-Covid)</option>
              <option value="2023-2026" className="bg-[#131320]">2023 — 2026 (AI Rally)</option>
            </select>
          </div>

          {/* Asset Search Filter */}
          <div className="relative">
            <button
              onClick={() => setShowAssetDropdown(!showAssetDropdown)}
              className="p-2 rounded-xl bg-[#131320] border border-[#202034] text-slate-400 hover:text-white transition-colors"
              title="Search Assets"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {showAssetDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#141422] border border-[#28283c] shadow-2xl p-2.5 z-50 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Filter assets (BTC, GOLD, NVDA)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0a0a12] border border-[#242436] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500 mb-2 font-mono"
                  autoFocus
                />
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {filteredAssets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        setShowAssetDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#1c1c2e] text-xs flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-slate-200 font-semibold">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{asset.exchange}</div>
                      </div>
                      <span className="font-mono text-indigo-300 font-bold">${asset.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => runBacktest()}
            disabled={isSimulating}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="font-bold">{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
