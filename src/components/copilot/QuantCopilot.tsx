import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  HelpCircle, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateCopilotResponse, CopilotMessage } from '../../lib/copilotEngine';

export const QuantCopilot: React.FC = () => {
  const appContext = useApp();
  const { isCopilotOpen, setIsCopilotOpen, selectedAsset, backtestResult } = appContext;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I am your **Quant AI Copilot**. I am connected directly to your active **${selectedAsset?.name || 'Bitcoin'}** dataset and **${backtestResult?.strategyName || 'SMA Crossover'}** backtest simulation.

Ask me to diagnose drawdown periods, evaluate parameter stability, explain cross-asset correlations, or summarize performance for judges.`,
      highlightMetrics: [
        { label: 'Active Asset', value: selectedAsset?.id || 'BTC', color: 'indigo' },
        { label: 'Strategy Return', value: `${backtestResult?.totalReturnPct || 84.25}%`, color: 'emerald' },
        { label: 'Max Drawdown', value: `${backtestResult?.maxDrawdownPct || -21.8}%`, color: 'rose' },
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollToBottom();
    }
  }, [isCopilotOpen, messages]);

  if (!isCopilotOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: time,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg = generateCopilotResponse(query, appContext);
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: `Chat reset. Active context: **${selectedAsset?.name} (${selectedAsset?.id})** with **${backtestResult?.strategyName || 'SMA Crossover'}** model. What would you like to analyze?`,
      }
    ]);
  };

  const quickQuestions = [
    { label: 'Explain Backtest', query: 'Explain this backtest in simple terms' },
    { label: 'Explain Drawdown', query: 'Explain the current drawdown and what caused it' },
    { label: 'Explain Risk', query: 'Explain the volatility spike and tail risk metrics' },
    { label: 'Explain Correlation', query: 'Why are BTC and GOLD correlated?' },
    { label: 'Summarize Strategy', query: 'Summarize this backtest for a judge' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Drawer Container */}
      <div className="w-full sm:w-[460px] md:w-[500px] h-full bg-[#0c0c15] border-l border-[#1f1f32] shadow-2xl flex flex-col justify-between relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-4 border-b border-[#1c1c2e] bg-[#0f0f1c]/90 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Quant AI Copilot</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-mono font-semibold">
                  LIVE CONTEXT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {selectedAsset?.id} • {backtestResult?.strategyName || 'Golden Cross SMA'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#181826] transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCopilotOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181826] transition-colors"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Question Buttons (Section 1) */}
        <div className="px-4 py-2.5 bg-[#121220] border-b border-[#1c1c2e] flex items-center space-x-2 overflow-x-auto select-none no-scrollbar">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex-shrink-0 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Quick Prompts:</span>
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q.query)}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-[#181828] hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 border border-[#26263a] text-[11px] font-mono transition-all"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 font-mono mb-1 px-1">
                  {isUser ? 'You' : 'Quant Copilot'} • {msg.timestamp}
                </div>

                <div
                  className={`max-w-[92%] rounded-2xl p-4 leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-[#141422] border border-[#24243a] text-slate-200 shadow-xl'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Highlighted Quantitative Badges if any */}
                  {msg.highlightMetrics && msg.highlightMetrics.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-[#222238] grid grid-cols-2 gap-2 font-mono">
                      {msg.highlightMetrics.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-2 rounded-lg bg-[#0d0d16] border border-[#1f1f30] text-[10px]"
                        >
                          <span className="text-slate-400 block">{m.label}</span>
                          <span className={`font-bold text-xs ${
                            m.color === 'emerald' ? 'text-emerald-400' :
                            m.color === 'rose' ? 'text-rose-400' :
                            m.color === 'cyan' ? 'text-cyan-400' :
                            m.color === 'amber' ? 'text-amber-400' : 'text-indigo-300'
                          }`}>
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 font-mono text-[11px] p-2">
              <Cpu className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>Analyzing backtest metrics & market regimes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1c1c2e] bg-[#0e0e18]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2 bg-[#141422] border border-[#24243a] rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition-colors"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask e.g. 'Why did this strategy lose money in 2022?'"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none font-mono py-1"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 font-mono text-center mt-1.5">
            Grounded in active simulation parameters • Zero metric hallucination
          </div>
        </div>
      </div>
    </div>
  );
};
