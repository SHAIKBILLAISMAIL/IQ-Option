# Real Deposit Features Added

I have updated the PipraPay integration to support **Real Deposits** in two ways:

## 1. Real Gateway Integration (Enhanced)
- **Customer Data**: The system now automatically fetches your name and email from your login session and sends it to PipraPay.
- **Why**: This ensures transactions are properly linked to your real identity in the PipraPay dashboard.
- **Status**: Ready to use with your API key.

## 2. New "Personal" Deposit Option
- **Added**: "Send Money (Personal)" option in the deposit dialog.
- **Purpose**: Allows users to manually "Send Money" to a personal bKash/Nagad/Rocket number and enter the Transaction ID (TrxID).
- **Why**: Many users prefer this method ("Real Deposit") over the automated gateway.
- **Flow**:
  1. Select "Send Money (Personal)"
  2. See the personal number (currently placeholder `01700000000`)
  3. Send money via app
  4. Enter TrxID
  5. Click Verify

## How to Test

1. **Gateway Method**:
   - Select "PipraPay (Gateway)"
   - Click "Continue to Pay"
   - Redirects to PipraPay (Real or Demo based on key)

2. **Personal Method**:
   - Select "Send Money (Personal)"
   - Enter Amount
   - Click "Continue"
   - You'll see the manual payment screen

## Configuration

To change the personal number, edit `src/components/trading/deposit-dialog.tsx` and search for `01700000000`.

## Files Updated
- `src/app/trade/page.tsx`: Passed user session to deposit dialog.
- `src/components/trading/deposit-dialog.tsx`: Added user prop, updated API call, added manual payment UI.
