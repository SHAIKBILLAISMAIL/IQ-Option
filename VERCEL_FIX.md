# Fix Vercel Deployment Error

## Problem
The build is failing because of an old Stripe API route that's no longer needed (we switched to Razorpay).

## Solution

### Step 1: Delete the Old Stripe Route

Delete this folder and its contents:
```
src/app/api/create-payment-intent/
```

You can do this by:
- **In VS Code**: Right-click the folder → Delete
- **In Terminal**: 
  ```bash
  rm -rf src/app/api/create-payment-intent
  ```

### Step 2: Commit and Push the Changes

```bash
git add .
git commit -m "Remove old Stripe payment route"
git push
```

### Step 3: Configure Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

   **For Production, Preview, and Development:**
   ```
   RAZORPAY_KEY_ID = rzp_test_sample_key
   RAZORPAY_KEY_SECRET = sample_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_sample_key
   ```

   **Also add (from your .env file):**
   ```
   TURSO_CONNECTION_URL = (your value from .env)
   TURSO_AUTH_TOKEN = (your value from .env)
   BETTER_AUTH_SECRET = (your value from .env)
   ```

5. Click **Save**

### Step 4: Redeploy

Vercel will automatically redeploy after you push, or you can manually trigger a redeploy from the Vercel dashboard.

---

## Alternative: Quick Fix Without Deleting

If you want to keep the file for reference, you can disable it by renaming:

```bash
# Rename the folder to disable it
mv src/app/api/create-payment-intent src/app/api/_create-payment-intent-OLD
```

The underscore prefix will make Next.js ignore it.

---

## Verification

After redeployment, your build should succeed. You'll see:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
```
