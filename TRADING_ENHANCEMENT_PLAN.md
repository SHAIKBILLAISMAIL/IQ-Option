# Complete Trading Enhancement Implementation

## Features to Implement:

### 1. Visual Live Price Updates
- Add price flash animations (green/red)
- Add "LIVE" indicator with pulse
- Increase update frequency to 100ms
- Add price change arrows

### 2. Binary Options Trading
- Add duration selector (1min, 5min, 15min, 30min, 1hr)
- Auto-close trades when duration expires
- Show win/lose popup with profit/loss
- Add countdown timer for each position
- Update database schema with `expiresAt` field

## Files to Modify:

### Database Schema (`src/db/schema.ts`)
- Add `expiresAt` field to trades table
- Add `duration` field to trades table

### API Routes
- Update `/api/trades` POST to accept duration
- Add auto-close logic

### Frontend (`src/app/trade/page.tsx`)
- Add duration state and selector UI
- Add position countdown timers
- Add auto-close effect
- Add win/lose dialog component
- Add price flash animations

### Hooks (`src/hooks/useMarketData.ts`)
- Increase update frequency from 200ms to 100ms
- Increase price variance for visibility

## Implementation Priority:
1. ✅ Visual price updates (quick win)
2. ✅ Binary options with auto-close (main feature)
3. ✅ Win/lose popup
4. ✅ Database updates

Let's proceed with implementation...
