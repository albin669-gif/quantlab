import React from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/ui/MetricCard';
import { PriceChart } from '../components/charts/PriceChart';
import { DataIntegrityBadge, DisclaimerBanner } from '../components/ui/DataIntegrityBadge';
import { ASSET_PRICE_SERIES, AVAILABLE_ASSETS } from '../data/mockData';
import { formatINR, formatPct } from '../lib/quant';
import { 
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  BarChart3,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { AssetInfo } from '../types';

export const Overview: React.FC = () => {
  const { 
    selectedAssetId, 
    setSelectedAssetId, 
    selectedAsset, 
    backtestResult, 
    setActivePage,
    launchDemoMode,
    isDemoRunning
  } = useApp();

  const priceHistory = ASSET_PRICE_SERIES[selectedAssetId] || ASSET_PRICE_SERIES.BTC;

  const currentPortfolioValue = backtestResult ? backtestResult.finalPortfolio : 124850;
  const portfolioReturn = backtestResult ? backtestResult.totalReturnPct : 24.85;
  const benchmarkReturn = backtestResult ? backtestResult.benchmarkReturnPct : 18.20;
  const sharpe = backtestResult ? backtestResult.sharpeRatio : 1.48;
  const vol = backtestResult ? backtestResult.annualizedVol : 32.4;
  const maxDD = backtestResult ? backtestResult.maxDrawdownPct : -21.8;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Section: Clean, Organized, Institutional Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#121222] via-[#0f0f1c] to-[#0a0a14] border border-[#222236] p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quantitative Multi-Asset Research & Algorithmic Terminal</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Institutional Market Intelligence & Strategy Backtesting
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-2 font-mono leading-relaxed">
            Analyze historical financial data for Bitcoin, Gold, and NVIDIA. Test algorithmic crossover models, inspect correlation breakdowns, simulate transaction costs, and stress-test performance across diverse market regimes.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setActivePage('strategy-lab')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Strategy Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('backtesting')}
              className="px-4 py-2.5 rounded-xl bg-[#171726] hover:bg-[#202034] text-slate-200 border border-[#2c2c40] text-xs font-semibold font-mono transition-colors"
            >
              View Backtest Results
            </button>

            <button
              onClick={launchDemoMode}
              disabled={isDemoRunning}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>{isDemoRunning ? 'Demo Active...' : 'Launch Pitch Demo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Executive Quantitative Risk & Return Profile
          </span>
          <span className="text-[11px] font-mono text-indigo-400">
            Strategy: {backtestResult?.strategyName || 'SMA Crossover'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <MetricCard
            title="Total Assets"
            value="4 Tracked"
            change="Multi-Asset"
            changeType="neutral"
            subtext="BTC, GOLD, NVDA, SPY"
            tooltip="Active multi-asset historical universe"
          />

          <MetricCard
            title="Market Return"
            value={formatPct(selectedAsset.change24hPct)}
            change={selectedAsset.change24hPct >= 0 ? '+24H' : '-24H'}
            changeType={selectedAsset.change24hPct >= 0 ? 'positive' : 'negative'}
            subtext={`${selectedAsset.name} Spot`}
            sparkline={selectedAsset.sparkline}
            sparklineColor="#6366f1"
            tooltip="24-hour spot performance"
          />

          <MetricCard
            title="Portfolio Value"
            value={formatINR(currentPortfolioValue)}
            change={formatPct(portfolioReturn)}
            changeType={portfolioReturn >= 0 ? 'positive' : 'negative'}
            subtext={`vs benchmark ${formatPct(benchmarkReturn)}`}
            sparkline={backtestResult?.equityCurve.slice(-15).map((e: any) => e.strategy)}
            sparklineColor="#10b981"
            tooltip="Simulated portfolio equity with reinvestment"
            explainId="strategy-return"
          />

          <MetricCard
            title="Annualized Vol"
            value={`${vol}%`}
            change="Normal"
            changeType="neutral"
            subtext="252-day scaled"
            sparkline={[28, 30, 35, 32, 29, 31, 33, 32]}
            sparklineColor="#06b6d4"
            tooltip="Annualized standard deviation of daily returns"
            explainId="volatility"
          />

          <MetricCard
            title="Sharpe Ratio"
            value={sharpe.toFixed(2)}
            change={sharpe > 1.2 ? 'Superior' : 'Moderate'}
            changeType={sharpe > 1.2 ? 'positive' : 'warning'}
            subtext="Rf = 4.50% (US T-Bills)"
            tooltip="Risk-adjusted excess return per unit of volatility"
            explainId="sharpe"
          />

          <MetricCard
            title="Max Drawdown"
            value={`${maxDD}%`}
            change="Hedged"
            changeType="negative"
            subtext="Historical peak-to-trough"
            sparkline={[-5, -12, -18, -21.8, -14, -8, -4]}
            sparklineColor="#f43f5e"
            tooltip="Maximum observed drawdown during observation period"
            explainId="drawdown"
          />
        </div>
      </div>

      {/* Asset Selector Grid */}
      <div className="rounded-2xl bg-[#101018]/90 border border-[#1e1e30] p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3.5 border-b border-[#1a1a2a] pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-300 font-bold">Select Active Asset</span>
            <span className="text-[10px] text-slate-400 font-mono">1,250 Daily Bars • 2020-2026 Historical Dataset</span>
          </div>
          <span className="text-xs text-indigo-400 font-mono font-medium">Click to inspect chart & run backtest</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {AVAILABLE_ASSETS.map((asset: AssetInfo) => {
            const isSelected = asset.id === selectedAssetId;
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#18182c] border-indigo-500 shadow-lg shadow-indigo-600/15 ring-1 ring-indigo-500/50'
                    : 'bg-[#13131f] border-[#1f1f32] hover:border-slate-600 hover:bg-[#161626]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {asset.assetClass}
                    </span>
                    <div className="text-sm font-bold text-white mt-2">{asset.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{asset.symbol}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-white">${asset.price.toLocaleString()}</div>
                    <div className={`text-xs font-bold ${asset.change24hPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {asset.change24hPct >= 0 ? '+' : ''}{asset.change24hPct}%
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#1f1f34] grid grid-cols-3 gap-1 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400">5Y Ret:</span>
                    <div className="text-emerald-400 font-bold">+{asset.totalReturn5Y}%</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Sharpe:</span>
                    <div className="text-slate-200 font-bold">{asset.sharpeRatio}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Max DD:</span>
                    <div className="text-rose-400 font-bold">{asset.maxDrawdown}%</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Chart */}
      <PriceChart
        data={priceHistory}
        assetName={selectedAsset.name}
        symbol={selectedAsset.symbol}
      />

      {/* Institutional Data Integrity Protocol */}
      <DataIntegrityBadge />

      {/* Methodology & Risk Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};
