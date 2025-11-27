// components/trading/tradingview-chart.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
}

// Symbol mapping for TradingView
// Symbol mapping for TradingView
const symbolMap: { [key: string]: string } = {
  // Indices
  "US 100": "NASDAQ:NDX",
  "NASDAQ": "NASDAQ:NDX",
  "US 30": "DJI:DJI",
  "DJI": "DJI:DJI",
  "US 500": "SP:SPX",
  "SPX": "SP:SPX",
  "GER 40": "XETR:DAX",
  "DAX": "XETR:DAX",
  "UK 100": "LSE:UKX",
  "FTSE": "LSE:UKX",
  "JPN 225": "TSE:NKY",
  "NIKKEI": "TSE:NKY",
  "FRA 40": "EURONEXT:CAC",
  "CAC40": "EURONEXT:CAC",
  "RUSSELL2000": "RUSSELL:RUT",

  // Forex
  "EUR/USD": "FX_IDC:EURUSD",
  "EURUSD": "FX_IDC:EURUSD",
  "GBP/USD": "FX_IDC:GBPUSD",
  "GBPUSD": "FX_IDC:GBPUSD",
  "USD/JPY": "FX_IDC:USDJPY",
  "USDJPY": "FX_IDC:USDJPY",
  "AUD/USD": "FX_IDC:AUDUSD",
  "AUDUSD": "FX_IDC:AUDUSD",
  "USD/CAD": "FX_IDC:USDCAD",
  "USDCAD": "FX_IDC:USDCAD",
  "USD/CHF": "FX_IDC:USDCHF",
  "USDCHF": "FX_IDC:USDCHF",

  // Crypto
  "BTC/USD": "BINANCE:BTCUSDT",
  "ETH/USD": "BINANCE:ETHUSDT",
  "XRP/USD": "BINANCE:XRPUSDT",
  "LTC/USD": "BINANCE:LTCUSDT",
  "ADA/USD": "BINANCE:ADAUSDT",
  "BINANCE:BTCUSDT": "BINANCE:BTCUSDT",
  "BINANCE:ETHUSDT": "BINANCE:ETHUSDT",
  "BINANCE:XRPUSDT": "BINANCE:XRPUSDT",
  "BINANCE:LTCUSDT": "BINANCE:LTCUSDT",
  "BINANCE:ADAUSDT": "BINANCE:ADAUSDT",

  // Stocks
  "AAPL": "NASDAQ:AAPL",
  "MSFT": "NASDAQ:MSFT",
  "TSLA": "NASDAQ:TSLA",
  "AMZN": "NASDAQ:AMZN",
  "GOOGL": "NASDAQ:GOOGL",
  "META": "NASDAQ:META"
};

export const TradingViewChart = ({ symbol, interval = "60" }: TradingViewChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError(null);

    // Clear previous content
    containerRef.current.innerHTML = "";

    // Resolve symbol: Check map -> Check if it has exchange prefix -> Default to NASDAQ:NDX
    let tradingViewSymbol = symbolMap[symbol] || symbol;

    // If symbol doesn't have a colon (exchange:symbol) and isn't in map, 
    // it might be an invalid raw symbol like "US 100". 
    // In this case, default to a safe symbol to avoid "Invalid Symbol" error.
    if (!tradingViewSymbol.includes(':') && !symbolMap[symbol]) {
      console.warn(`Symbol "${symbol}" not found in map and has no exchange prefix. Defaulting to NASDAQ:NDX`);
      tradingViewSymbol = "NASDAQ:NDX";
    }

    try {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      const widgetConfig = {
        autosize: true,
        symbol: tradingViewSymbol,
        interval: mapInterval(interval),
        timezone: "Asia/Kolkata",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_chart",
        studies: [
          "MASimple@tv-basicstudies",
          "RSI@tv-basicstudies"
        ],
        support_host: "https://www.tradingview.com"
      };

      script.innerHTML = JSON.stringify(widgetConfig);

      script.onload = () => {
        setIsLoading(false);
      };

      script.onerror = () => {
        setIsLoading(false);
        setError("Failed to load TradingView chart");
      };

      containerRef.current.appendChild(script);

    } catch (err) {
      setIsLoading(false);
      setError("Error initializing chart");
      console.error("Chart error:", err);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, interval]);

  const mapInterval = (interval: string): string => {
    switch (interval) {
      case "1": return "1";
      case "60": return "60";
      case "D": return "D";
      case "W": return "W";
      default: return "60";
    }
  };

  if (error) {
    return (
      <div className="h-full w-full bg-[#131722] flex flex-col items-center justify-center">
        <div className="text-red-400 text-lg mb-2">Chart Error</div>
        <div className="text-gray-400 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#ff8516] rounded text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#131722] relative">
      {/* TradingView Chart Container - Full Height */}
      <div
        ref={containerRef}
        className="tradingview-widget-container absolute inset-0"
      >
        <div
          id="tradingview_chart"
          className="h-full w-full"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#131722] z-10">
          <div className="flex flex-col items-center justify-center text-white">
            <RefreshCw size={32} className="animate-spin mb-4 text-[#ff8516]" />
            <div className="text-lg">Loading Chart...</div>
            <div className="text-sm text-gray-400 mt-2">Powered by TradingView</div>
          </div>
        </div>
      )}
    </div>
  );
};
