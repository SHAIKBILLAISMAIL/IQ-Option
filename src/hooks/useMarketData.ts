import { useState, useEffect, useCallback, useRef } from 'react';
import { MarketData } from '@/lib/market-data';

type UseMarketDataOptions = {
  symbol: string;
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
};

// Helper to add small random variance to price (0.005% to 0.02%)
const addNoise = (price: number) => {
  const variance = price * (0.00005 + Math.random() * 0.00015);
  return Math.random() > 0.5 ? price + variance : price - variance;
};

export function useMarketData({ symbol, enabled = true, refreshInterval = 5000 }: UseMarketDataOptions) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch(`/api/market-data?symbol=${encodeURIComponent(symbol)}`);
      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, enabled]);

  // Simulation effect
  useEffect(() => {
    if (!data || !enabled) return;

    // Stop previous simulation
    if (simulationRef.current) clearInterval(simulationRef.current);

    // Start new simulation to make price "alive"
    simulationRef.current = setInterval(() => {
      setData(prev => {
        if (!prev) return null;
        const newPrice = addNoise(prev.price);
        const spread = prev.spread || (newPrice * 0.0002);

        return {
          ...prev,
          price: newPrice,
          bid: newPrice - (spread / 2),
          ask: newPrice + (spread / 2),
          timestamp: Date.now(),
        };
      });
    }, 200); // Update every 200ms

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [data?.symbol]); // Restart when symbol changes (but not when data changes to avoid infinite loop)

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling interval for "real" sync
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [fetchData, refreshInterval, enabled]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook for batch fetching multiple symbols
export function useBatchMarketData(symbols: string[], refreshInterval: number = 10000) {
  const [data, setData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  // Use a stringified version of symbols to avoid dependency issues with array references
  const symbolsKey = symbols.join(',');

  const fetchData = useCallback(async () => {
    if (symbols.length === 0) return;

    try {
      const response = await fetch(`/api/market-data?symbols=${encodeURIComponent(symbolsKey)}`);
      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
      console.error('Batch market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbolsKey]); // Stable dependency

  // Simulation effect for batch
  useEffect(() => {
    if (Object.keys(data).length === 0) return;

    if (simulationRef.current) clearInterval(simulationRef.current);

    simulationRef.current = setInterval(() => {
      setData(prev => {
        const next = { ...prev };
        let changed = false;

        Object.keys(next).forEach(key => {
          const asset = next[key];
          if (asset) {
            // Increased variance for better visibility (0.01% to 0.03%)
            const variance = asset.price * (0.0001 + Math.random() * 0.0002);
            const newPrice = Math.random() > 0.5 ? asset.price + variance : asset.price - variance;

            const spread = asset.spread || (newPrice * 0.0002);
            next[key] = {
              ...asset,
              price: newPrice,
              bid: newPrice - (spread / 2),
              ask: newPrice + (spread / 2),
              timestamp: Date.now(),
            };
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    }, 200); // 200ms updates

    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [symbolsKey, Object.keys(data).length > 0]);

  useEffect(() => {
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }

    fetchData();

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [fetchData, refreshInterval]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

