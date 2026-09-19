import React, { useEffect } from 'react';
import { 
  X, 
  HelpCircle, 
  Activity, 
  Target, 
  AlertTriangle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { METRIC_EXPLANATIONS, MetricExplanationData } from '../../lib/metricExplanations';
import { useApp } from '../../context/AppContext';

interface ExplainModalProps {
  metricId: string | null;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ metricId, onClose }) => {
  const appContext = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!metricId) return null;

  const data: MetricExplanationData | undefined = METRIC_EXPLANATIONS[metricId];

  if (!data) return null;

  const currentValueExplanation = data.currentValueMeaning(appContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[#10101a] border border-indigo-500/40 rounded-2xl p-6 shadow-2xl shadow-indigo-500/15 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1f1f32] pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">{data.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase">
                  {data.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Institutional Quantitative Analysis Breakdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c1c2e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Structured Sections */}
        <div className="space-y-4 overflow-y-auto pr-1 text-xs leading-relaxed font-sans">
          {/* Section 1: Definition */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#212136]">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs mb-1.5 uppercase font-mono">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>1. What This Metric Means</span>
            </div>
            <p className="text-slate-300">
              {data.whatItMeans}
            </p>
          </div>

          {/* Section 2: Current Value Interpretation */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#121e17] to-[#121422] border border-emerald-500/40">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-1.5 uppercase font-mono">
              <Activity className="w-3.5 h-3.5" />
              <span>2. What The Current Value Means</span>
            </div>
            <p className="text-emerald-200/90 font-mono text-[11px] leading-relaxed">
              {currentValueExplanation}
            </p>
          </div>

          {/* Section 3: Why It Matters */}
          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#212136]">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs mb-1.5 uppercase font-mono">
              <Target className="w-3.5 h-3.5" />
              <span>3. Why It Matters</span>
            </div>
            <p className="text-slate-300">
              {data.whyItMatters}
            </p>
          </div>

          {/* Section 4: Limitation & Caution */}
          <div className="p-3.5 rounded-xl bg-[#181318] border border-amber-500/40">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1.5 uppercase font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>4. Important Limitation & Caution</span>
            </div>
            <p className="text-amber-200/90 text-[11px]">
              {data.limitation}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3.5 border-t border-[#1f1f32] flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            QuantLab Analytical Explainer • Press ESC to dismiss
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
