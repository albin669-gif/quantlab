import React, { useState } from 'react';
import { CorrelationHeatmap } from '../components/charts/CorrelationHeatmap';
import { RollingCorrelationChart } from '../components/charts/RollingCorrelationChart';
import { AssetId } from '../types';
import { GitMerge, Sparkles, AlertCircle } from 'lucide-react';

export const Correlation: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<[AssetId, AssetId]>(['BTC', 'NVDA']);

  const handleSelectPair = (a1: AssetId, a2: AssetId) => {
    setSelectedPair([a1, a2]);
  };

  const getPairInsight = (a1: AssetId, a2: AssetId) => {
    const key = `${a1}-${a2}`;
    const reverseKey = `${a2}-${a1}`;

    if (key === 'BTC-NVDA' || reverseKey === 'BTC-NVDA') {
      return {
        title: 'High Beta Tech & Liquidity Co-Movement Regime',
        summary: 'Bitcoin and NVIDIA demonstrated increasing correlation (+0.52 to +0.68) during high-liquidity stimulus and Generative AI investment cycles.',
        implication: 'Holding both assets concurrently increases portfolio volatility during macro risk-off liquidity contractions.',
        diversification: 'Moderate (Correlation: 0.52)',
      };
    }
    if (key === 'BTC-GOLD' || reverseKey === 'BTC-GOLD') {
      return {
        title: 'Digital vs Physical Monetary Reserve Decoupling',
        summary: 'Bitcoin and Gold maintain a statistically low correlation (0.18), occasionally decorrelating during sovereign flight-to-safety shocks.',
        implication: 'Gold serves as a true defensive ballast while Bitcoin functions as an asymmetric liquidity call option.',
        diversification: 'Superior (Correlation: 0.18)',
      };
    }
    if (key === 'NVDA-SPY' || reverseKey === 'NVDA-SPY') {
      return {
        title: 'Index Driver & Benchmark Concentration Risk',
        summary: 'NVIDIA shows an extremely high correlation (+0.78) with the S&P 500 (SPY), reflecting its heavyweight market cap weighting.',
        implication: 'Strategies trading NVIDIA are heavily exposed to broad market equity beta and Federal Reserve rate decisions.',
        diversification: 'Low (Correlation: 0.78)',
      };
    }
    return {
      title: 'Macro Cross-Asset Diversification Matrix',
      summary: `${a1} and ${a2} exhibit independent regime dynamics across the 5-year observation period.`,
      implication: 'Pairing uncorrelated assets improves portfolio Sharpe ratio by minimizing portfolio variance.',
      diversification: 'Active Regime',
    };
  };

  const insight = getPairInsight(selectedPair[0], selectedPair[1]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#111118]/80 border border-[#1f1f2e] p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Cross-Asset Correlation Lab</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              DIVERGING HEATMAP
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Analyze statistical co-movements, identify structural decoupling, and examine rolling correlation windows.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-[#161624] px-3 py-1.5 rounded-lg border border-[#232336] text-slate-300">
          <span>Active Pair:</span>
          <span className="text-indigo-300 font-bold">{selectedPair[0]} ↔ {selectedPair[1]}</span>
        </div>
      </div>

      {/* Correlation Matrix Heatmap */}
      <div className="rounded-xl bg-[#111118]/90 border border-[#1f1f2e] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1b1b28]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Multi-Asset Correlation Matrix Heatmap</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                PEARSON (r)
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Click any non-identity cell to load its rolling correlation time-series chart below
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-700" />
              <span className="text-slate-400">&lt; 0.20 (Diversified)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-900 border border-cyan-500" />
              <span className="text-slate-400">0.20 - 0.50</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-600 border border-indigo-400" />
              <span className="text-slate-400">&gt; 0.50 (High Co-movement)</span>
            </span>
          </div>
        </div>

        <CorrelationHeatmap
          onSelectPair={handleSelectPair}
          selectedPair={selectedPair}
        />
      </div>

      {/* AI-Style Insight Panel (Section 8) */}
      <div className="rounded-xl bg-gradient-to-br from-[#151526] to-[#10101b] border border-indigo-500/40 p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Quantitative Correlation Insight Engine</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
            {insight.diversification}
          </span>
        </div>

        <h4 className="text-base font-bold text-white tracking-tight mt-1">
          {insight.title}
        </h4>
        <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
          {insight.summary}
        </p>
        <p className="text-xs text-indigo-200/90 mt-1.5 font-mono">
          <span className="font-semibold text-white">Portfolio Implication: </span>
          {insight.implication}
        </p>

        {/* Clear Notice as explicitly required by prompt */}
        <div className="mt-3.5 pt-2.5 border-t border-[#232338] flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
          <span>
            Research Note: Algorithmic insights are synthesized from historical simulation sample data for quantitative validation purposes. Past cross-asset correlation regimes can decouple during sovereign liquidity events.
          </span>
        </div>
      </div>

      {/* Rolling Correlation Time-Series Chart */}
      <RollingCorrelationChart
        asset1={selectedPair[0]}
        asset2={selectedPair[1]}
      />
    </div>
  );
};
