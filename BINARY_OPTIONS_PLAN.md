# Binary Options Trading Implementation Plan

## Changes Required:

### 1. Database Schema Update
Add `expiresAt` field to `trades` table to track when the trade should auto-close.

### 2. Frontend Updates (`src/app/trade/page.tsx`)
- Add trading duration selector (1min, 5min, 15min, 30min, 1hr)
- Add timer countdown for each open position
- Auto-close trades when duration expires
- Show win/lose popup with profit/loss amount
- Update chart to refresh every second

### 3. New Components
- Trade Result Dialog (Win/Lose popup)
- Duration Selector UI
- Position Timer Display

## Implementation Steps:
1. Update database schema
2. Add duration state and UI
3. Implement auto-close logic with timer
4. Create result popup
5. Update chart refresh rate
