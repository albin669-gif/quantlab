import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const SimulationModal: React.FC = () => {
  const { isSimulating, simulationStep, simulationProgress } = useApp();

  if (!isSimulating) return null;

  const steps = [
    { label: 'Connecting to historical data feed', threshold: 15 },
    { label: 'Calculating quantitative indicators (SMA/EMA)', threshold: 35 },
    { label: 'Generating algorithmic cross signals & entry orders', threshold: 55 },
    { label: 'Simulating order execution & slippage', threshold: 75 },
    { label: 'Computing risk statistics & drawdown series', threshold: 90 },
    { label: 'Synthesizing regime breakdown & sensitivity', threshold: 100 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#11111a] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl shadow-indigo-500/20 text-center">
        {/* Terminal Spinner */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/30">
          <Cpu className="w-7 h-7 text-indigo-400 animate-pulse" />
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight">
          Executing Quantitative Backtest
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          High-frequency simulation engine running...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#1b1b2a] h-2.5 rounded-full my-4 overflow-hidden border border-[#27273d]">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${simulationProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-4">
          <span className="text-indigo-300 font-semibold">{simulationStep}</span>
          <span>{simulationProgress}%</span>
        </div>

        {/* Sub-steps checklist */}
        <div className="space-y-1.5 text-left border-t border-[#1f1f2e] pt-3 text-xs font-mono">
          {steps.map((s, idx) => {
            const isDone = simulationProgress >= s.threshold;
            const isCurrent = !isDone && (idx === 0 || simulationProgress >= steps[idx - 1].threshold);
            return (
              <div
                key={idx}
                className={`flex items-center space-x-2 py-0.5 ${
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-300 font-semibold' : 'text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
