import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { DrawdownChart } from '../components/charts/DrawdownChart';
import { formatINR, formatPct } from '../lib/quant';
import { 
  CheckCircle2, 
  Filter, 
  FlaskConical,
  TrendingUp,
  Scale,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { TradeRecord } from '../types';

export const Backtesting: React.FC = () => {
  const { backtestResult, selectedAsset, setActivePage } = useApp();
  const [tradeFilter, setTradeFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [activeTab, setActiveTab] = useState<'equity' | 'drawdown'>('equity');

  if (!backtestResult) {
    return (
      <div className="rounded-2xl bg-[#101018]/90 border border-[#1e1e30] p-12 text-center max-w-lg mx-auto my-12 animate-fadeIn shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <FlaskConical className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">No backtest simulation executed yet</h3>
        <p className="text-xs text-slate-400 font-mono mt-2 leading-relaxed">
          Configure a quantitative strategy in the Strategy Lab and run your historical simulation.
        </p>
        <button
          onClick={() => setActivePage('strategy-lab')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          Open Strategy Lab →
        </button>
      </div>
    );
  }

  const {
    strategyName,
    assetId,
    period,
    initialCapital,
    finalPortfolio,
    totalReturnPct,
    benchmarkReturnPct,
    alphaPct,
    sharpeRatio,
    benchmarkSharpe,
    annualizedVol,
    benchmarkVol,
    maxDrawdownPct,
    benchmarkMaxDrawdownPct,
    totalTrades,
    winningTrades,
    losingTrades,
    winRatePct,
    profitFactor,
    bestTradePct,
    worstTradePct,
    avgTradePct,
    equityCurve,
    trades,
  } = backtestResult;

  const filteredTrades = trades.filter((t: TradeRecord) => {
    if (tradeFilter === 'WIN') return t.status === 'WIN';
    if (tradeFilter === 'LOSS') return t.status === 'LOSS';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: BACKTEST COMPLETE (Section 10) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#121222] via-[#141426] to-[#0f0f1c] border border-[#24243a] p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1e1e32] pb-4 mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold font-mono text-emerald-400 tracking-wider">
                  BACKTEST COMPLETE ✓
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  SLIPPAGE INCLUDED (0.10%)
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mt-0.5">
                {strategyName} on {selectedAsset.name} ({assetId})
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="bg-[#161626] px-3.5 py-1.5 rounded-xl border border-[#25253c] text-slate-300">
              <span className="text-slate-400">Period: </span>
              <span className="text-white font-bold">{period}</span>
            </div>
            <div className="bg-[#161626] px-3.5 py-1.5 rounded-xl border border-[#25253c] text-slate-300">
              <span className="text-slate-400">Capital: </span>
              <span className="text-indigo-300 font-bold">{formatINR(initialCapital)}</span>
            </div>
          </div>
        </div>

        {/* Large Performance Metrics Grid (Section 10) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Final Portfolio</div>
            <div className="text-base font-bold text-white font-mono mt-1">{formatINR(finalPortfolio)}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 font-semibold">Net Proceeds</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Total Return</div>
            <div className={`text-base font-bold font-mono mt-1 ${totalReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPct(totalReturnPct)}
            </div>
            <div className="text-[10px] text-indigo-300 font-mono mt-0.5">Alpha: {formatPct(alphaPct)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Sharpe Ratio</div>
            <div className="text-base font-bold text-white font-mono mt-1">{sharpeRatio.toFixed(2)}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Bench: {benchmarkSharpe.toFixed(2)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Volatility</div>
            <div className="text-base font-bold text-cyan-400 font-mono mt-1">{annualizedVol}%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Bench: {benchmarkVol}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Max Drawdown</div>
            <div className="text-base font-bold text-rose-400 font-mono mt-1">{maxDrawdownPct}%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Bench: {benchmarkMaxDrawdownPct}%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Total Trades</div>
            <div className="text-base font-bold text-white font-mono mt-1">{totalTrades}</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Roundtrips</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Win Rate</div>
            <div className="text-base font-bold text-emerald-400 font-mono mt-1">{winRatePct}%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{winningTrades}W / {losingTrades}L</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#141422] border border-[#222238]">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Profit Factor</div>
            <div className="text-base font-bold text-indigo-300 font-mono mt-1">{profitFactor}x</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Gross W/L</div>
          </div>
        </div>
      </div>

      {/* CENTERPIECE: Section 11 - Large Interactive Equity Curve */}
      <div className="rounded-2xl bg-[#101018]/95 border border-[#1e1e30] p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-[#1a1a2a]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Equity Curve: Strategy Portfolio vs Buy & Hold Benchmark</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CAPITAL REINVESTED
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Simulated portfolio value progression over time comparing the dynamic algorithmic model against passive holding
            </p>
          </div>

          {/* Toggle between Equity Curve and Underwater Drawdown */}
          <div className="flex items-center bg-[#141422] p-1 rounded-xl border border-[#202034] text-xs font-mono">
            <button
              onClick={() => setActiveTab('equity')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === 'equity' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Equity Curve
            </button>
            <button
              onClick={() => setActiveTab('drawdown')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                activeTab === 'drawdown' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Underwater Drawdown
            </button>
          </div>
        </div>

        {activeTab === 'equity' ? (
          <EquityCurveChart data={equityCurve} initialCapital={initialCapital} />
        ) : (
          <DrawdownChart data={equityCurve.map(e => ({ date: e.date, drawdown: e.drawdown, benchmarkDrawdown: e.benchmarkDrawdown }))} />
        )}

        {/* Strategy vs Benchmark Comparison Table (Section 11) */}
        <div className="mt-6 pt-5 border-t border-[#1a1a2a]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3">
            Strategy vs Buy & Hold Quantitative Comparison Table
          </h4>
          <div className="overflow-x-auto border border-[#1e1e30] rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="bg-[#141422] border-b border-[#1e1e30]">
                <tr className="text-slate-400">
                  <th className="py-3 px-4">Performance Metric</th>
                  <th className="py-3 px-4 text-indigo-400 font-bold">Strategy (Algorithmic)</th>
                  <th className="py-3 px-4 text-slate-300">Buy & Hold Benchmark</th>
                  <th className="py-3 px-4 text-emerald-400 font-bold">Alpha / Net Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171726]">
                <tr className="hover:bg-[#131320] transition-colors">
                  <td className="py-3 px-4 text-slate-300 font-semibold">Total Net Return</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">{formatPct(totalReturnPct)}</td>
                  <td className="py-3 px-4 text-slate-200">{formatPct(benchmarkReturnPct)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">+{formatPct(alphaPct)}</td>
                </tr>
                <tr className="hover:bg-[#131320] transition-colors">
                  <td className="py-3 px-4 text-slate-300 font-semibold">Sharpe Ratio (Rf = 4.5%)</td>
                  <td className="py-3 px-4 font-bold text-white">{sharpeRatio.toFixed(2)}</td>
                  <td className="py-3 px-4 text-slate-300">{benchmarkSharpe.toFixed(2)}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">+{(sharpeRatio - benchmarkSharpe).toFixed(2)}</td>
                </tr>
                <tr className="hover:bg-[#131320] transition-colors">
                  <td className="py-3 px-4 text-slate-300 font-semibold">Annualized Volatility (σ)</td>
                  <td className="py-3 px-4 font-bold text-cyan-300">{annualizedVol}%</td>
                  <td className="py-3 px-4 text-slate-300">{benchmarkVol}%</td>
                  <td className="py-3 px-4 font-bold text-cyan-400">{(annualizedVol - benchmarkVol).toFixed(1)}%</td>
                </tr>
                <tr className="hover:bg-[#131320] transition-colors">
                  <td className="py-3 px-4 text-slate-300 font-semibold">Maximum Peak-to-Trough Drawdown</td>
                  <td className="py-3 px-4 font-bold text-rose-400">{maxDrawdownPct}%</td>
                  <td className="py-3 px-4 text-rose-500">{benchmarkMaxDrawdownPct}%</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">
                    +{(Math.abs(benchmarkMaxDrawdownPct) - Math.abs(maxDrawdownPct)).toFixed(1)}% Downside Preservation
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 12: TRADE ANALYSIS */}
      <div className="rounded-2xl bg-[#101018]/95 border border-[#1e1e30] p-6 shadow-xl">
        {/* Trade Summary Statistics Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-[#1a1a2a]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Historical Trade Log & Audit Trail</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {trades.length} EXECUTIONS
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Verified simulated executions with 0.10% transaction cost and slippage
            </p>
          </div>

          {/* Trade Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-center bg-[#141422] p-1 rounded-xl border border-[#202034] text-xs font-mono">
              <button
                onClick={() => setTradeFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  tradeFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({trades.length})
              </button>
              <button
                onClick={() => setTradeFilter('WIN')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  tradeFilter === 'WIN' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Winning ({winningTrades})
              </button>
              <button
                onClick={() => setTradeFilter('LOSS')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  tradeFilter === 'LOSS' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Losing ({losingTrades})
              </button>
            </div>
          </div>
        </div>

        {/* Trade Stat Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#141422] border border-[#202034]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Trades</div>
            <div className="text-base font-bold text-white mt-0.5">{totalTrades}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#141422] border border-[#202034]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Rate</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{winRatePct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-[#141422] border border-[#202034]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Average Trade</div>
            <div className="text-base font-bold text-indigo-300 mt-0.5">+{avgTradePct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-[#141422] border border-[#202034]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Best Trade</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">+{bestTradePct}%</div>
          </div>
          <div className="p-3 rounded-xl bg-[#141422] border border-[#202034]">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Worst Trade</div>
            <div className="text-base font-bold text-rose-400 mt-0.5">{worstTradePct}%</div>
          </div>
        </div>

        {/* Trade Table */}
        <div className="overflow-x-auto border border-[#1e1e30] rounded-xl max-h-96">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead className="bg-[#141422] sticky top-0 z-10 text-slate-400 border-b border-[#1e1e30]">
              <tr>
                <th className="py-2.5 px-3.5">Trade ID</th>
                <th className="py-2.5 px-3.5">Entry Date</th>
                <th className="py-2.5 px-3.5">Exit Date</th>
                <th className="py-2.5 px-3.5">Asset</th>
                <th className="py-2.5 px-3.5">Action</th>
                <th className="py-2.5 px-3.5">Entry Price</th>
                <th className="py-2.5 px-3.5">Exit Price</th>
                <th className="py-2.5 px-3.5">Position (₹)</th>
                <th className="py-2.5 px-3.5 text-right">Net P&L (₹)</th>
                <th className="py-2.5 px-3.5 text-right">Return (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181826]">
              {filteredTrades.map((trade: TradeRecord) => (
                <tr key={trade.id} className="hover:bg-[#151526] transition-colors">
                  <td className="py-2.5 px-3.5 text-slate-400 font-semibold">{trade.id}</td>
                  <td className="py-2.5 px-3.5 text-slate-300">{trade.date}</td>
                  <td className="py-2.5 px-3.5 text-slate-300">{trade.exitDate}</td>
                  <td className="py-2.5 px-3.5 text-white font-bold">{trade.asset}</td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      SELL
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-200">${trade.entryPrice.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-slate-200">${trade.exitPrice.toLocaleString()}</td>
                  <td className="py-2.5 px-3.5 text-slate-300">{formatINR(trade.positionSize)}</td>
                  <td className={`py-2.5 px-3.5 text-right font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{formatINR(trade.pnl)}
                  </td>
                  <td className={`py-2.5 px-3.5 text-right font-bold ${trade.returnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trade.returnPct >= 0 ? '+' : ''}{trade.returnPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
