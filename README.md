# QuantLab — Quantitative Multi-Asset Financial Intelligence & Backtesting Terminal

A quantitative finance terminal and algorithmic research platform built for institutional research, multi-asset historical analysis, and event-driven backtesting.

![QuantLab Terminal Banner](https://raw.githubusercontent.com/albin669-gif/quantlab/main/public/favicon.svg)

---

## 🏛️ Project Overview

QuantLab blends the depth of **Bloomberg Terminal**, the visual precision of **TradingView**, and the modern UX of top-tier AI fintech platforms. It models historical financial price series across **Bitcoin (BTC)**, **Gold (XAU)**, **NVIDIA (NVDA)**, and the **S&P 500 (SPY)**, executes event-driven algorithmic crossover models, assesses cross-asset correlation breakdowns, and evaluates strategy robustness across macroeconomic regimes.

```
HISTORICAL DATA FEED ──► INDICATOR CALCULATION ──► SIGNAL ENGINE ──► SLIPPAGE MODEL ──► RISK ATTRIBUTION ──► AUDITED REPORT
```

---

## 🚀 Key Features

* **Executive Market Overview**: 6 primary KPI metric cards with SVG sparklines (Portfolio Value in ₹, Volatility, Sharpe Ratio, Max Drawdown).
* **Multi-Asset Market Explorer**: Detailed OHLCV statistics with Momentum Oscillators (RSI 14, MACD Histogram, Bollinger Band %B, ATR Volatility) and Trend Regime signals.
* **Interactive TradingView-Style Price Charts**: Timeframe selections (`1M`, `6M`, `1Y`, `3Y`, `MAX`) with toggleable `SMA 20`, `SMA 50`, `EMA 20`, and `EMA 50` overlays and crosshair tooltips.
* **Quant Risk Analytics**: Dual-axis Cumulative Returns and 20-Day Rolling Volatility chart, Underwater Drawdown profile, and parametric tail-risk metrics (95% Daily VaR, Expected Shortfall / CVaR, Sortino, Calmar).
* **Cross-Asset Correlation Lab**: Diverging Pearson Correlation Heatmap, dynamic AI correlation insight engine, and Rolling Correlation time-series with customizable lookback windows (30D to 1Y).
* **Strategy Lab**: 4 quantitative strategy architectures (*SMA Crossover*, *EMA Momentum Trend*, *Dual-Speed Momentum & ROC*, *Statistical Mean Reversion*) with parameter configurator and realistic 0.10% transaction slippage.
* **Backtesting Centerpiece**: Large interactive **Equity Curve** comparing Strategy Portfolio against the Buy & Hold benchmark with an interactive toggle to Underwater Drawdown, plus full trade audit log with filters.
* **Market Regimes & Robustness**: Behavior breakdown under *Bull Market*, *Bear Market*, *High Volatility*, and *Low Volatility*, and parameter sensitivity matrix heatmap (Fast MA vs Slow MA) to verify overfitting resistance.
* **Research Reports**: Institutional tear-sheet with one-click **Export CSV** (real trade log download) and **Export PDF / Print** capabilities.
* **Hackathon Pitch Demo Mode**: Automated guided tour through the full quantitative workflow in ~2 minutes with animated pipeline steps.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS v4, PostCSS
* **Data Visualization**: Recharts, SVG Sparklines
* **Icons**: Lucide React
* **Math Engine**: Custom Vectorized Financial Kernel (SMA, EMA, Annualized Volatility, Sharpe, Drawdown, Pearson Correlation)

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/albin669-gif/quantlab.git
cd quantlab

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 Quantitative & Risk Disclaimer

*Backtested performance is based on historical simulation models and does not guarantee future financial results. QuantLab is an analytical research workbench intended strictly for quantitative modeling, academic research, and hypothesis validation.*
