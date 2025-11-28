# Fix Live Market Data - Get Real-Time Prices

## Problem
Your chart shows "SIMULATED DATA" because the Finnhub API key is invalid (`demo` key doesn't work).

## Solution: Get a FREE Finnhub API Key

### Step 1: Sign Up for Finnhub (100% Free)

1. Go to: **https://finnhub.io/register**
2. Sign up with your email (free account)
3. Verify your email
4. Login to your dashboard

### Step 2: Get Your API Key

1. After login, you'll see your **API Key** on the dashboard
2. Copy the key (looks like: `csh1234567890abcdef`)

### Step 3: Add to Environment Variables

**Option A: Local Development**

Edit `.env.local`:
```env
NEXT_PUBLIC_FINNHUB_API_KEY=YOUR_ACTUAL_KEY_HERE
```

**Option B: Vercel Deployment**

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   - **Name**: `NEXT_PUBLIC_FINNHUB_API_KEY`
   - **Value**: Your Finnhub API key
   - **Environments**: Production, Preview, Development
4. Click Save

### Step 4: Restart Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 5: Verify

1. Open your trading app
2. The chart should now show **LIVE DATA** instead of "SIMULATED DATA"
3. Prices will update in real-time!

---

## Alternative: Use Free APIs Without Registration

If you don't want to register, I can modify the code to use completely free APIs that don't require keys:

### For Stocks: Yahoo Finance (via yfinance proxy)
### For Crypto: CoinGecko (already working, no key needed)
### For Forex: Exchange Rate API

Let me know if you want me to implement this alternative!

---

## Finnhub Free Tier Limits

- ✅ **60 API calls/minute**
- ✅ **Real-time US stocks**
- ✅ **Forex data**
- ✅ **Crypto data**
- ✅ **Free forever**

This is more than enough for your trading platform!

---

## Quick Test

After adding the key, open browser console (F12) and check:
- ❌ Before: "Finnhub API key invalid for ^NDX. Using mock data."
- ✅ After: No errors, live data flowing!

---

## Troubleshooting

**Issue: Still showing simulated data**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check `.env.local` has the correct key
- Restart dev server

**Issue: "Rate limit exceeded"**
- Free tier: 60 calls/minute
- Reduce polling frequency in code (currently every 5 seconds)
- Or upgrade to paid tier ($59/month for 300 calls/min)
