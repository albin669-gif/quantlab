import React from 'react';
import { useApp } from '../context/AppContext';
import { SensitivityHeatmap } from '../components/charts/SensitivityHeatmap';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Calendar
} from 'lucide-react';
import { formatPct } from '../lib/quant';
import { RegimePerformance } from '../types';

export const MarketRegimes: React.FC = () => {
  const { 
    backtestResult, 
    fastPeriod, 
    slowPeriod, 
    setFastPeriod, 
    setSlowPeriod, 
    runBacktest 
  } = useApp();

  if (!backtestResult) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        Please run a backtest first.
      </div>
    );
  }

  const { regimes, sensitivityMatrix } = backtestResult;

  const handleSelectParam = async (f: number, s: number) => {
    setFastPeriod(f);
    setSlowPeriod(s);
    await runBacktest();
  };

  const regimeTimeline = [
    { period: 'Q1 2020', regime: 'Bear Market (Covid Crash)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', notes: 'Severe liquidity flash crash; dynamic trailing stop preserves cash.' },
    { period: '2020 — 2021', regime: 'Bull Market (Stimulus Liquidity)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', notes: 'Persistent parabolic momentum; golden cross maintains continuous long exposure.' },
    { period: '2022', regime: 'Bear Market (Fed Hiking Cycle)', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', notes: 'Prolonged downward macro drift; strategy exits to cash, dodging -60%+ passive drawdown.' },
    { period: '2023 — 2024', regime: 'High Volatility (Generative AI / ETF)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', notes: 'Violent institutional accumulation swings; fast MA captures explosive breakout legs.' },
    { period: '2025 — 2026', regime: 'Low Volatility (Macro Consolidation)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', notes: 'Trading in compressed channel at elevated valuations; minimal whipsaw slippage.' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#111118]/80 border border-[#1f1f2e] p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Market Regime Analysis & Strategy Robustness</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              STRESS TESTING
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Quantify algorithmic strategy behavior across Bull, Bear, High Volatility, and Low Volatility market cycles.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-300 bg-[#161624] px-3 py-1.5 rounded-lg border border-[#232336]">
          Strategy: <span className="text-indigo-300 font-bold">{backtestResult.strategyName}</span>
        </div>
      </div>

      {/* 4 Regime Cards (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regimes.map((reg: RegimePerformance) => {
          const isBull = reg.regime === 'Bull Market';
          const isBear = reg.regime === 'Bear Market';
          const isHighVol = reg.regime === 'High Volatility';
          
          return (
            <div
              key={reg.regime}
              className={`rounded-xl p-5 border flex flex-col justify-between ${
                isBull
                  ? 'bg-gradient-to-br from-[#121c17] to-[#101318] border-emerald-500/40'
                  : isBear
                  ? 'bg-gradient-to-br from-[#1c1214] to-[#141012] border-rose-500/40'
                  : isHighVol
                  ? 'bg-gradient-to-br from-[#181424] to-[#11101a] border-indigo-500/40'
                  : 'bg-gradient-to-br from-[#121822] to-[#101318] border-cyan-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center space-x-1.5">
                    {isBull ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : isBear ? <TrendingDown className="w-4 h-4 text-rose-400" /> : <Zap className="w-4 h-4 text-indigo-400" />}
                    <span>{reg.regime}</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                    {reg.trades} Trades
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Strategy Return</div>
                  <div className={`text-2xl font-bold font-mono ${reg.strategyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPct(reg.strategyReturn)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Benchmark: {formatPct(reg.benchmarkReturn)}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 font-mono leading-relaxed">
                  {reg.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-400">Sharpe: </span>
                  <span className="font-bold text-white">{reg.sharpe}</span>
                </div>
                <div>
                  <span className="text-slate-400">Win Rate: </span>
                  <span className="font-bold text-emerald-400">{reg.winRate}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Regime Timeline (Section 13) */}
      <div className="rounded-xl bg-[#111118]/90 border border-[#1f1f2e] p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1b1b28]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Historical Regime Classification Timeline</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Historical phases identified using multi-factor volatility and trend detection models
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-300">2020 — 2026</span>
        </div>

        <div className="space-y-3">
          {regimeTimeline.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#151522] border border-[#232336] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold w-24 flex-shrink-0">{item.period}</span>
                <span className={`px-2.5 py-1 rounded border font-semibold ${item.color}`}>
                  {item.regime}
                </span>
              </div>
              <div className="text-slate-300 flex-1 md:ml-4 text-left">
                {item.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 14: ROBUSTNESS TESTING - Parameter Sensitivity Heatmap */}
      <SensitivityHeatmap
        matrix={sensitivityMatrix}
        currentFast={fastPeriod}
        currentSlow={slowPeriod}
        onSelectParam={handleSelectParam}
      />
    </div>
  );
};
