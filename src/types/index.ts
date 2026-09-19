export type AssetId = 'BTC' | 'GOLD' | 'NVDA' | 'SPY' | 'ETH';

export interface AssetInfo {
  id: AssetId;
  name: string;
  symbol: string;
  assetClass: 'Crypto' | 'Commodity' | 'Equity';
  price: number;
  change24h: number;
  change24hPct: number;
  totalReturn5Y: number;
  annualizedVol: number;
  sharpeRatio: number;
  maxDrawdown: number;
  sparkline: number[];
  currency: string;
  exchange: string;
  dataPoints: number;
  historicalRange: string;
  description: string;
}

export interface PricePoint {
  date: string;
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  ema20?: number;
  ema50?: number;
  dailyReturn?: number;
  cumReturn?: number;
  rollingVol?: number;
  drawdown?: number;
  regime: 'Bull' | 'Bear' | 'High Volatility' | 'Low Volatility';
}

export type StrategyId = 'SMA_CROSS' | 'EMA_TREND' | 'MOMENTUM' | 'MEAN_REVERSION';

export interface StrategyDefinition {
  id: StrategyId;
  name: string;
  tagline: string;
  description: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  parameters: {
    fastPeriod: number;
    slowPeriod: number;
    initialCapital: number;
    positionSize: number; // percentage, e.g. 100
    transactionCost: number; // percentage, e.g. 0.10
    startYear: number;
    endYear: number;
  };
  recommendedFor: string;
}

export interface TradeRecord {
  id: string;
  date: string;
  exitDate: string;
  asset: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  shares: number;
  positionSize: number;
  pnl: number;
  returnPct: number;
  holdingPeriodDays: number;
  status: 'WIN' | 'LOSS';
}

export interface EquityPoint {
  date: string;
  strategy: number;
  benchmark: number;
  drawdown: number;
  benchmarkDrawdown: number;
  signal?: 'BUY' | 'SELL' | null;
  price: number;
}

export interface RegimePerformance {
  regime: 'Bull Market' | 'Bear Market' | 'High Volatility' | 'Low Volatility';
  strategyReturn: number;
  benchmarkReturn: number;
  sharpe: number;
  trades: number;
  winRate: number;
  description: string;
}

export interface SensitivityCell {
  fast: number;
  slow: number;
  returnPct: number;
  sharpe: number;
  maxDrawdown: number;
}

export interface BacktestResult {
  assetId: AssetId;
  strategyId: StrategyId;
  strategyName: string;
  period: string;
  initialCapital: number;
  finalPortfolio: number;
  totalReturnPct: number;
  benchmarkReturnPct: number;
  alphaPct: number;
  sharpeRatio: number;
  benchmarkSharpe: number;
  annualizedVol: number;
  benchmarkVol: number;
  maxDrawdownPct: number;
  benchmarkMaxDrawdownPct: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePct: number;
  profitFactor: number;
  bestTradePct: number;
  worstTradePct: number;
  avgTradePct: number;
  equityCurve: EquityPoint[];
  trades: TradeRecord[];
  regimes: RegimePerformance[];
  sensitivityMatrix: SensitivityCell[];
}

export type PageId =
  | 'overview'
  | 'market-explorer'
  | 'quant-analytics'
  | 'correlation'
  | 'strategy-lab'
  | 'backtesting'
  | 'market-regimes'
  | 'reports';
