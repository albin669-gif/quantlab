import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend 
} from 'recharts';
import { EquityPoint } from '../../types';
import { formatINR, formatPct } from '../../lib/quant';

interface EquityCurveProps {
  data: EquityPoint[];
  initialCapital: number;
}

export const EquityCurveChart: React.FC<EquityCurveProps> = ({ data, initialCapital }) => {
  // Downsample if very large to keep chart fast and smooth
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (data.length <= 300) return data;
    const step = Math.ceil(data.length / 250);
    return data.filter((_, idx) => idx % step === 0 || idx === data.length - 1);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload as EquityPoint;
      const stratRet = (((p.strategy - initialCapital) / initialCapital) * 100);
      const benchRet = (((p.benchmark - initialCapital) / initialCapital) * 100);

      return (
        <div className="bg-[#11111a] border border-[#2a2a3e] p-3 rounded-xl shadow-2xl text-xs font-mono">
          <div className="text-slate-400 text-[10px] mb-2 border-b border-[#1f1f2e] pb-1">
            Date: <span className="text-white font-semibold">{label}</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center space-x-6 text-indigo-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Strategy Equity:</span>
              </span>
              <span className="text-white">{formatINR(p.strategy)} ({formatPct(stratRet)})</span>
            </div>

            <div className="flex justify-between items-center space-x-6 text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Buy & Hold Benchmark:</span>
              </span>
              <span className="text-slate-200">{formatINR(p.benchmark)} ({formatPct(benchRet)})</span>
            </div>

            <div className="flex justify-between items-center space-x-6 text-rose-400 text-[11px] pt-1 border-t border-[#1f1f2e]">
              <span>Strategy Drawdown:</span>
              <span>{p.drawdown}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: 15, bottom: 0 }}>
          <defs>
            <linearGradient id="strategyEquityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="benchGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
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
            stroke="#64748b"
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            domain={['auto', 'auto']}
            orientation="right"
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Benchmark Line */}
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#benchGradient)"
            name="Buy & Hold Benchmark"
          />

          {/* Strategy Equity Area */}
          <Area
            type="monotone"
            dataKey="strategy"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#strategyEquityGradient)"
            name="Strategy Portfolio"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
