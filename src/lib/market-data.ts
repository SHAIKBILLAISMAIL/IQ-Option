import axios from 'axios';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: number;
  isMock?: boolean;
}

export type AssetType = 'stock' | 'forex' | 'crypto' | 'index' | 'commodity';

export interface AssetConfig {
  name: string;
  flag: string;
  symbol: string; // The display symbol/ID used in the app
  apiSymbol: string; // The symbol used for the API
  provider: 'finnhub' | 'coingecko';
  type: AssetType;
  category: 'indices' | 'forex' | 'crypto' | 'stocks' | 'commodities';
}

// Centralized Asset Configuration
export const ASSETS_CONFIG: AssetConfig[] = [
  // Indices
  { name: "US 100", flag: "🇺🇸", symbol: "US 100", apiSymbol: "^NDX", provider: "finnhub", type: "index", category: "indices" },
  { name: "US 30", flag: "🇺🇸", symbol: "US 30", apiSymbol: "^DJI", provider: "finnhub", type: "index", category: "indices" },
  { name: "US 2000", flag: "🇺🇸", symbol: "US 2000", apiSymbol: "^RUT", provider: "finnhub", type: "index", category: "indices" },
  { name: "US 500", flag: "🇺🇸", symbol: "US 500", apiSymbol: "^GSPC", provider: "finnhub", type: "index", category: "indices" },
  { name: "GER 30", flag: "🇩🇪", symbol: "GER 30", apiSymbol: "^GDAXI", provider: "finnhub", type: "index", category: "indices" },
  { name: "JP 225", flag: "🇯🇵", symbol: "JP 225", apiSymbol: "^N225", provider: "finnhub", type: "index", category: "indices" },
  { name: "FR 40", flag: "🇫🇷", symbol: "FR 40", apiSymbol: "^FCHI", provider: "finnhub", type: "index", category: "indices" },
  { name: "UK 100", flag: "🇬🇧", symbol: "UK 100", apiSymbol: "^FTSE", provider: "finnhub", type: "index", category: "indices" },

  // Forex
  { name: "EUR/USD", flag: "🇪🇺", symbol: "EUR/USD", apiSymbol: "OANDA:EUR_USD", provider: "finnhub", type: "forex", category: "forex" },
  { name: "GBP/USD", flag: "🇬🇧", symbol: "GBP/USD", apiSymbol: "OANDA:GBP_USD", provider: "finnhub", type: "forex", category: "forex" },
  { name: "USD/JPY", flag: "🇺🇸", symbol: "USD/JPY", apiSymbol: "OANDA:USD_JPY", provider: "finnhub", type: "forex", category: "forex" },
  { name: "AUD/USD", flag: "🇦🇺", symbol: "AUD/USD", apiSymbol: "OANDA:AUD_USD", provider: "finnhub", type: "forex", category: "forex" },
  { name: "USD/CAD", flag: "🇺🇸", symbol: "USD/CAD", apiSymbol: "OANDA:USD_CAD", provider: "finnhub", type: "forex", category: "forex" },
  { name: "USD/CHF", flag: "🇺🇸", symbol: "USD/CHF", apiSymbol: "OANDA:USD_CHF", provider: "finnhub", type: "forex", category: "forex" },

  // Crypto
  { name: "Bitcoin", flag: "₿", symbol: "Bitcoin", apiSymbol: "bitcoin", provider: "coingecko", type: "crypto", category: "crypto" },
  { name: "Ethereum", flag: "Ξ", symbol: "Ethereum", apiSymbol: "ethereum", provider: "coingecko", type: "crypto", category: "crypto" },
  { name: "Ripple", flag: "✕", symbol: "Ripple", apiSymbol: "ripple", provider: "coingecko", type: "crypto", category: "crypto" },
  { name: "Litecoin", flag: "Ł", symbol: "Litecoin", apiSymbol: "litecoin", provider: "coingecko", type: "crypto", category: "crypto" },
  { name: "Cardano", flag: "₳", symbol: "Cardano", apiSymbol: "cardano", provider: "coingecko", type: "crypto", category: "crypto" },

  // Stocks
  { name: "Apple", flag: "🇺🇸", symbol: "Apple", apiSymbol: "AAPL", provider: "finnhub", type: "stock", category: "stocks" },
  { name: "Microsoft", flag: "🇺🇸", symbol: "Microsoft", apiSymbol: "MSFT", provider: "finnhub", type: "stock", category: "stocks" },
  { name: "Tesla", flag: "🇺🇸", symbol: "Tesla", apiSymbol: "TSLA", provider: "finnhub", type: "stock", category: "stocks" },
  { name: "Amazon", flag: "🇺🇸", symbol: "Amazon", apiSymbol: "AMZN", provider: "finnhub", type: "stock", category: "stocks" },
  { name: "Google", flag: "🇺🇸", symbol: "Google", apiSymbol: "GOOGL", provider: "finnhub", type: "stock", category: "stocks" },
  { name: "Meta", flag: "🇺🇸", symbol: "Meta", apiSymbol: "META", provider: "finnhub", type: "stock", category: "stocks" },
];

// Helper to get config by symbol name
export function getAssetConfig(name: string): AssetConfig | undefined {
  return ASSETS_CONFIG.find(a => a.name === name);
}

// Helper to get assets by category
export function getAssetsByCategory(category: string): AssetConfig[] {
  return ASSETS_CONFIG.filter(a => a.category === category);
}

// Free API providers
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || 'demo';

// Finnhub for stocks, forex, and indices
export async function getFinnhubQuote(symbol: string): Promise<MarketData | null> {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    const data = response.data;

    if (!data.c || data.c === 0) return null;

    const price = data.c; // Current price
    const open = data.o; // Open price
    const high = data.h; // High price
    const low = data.l; // Low price
    const prevClose = data.pc; // Previous close

    const change = price - prevClose;
    const changePercent = ((change / prevClose) * 100);

    // Simulate bid/ask spread (0.1% spread)
    const spreadPercent = 0.001;
    const spread = price * spreadPercent;
    const bid = price - (spread / 2);
    const ask = price + (spread / 2);

    return {
      symbol,
      name: symbol,
      price,
      bid,
      ask,
      spread,
      change,
      changePercent,
      high,
      low,
      open,
      previousClose: prevClose,
      volume: 0,
      timestamp: data.t * 1000 || Date.now(),
      isMock: false,
    };
  } catch (error: any) {
    // Handle specific error types
    if (error.response?.status === 401) {
      console.warn(`Finnhub API key invalid for ${symbol}. Using mock data.`);
    } else if (error.response?.status === 429) {
      console.warn(`Finnhub rate limit exceeded for ${symbol}. Using mock data.`);
    } else if (error.response?.status === 403) {
      console.warn(`Finnhub access forbidden for ${symbol}. Using mock data.`);
    } else {
      console.error('Finnhub error:', error.message || error);
    }
    return null;
  }
}

// CoinGecko for crypto (free, no auth required)
export async function getCoinGeckoPrice(coinId: string): Promise<MarketData | null> {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
    );

    const data = response.data[coinId];
    if (!data) return null;

    const price = data.usd;
    const changePercent = data.usd_24h_change || 0;
    const change = (changePercent / 100) * price;

    // Simulate bid/ask spread (0.2% for crypto)
    const spreadPercent = 0.002;
    const spread = price * spreadPercent;
    const bid = price - (spread / 2);
    const ask = price + (spread / 2);

    return {
      symbol: coinId.toUpperCase(),
      name: coinId,
      price,
      bid,
      ask,
      spread,
      change,
      changePercent,
      high: price * 1.02, // Estimate
      low: price * 0.98, // Estimate
      open: price, // Estimate
      previousClose: price, // Estimate
      volume: data.usd_24h_vol || 0,
      timestamp: data.last_updated_at * 1000 || Date.now(),
      isMock: false,
    };
  } catch (error) {
    console.error('CoinGecko error:', error);
    return null;
  }
}

// Get market data for any asset - tries real API first, falls back to mock data
export async function getMarketData(displayName: string): Promise<MarketData | null> {
  const config = getAssetConfig(displayName);

  if (!config) {
    console.warn(`No mapping found for ${displayName}`);
    return getMockMarketData(displayName);
  }

  try {
    let result: MarketData | null = null;

    if (config.provider === 'coingecko') {
      result = await getCoinGeckoPrice(config.apiSymbol);
    } else if (config.provider === 'finnhub') {
      result = await getFinnhubQuote(config.apiSymbol);
    }

    // If API call failed, fall back to mock data
    if (!result) {
      result = getMockMarketData(displayName);
    }

    return result;
  } catch (error) {
    console.error(`Error fetching data for ${displayName}:`, error);
    return getMockMarketData(displayName);
  }
}

// Batch fetch multiple assets
export async function getBatchMarketData(symbols: string[]): Promise<Record<string, MarketData>> {
  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const data = await getMarketData(symbol);
      return { symbol, data };
    })
  );

  const dataMap: Record<string, MarketData> = {};

  results.forEach((result, index) => {
    const symbol = symbols[index];
    if (result.status === 'fulfilled' && result.value.data) {
      dataMap[symbol] = result.value.data;
    } else {
      // Fallback to mock data if API fails
      dataMap[symbol] = getMockMarketData(symbol);
    }
  });

  return dataMap;
}

// Generate realistic price movement for simulation when APIs fail
export function simulatePriceMovement(basePrice: number, volatility: number = 0.001): number {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + change);
}

// Mock data fallback function
function getMockMarketData(symbol: string): MarketData {
  const basePrices: { [key: string]: number } = {
    "US 100": 17500, "US 30": 38500, "US 2000": 2000, "US 500": 5200,
    "GER 30": 18000, "JP 225": 38500, "FR 40": 8000, "UK 100": 7700,
    "EUR/USD": 1.08, "GBP/USD": 1.27, "USD/JPY": 150.50,
    "AUD/USD": 0.66, "USD/CAD": 1.35, "USD/CHF": 0.88,
    "Bitcoin": 65000, "Ethereum": 3500, "Ripple": 0.52,
    "Litecoin": 74, "Cardano": 0.46,
    "Apple": 180, "Microsoft": 420, "Tesla": 175,
    "Amazon": 178, "Google": 150, "Meta": 485
  };

  const basePrice = basePrices[symbol] || 100;
  const volatility = basePrice * 0.02;

  const change = (Math.random() - 0.5) * volatility;
  const currentPrice = basePrice + change;
  const changePercent = (change / basePrice) * 100;

  const spread = basePrice * 0.0001;
  const bid = currentPrice - spread / 2;
  const ask = currentPrice + spread / 2;

  return {
    symbol,
    name: symbol,
    price: currentPrice,
    change,
    changePercent,
    bid,
    ask,
    spread,
    high: basePrice * 1.02,
    low: basePrice * 0.98,
    open: basePrice,
    previousClose: basePrice,
    volume: Math.floor(Math.random() * 1000000),
    timestamp: Date.now(),
    isMock: true,
  };
}

