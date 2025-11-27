---
description: Test Real-Time Payment and Withdrawal
---

# Test Real-Time Payment and Withdrawal

This workflow describes how to test the real-time payment (Razorpay) and withdrawal features.

## Prerequisites
- Ensure the application is running (`npm run dev`).
- Ensure you are logged in.

## Test Real-Time Deposit (Razorpay)
1. Click on the "Deposit" button in the top right corner.
2. Select "Instant Payment" (Razorpay).
3. Enter an amount (e.g., 100).
4. Click "Deposit".
5. The Razorpay modal should open.
6. Complete the payment using a test card or UPI (in test mode).
7. Verify that the balance updates instantly upon success.

## Test Real-Time Withdrawal
1. Click on the "Withdraw" button in the top right corner.
2. Select "Instant Bank Transfer".
3. Enter an amount (e.g., 50).
4. Enter dummy bank details.
5. Click "Submit Withdrawal".
6. Observe the "Processing Request" animation.
7. Verify the "Withdrawal Initiated" success screen appears.
8. Verify the balance is deducted immediately.
9. Check the "Recent Activity" list to see the new withdrawal with "pending" status (simulated instant processing).

## Notes
- Razorpay is currently in test mode (`rzp_test_demo`).
- Withdrawals are simulated to be "instant" in the UI (balance deduction), but the status remains "pending" until admin approval (or further backend integration).
