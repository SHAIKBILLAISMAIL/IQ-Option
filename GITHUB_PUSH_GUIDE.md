# How to Push Your Code to GitHub

Follow these steps to push your trading platform to GitHub:

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `iq-option-trading` (or any name you prefer)
   - **Description**: "Real-time trading platform with Razorpay integration"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (your project already has files)
5. Click **"Create repository"**
6. **Copy the repository URL** (it will look like: `https://github.com/YOUR_USERNAME/iq-option-trading.git`)

## Step 2: Initialize Git (if not already done)

Open your terminal in the project folder and run:

```bash
git init
```

## Step 3: Add All Files to Git

```bash
git add .
```

This stages all your files for commit.

## Step 4: Create Your First Commit

```bash
git commit -m "Initial commit: Real-time trading platform with Razorpay payments"
```

## Step 5: Connect to GitHub Repository

Replace `YOUR_USERNAME` and `REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

Example:
```bash
git remote add origin https://github.com/ismail/iq-option-trading.git
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

If this is your first time pushing, Git might ask for your GitHub credentials.

## Step 7: Verify

Go to your GitHub repository page and refresh. You should see all your files!

---

## For Future Updates

After making changes to your code:

```bash
# 1. Stage changes
git add .

# 2. Commit with a message
git commit -m "Description of what you changed"

# 3. Push to GitHub
git push
```

---

## Important Notes

### ⚠️ Security: Protect Your Secrets

Before pushing, make sure `.env.local` is in `.gitignore` so your API keys don't get uploaded:

1. Open `.gitignore` file
2. Make sure it contains:
   ```
   .env.local
   .env*.local
   ```

### 📝 Good Commit Messages

Examples of good commit messages:
- `"Add real-time payment verification"`
- `"Fix withdrawal balance update bug"`
- `"Update UI for deposit dialog"`

---

## Troubleshooting

**Problem: "Permission denied"**
- Solution: You may need to authenticate with GitHub. Use a Personal Access Token instead of password.
- Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token

**Problem: "Repository already exists"**
- Solution: Use `git remote set-url origin NEW_URL` to change the remote URL

**Problem: "Updates were rejected"**
- Solution: Run `git pull origin main --rebase` first, then push again

---

## Quick Reference Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main
```
