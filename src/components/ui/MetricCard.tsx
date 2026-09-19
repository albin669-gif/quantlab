import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
  subtext?: string;
  sparkline?: number[];
  sparklineColor?: string;
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtext,
  sparkline,
  sparklineColor = '#6366f1',
  tooltip,
}) => {
  // Generate high quality SVG path for sparklines
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 84;
    const height = 28;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={sparklineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const getChangeBadge = () => {
    if (!change) return null;
    if (changeType === 'positive') {
      return (
        <span className="inline-flex items-center text-[11px] font-bold font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/25">
          <ArrowUpRight className="w-3 h-3 mr-0.5" />
          {change}
        </span>
      );
    }
    if (changeType === 'negative') {
      return (
        <span className="inline-flex items-center text-[11px] font-bold font-mono text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-md border border-rose-500/25">
          <ArrowDownRight className="w-3 h-3 mr-0.5" />
          {change}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] font-bold font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/40">
        {change}
      </span>
    );
  };

  return (
    <div className="bg-[#101018]/90 hover:bg-[#141422] border border-[#1e1e30] hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] uppercase font-mono tracking-wider font-semibold text-slate-400 flex items-center space-x-1">
            <span>{title}</span>
            {tooltip && (
              <span title={tooltip} className="cursor-help text-slate-400 hover:text-slate-300">
                <Info className="w-3 h-3" />
              </span>
            )}
          </span>
          {sparkline && <div className="opacity-75 group-hover:opacity-100 transition-opacity">{renderSparkline()}</div>}
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight">
            {value}
          </div>
          {getChangeBadge()}
        </div>
      </div>

      {subtext && (
        <div className="mt-3 text-[10px] text-slate-400 font-mono border-t border-[#1c1c2c] pt-2 flex items-center justify-between">
          <span className="truncate">{subtext}</span>
        </div>
      )}
    </div>
  );
};
