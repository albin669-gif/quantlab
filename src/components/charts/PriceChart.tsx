import React, { useState } from 'react';
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
import { PricePoint } from '../../types';
import { Sliders, Maximize2 } from 'lucide-react';

interface PriceChartProps {
  data: PricePoint[];
  assetName: string;
  symbol: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, assetName, symbol }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '6M' | '1Y' | '3Y' | 'MAX'>('MAX');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showEMA20, setShowEMA20] = useState(false);
  const [showEMA50, setShowEMA50] = useState(false);

  // Filter data by selected timeframe
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeframe === '1M') return data.slice(-25);
    if (timeframe === '6M') return data.slice(-130);
    if (timeframe === '1Y') return data.slice(-260);
    if (timeframe === '3Y') return data.slice(-780);
    return data;
  }, [data, timeframe]);

  // Downsample if MAX to keep chart responsive
  const chartPoints = React.useMemo(() => {
    if (filteredData.length <= 300) return filteredData;
    const step = Math.ceil(filteredData.length / 250);
    return filteredData.filter((_, idx) => idx % step === 0 || idx === filteredData.length - 1);
  }, [filteredData]);

  const latestPrice = data[data.length - 1]?.price || 0;
  const initialPrice = filteredData[0]?.price || latestPrice;
  const periodReturn = initialPrice > 0 ? (((latestPrice - initialPrice) / initialPrice) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload as PricePoint;
      return (
        <div className="bg-[#11111a] border border-[#27273d] p-3 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-md">
          <div className="text-slate-400 text-[10px] mb-2 flex items-center justify-between border-b border-[#1f1f2e] pb-1">
            <span className="font-bold text-slate-300">{label}</span>
            <span className="text-indigo-400 font-bold">{symbol}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center space-x-6">
              <span className="text-slate-400">Close Price:</span>
              <span className="text-white font-bold">${p.price?.toLocaleString()}</span>
            </div>
            {p.dailyReturn !== undefined && (
              <div className="flex justify-between items-center space-x-6">
                <span className="text-slate-400">Daily Delta:</span>
                <span className={`font-bold ${p.dailyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {p.dailyReturn >= 0 ? '+' : ''}{p.dailyReturn}%
                </span>
              </div>
            )}
            {showSMA20 && p.sma20 && (
              <div className="flex justify-between items-center space-x-6 text-amber-400">
                <span>SMA (20):</span>
                <span>${p.sma20?.toLocaleString()}</span>
              </div>
            )}
            {showSMA50 && p.sma50 && (
              <div className="flex justify-between items-center space-x-6 text-cyan-400">
                <span>SMA (50):</span>
                <span>${p.sma50?.toLocaleString()}</span>
              </div>
            )}
            {showEMA20 && p.ema20 && (
              <div className="flex justify-between items-center space-x-6 text-purple-400">
                <span>EMA (20):</span>
                <span>${p.ema20?.toLocaleString()}</span>
              </div>
            )}
            {showEMA50 && p.ema50 && (
              <div className="flex justify-between items-center space-x-6 text-pink-400">
                <span>EMA (50):</span>
                <span>${p.ema50?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-[#101018]/95 border border-[#1e1e30] p-5 shadow-lg">
      {/* Chart Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1a1a2a]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-sm md:text-base font-bold text-white tracking-tight">{assetName} Price Chart</h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {symbol}
            </span>
            <span className={`text-xs font-mono font-bold ${periodReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({periodReturn >= 0 ? '+' : ''}{periodReturn.toFixed(2)}% in {timeframe})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Dual moving average trend channels with momentum overlays
          </p>
        </div>

        {/* Indicators & Timeframe toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Moving Average Overlay Toggles */}
          <div className="flex items-center bg-[#141422] p-1 rounded-xl border border-[#202034] text-[11px] font-mono">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                showSMA20 ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>SMA 20</span>
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                showSMA50 ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>SMA 50</span>
            </button>
            <button
              onClick={() => setShowEMA20(!showEMA20)}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                showEMA20 ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>EMA 20</span>
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                showEMA50 ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span>EMA 50</span>
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-[#141422] p-1 rounded-xl border border-[#202034] text-[11px] font-mono">
            {(['1M', '6M', '1Y', '3Y', 'MAX'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  timeframe === tf
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartPoints} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#191928" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              minTickGap={45}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
              domain={['auto', 'auto']}
              orientation="right"
              tickFormatter={(val) => `$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Price Area */}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#6366f1"
              strokeWidth={2.25}
              fillOpacity={1}
              fill="url(#priceGradient)"
              name="Price"
            />

            {/* Moving Average Overlays */}
            {showSMA20 && (
              <Line
                type="monotone"
                dataKey="sma20"
                stroke="#f59e0b"
                strokeWidth={1.75}
                dot={false}
                name="SMA 20"
              />
            )}
            {showSMA50 && (
              <Line
                type="monotone"
                dataKey="sma50"
                stroke="#06b6d4"
                strokeWidth={1.75}
                dot={false}
                name="SMA 50"
              />
            )}
            {showEMA20 && (
              <Line
                type="monotone"
                dataKey="ema20"
                stroke="#a855f7"
                strokeWidth={1.75}
                dot={false}
                name="EMA 20"
              />
            )}
            {showEMA50 && (
              <Line
                type="monotone"
                dataKey="ema50"
                stroke="#ec4899"
                strokeWidth={1.75}
                dot={false}
                name="EMA 50"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
