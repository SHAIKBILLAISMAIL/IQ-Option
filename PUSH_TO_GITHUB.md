# Step-by-Step: Push Changes to GitHub

Follow these commands **exactly** in your terminal:

## Step 1: Open Terminal in Your Project Folder

Make sure you're in the project directory:
```bash
cd c:\Users\ismai\Downloads\iq-option-main
```

## Step 2: Check What Changed

```bash
git status
```

You should see the deleted files and any other changes.

## Step 3: Stage All Changes

```bash
git add .
```

This adds all your changes (including deleted files) to be committed.

## Step 4: Commit the Changes

```bash
git commit -m "Remove old Stripe code and fix Vercel build error"
```

## Step 5: Push to GitHub

```bash
git push
```

If this is your first push, you might need:
```bash
git push -u origin main
```

---

## That's It! ✅

After running these commands:
1. Your code will be on GitHub
2. Vercel will automatically start building
3. Check your Vercel dashboard to see the deployment progress

---

## If You Get Errors:

### Error: "fatal: not a git repository"
Run this first:
```bash
git init
git remote add origin https://github.com/SHAIKBILLAISMAIL/iq-options.git
```
Then repeat Steps 3-5.

### Error: "Permission denied" or "Authentication failed"
You need to authenticate with GitHub. Use a Personal Access Token:
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate a new token
3. Use the token as your password when pushing

### Error: "Updates were rejected"
Run this first:
```bash
git pull origin main --rebase
```
Then try pushing again.

---

## Quick Copy-Paste (All Commands Together)

```bash
cd c:\Users\ismai\Downloads\iq-option-main
git add .
git commit -m "Remove old Stripe code and fix Vercel build error"
git push
```
