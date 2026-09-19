import React from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_ASSETS, ASSET_PRICE_SERIES } from '../data/mockData';
import { PriceChart } from '../components/charts/PriceChart';
import { MetricCard } from '../components/ui/MetricCard';
import { formatPct } from '../lib/quant';
import { 
  TrendingUp, 
  Compass, 
  Sliders
} from 'lucide-react';
import { AssetInfo } from '../types';

export const MarketExplorer: React.FC = () => {
  const { selectedAssetId, setSelectedAssetId, selectedAsset, setActivePage } = useApp();
  const priceHistory = ASSET_PRICE_SERIES[selectedAssetId] || ASSET_PRICE_SERIES.BTC;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Asset Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#111118]/80 border border-[#1f1f2e] p-5 rounded-2xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-mono font-black text-indigo-300 text-base">
            {selectedAsset.id}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight">{selectedAsset.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selectedAsset.symbol}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedAsset.exchange}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono leading-relaxed">
              {selectedAsset.description}
            </p>
          </div>
        </div>

        {/* Switch Asset Selector */}
        <div className="flex items-center space-x-2 bg-[#161624] p-1.5 rounded-xl border border-[#242438]">
          {AVAILABLE_ASSETS.map((asset: AssetInfo) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                selectedAssetId === asset.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f1f30]'
              }`}
            >
              {asset.name}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Key Asset Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Spot Price"
          value={`$${selectedAsset.price.toLocaleString()}`}
          change={formatPct(selectedAsset.change24hPct)}
          changeType={selectedAsset.change24hPct >= 0 ? 'positive' : 'negative'}
          subtext="24h Change"
          sparkline={selectedAsset.sparkline}
          sparklineColor="#6366f1"
        />

        <MetricCard
          title="5Y Total Return"
          value={`+${selectedAsset.totalReturn5Y}%`}
          change="Bullish"
          changeType="positive"
          subtext="Compound lookback"
          sparkline={[100, 140, 220, 180, 310, 420, 680, 824]}
          sparklineColor="#10b981"
        />

        <MetricCard
          title="Annualized Vol"
          value={`${selectedAsset.annualizedVol}%`}
          change="Regime"
          changeType="neutral"
          subtext="252-day historical"
          sparkline={[42, 45, 55, 62, 58, 54, 58]}
          sparklineColor="#06b6d4"
        />

        <MetricCard
          title="Sharpe Ratio"
          value={selectedAsset.sharpeRatio.toFixed(2)}
          change={selectedAsset.sharpeRatio > 1.2 ? 'Strong' : 'Moderate'}
          changeType={selectedAsset.sharpeRatio > 1.2 ? 'positive' : 'warning'}
          subtext="Risk-adjusted"
        />

        <MetricCard
          title="Max Drawdown"
          value={`${selectedAsset.maxDrawdown}%`}
          change="Peak to trough"
          changeType="negative"
          subtext="Historical extreme"
          sparkline={[-10, -25, -45, -76.8, -50, -25, -12]}
          sparklineColor="#f43f5e"
        />

        <MetricCard
          title="Data Points"
          value={selectedAsset.dataPoints.toLocaleString()}
          change="Daily Bars"
          changeType="neutral"
          subtext="2020-2026 Lookback"
        />
      </div>

      {/* Main Interactive Price Chart */}
      <PriceChart
        data={priceHistory}
        assetName={selectedAsset.name}
        symbol={selectedAsset.symbol}
      />

      {/* Quantitative Indicator Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Technical Oscillators */}
        <div className="rounded-xl bg-[#111118]/80 border border-[#1f1f2e] p-5">
          <div className="flex items-center justify-between border-b border-[#1b1b28] pb-3 mb-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Momentum Indicators</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ACCUMULATION
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">14-Day RSI:</span>
              <span className="text-emerald-400 font-bold">62.4 (Bullish Expansion)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">MACD Histogram:</span>
              <span className="text-emerald-400 font-bold">+184.20 (Positive Divergence)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">Bollinger %B:</span>
              <span className="text-slate-200 font-bold">0.82 (Upper Band Expansion)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">14-Day ATR Volatility:</span>
              <span className="text-slate-200 font-bold">$2,140 (2.34% Avg Range)</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Stochastic %K / %D:</span>
              <span className="text-indigo-300 font-bold">78.5 / 74.2 (Golden Alignment)</span>
            </div>
          </div>
        </div>

        {/* Moving Average Status */}
        <div className="rounded-xl bg-[#111118]/80 border border-[#1f1f2e] p-5">
          <div className="flex items-center justify-between border-b border-[#1b1b28] pb-3 mb-4">
            <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Trend Regime Signals</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              BULL REGIME
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">20-Day SMA:</span>
              <span className="text-amber-400 font-bold">Price &gt; SMA 20 (+4.8%)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">50-Day SMA:</span>
              <span className="text-cyan-400 font-bold">Price &gt; SMA 50 (+11.4%)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">Golden Cross Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE (Bullish Spread)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-[#181824]">
              <span className="text-slate-400">200-Day Macro Filter:</span>
              <span className="text-emerald-400 font-bold">Trading Above 200 SMA</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Trend Persistence:</span>
              <span className="text-indigo-300 font-bold">High (ADX = 34.8)</span>
            </div>
          </div>
        </div>

        {/* Strategy Quick Backtest Call to Action */}
        <div className="rounded-xl bg-gradient-to-br from-[#171728] to-[#121220] border border-indigo-500/30 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <Sliders className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold">Strategy Lab Link</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              Test {selectedAsset.name} Against Quantitative Strategies
            </h4>
            <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
              Verify if an algorithmic SMA Crossover or EMA Momentum strategy outperforms a pure Buy & Hold passive allocation.
            </p>
          </div>

          <button
            onClick={() => setActivePage('strategy-lab')}
            className="w-full mt-4 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>Open in Strategy Lab</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
