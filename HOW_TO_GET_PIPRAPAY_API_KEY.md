# How to Get PipraPay API Key - Step by Step Guide

## Method 1: Cloud Hosted (Recommended for Beginners)

### Cost: 100 BDT/month or 800 BDT/year

### Step 1: Create Account
1. Go to **https://cloud.piprapay.com**
2. Click **"Sign Up"** or **"Register"**
3. Fill in your details:
   - Name
   - Email
   - Password
   - Phone Number
4. Verify your email

### Step 2: Complete Profile
1. Log in to your account
2. Complete your business profile:
   - Business Name
   - Business Type
   - Address
   - Tax/NID Information

### Step 3: Choose Plan
1. Go to **Billing** or **Subscription**
2. Select a plan:
   - **Monthly**: 100 BDT/month
   - **Yearly**: 800 BDT/year (Save 200 BDT)
3. Pay using bKash/Nagad/Rocket

### Step 4: Get API Key
1. Go to **Developer** section in dashboard
2. Click **"API Keys"**
3. Click **"Generate New API Key"**
4. Copy the API key (starts with something like `pp_live_...`)
5. **IMPORTANT**: Save it securely - you won't see it again!

### Step 5: Configure Webhook (Optional)
1. In Developer section, go to **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/piprapay/callback`
3. Select events: `payment.success`, `payment.failed`
4. Save

---

## Method 2: Self-Hosted (FREE Forever)

### Cost: FREE (You host it yourself)

### Step 1: Download PipraPay
1. Go to **https://piprapay.com/download**
2. Download the latest version
3. You'll get a ZIP file

### Step 2: Server Requirements
- **PHP**: 8.1 or higher
- **MySQL**: 5.7 or higher
- **Web Server**: Apache/Nginx
- **SSL Certificate**: Required for production

### Step 3: Install
1. Extract ZIP file to your web server
2. Create MySQL database
3. Import database schema (included in download)
4. Configure `.env` file:
   ```env
   DB_HOST=localhost
   DB_DATABASE=piprapay
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   APP_URL=https://yourdomain.com
   ```
5. Run installation script: `php artisan migrate`

### Step 4: Setup Admin Account
1. Access: `https://yourdomain.com/install`
2. Create admin account
3. Complete setup wizard

### Step 5: Generate API Key
1. Log in to admin panel
2. Go to **Settings** → **API Keys**
3. Click **"Generate New Key"**
4. Copy the API key
5. Save it securely

### Step 6: Configure Payment Methods
1. Go to **Payment Methods** in admin panel
2. Enable payment gateways:
   - bKash
   - Nagad
   - Rocket
3. Add your merchant credentials for each

---

## Step 7: Add API Key to Your Project

### For Development (localhost)

Open `.env.local` in your project:

```env
# PipraPay Configuration
PIPRAPAY_API_KEY=pp_live_your_actual_api_key_here
PIPRAPAY_BASE_URL=https://cloud.piprapay.com/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For Self-Hosted:**
```env
PIPRAPAY_BASE_URL=https://yourdomain.com/api
```

### For Production (Vercel/Netlify)

1. Go to your hosting dashboard
2. Navigate to **Environment Variables**
3. Add these variables:
   ```
   PIPRAPAY_API_KEY=pp_live_your_actual_api_key_here
   PIPRAPAY_BASE_URL=https://cloud.piprapay.com/api
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```
4. Redeploy your application

---

## Step 8: Test the Integration

### Test Mode (Sandbox)
1. PipraPay provides test credentials
2. Use test API key: `pp_test_...`
3. Test with sandbox bKash/Nagad accounts
4. No real money is charged

### Live Mode
1. Use live API key: `pp_live_...`
2. Real payments will be processed
3. Start with small amounts (100-500 BDT)

---

## API Key Format

### Test Key (Sandbox):
```
pp_test_1234567890abcdefghijklmnopqrstuvwxyz
```

### Live Key (Production):
```
pp_live_1234567890abcdefghijklmnopqrstuvwxyz
```

---

## Security Best Practices

1. **Never commit API keys to Git**
   - `.env.local` is in `.gitignore`
   - Use environment variables

2. **Use different keys for dev/prod**
   - Test key for development
   - Live key for production

3. **Rotate keys regularly**
   - Generate new keys every 3-6 months
   - Revoke old keys

4. **Restrict API key permissions**
   - Only enable required permissions
   - Use IP whitelisting if available

---

## Troubleshooting

### "Invalid API Key"
- Check if key is copied correctly (no spaces)
- Verify key is active in dashboard
- Ensure using correct environment (test vs live)

### "API Key Expired"
- Generate new key from dashboard
- Update environment variables
- Restart application

### "Insufficient Permissions"
- Check API key permissions in dashboard
- Ensure key has payment creation permission

---

## Support

- **Documentation**: https://piprapay.readme.io
- **Community Forum**: https://community.piprapay.com
- **Email Support**: support@piprapay.com
- **Live Chat**: Available in dashboard

---

## Pricing Comparison

| Feature | Cloud Hosted | Self-Hosted |
|---------|-------------|-------------|
| **Cost** | 100 BDT/month | FREE |
| **Setup** | 5 minutes | 1-2 hours |
| **Maintenance** | Managed | You manage |
| **Updates** | Automatic | Manual |
| **Support** | Priority | Community |
| **Uptime** | 99.9% SLA | Your server |

---

## Next Steps

1. ✅ Choose hosting method (Cloud or Self-hosted)
2. ✅ Create account and get API key
3. ✅ Add API key to `.env.local`
4. ✅ Restart your dev server: `npm run dev`
5. ✅ Test deposit with small amount
6. ✅ Deploy to production

---

## Quick Start (Cloud Hosted)

```bash
# 1. Sign up
Visit: https://cloud.piprapay.com

# 2. Get API key
Dashboard → Developer → API Keys → Generate

# 3. Add to project
echo "PIPRAPAY_API_KEY=pp_live_your_key_here" >> .env.local

# 4. Restart server
npm run dev

# 5. Test deposit
Visit: http://localhost:3000/trade
```

That's it! You're ready to accept payments from Bangladesh! 🎉
