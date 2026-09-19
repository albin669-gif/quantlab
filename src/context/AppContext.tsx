import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssetId, StrategyId, PageId, BacktestResult, AssetInfo } from '../types';
import { AVAILABLE_ASSETS, runBacktestSimulation } from '../data/mockData';

interface AppContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedAssetId: AssetId;
  setSelectedAssetId: (id: AssetId) => void;
  selectedAsset: AssetInfo;
  selectedStrategyId: StrategyId;
  setSelectedStrategyId: (id: StrategyId) => void;
  // Strategy Parameters
  fastPeriod: number;
  setFastPeriod: (val: number) => void;
  slowPeriod: number;
  setSlowPeriod: (val: number) => void;
  initialCapital: number;
  setInitialCapital: (val: number) => void;
  positionSize: number;
  setPositionSize: (val: number) => void;
  transactionCost: number;
  setTransactionCost: (val: number) => void;
  startYear: number;
  setStartYear: (val: number) => void;
  endYear: number;
  setEndYear: (val: number) => void;
  // Execution & Simulation State
  backtestResult: BacktestResult | null;
  isSimulating: boolean;
  simulationStep: string;
  simulationProgress: number;
  runBacktest: (overrideAsset?: AssetId, overrideStrategy?: StrategyId) => Promise<void>;
  // Hackathon Demo Mode
  isDemoRunning: boolean;
  launchDemoMode: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [selectedAssetId, setSelectedAssetId] = useState<AssetId>('BTC');
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyId>('SMA_CROSS');

  // Parameters
  const [fastPeriod, setFastPeriod] = useState<number>(20);
  const [slowPeriod, setSlowPeriod] = useState<number>(50);
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [positionSize, setPositionSize] = useState<number>(100);
  const [transactionCost, setTransactionCost] = useState<number>(0.10);
  const [startYear, setStartYear] = useState<number>(2020);
  const [endYear, setEndYear] = useState<number>(2026);

  // Results
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<string>('');
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedAsset = AVAILABLE_ASSETS.find(a => a.id === selectedAssetId) || AVAILABLE_ASSETS[0];

  // Initialize initial realistic backtest on load
  useEffect(() => {
    const defaultResult = runBacktestSimulation(
      'BTC',
      'SMA_CROSS',
      20,
      50,
      100000,
      100,
      0.10,
      2020,
      2026
    );
    setBacktestResult(defaultResult);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const runBacktest = async (overrideAsset?: AssetId, overrideStrategy?: StrategyId) => {
    const asset = overrideAsset || selectedAssetId;
    const strategy = overrideStrategy || selectedStrategyId;

    setIsSimulating(true);
    setSimulationProgress(5);
    setSimulationStep('Connecting to historical data feed...');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    await delay(350);
    setSimulationProgress(22);
    setSimulationStep('Calculating quantitative indicators (SMA/EMA)...');

    await delay(350);
    setSimulationProgress(45);
    setSimulationStep('Generating algorithmic cross signals & entry orders...');

    await delay(350);
    setSimulationProgress(68);
    setSimulationStep('Simulating order execution & transaction slippage (0.10%)...');

    await delay(350);
    setSimulationProgress(85);
    setSimulationStep('Computing risk statistics, Sharpe ratio & max drawdown...');

    await delay(300);
    setSimulationProgress(100);
    setSimulationStep('Synthesizing market regime breakdown & sensitivity matrix...');

    await delay(250);

    const result = runBacktestSimulation(
      asset,
      strategy,
      fastPeriod,
      slowPeriod,
      initialCapital,
      positionSize,
      transactionCost,
      startYear,
      endYear
    );

    setBacktestResult(result);
    setIsSimulating(false);
    showToast(`Simulation complete: ${result.totalReturnPct > 0 ? '+' : ''}${result.totalReturnPct}% return across ${result.totalTrades} trades`);
  };

  // Automated 2-3 minute pitch presentation demo mode
  const launchDemoMode = async () => {
    setIsDemoRunning(true);
    showToast('🚀 Launching Hackathon Demo Mode: Full Quantitative Flow');
    
    // Step 1: Select Bitcoin
    setSelectedAssetId('BTC');
    setSelectedStrategyId('SMA_CROSS');
    setFastPeriod(20);
    setSlowPeriod(50);
    setInitialCapital(100000);
    setActivePage('overview');
    
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(1600);

    // Step 2: Navigate to Market Explorer
    setActivePage('market-explorer');
    showToast('Step 1/6: Exploring multi-asset historical price action & moving averages');
    await delay(2200);

    // Step 3: Navigate to Quant Analytics
    setActivePage('quant-analytics');
    showToast('Step 2/6: Analyzing risk, volatility clusters, and drawdown history');
    await delay(2200);

    // Step 4: Navigate to Correlation Matrix
    setActivePage('correlation');
    showToast('Step 3/6: Multi-asset correlation heatmap & rolling correlation regime analysis');
    await delay(2200);

    // Step 5: Navigate to Strategy Lab
    setActivePage('strategy-lab');
    showToast('Step 4/6: Configuring Golden Cross SMA Quantitative Strategy parameters');
    await delay(2000);

    // Step 6: Trigger Backtest Simulation
    await runBacktest('BTC', 'SMA_CROSS');

    // Step 7: View Results in Backtesting
    setActivePage('backtesting');
    showToast('Step 5/6: Strategy Equity Curve vs Buy & Hold Benchmark with verified trade log');
    await delay(2800);

    // Step 8: View Market Regimes
    setActivePage('market-regimes');
    showToast('Step 6/6: Stress testing across Bull, Bear, and Volatility Regimes');
    await delay(2500);

    // Return to Backtesting overview
    setActivePage('backtesting');
    setIsDemoRunning(false);
    showToast('✅ Demo complete! Ready for judge inspection & parameter experimentation.');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedAssetId,
        setSelectedAssetId,
        selectedAsset,
        selectedStrategyId,
        setSelectedStrategyId,
        fastPeriod,
        setFastPeriod,
        slowPeriod,
        setSlowPeriod,
        initialCapital,
        setInitialCapital,
        positionSize,
        setPositionSize,
        transactionCost,
        setTransactionCost,
        startYear,
        setStartYear,
        endYear,
        setEndYear,
        backtestResult,
        isSimulating,
        simulationStep,
        simulationProgress,
        runBacktest,
        isDemoRunning,
        launchDemoMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
