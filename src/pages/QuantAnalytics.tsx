import React from 'react';
import { useApp } from '../context/AppContext';
import { ASSET_PRICE_SERIES } from '../data/mockData';
import { DrawdownChart } from '../components/charts/DrawdownChart';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Activity } from 'lucide-react';
import { PricePoint } from '../types';

export const QuantAnalytics: React.FC = () => {
  const { selectedAssetId, selectedAsset } = useApp();
  const priceHistory = ASSET_PRICE_SERIES[selectedAssetId] || ASSET_PRICE_SERIES.BTC;

  // Prepare cumulative returns and rolling volatility series
  const returnsData = React.useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];
    const step = Math.ceil(priceHistory.length / 250);
    return priceHistory.filter((_: PricePoint, idx: number) => idx % step === 0 || idx === priceHistory.length - 1);
  }, [priceHistory]);

  const CustomReturnsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-[#12121c] border border-[#27273d] p-3 rounded-xl shadow-xl text-xs font-mono">
          <div className="text-slate-400 text-[10px] mb-1.5 border-b border-[#1f1f2e] pb-1">
            Date: <span className="text-white font-semibold">{label}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center space-x-4 text-emerald-400 font-bold">
              <span>Cumulative Return:</span>
              <span>+{p.cumReturn}%</span>
            </div>
            {p.rollingVol && (
              <div className="flex justify-between items-center space-x-4 text-cyan-400 font-medium">
                <span>20D Rolling Volatility:</span>
                <span>{p.rollingVol}%</span>
              </div>
            )}
            <div className="flex justify-between items-center space-x-4 text-slate-300">
              <span>Asset Price:</span>
              <span>${p.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#111118]/80 border border-[#1f1f2e] p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Quantitative Risk & Returns Analytics</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {selectedAsset.name} ({selectedAsset.id})
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Statistical return distributions, rolling volatility regime detection, and tail-risk drawdowns.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-[#161624] px-3 py-1.5 rounded-lg border border-[#232336] text-slate-300">
          <span>Lookback:</span>
          <span className="text-indigo-300 font-bold">1,250 Daily Observations (2020-2026)</span>
        </div>
      </div>

      {/* Primary Chart: Cumulative Returns */}
      <div className="rounded-xl bg-[#111118]/90 border border-[#1f1f2e] p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1b1b28]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Cumulative Returns & Rolling Volatility Overlay</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                COMPOUND PATH
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Visualizes total capital growth percentage alongside 20-day rolling annualized volatility
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Cumulative Return (%)</span>
            </span>
            <span className="flex items-center space-x-1 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Rolling Volatility (%)</span>
            </span>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={returnsData} margin={{ top: 10, right: 15, left: 15, bottom: 0 }}>
              <defs>
                <linearGradient id="cumRetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                minTickGap={40}
              />
              <YAxis
                yAxisId="left"
                stroke="#10b981"
                tickLine={false}
                tick={{ fill: '#10b981', fontSize: 10, fontFamily: 'monospace' }}
                orientation="left"
                tickFormatter={(val) => `+${val}%`}
              />
              <YAxis
                yAxisId="right"
                stroke="#06b6d4"
                tickLine={false}
                tick={{ fill: '#06b6d4', fontSize: 10, fontFamily: 'monospace' }}
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomReturnsTooltip />} />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="cumReturn"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cumRetGrad)"
                name="Cumulative Return"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rollingVol"
                stroke="#06b6d4"
                strokeWidth={1.5}
                dot={false}
                name="Rolling Volatility"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Two Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#141424] to-[#10101c] border border-cyan-500/30">
          <div className="text-xs uppercase font-mono text-cyan-400 font-bold mb-1">Annualized Volatility (σ)</div>
          <div className="text-3xl font-extrabold font-mono text-white">{selectedAsset.annualizedVol}%</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            252-day scaled standard deviation of daily logarithmic returns.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-[#141424] to-[#10101c] border border-indigo-500/30">
          <div className="text-xs uppercase font-mono text-indigo-400 font-bold mb-1">Sharpe Ratio (Rf = 4.5%)</div>
          <div className="text-3xl font-extrabold font-mono text-white">{selectedAsset.sharpeRatio.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Excess return per unit of volatility relative to risk-free sovereign rate.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-[#141424] to-[#10101c] border border-rose-500/30">
          <div className="text-xs uppercase font-mono text-rose-400 font-bold mb-1">Maximum Peak-to-Trough Drawdown</div>
          <div className="text-3xl font-extrabold font-mono text-rose-400">{selectedAsset.maxDrawdown}%</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Largest single equity drawdown during the 5-year observation period.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-[#141424] to-[#10101c] border border-emerald-500/30">
          <div className="text-xs uppercase font-mono text-emerald-400 font-bold mb-1">Sortino Ratio (Downside σ)</div>
          <div className="text-3xl font-extrabold font-mono text-white">{(selectedAsset.sharpeRatio * 1.42).toFixed(2)}</div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Penalizes only downside volatility, preserving upside participation.
          </p>
        </div>
      </div>

      {/* Bottom Section: Drawdown History Area Chart */}
      <div className="rounded-xl bg-[#111118]/90 border border-[#1f1f2e] p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1b1b28]">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Historical Drawdown Profile (Underwater Curve)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300">
                TAIL RISK ANALYSIS
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Tracks drawdown severity and duration from historical highs to subsequent recovery
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400 font-bold">
            Max Historical Dip: {selectedAsset.maxDrawdown}%
          </span>
        </div>

        <DrawdownChart data={returnsData.map((d: PricePoint) => ({ date: d.date, drawdown: d.drawdown || 0 }))} />
      </div>

      {/* Advanced Tail Risk Statistics Matrix */}
      <div className="rounded-xl bg-[#111118]/80 border border-[#1f1f2e] p-5">
        <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-white mb-3">
          Parametric & Non-Parametric Risk Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#141422] border border-[#212133]">
            <div className="text-slate-400 text-[10px] uppercase">Daily VaR (95% Confidence)</div>
            <div className="text-base font-bold text-rose-400 mt-1">-3.42%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Parametric 1-Day loss boundary</div>
          </div>
          <div className="p-3 rounded-lg bg-[#141422] border border-[#212133]">
            <div className="text-slate-400 text-[10px] uppercase">Conditional VaR / Expected Shortfall</div>
            <div className="text-base font-bold text-rose-400 mt-1">-5.18%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mean loss beyond 95th percentile</div>
          </div>
          <div className="p-3 rounded-lg bg-[#141422] border border-[#212133]">
            <div className="text-slate-400 text-[10px] uppercase">Calmar Ratio (Ret / MaxDD)</div>
            <div className="text-base font-bold text-indigo-300 mt-1">
              {(selectedAsset.totalReturn5Y / Math.abs(selectedAsset.maxDrawdown * 5)).toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Annualized return to drawdown ratio</div>
          </div>
          <div className="p-3 rounded-lg bg-[#141422] border border-[#212133]">
            <div className="text-slate-400 text-[10px] uppercase">Return Skewness & Kurtosis</div>
            <div className="text-base font-bold text-slate-200 mt-1">+0.48 / 4.82</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fat-tail distribution indicator</div>
          </div>
        </div>
      </div>
    </div>
  );
};
