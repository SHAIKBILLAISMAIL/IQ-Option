# Real-Time Payment Integration Guide

This trading platform now supports **real-time payment processing** through multiple payment methods.

## 🎯 Supported Payment Methods

### 1. **Credit/Debit Cards** (Stripe) - ✅ Real-Time
- **Provider**: Stripe
- **Processing**: Instant
- **Supported Cards**: Visa, Mastercard, American Express
- **Features**:
  - PCI-compliant secure payment processing
  - 3D Secure authentication support
  - Instant balance updates
  - Real-time payment status

### 2. **UPI Payment** - ⏳ Manual Verification
- **Provider**: Manual (UPI ID based)
- **Processing**: Requires manual verification
- **Features**:
  - UPI deep linking for mobile apps
  - UTR number tracking
  - Copy-paste UPI ID

### 3. **Bank Transfer** - ⏳ Manual Verification
- **Provider**: Manual (Bank details based)
- **Processing**: 1-3 business days
- **Features**:
  - Complete bank details provided
  - Transaction reference tracking
  - SWIFT/IFSC code support

### 4. **Cryptocurrency (USDT TRC20)** - ⏳ Manual Verification
- **Provider**: Manual (Wallet address based)
- **Processing**: Requires blockchain confirmation
- **Features**:
  - TRC20 network support
  - Transaction hash tracking
  - Wallet address copy functionality

---

## 🔧 Setup Instructions

### 1. Stripe Integration (Required for Card Payments)

#### Step 1: Create a Stripe Account
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. Complete account verification

#### Step 2: Get API Keys
1. Navigate to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

#### Step 3: Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Other required variables
NEXT_PUBLIC_FINNHUB_API_KEY=demo
DATABASE_URL=file:./local.db
```

⚠️ **Important**: Never commit your `.env.local` file to version control!

#### Step 4: Test the Integration
1. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Requires 3D Secure**: `4000 0025 0000 3155`
   - **Declined**: `4000 0000 0000 0002`
2. Use any future expiry date (e.g., `12/34`)
3. Use any 3-digit CVC (e.g., `123`)

### 2. Production Deployment

#### Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode**
2. Get your live API keys
3. Update environment variables with live keys:
   ```bash
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   ```

#### Enable Payment Methods
1. Go to **Settings** → **Payment methods**
2. Enable desired payment methods (cards, wallets, etc.)
3. Configure currency settings

---

## 💳 How It Works

### Card Payment Flow (Stripe)

```
User selects amount
      ↓
Click "Continue to Pay"
      ↓
System creates Payment Intent (API call to /api/create-payment-intent)
      ↓
Stripe Elements form loads
      ↓
User enters card details
      ↓
Stripe processes payment securely
      ↓
Payment confirmed
      ↓
Deposit record created with status "completed"
      ↓
User balance updated instantly
```

### Manual Payment Flow (UPI/Bank/Crypto)

```
User selects amount
      ↓
Click "Continue to Pay"
      ↓
Payment details displayed (UPI ID / Bank Account / Wallet Address)
      ↓
User completes payment externally
      ↓
User enters transaction reference (UTR / Transaction Hash)
      ↓
Click "Verify & Complete Deposit"
      ↓
Deposit record created with status "pending"
      ↓
Admin manually verifies and approves
      ↓
Balance updated after approval
```

---

## 🔐 Security Features

### Stripe Integration
- ✅ PCI DSS Level 1 compliant
- ✅ End-to-end encryption
- ✅ 3D Secure (SCA) support
- ✅ Fraud detection built-in
- ✅ No card details touch your server

### Application Security
- ✅ JWT-based authentication
- ✅ Server-side payment validation
- ✅ Transaction ID uniqueness checks
- ✅ User authorization checks
- ✅ HTTPS required in production

---

## 📊 Database Schema

### Deposits Table
```sql
CREATE TABLE deposits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  paymentMethod TEXT NOT NULL,  -- 'card', 'upi', 'bank_transfer', 'crypto'
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  transactionId TEXT UNIQUE NOT NULL,
  createdAt INTEGER NOT NULL
);
```

---

## 🧪 Testing

### Test Card Numbers (Stripe)
| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Declined (insufficient funds) |
| `4000 0000 0000 0002` | Declined (generic) |

### Test UPI
- UPI ID: `merchant@paytm` (demo)
- Any 12-digit UTR number

### Test Crypto
- Wallet: `TXqHvS2VfM4xKzYpN8bC3dE5fG7hJ9kL2m` (demo)
- Any transaction hash

---

## 🚀 API Endpoints

### POST `/api/create-payment-intent`
Creates a Stripe Payment Intent for card payments.

**Request**:
```json
{
  "amount": 100,
  "currency": "usd"
}
```

**Response**:
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### POST `/api/deposits`
Creates a deposit record.

**Request**:
```json
{
  "amount": 100,
  "currency": "USD",
  "paymentMethod": "card",
  "transactionId": "pi_xxx",
  "status": "completed"
}
```

---

## 📝 Customization

### Update Payment Methods
Edit `src/components/trading/deposit-dialog.tsx`:

```typescript
const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Instant deposit via Stripe',
    minAmount: 10,
  },
  // Add more methods here
];
```

### Update UPI/Bank/Crypto Details
```typescript
const UPI_ID = "your-upi-id@bank";
const USDT_WALLET = "your-wallet-address";
const BANK_DETAILS = {
  bankName: "Your Bank",
  accountName: "Your Company",
  accountNumber: "1234567890",
  ifscCode: "BANK0001234",
  swiftCode: "BANKXXXX"
};
```

---

## 🐛 Troubleshooting

### "Failed to initialize payment"
- Check if `STRIPE_SECRET_KEY` is set correctly
- Verify API key is for the correct mode (test/live)
- Check server logs for detailed error

### "Payment requires authentication"
- This is normal for 3D Secure cards
- User will be redirected to bank's authentication page
- Payment will complete after authentication

### Balance not updating
- Check deposit status in database
- For manual methods, status should be "pending" until admin approval
- For Stripe, status should be "completed" immediately

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Payment Element](https://stripe.com/docs/payments/payment-element)
- [Webhooks](https://stripe.com/docs/webhooks) (for advanced integration)

---

## ⚠️ Important Notes

1. **Test Mode**: Always test thoroughly in test mode before going live
2. **Webhooks**: Consider implementing Stripe webhooks for production to handle async payment events
3. **Error Handling**: Monitor Stripe Dashboard for failed payments
4. **Compliance**: Ensure you comply with local payment regulations
5. **Fees**: Stripe charges transaction fees (typically 2.9% + $0.30 per transaction)

---

## 🎉 You're Ready!

Your trading platform now has real-time payment processing! Users can deposit funds instantly using their credit/debit cards through Stripe's secure payment infrastructure.

For production deployment, remember to:
- [ ] Switch to live Stripe keys
- [ ] Enable HTTPS
- [ ] Set up Stripe webhooks
- [ ] Configure proper error monitoring
- [ ] Test all payment flows thoroughly
