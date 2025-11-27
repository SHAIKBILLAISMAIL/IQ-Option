# Real-Time Market Data Integration Guide

Your IQ Option trading platform now fetches **real-time market data** from professional financial APIs for stocks, forex, crypto, and indices.

## 🚀 Quick Start

### 1. Get Free API Keys

#### Finnhub (Required - Stocks, Forex, Indices)
1. Visit https://finnhub.io/register
2. Sign up with your email
3. Get your API key instantly from the dashboard
4. **Free Tier**: 60 API calls per minute

#### CoinGecko (No Key Needed - Cryptocurrency)
- Already configured and working
- No signup required
- 100% free for public data

### 2. Add API Keys to Your Project

Open your `.env` file (or `.env.local`) and add:

```env
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key_here
```

**Important**: Replace `your_finnhub_api_key_here` with your actual API key from Finnhub.

### 3. Restart Development Server

```bash
bun run dev
```

## 📊 What's Included

### Real-Time Data Sources

| Asset Type | Provider | Update Frequency | Status |
|------------|----------|------------------|--------|
| **Indices** (US 100, US 30, GER 30, etc.) | Finnhub | 5 seconds | ✅ Live |
| **Forex** (EUR/USD, GBP/USD, etc.) | Finnhub | 5 seconds | ✅ Live |
| **Crypto** (Bitcoin, Ethereum, etc.) | CoinGecko | 5 seconds | ✅ Live |
| **Stocks** (Apple, Tesla, Microsoft, etc.) | Finnhub | 5 seconds | ✅ Live |

### Features

✅ **Real-time price updates** every 5 seconds  
✅ **Bid/Ask spreads** calculated automatically  
✅ **24h price changes** with green/red indicators  
✅ **Live market status** indicator (green = connected)  
✅ **Manual refresh** button to update instantly  
✅ **Automatic failover** if API is unavailable  
✅ **Loading states** while fetching data  

## 🔧 How It Works

### Data Flow

```
Trading Platform
    ↓
useBatchMarketData Hook (Auto-refresh every 5s)
    ↓
API Route (/api/market-data)
    ↓
Market Data Library (lib/market-data.ts)
    ↓
External APIs (Finnhub, CoinGecko)
```

### API Endpoints

**Single Symbol**:
```
GET /api/market-data?symbol=Bitcoin
```

**Multiple Symbols** (Batch):
```
GET /api/market-data?symbols=Bitcoin,Ethereum,Apple
```

### Supported Assets

#### Indices
- US 100 (NASDAQ)
- US 30 (Dow Jones)
- US 500 (S&P 500)
- GER 30 (DAX)
- JP 225 (Nikkei)
- FR 40 (CAC)
- UK 100 (FTSE)

#### Forex Pairs
- EUR/USD
- GBP/USD
- USD/JPY
- AUD/USD
- USD/CAD
- USD/CHF

#### Cryptocurrencies
- Bitcoin
- Ethereum
- Ripple
- Litecoin
- Cardano

#### Stocks
- Apple (AAPL)
- Microsoft (MSFT)
- Tesla (TSLA)
- Amazon (AMZN)
- Google (GOOGL)
- Meta (META)

## 📈 Trading Features

### Place Trades
1. Select an asset from the right sidebar
2. Enter your trade amount
3. Click **Buy** or **Sell** button
4. Position opens with real-time entry price

### Manage Positions
- View all open positions at the bottom
- Real-time P/L updates based on current market prices
- Close positions with one click
- Balance automatically updates

### Market Information
- **Current Price**: Mid-point between bid and ask
- **Spread**: Difference between buy and sell price
- **24h Change**: Percentage change in last 24 hours
- **Live Status**: Green dot = connected to market data

## ⚙️ Configuration

### Adjust Refresh Rate

Edit `src/app/trade/page.tsx`:

```typescript
// Change 5000 (5 seconds) to your preferred interval
const { data: marketData } = useBatchMarketData(symbolNames, 5000);
```

**Recommended intervals**:
- 1000ms (1s) - Very aggressive, high API usage
- 5000ms (5s) - Balanced (default)
- 10000ms (10s) - Conservative, lower API usage

### Rate Limits

**Finnhub Free Tier**:
- 60 API calls per minute
- With 8 assets updating every 5s = 96 calls/min
- Solution: Increase refresh interval to 10s (48 calls/min)

## 🔍 Troubleshooting

### "Loading..." appears forever

**Cause**: API key not configured or invalid

**Solution**:
1. Check `.env` file has `NEXT_PUBLIC_FINNHUB_API_KEY`
2. Verify API key is correct
3. Restart dev server: `bun run dev`

### Red "Offline" status

**Cause**: API rate limit exceeded or network error

**Solution**:
1. Wait 1 minute for rate limit reset
2. Click refresh button manually
3. Increase refresh interval to 10s or 15s

### Prices showing as "--"

**Cause**: Symbol not found or API error

**Solution**:
1. Check symbol mapping in `src/lib/market-data.ts`
2. Verify symbol is supported by provider
3. Check browser console for errors

### Rate limit exceeded

**Cause**: Too many API calls

**Solutions**:
- Increase refresh interval in `src/app/trade/page.tsx`
- Reduce number of assets loaded simultaneously
- Upgrade to Finnhub paid plan ($49.99/mo for 300 calls/min)

## 🎯 Best Practices

### For Demo/Testing
- Use free Finnhub API key
- Set refresh interval to 10 seconds
- Load one category at a time

### For Production
- Upgrade to paid Finnhub plan
- Implement caching layer (Redis)
- Use WebSocket for real-time updates
- Add error retry logic with exponential backoff

## 📦 Files Structure

```
src/
├── lib/
│   └── market-data.ts          # API integration logic
├── hooks/
│   └── useMarketData.ts        # React hook for real-time data
├── app/
│   ├── api/
│   │   └── market-data/
│   │       └── route.ts        # API endpoint
│   └── trade/
│       └── page.tsx            # Trading platform UI
```

## 🔗 Useful Links

- [Finnhub Dashboard](https://finnhub.io/dashboard)
- [CoinGecko API Docs](https://docs.coingecko.com)
- [Finnhub API Docs](https://finnhub.io/docs/api)

## 💡 Pro Tips

1. **Test with Demo Key**: Finnhub provides a `demo` key for testing
2. **Monitor Usage**: Check Finnhub dashboard for API call statistics
3. **Cache Data**: Consider adding Redis for production deployments
4. **WebSocket Upgrade**: For < 1s updates, upgrade to WebSocket connections
5. **Error Handling**: The system automatically falls back to cached data if APIs fail

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Verify API keys in `.env` file
3. Check Finnhub dashboard for rate limits
4. Test API directly: `curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"`

---

**Your trading platform now has real-time market data! 🎉**

The platform automatically fetches live prices every 5 seconds from professional financial APIs. Start trading with real market data now!
