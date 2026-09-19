import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface DrawdownChartProps {
  data: { date: string; drawdown: number; benchmarkDrawdown?: number }[];
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ data }) => {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (data.length <= 300) return data;
    const step = Math.ceil(data.length / 250);
    return data.filter((_, idx) => idx % step === 0 || idx === data.length - 1);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-[#12121c] border border-[#27273d] p-2.5 rounded-xl text-xs font-mono shadow-xl">
          <div className="text-slate-400 text-[10px] mb-1">{label}</div>
          <div className="text-rose-400 font-semibold">
            Strategy Drawdown: {p.drawdown}%
          </div>
          {p.benchmarkDrawdown !== undefined && (
            <div className="text-slate-400 text-[11px] mt-0.5">
              Benchmark Drawdown: {p.benchmarkDrawdown}%
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.0} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.35} />
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
            domain={['dataMin', 0]}
            orientation="right"
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#f43f5e"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#drawdownGradient)"
            name="Strategy Drawdown"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
