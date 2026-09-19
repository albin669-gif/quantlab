import React, { useState } from 'react';
import { SensitivityCell } from '../../types';
import { formatPct } from '../../lib/quant';

interface SensitivityHeatmapProps {
  matrix: SensitivityCell[];
  currentFast: number;
  currentSlow: number;
  onSelectParam?: (fast: number, slow: number) => void;
}

export const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({
  matrix,
  currentFast,
  currentSlow,
  onSelectParam,
}) => {
  const [metricView, setMetricView] = useState<'return' | 'sharpe'>('return');

  const fastRows = [10, 15, 20, 25, 30];
  const slowCols = [30, 45, 50, 70, 100];

  const getCell = (f: number, s: number) => {
    return matrix.find(m => m.fast === f && m.slow === s);
  };

  const getHeatmapColor = (cell?: SensitivityCell) => {
    if (!cell) return 'bg-[#151520] text-slate-400';
    if (metricView === 'return') {
      const ret = cell.returnPct;
      if (ret >= 75) return 'bg-emerald-600/40 text-emerald-200 border-emerald-500/50';
      if (ret >= 50) return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30';
      if (ret >= 25) return 'bg-indigo-500/30 text-indigo-200 border-indigo-500/30';
      if (ret >= 0) return 'bg-slate-800 text-slate-300 border-slate-700';
      return 'bg-rose-950/40 text-rose-300 border-rose-800/40';
    } else {
      const sh = cell.sharpe;
      if (sh >= 1.5) return 'bg-emerald-600/40 text-emerald-200 border-emerald-500/50';
      if (sh >= 1.2) return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30';
      if (sh >= 1.0) return 'bg-indigo-500/30 text-indigo-200 border-indigo-500/30';
      return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="rounded-xl bg-[#111118]/90 border border-[#1f1f2e] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1b1b28]">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Parameter Robustness Heatmap</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OVERFITTING RESISTANCE
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cross-testing Fast MA vs Slow MA surface prevents curve-fitting anomalies
          </p>
        </div>

        {/* Metric View Toggle */}
        <div className="flex items-center bg-[#151522] p-1 rounded-lg border border-[#1f1f2e] text-[11px] font-mono">
          <button
            onClick={() => setMetricView('return')}
            className={`px-3 py-1 rounded transition-colors ${
              metricView === 'return'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Total Return (%)
          </button>
          <button
            onClick={() => setMetricView('sharpe')}
            className={`px-3 py-1 rounded transition-colors ${
              metricView === 'sharpe'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sharpe Ratio
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2.5 text-left text-xs font-mono text-slate-400 border-b border-[#1f1f2e]">
                Fast \ Slow
              </th>
              {slowCols.map(s => (
                <th key={s} className="p-2.5 text-xs font-mono font-bold text-slate-300 border-b border-[#1f1f2e]">
                  SMA {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fastRows.map(f => (
              <tr key={f} className="border-b border-[#181824]">
                <td className="p-2.5 text-left text-xs font-mono font-bold text-slate-300">
                  SMA {f}
                </td>
                {slowCols.map(s => {
                  const cell = getCell(f, s);
                  const isCurrent = f === currentFast && s === currentSlow;
                  const isInvalid = s <= f;

                  return (
                    <td key={s} className="p-1.5">
                      {isInvalid ? (
                        <div className="py-2.5 px-2 rounded-lg bg-[#0d0d14] text-[10px] text-slate-400 font-mono">
                          N/A
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectParam && onSelectParam(f, s)}
                          className={`w-full py-2 px-2 rounded-lg border text-xs font-mono transition-all duration-150 ${
                            getHeatmapColor(cell)
                          } ${
                            isCurrent
                              ? 'ring-2 ring-indigo-400 scale-[1.05] shadow-lg shadow-indigo-500/20'
                              : 'hover:scale-[1.02]'
                          }`}
                        >
                          <div className="font-bold">
                            {cell ? (metricView === 'return' ? formatPct(cell.returnPct) : cell.sharpe.toFixed(2)) : '-'}
                          </div>
                          {isCurrent && (
                            <div className="text-[9px] uppercase tracking-wider text-indigo-300 font-extrabold">
                              Current
                            </div>
                          )}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
