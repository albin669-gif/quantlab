import React from 'react';
import { useApp } from '../context/AppContext';
import { STRATEGIES, AVAILABLE_ASSETS } from '../data/mockData';
import { StrategyId, AssetInfo } from '../types';
import { 
  FlaskConical, 
  Settings, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';
import { formatINR } from '../lib/quant';

export const StrategyLab: React.FC = () => {
  const {
    selectedAssetId,
    setSelectedAssetId,
    selectedAsset,
    selectedStrategyId,
    setSelectedStrategyId,
    fastPeriod,
    setFastPeriod,
    slowPeriod,
    setSlowPeriod,
    initialCapital,
    setInitialCapital,
    positionSize,
    setPositionSize,
    transactionCost,
    setTransactionCost,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    runBacktest,
    isSimulating,
    setActivePage
  } = useApp();

  const strategyList: StrategyId[] = ['SMA_CROSS', 'EMA_TREND', 'MOMENTUM', 'MEAN_REVERSION'];

  const handleRunAndNavigate = async () => {
    await runBacktest(selectedAssetId, selectedStrategyId);
    setActivePage('backtesting');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#101018]/90 border border-[#1e1e30] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Strategy Lab & Algorithmic Studio</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              EVENT-DRIVEN KERNEL
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Design, configure and test quantitative strategies against multi-asset historical data feeds.
          </p>
        </div>

        {/* Selected Asset Indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-[#141422] px-3 py-1.5 rounded-xl border border-[#222238]">
          <span className="text-slate-400">Target Asset:</span>
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value as any)}
            className="bg-transparent text-indigo-300 font-bold outline-none cursor-pointer"
          >
            {AVAILABLE_ASSETS.map((a: AssetInfo) => (
              <option key={a.id} value={a.id} className="bg-[#141420] text-white">
                {a.name} ({a.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Strategy Cards Grid (Section 9) */}
      <div>
        <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center justify-between font-bold">
          <span>Select Quantitative Architecture</span>
          <span className="text-[11px] text-indigo-400 font-normal">Choose one to configure and backtest</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategyList.map(stratId => {
            const strat = STRATEGIES[stratId];
            const isSelected = selectedStrategyId === stratId;

            return (
              <div
                key={stratId}
                className={`rounded-2xl p-5 border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#18182c] border-indigo-500 shadow-xl shadow-indigo-600/20 ring-1 ring-indigo-500/60'
                    : 'bg-[#101018]/90 border-[#1e1e30] hover:border-slate-600 hover:bg-[#141422]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      strat.complexity === 'Beginner'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : strat.complexity === 'Intermediate'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                    }`}>
                      {strat.complexity}
                    </span>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-emerald-400 text-xs font-mono font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>CONFIGURED</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight mt-1">{strat.name}</h3>
                  <p className="text-[11px] text-indigo-300/90 font-mono mt-0.5">{strat.tagline}</p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans">
                    {strat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#1e1e32]">
                  <div className="text-[10px] text-slate-400 font-mono mb-3">
                    Target: <span className="text-slate-200 font-semibold">{strat.recommendedFor}</span>
                  </div>

                  <button
                    onClick={() => setSelectedStrategyId(stratId)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-[#171728] hover:bg-indigo-600/25 text-slate-300 hover:text-white border border-[#25253c]'
                    }`}
                  >
                    {isSelected ? 'Active Model ✓' : 'Select Architecture'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy Configuration Panel (Section 9) */}
      <div className="rounded-2xl bg-[#101018]/95 border border-[#1e1e30] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1a1a2a]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-600/10">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {STRATEGIES[selectedStrategyId].name} Parameters
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Asset: <span className="text-indigo-300 font-bold">{selectedAsset.name}</span> • Adjust indicator lookbacks, portfolio capital, and slippage
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
            CALCULATOR SYNCHRONIZED
          </span>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Fast Moving Average */}
          <div className="p-4 rounded-xl bg-[#141422] border border-[#222238]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Fast MA Period (Bars)
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="number"
                min={5}
                max={40}
                value={fastPeriod}
                onChange={(e) => setFastPeriod(Number(e.target.value))}
                className="w-24 bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-3 py-1.5 text-sm font-mono text-white text-center focus:border-indigo-500 outline-none"
              />
              <span className="text-xs text-slate-400 font-mono">Recommended: 15 — 25</span>
            </div>
          </div>

          {/* Slow Moving Average */}
          <div className="p-4 rounded-xl bg-[#141422] border border-[#222238]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Slow MA Period (Bars)
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="number"
                min={30}
                max={150}
                value={slowPeriod}
                onChange={(e) => setSlowPeriod(Number(e.target.value))}
                className="w-24 bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-3 py-1.5 text-sm font-mono text-white text-center focus:border-indigo-500 outline-none"
              />
              <span className="text-xs text-slate-400 font-mono">Recommended: 50 — 100</span>
            </div>
          </div>

          {/* Initial Capital */}
          <div className="p-4 rounded-xl bg-[#141422] border border-[#222238]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Initial Capital (INR / ₹)
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="number"
                step={10000}
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-32 bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-3 py-1.5 text-sm font-mono text-white text-center focus:border-indigo-500 outline-none"
              />
              <span className="text-xs text-indigo-300 font-mono font-bold">{formatINR(initialCapital)}</span>
            </div>
          </div>

          {/* Position Sizing */}
          <div className="p-4 rounded-xl bg-[#141422] border border-[#222238]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Position Sizing (% Equity)
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="number"
                min={10}
                max={100}
                value={positionSize}
                onChange={(e) => setPositionSize(Number(e.target.value))}
                className="w-24 bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-3 py-1.5 text-sm font-mono text-white text-center focus:border-indigo-500 outline-none"
              />
              <span className="text-xs text-slate-400 font-mono">100% Full allocation</span>
            </div>
          </div>

          {/* Transaction Cost */}
          <div className="p-4 rounded-xl bg-[#141422] border border-[#222238]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Transaction Fee + Slippage (%)
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <input
                type="number"
                step={0.05}
                min={0}
                max={1.0}
                value={transactionCost}
                onChange={(e) => setTransactionCost(Number(e.target.value))}
                className="w-24 bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-3 py-1.5 text-sm font-mono text-white text-center focus:border-indigo-500 outline-none"
              />
              <span className="text-xs text-slate-400 font-mono">0.10% Roundtrip slippage</span>
            </div>
          </div>

          {/* Backtest Period */}
          <div className="p-4 rounded-xl bg-[#141422] border border-[#222238]">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1 font-semibold">
              Historical Observation Window
            </label>
            <div className="flex items-center space-x-2 mt-2 font-mono text-sm">
              <select
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-2.5 py-1.5 text-white outline-none"
              >
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
              </select>
              <span className="text-slate-400 font-bold">—</span>
              <select
                value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
                className="bg-[#0a0a12] border border-[#2b2b40] rounded-lg px-2.5 py-1.5 text-white outline-none"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prominent Run Button as explicitly requested in Section 9 */}
        <div className="mt-8 pt-5 border-t border-[#1a1a2a] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            Algorithm: <span className="text-white font-bold">{STRATEGIES[selectedStrategyId].name}</span> with bar-by-bar execution.
          </div>

          <button
            onClick={handleRunAndNavigate}
            disabled={isSimulating}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] group"
          >
            <span>RUN BACKTEST →</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
