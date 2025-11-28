# Live Line Chart Integration Guide

## ✅ Chart Component Created

The `LiveLineChart` component is now ready at:
`src/components/trading/live-line-chart.tsx`

## How to Use It

### Option 1: Replace TradingView Chart

In `src/app/trade/page.tsx`:

1. **Add import** (line 44):
```typescript
import { LiveLineChart } from "@/components/trading/live-line-chart";
```

2. **Find the TradingViewChart component** in the JSX (around line 800-1000)

3. **Replace it with**:
```tsx
<LiveLineChart 
  symbol={selectedAsset?.name || "US 100"}
  currentPrice={selectedAsset?.buy || 0}
  height={400}
/>
```

### Option 2: Add Toggle Between Charts

Add a state for chart type:
```typescript
const [chartType, setChartType] = useState<'tradingview' | 'live'>('live');
```

Then render conditionally:
```tsx
{chartType === 'live' ? (
  <LiveLineChart 
    symbol={selectedAsset?.name || "US 100"}
    currentPrice={selectedAsset?.buy || 0}
    height={400}
  />
) : (
  <TradingViewChart 
    symbol={selectedAsset?.symbol || "US 100"}
    interval={chartInterval}
  />
)}
```

## Features

✅ **Real-time updates**: 10x per second
✅ **Live indicator**: Pulsing red dot
✅ **60-second window**: Rolling chart
✅ **Auto-scaling**: Y-axis adjusts automatically
✅ **Price label**: Shows current price
✅ **Grid lines**: For easy reading

## Next Steps

1. Test the chart by adding it to your trade page
2. The prices will start updating immediately
3. You'll see a smooth moving line like IQ Option!

Would you like me to find and replace the TradingView chart automatically?
