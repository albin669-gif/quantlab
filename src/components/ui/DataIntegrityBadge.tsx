import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Scale, BarChart2 } from 'lucide-react';

export const DataIntegrityBadge: React.FC = () => {
  return (
    <div className="rounded-xl bg-[#111118]/70 border border-[#1f1f2e] p-4 text-xs font-mono text-slate-300">
      <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white tracking-tight">Quantitative Data & Simulation Integrity Protocol</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
          AUDITED SIMULATION
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-2.5 rounded-lg bg-[#141420] border border-[#1d1d2c]">
          <div className="text-[10px] text-slate-400 uppercase">Historical Data</div>
          <div className="flex items-center space-x-1.5 mt-1 font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Available (5Y)</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141420] border border-[#1d1d2c]">
          <div className="text-[10px] text-slate-400 uppercase">Missing Data</div>
          <div className="flex items-center space-x-1.5 mt-1 font-semibold text-slate-200">
            <span>0.2% Cleaned</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141420] border border-[#1d1d2c]">
          <div className="text-[10px] text-slate-400 uppercase">Look-Ahead Bias</div>
          <div className="flex items-center space-x-1.5 mt-1 font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Protected</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141420] border border-[#1d1d2c]">
          <div className="text-[10px] text-slate-400 uppercase">Transaction Costs</div>
          <div className="flex items-center space-x-1.5 mt-1 font-semibold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0.10% Included</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141420] border border-[#1d1d2c]">
          <div className="text-[10px] text-slate-400 uppercase">Benchmark</div>
          <div className="flex items-center space-x-1.5 mt-1 font-semibold text-indigo-300">
            <Scale className="w-3.5 h-3.5" />
            <span>Buy & Hold</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-[#141420] border border-[#1d1d2c]">
          <div className="text-[10px] text-slate-400 uppercase">Methodology</div>
          <div className="flex items-center space-x-1.5 mt-1 font-semibold text-indigo-300">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Event Simulation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="p-3.5 rounded-xl bg-[#111118]/50 border border-slate-800/80 text-[11px] text-slate-400 flex items-start space-x-3 mt-6">
      <AlertTriangle className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-300">Quantitative Research & Historical Methodology Notice: </span>
        Backtested performance is derived via historical simulation models with slippage modeling and does not guarantee future results. 
        QuantLab is an analytical research workbench intended strictly for quantitative modeling, academic research, and hypothesis validation. 
        No output constitutes financial advice, solicitation, or investment recommendation.
      </div>
    </div>
  );
};
