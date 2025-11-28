# Live Graph Fix

## Problem Identified:
1. TradingView chart widget updates on its own schedule (not per-second)
2. Market data is only fetched once on page load
3. No automatic refresh mechanism

## Solution:
Add automatic price polling every 1-5 seconds to update:
- Asset prices in the sidebar
- Current position P&L
- Chart data (via TradingView's auto-refresh)

## Files to Modify:
1. `src/app/trade/page.tsx` - Add useEffect with setInterval for price updates
2. `src/components/trading/tradingview-chart.tsx` - Already auto-updates via TradingView

## Implementation:
- Poll `/api/market-data` every 2 seconds
- Update all asset prices
- Recalculate open position P&L
- Show live price changes with animations
