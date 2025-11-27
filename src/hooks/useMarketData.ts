import { useState, useEffect, useCallback, useRef } from 'react';
import { MarketData } from '@/lib/market-data';

type UseMarketDataOptions = {
  symbol: string;
  enabled?: boolean;
  refreshInterval?: number; // in milliseconds
};

export function useMarketData({ symbol, enabled = true, refreshInterval = 5000 }: UseMarketDataOptions) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
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
  const [data, setData] = useState<Record<string, MarketData | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    if (symbols.length === 0) return;

    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(`/api/market-data?symbols=${encodeURIComponent(symbolsParam)}`);
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
  }, [symbols]);

  useEffect(() => {
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, refreshInterval]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
