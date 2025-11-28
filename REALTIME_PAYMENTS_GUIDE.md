# Real-Time Payment Setup Guide

## ✅ What I've Configured

Your system is now set up for **instant payment confirmation** with RupantorPay:

1. **Webhook URL**: Enabled in payment requests
2. **Callback Handler**: Processes payments instantly when RupantorPay confirms them
3. **Balance Update**: User's real balance updates immediately upon payment confirmation

---

## 🧪 How to Test Real-Time Payments

### **Step 1: Make a Test Payment**
1. Go to `/trade` and click **Deposit**
2. Select **RupantorPay** and enter an amount (e.g., ৳500)
3. Click **Continue to Pay**
4. You'll be redirected to the RupantorPay payment page

### **Step 2: Complete the Payment**
1. On the RupantorPay page, select your payment method (bKash/Nagad/Rocket)
2. Send the money from your mobile wallet
3. Enter the **Transaction ID** (TrxID) from your wallet
4. Click **VERIFY** or **Pay**

### **Step 3: Check the Logs**
Watch your terminal for these logs:
```
RupantorPay webhook received: { ... }
✅ Payment processed successfully: { transactionId: '...', amount: 500, userId: '...' }
```

### **Step 4: Verify Balance Update**
- Your **Real Balance** should update instantly
- The deposit should show as **Completed** in your history

---

## 🔍 Troubleshooting

### **If webhook is not received:**

1. **Check RupantorPay Dashboard**:
   - Log in to your RupantorPay merchant panel
   - Go to **Transactions** and verify the payment shows as **Paid**
   - Check **Webhook Logs** (if available) to see if they're sending to your URL

2. **Localhost Issue**:
   - If testing on `localhost`, RupantorPay **cannot** reach your webhook
   - **Solution**: Deploy to a public URL (Vercel, Netlify, etc.) or use **ngrok**:
     ```bash
     ngrok http 3000
     ```
   - Update `NEXT_PUBLIC_SITE_URL` in `.env.local` to the ngrok URL
   - Restart your server

3. **Check Webhook URL**:
   - Make sure `NEXT_PUBLIC_SITE_URL` is set correctly in `.env.local`
   - For production: `https://yourdomain.com`
   - For ngrok: `https://abc123.ngrok.io`

---

## 🚀 For Production Deployment

### **1. Update Environment Variables**
On your hosting platform (Vercel/Netlify):
```
RUPANTORPAY_API_KEY=R5BV0eCdgNBaaRb3P2DABZV4uadCJbXKRfxpPHhXMlkV0c2CO7
RUPANTORPAY_BASE_URL=https://payment.rupantorpay.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### **2. Test the Webhook**
1. Make a real payment
2. Check server logs for `RupantorPay webhook received`
3. Verify balance updates instantly

### **3. Contact RupantorPay Support (if needed)**
If webhooks aren't working:
- Email: support@rupantorpay.com
- Provide: Your webhook URL and a test invoice ID
- Ask them to check their webhook delivery logs

---

## 📊 How It Works

```
User pays → RupantorPay verifies → Webhook sent to your server
                                           ↓
                                  Deposit marked 'completed'
                                           ↓
                                  Balance updated instantly
                                           ↓
                                  User sees new balance
```

---

## ⚠️ Important Notes

1. **Localhost Testing**: Webhooks won't work on `localhost`. Use ngrok or deploy to test.
2. **Security**: In production, verify the webhook signature (check RupantorPay docs for their signature method).
3. **Duplicate Prevention**: The code already checks if a payment is already processed to prevent double-crediting.

---

## 🎯 Next Steps

1. **Test on localhost** (GET callback will work, webhook won't)
2. **Deploy to production** or use ngrok
3. **Make a real payment** and verify instant balance update
4. **Monitor logs** to ensure webhooks are being received

Your real-time payment system is ready! 🚀
