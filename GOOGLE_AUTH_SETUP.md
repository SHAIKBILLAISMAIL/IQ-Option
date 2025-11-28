# Google OAuth Setup Guide

This guide will help you enable Google login for your trading platform.

## Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your Firebase project from the dropdown at the top (or create a new project)

## Step 2: Enable Google+ API (Required for OAuth)

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and press **"Enable"**

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in the required fields:
   - **App name**: `IQ Option Trading Platform` (or your app name)
   - **User support email**: Your email
   - **Developer contact email**: Your email
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (default scopes are fine)
7. On the **Test users** page, add your email as a test user
8. Click **"Save and Continue"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Fill in the details:
   - **Name**: `IQ Option Web Client`
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `http://localhost:3001`
     - `http://localhost:3002`
     - `http://localhost:3003`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3001/api/auth/callback/google`
     - `http://localhost:3002/api/auth/callback/google`
     - `http://localhost:3003/api/auth/callback/google`
5. Click **"Create"**
6. A popup will show your **Client ID** and **Client Secret** - **COPY THESE!**

## Step 5: Add Credentials to Your Project

1. Open your `.env.local` file in the project
2. Replace the placeholder values with your real credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
```

3. Enable Google login by adding this line:

```env
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

## Step 6: Restart Your Development Server

1. Stop the running dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. The Google login button should now appear on login/register pages

## Step 7: Test Google Login

1. Go to `http://localhost:3000/login` (or whatever port your app is running on)
2. Click the **"Google"** button
3. Sign in with your Google account
4. You should be redirected to the trading platform!

## For Production Deployment

When deploying to production (e.g., Vercel), you'll need to:

1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add your production URLs:
   - **Authorized JavaScript origins**: `https://yourdomain.com`
   - **Authorized redirect URIs**: `https://yourdomain.com/api/auth/callback/google`
4. Update your production environment variables with the same credentials

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Make sure you added your email as a test user in the OAuth consent screen
- Check that the redirect URI in Google Cloud matches exactly: `http://localhost:3000/api/auth/callback/google`

### "Failed to login with google"
- Verify your Client ID and Secret are correct in `.env.local`
- Make sure there are no extra spaces or quotes around the values
- Restart your dev server after changing environment variables

### Google button not showing
- Make sure `NEXT_PUBLIC_GOOGLE_ENABLED=true` is in your `.env.local`
- Restart the dev server

## Need Help?

If you encounter any issues, check the browser console and terminal for error messages.
