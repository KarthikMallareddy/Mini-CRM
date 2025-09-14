# Mini CRM - Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites:
1. GitHub account
2. Vercel account (free)
3. MongoDB Atlas account (free)

### Step 1: Prepare Your Code
```bash
# Navigate to your project
cd C:\Users\ASUS\Downloads\mini_crm

# Initialize git repository
git init
git add .
git commit -m "Initial commit - Mini CRM"

# Create GitHub repository and push
# (Or use GitHub Desktop)
```

### Step 2: Environment Variables Setup
Create these environment variables in Vercel:

**Backend Environment Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string (e.g., "your-super-secret-jwt-key-here")
- `NODE_ENV`: "production"

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration
6. Add your environment variables
7. Click "Deploy"

### Step 4: Database Setup (MongoDB Atlas)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to Vercel environment variables

---

## 🌐 Alternative: Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
railway login
railway init
railway up
```

---

## 🔧 Other Options:

### Netlify + Heroku
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Heroku
- **Database**: MongoDB Atlas

### Render (Full-Stack)
- Deploy both frontend and backend
- Built-in database options
- Free tier available

### AWS/DigitalOcean
- More control but requires more setup
- Good for production apps

---

## 📝 Pre-Deployment Checklist:

### Frontend Changes Needed:
1. Update API endpoints for production
2. Add build scripts
3. Configure environment variables

### Backend Changes Needed:
1. Add production MongoDB URI
2. Configure CORS for production domain
3. Add error handling for production

### Security:
1. Secure JWT secret
2. Configure CORS properly
3. Add rate limiting
4. Validate all inputs

---

## 🚨 Quick Fix Commands:

```bash
# Build frontend
cd frontend
npm run build

# Test backend locally
cd backend
npm start

# Install missing dependencies
npm install
```

---

## 💡 Tips:
- Start with Vercel (easiest)
- Use MongoDB Atlas for database
- Test locally before deploying
- Monitor deployment logs
- Set up custom domain later
