import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { AssetId } from '../../types';
import { ASSET_PRICE_SERIES } from '../../data/mockData';
import { calculateRollingCorrelation } from '../../lib/quant';

interface RollingCorrelationProps {
  asset1: AssetId;
  asset2: AssetId;
}

export const RollingCorrelationChart: React.FC<RollingCorrelationProps> = ({ asset1, asset2 }) => {
  const [windowDays, setWindowDays] = useState<number>(90);

  const series1 = ASSET_PRICE_SERIES[asset1] || ASSET_PRICE_SERIES.BTC;
  const series2 = ASSET_PRICE_SERIES[asset2] || ASSET_PRICE_SERIES.NVDA;

  const chartData = React.useMemo(() => {
    const p1 = series1.map(s => s.price);
    const p2 = series2.map(s => s.price);
    const rolling = calculateRollingCorrelation(p1, p2, windowDays);

    return rolling.map(item => ({
      date: series1[item.index]?.date || `Day ${item.index}`,
      correlation: item.corr,
    }));
  }, [series1, series2, windowDays]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-[#12121c] border border-[#27273d] p-3 rounded-xl shadow-xl text-xs font-mono">
          <div className="text-slate-400 text-[10px] mb-1">Date: {label}</div>
          <div className="text-indigo-400 font-bold">
            {windowDays}-Day Rolling Correlation: {val}
          </div>
          <div className="text-slate-400 text-[10px] mt-1">
            {val > 0.6 ? 'High co-movement regime' : val > 0.2 ? 'Moderate correlation' : 'Macro diversification regime'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-[#111118]/80 border border-[#1f1f2e] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1b1b28]">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Rolling Correlation ({asset1} vs {asset2})</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              {windowDays}D WINDOW
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Dynamic regime co-movement dynamics over 5-year lookback
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center bg-[#151522] p-1 rounded-lg border border-[#1f1f2e] text-[11px] font-mono">
          {[
            { label: '30D', val: 30 },
            { label: '60D', val: 60 },
            { label: '90D', val: 90 },
            { label: '180D', val: 180 },
            { label: '1Y', val: 252 },
          ].map(opt => (
            <button
              key={opt.val}
              onClick={() => setWindowDays(opt.val)}
              className={`px-2.5 py-1 rounded transition-colors ${
                windowDays === opt.val
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c2b" vertical={false} />
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
              domain={[-0.5, 1.0]}
              orientation="right"
              ticks={[-0.4, -0.2, 0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="correlation"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
