# AgricLend Deployment Guide

This guide will help you deploy the AgricLend application to production.

## Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (for production database)
- Vercel account (for frontend deployment)
- Render/Railway/Heroku account (for backend deployment)
- Git account (GitHub)

## Architecture

- **Frontend**: React + TypeScript (deployed to Vercel)
- **Backend**: Express + Node.js (deployed to Render/Railway)
- **Database**: MongoDB Atlas

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is sufficient)
4. Create a database user:
   - Username: `agrilend_user` (or your preferred username)
   - Password: Generate a strong password
5. Configure network access:
   - Add IP address `0.0.0.0/0` (allows all IPs) OR
   - Add your deployment platform's IP ranges
6. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`

## Step 2: Deploy Backend (Render)

### Option A: Using Render (Recommended)

1. Go to [Render](https://render.com)
2. Create a free account
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `agrilend-backend`
   - **Region**: Choose nearest region
   - **Branch**: `master`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string (use: `openssl rand -base64 32`)
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://agrilend.vercel.app`)
7. Click "Deploy Web Service"
8. Wait for deployment to complete
9. Copy your backend URL (e.g., `https://agrilend-backend.onrender.com`)

### Option B: Using Railway

1. Go to [Railway](https://railway.app)
2. Create a free account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - Root Directory: `backend`
   - Start Command: `node server.js`
6. Add environment variables in the Variables tab
7. Deploy and copy the backend URL

## Step 3: Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Create a free account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://agrilend-backend.onrender.com/api`)
7. Click "Deploy"
8. Wait for deployment to complete
9. Copy your frontend URL (e.g., `https://agrilend.vercel.app`)

## Step 4: Update Backend CORS Configuration

After deploying both frontend and backend, update the backend's CORS configuration:

1. Go to your backend deployment (Render/Railway)
2. Update the `FRONTEND_URL` environment variable to your actual frontend URL
3. Redeploy the backend

## Step 5: Test the Deployment

1. Visit your frontend URL
2. Try to:
   - Register as a new farmer
   - Login
   - Apply for a loan
   - Check if data is saved to MongoDB Atlas

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrilend
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Troubleshooting

### Backend fails to start
- Check MongoDB connection string format
- Verify MongoDB Atlas IP whitelist
- Check Render/Railway logs for errors

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is correct
- Check backend CORS configuration
- Ensure backend is running and accessible

### MongoDB connection errors
- Verify username and password in connection string
- Check MongoDB Atlas cluster status
- Ensure IP whitelist includes deployment platform

### Build errors
- Ensure Node.js version >= 18.0.0
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for deprecated dependencies

## Security Best Practices

1. **Never commit .env files** - Use .env.example as template
2. **Use strong JWT secrets** - Generate with `openssl rand -base64 32`
3. **Enable MongoDB Atlas authentication** - Use strong passwords
4. **Use HTTPS** - Both Vercel and Render provide free SSL
5. **Monitor logs** - Check for suspicious activity
6. **Regular updates** - Keep dependencies updated

## Cost Summary (Free Tier)

- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (with spin-up/down)
- **Vercel**: Free (100GB bandwidth/month)
- **Total**: $0/month (suitable for development/small projects)

## Scaling Considerations

For production with higher traffic:
- Upgrade MongoDB Atlas cluster
- Use Render/Railway paid tiers for better performance
- Consider CDN for static assets
- Implement rate limiting
- Add monitoring and logging

## Support

For issues or questions:
- Check deployment platform logs
- Review MongoDB Atlas status
- Verify environment variables
- Test API endpoints directly
