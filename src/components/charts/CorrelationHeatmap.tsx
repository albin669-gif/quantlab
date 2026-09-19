import React from 'react';
import { AssetId } from '../../types';

interface CorrelationMatrixProps {
  onSelectPair?: (asset1: AssetId, asset2: AssetId) => void;
  selectedPair?: [AssetId, AssetId];
}

export const CorrelationHeatmap: React.FC<CorrelationMatrixProps> = ({ 
  onSelectPair, 
  selectedPair = ['BTC', 'NVDA'] 
}) => {
  const assets: { id: AssetId; name: string; symbol: string }[] = [
    { id: 'BTC', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'GOLD', name: 'Gold', symbol: 'XAU' },
    { id: 'NVDA', name: 'NVIDIA', symbol: 'NVDA' },
    { id: 'SPY', name: 'S&P 500', symbol: 'SPY' },
  ];

  // Divergent correlation values
  const matrix: Record<string, Record<string, number>> = {
    BTC:  { BTC: 1.00, GOLD: 0.18, NVDA: 0.52, SPY: 0.44 },
    GOLD: { BTC: 0.18, GOLD: 1.00, NVDA: 0.06, SPY: 0.12 },
    NVDA: { BTC: 0.52, GOLD: 0.06, NVDA: 1.00, SPY: 0.78 },
    SPY:  { BTC: 0.44, GOLD: 0.12, NVDA: 0.78, SPY: 1.00 },
  };

  const getCellColor = (val: number, isSelf: boolean) => {
    if (isSelf) return 'bg-indigo-600/30 text-white font-bold border-indigo-500/40';
    if (val >= 0.7) return 'bg-indigo-500/40 text-indigo-200 font-bold border-indigo-500/50';
    if (val >= 0.4) return 'bg-cyan-500/25 text-cyan-200 font-semibold border-cyan-500/30';
    if (val >= 0.15) return 'bg-slate-800/80 text-slate-300 font-medium border-slate-700/40';
    return 'bg-emerald-950/40 text-emerald-300 font-medium border-emerald-800/30';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="p-3 text-left text-xs font-mono text-slate-400 border-b border-[#1f1f2e]">
              Asset Pair
            </th>
            {assets.map(a => (
              <th key={a.id} className="p-3 text-xs font-mono font-bold text-slate-300 border-b border-[#1f1f2e]">
                <div className="text-white">{a.symbol}</div>
                <div className="text-[10px] text-slate-400 font-normal">{a.name}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map(rowAsset => (
            <tr key={rowAsset.id} className="border-b border-[#181824] hover:bg-[#151522] transition-colors">
              <td className="p-3 text-left text-xs font-mono font-bold text-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{rowAsset.name}</span>
                  <span className="text-slate-400 font-normal">({rowAsset.symbol})</span>
                </div>
              </td>
              {assets.map(colAsset => {
                const val = matrix[rowAsset.id]?.[colAsset.id] ?? 0;
                const isSelf = rowAsset.id === colAsset.id;
                const isSelected = 
                  (selectedPair[0] === rowAsset.id && selectedPair[1] === colAsset.id) ||
                  (selectedPair[0] === colAsset.id && selectedPair[1] === rowAsset.id);

                return (
                  <td key={colAsset.id} className="p-2">
                    <button
                      onClick={() => onSelectPair && !isSelf && onSelectPair(rowAsset.id, colAsset.id)}
                      disabled={isSelf}
                      className={`w-full py-3 px-2 rounded-lg border text-xs font-mono transition-all duration-150 ${
                        getCellColor(val, isSelf)
                      } ${isSelected ? 'ring-2 ring-indigo-400 scale-[1.03] shadow-lg shadow-indigo-500/20' : 'hover:scale-[1.02]'}`}
                    >
                      <div>{val.toFixed(2)}</div>
                      <div className="text-[9px] opacity-70">
                        {isSelf ? 'identity' : val >= 0.5 ? 'strong' : val >= 0.2 ? 'moderate' : 'decorrelated'}
                      </div>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
