// Quantitative Math & Financial Engine for QuantLab

export function calculateSMA(data: number[], period: number): (number | undefined)[] {
  const result: (number | undefined)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(undefined);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      result.push(Number((sum / period).toFixed(2)));
    }
  }
  return result;
}

export function calculateEMA(data: number[], period: number): (number | undefined)[] {
  const result: (number | undefined)[] = [];
  const k = 2 / (period + 1);
  let prevEMA: number | undefined = undefined;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(undefined);
    } else if (i === period - 1) {
      // First EMA is SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      prevEMA = sum / period;
      result.push(Number(prevEMA.toFixed(2)));
    } else if (prevEMA !== undefined) {
      const currentEMA: number = data[i] * k + prevEMA * (1 - k);
      prevEMA = currentEMA;
      result.push(Number(currentEMA.toFixed(2)));
    }
  }
  return result;
}

export function calculateReturns(prices: number[]): number[] {
  const returns: number[] = [0];
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(ret);
  }
  return returns;
}

export function calculateAnnualizedVolatility(dailyReturns: number[]): number {
  if (dailyReturns.length < 2) return 0;
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (dailyReturns.length - 1);
  const dailyVol = Math.sqrt(variance);
  return Number((dailyVol * Math.sqrt(252) * 100).toFixed(2));
}

export function calculateSharpeRatio(dailyReturns: number[], riskFreeRate: number = 0.045): number {
  if (dailyReturns.length < 2) return 0;
  const meanDaily = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const annualReturn = meanDaily * 252;
  const variance = dailyReturns.reduce((a, b) => a + Math.pow(b - meanDaily, 2), 0) / (dailyReturns.length - 1);
  const annualVol = Math.sqrt(variance) * Math.sqrt(252);
  if (annualVol === 0) return 0;
  const sharpe = (annualReturn - riskFreeRate) / annualVol;
  return Number(sharpe.toFixed(2));
}

export function calculateDrawdown(equity: number[]): { drawdownSeries: number[]; maxDrawdown: number } {
  let peak = equity[0] || 1;
  const drawdownSeries: number[] = [];
  let maxDrawdown = 0;

  for (let i = 0; i < equity.length; i++) {
    const val = equity[i];
    if (val > peak) {
      peak = val;
    }
    const dd = ((val - peak) / peak) * 100;
    drawdownSeries.push(Number(dd.toFixed(2)));
    if (dd < maxDrawdown) {
      maxDrawdown = dd;
    }
  }

  return {
    drawdownSeries,
    maxDrawdown: Number(maxDrawdown.toFixed(2)),
  };
}

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return Number((num / den).toFixed(2));
}

// Rolling correlation calculation
export function calculateRollingCorrelation(series1: number[], series2: number[], window: number): { index: number; corr: number }[] {
  const results: { index: number; corr: number }[] = [];
  const minLen = Math.min(series1.length, series2.length);

  for (let i = window; i < minLen; i += Math.max(1, Math.floor(minLen / 60))) {
    const s1 = series1.slice(i - window, i);
    const s2 = series2.slice(i - window, i);
    const corr = calculateCorrelation(s1, s2);
    results.push({ index: i, corr });
  }

  return results;
}

// Format currency in Indian Rupees style (₹) with commas
export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatUSD(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatPct(val: number, includeSign: boolean = true): string {
  const sign = includeSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}
