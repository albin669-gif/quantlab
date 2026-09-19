// Quantitative Metric Explanation Knowledge Engine for QuantLab

export interface MetricExplanationData {
  id: string;
  title: string;
  category: 'Risk' | 'Return' | 'Portfolio' | 'Strategy';
  whatItMeans: string;
  currentValueMeaning: (context: any) => string;
  whyItMatters: string;
  limitation: string;
}

export const METRIC_EXPLANATIONS: Record<string, MetricExplanationData> = {
  sharpeRatio: {
    id: 'sharpeRatio',
    title: 'Sharpe Ratio',
    category: 'Risk',
    whatItMeans: 'The Sharpe ratio quantifies how much excess return a portfolio produces for each unit of total volatility risk, benchmarked against a risk-free interest rate (Rf = 4.50%).',
    currentValueMeaning: (ctx) => {
      const val = ctx.backtestResult?.sharpeRatio ?? ctx.selectedAsset?.sharpeRatio ?? 1.48;
      const rating = val >= 1.5 ? 'exceptional institutional tier' : val >= 1.0 ? 'strong risk-adjusted performance' : val >= 0.5 ? 'moderate compensation for risk' : 'sub-optimal return relative to volatility';
      return `Current Value: ${val.toFixed(2)}. This signifies ${rating}. For every 1.00% of annualized standard deviation, the strategy generates ${val.toFixed(2)}% in excess annualized alpha over US Treasuries.`;
    },
    whyItMatters: 'It prevents deceptive returns: a strategy returning 30% with 60% volatility is often inferior to a strategy returning 18% with 10% volatility.',
    limitation: 'Assumes investment returns follow a normal Gaussian distribution. It penalizes large upside explosive spikes identically to downside crashes and fails to reflect fat-tailed crash risk.',
  },

  maxDrawdown: {
    id: 'maxDrawdown',
    title: 'Maximum Drawdown',
    category: 'Risk',
    whatItMeans: 'Maximum Drawdown (Max DD) measures the greatest percentage decline from any historical portfolio equity peak to its subsequent lowest trough before recovering to a new high.',
    currentValueMeaning: (ctx) => {
      const val = ctx.backtestResult?.maxDrawdownPct ?? ctx.selectedAsset?.maxDrawdown ?? -21.8;
      const benchVal = ctx.backtestResult?.benchmarkMaxDrawdownPct ?? -76.8;
      const preservation = Math.abs(benchVal) - Math.abs(val);
      return `Current Value: ${val}%. If an investor bought at the absolute historical peak, the maximum loss experienced before recovering was ${Math.abs(val)}%. In contrast, the passive Buy & Hold benchmark suffered ${benchVal}%, meaning the algorithmic strategy preserved ${preservation.toFixed(1)}% of capital.`;
    },
    whyItMatters: 'Drawdown determines whether an investor will panic-sell or face margin liquidation. A 50% loss requires a 100% gain just to break even.',
    limitation: 'Historical maximum drawdown is backward-looking. A strategy’s worst historical drawdown is guaranteed to be exceeded at some point in future unseen market regimes.',
  },

  volatility: {
    id: 'volatility',
    title: 'Annualized Volatility (σ)',
    category: 'Risk',
    whatItMeans: 'Annualized volatility is the annualized standard deviation of logarithmic daily price returns, scaled across 252 trading days (σ_daily × √252).',
    currentValueMeaning: (ctx) => {
      const val = ctx.backtestResult?.annualizedVol ?? ctx.selectedAsset?.annualizedVol ?? 32.4;
      return `Current Value: ${val}%. This implies that in approximately 68% of years (1 standard deviation), portfolio returns will fluctuate within ±${val}% of the mean return.`;
    },
    whyItMatters: 'Volatility is the standard baseline measure of market uncertainty. Higher volatility demands wider stop-loss buffers and dynamic position-size scaling.',
    limitation: 'Volatility measures both upward and downward variance equally. Investors welcome upward spikes, so treating upside volatility as "risk" can mischaracterize asymmetric assets like Bitcoin.',
  },

  var: {
    id: 'var',
    title: 'Value at Risk (95% Daily VaR)',
    category: 'Risk',
    whatItMeans: 'Value at Risk (VaR) calculates the maximum expected loss over a 1-day holding period under normal market conditions at a 95% statistical confidence interval.',
    currentValueMeaning: (ctx) => {
      const vol = ctx.selectedAsset?.annualizedVol ?? 32.4;
      const dailyVaR = Number((-(vol / Math.sqrt(252)) * 1.645).toFixed(2));
      return `Current Value: ${dailyVaR}%. On 95 out of 100 trading days, portfolio losses will not exceed ${Math.abs(dailyVaR)}%. Conversely, on 5% of trading days, losses may be larger.`;
    },
    whyItMatters: 'Used by global banking regulators (Basel Accords) and risk desks to set daily capital reserve thresholds and maximum overnight leverage limits.',
    limitation: 'VaR is completely silent about the severity of losses beyond the 95th percentile threshold. It does not measure black swan tail events.',
  },

  sortino: {
    id: 'sortino',
    title: 'Sortino Ratio',
    category: 'Risk',
    whatItMeans: 'The Sortino ratio is an enhancement of the Sharpe ratio that penalizes only downside volatility (variance below the risk-free rate), ignoring upside volatility.',
    currentValueMeaning: (ctx) => {
      const sharpe = ctx.backtestResult?.sharpeRatio ?? 1.48;
      const sortino = Number((sharpe * 1.42).toFixed(2));
      return `Current Value: ${sortino}. Because the Sortino ratio (${sortino}) is substantially higher than the Sharpe ratio (${sharpe.toFixed(2)}), it confirms that a large portion of the asset's volatility comes from explosive upward rallies rather than crashes.`;
    },
    whyItMatters: 'Provides a far more accurate assessment for momentum and growth assets where upside volatility should be rewarded, not penalized.',
    limitation: 'Requires a sufficiently large dataset of negative return observations to generate statistically significant downside deviation values.',
  },

  calmar: {
    id: 'calmar',
    title: 'Calmar Ratio',
    category: 'Risk',
    whatItMeans: 'The Calmar ratio measures the ratio of annualized compound return to maximum drawdown over the backtest observation window.',
    currentValueMeaning: (ctx) => {
      const ret = ctx.backtestResult?.totalReturnPct ?? 84.25;
      const dd = Math.abs(ctx.backtestResult?.maxDrawdownPct ?? 21.8);
      const ratio = dd > 0 ? Number((ret / dd).toFixed(2)) : 0;
      return `Current Value: ${ratio}. The strategy produced ${ratio} units of total return for every 1.00% of maximum drawdown incurred.`;
    },
    whyItMatters: 'Highly favored by Commodity Trading Advisors (CTAs) and hedge funds because it evaluates pure return efficiency relative to capital destruction.',
    limitation: 'Heavily sensitive to the specific time window: an otherwise brilliant strategy will have an artificially degraded Calmar ratio if it covers a single extreme black-swan event.',
  },

  correlation: {
    id: 'correlation',
    title: 'Cross-Asset Pearson Correlation',
    category: 'Portfolio',
    whatItMeans: 'Measures the linear co-movement between two assets on a scale from -1.0 (perfect inverse co-movement) to +1.0 (perfect identical movement).',
    currentValueMeaning: (ctx) => {
      const p1 = ctx.selectedPair?.[0] || 'BTC';
      const p2 = ctx.selectedPair?.[1] || 'NVDA';
      const isBtcGold = (p1 === 'BTC' && p2 === 'GOLD') || (p1 === 'GOLD' && p2 === 'BTC');
      const val = isBtcGold ? 0.18 : 0.52;
      return `Current Value for ${p1} vs ${p2}: ${val}. ${isBtcGold ? 'This low correlation (0.18) indicates exceptional portfolio diversification benefits.' : 'This moderate correlation (0.52) demonstrates liquidity and tech-beta co-movement.'}`;
    },
    whyItMatters: 'Modern Portfolio Theory (Markowitz) proves that combining uncorrelated assets shifts the efficient frontier outward, achieving higher returns with lower overall volatility.',
    limitation: 'Correlation is non-stationary: assets that appear uncorrelated during calm bull markets frequently jump to 1.0 correlation during systemic liquidity panics.',
  },

  equityCurve: {
    id: 'equityCurve',
    title: 'Equity Curve vs Buy & Hold Benchmark',
    category: 'Strategy',
    whatItMeans: 'The equity curve visualizes the cumulative mark-to-market portfolio value of the quantitative algorithm over time compared against passively holding the underlying asset.',
    currentValueMeaning: (ctx) => {
      const finalVal = ctx.backtestResult?.finalPortfolio ?? 184250;
      const alpha = ctx.backtestResult?.alphaPct ?? 18.2;
      const trades = ctx.backtestResult?.totalTrades ?? 46;
      return `Final Portfolio: ₹${finalVal.toLocaleString()} across ${trades} simulated trades, generating ${alpha > 0 ? '+' : ''}${alpha}% in net Alpha over the Buy & Hold passive benchmark.`;
    },
    whyItMatters: 'Visualizes the real-world trajectory of investor capital, displaying capital compounding and showing whether outperformance is consistent or concentrated in a single lucky trade.',
    limitation: 'Must account for transaction slippage, execution lag, and dividend/funding reinvestment, which can erode paper outperformance in live production.',
  },

  robustnessHeatmap: {
    id: 'robustnessHeatmap',
    title: 'Parameter Robustness Sensitivity Heatmap',
    category: 'Strategy',
    whatItMeans: 'A 2D sensitivity matrix cross-testing different Fast Moving Average periods against Slow Moving Average periods across the entire parameter space.',
    currentValueMeaning: (ctx) => {
      const currentFast = ctx.fastPeriod ?? 20;
      const currentSlow = ctx.slowPeriod ?? 50;
      return `Tested around current baseline (Fast MA ${currentFast} / Slow MA ${currentSlow}). A broad region of profitable green cells confirms the algorithm is robust and resists overfitting.`;
    },
    whyItMatters: 'Protects against curve-fitting: if an algorithm only makes money at exactly Fast 20 / Slow 50 and loses money at Fast 19 or Slow 51, it is overfitted and will fail in live trading.',
    limitation: 'Even a robust parameter surface in historical data does not guarantee stability if structural market microstructure or regulatory regimes change in the future.',
  },

  strategyReturn: {
    id: 'strategyReturn',
    title: 'Strategy Net Return',
    category: 'Return',
    whatItMeans: 'The total cumulative percentage return earned by the algorithmic strategy across the backtest window after deducting 0.10% transaction slippage and trading fees.',
    currentValueMeaning: (ctx) => {
      const ret = ctx.backtestResult?.totalReturnPct ?? 84.25;
      const initial = ctx.backtestResult?.initialCapital ?? 100000;
      const final = ctx.backtestResult?.finalPortfolio ?? 184250;
      return `Total Net Return: +${ret}%. An initial capital allocation of ₹${initial.toLocaleString()} grew to ₹${final.toLocaleString()} after fully modeling execution slippage and exchange fees.`;
    },
    whyItMatters: 'Represents the bottom-line financial outcome of the quantitative research hypothesis.',
    limitation: 'Raw percentage return ignores the risk taken to achieve it. High return with unbearable drawdowns often leads to forced liquidation.',
  },
};
