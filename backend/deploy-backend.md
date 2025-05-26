# Deploying AgriLend Backend

This guide will walk you through deploying your AgriLend backend to Render, a cloud platform that's ideal for Node.js applications.

## Prerequisites

1. A [Render account](https://render.com) (free to sign up)
2. Your GitHub repository connected to Render
3. A MongoDB Atlas account for the database

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account or log in
2. Create a new cluster (the free tier is sufficient for development)
3. Under "Database Access," create a database user with read and write permissions
4. Under "Network Access," add your IP address or allow access from anywhere (0.0.0.0/0)
5. Once your cluster is created, click "Connect" → "Connect your application"
6. Copy the connection string (it looks like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/myDatabase`)

## Step 2: Deploy to Render

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure your service:
   - **Name**: `agrilend-backend` (or your preferred name)
   - **Root Directory**: Choose your backend directory (`/backend` if your repo contains both frontend and backend)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose the Free plan for development

5. Add Environment Variables:
   - Click "Environment" → "Add Environment Variable"
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string for JWT authentication
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://agrilend-frontend.vercel.app`)

6. Click "Create Web Service"

## Step 3: Update Frontend Configuration

Once your backend is deployed, you'll need to update your frontend environment variable in Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Navigate to "Settings" → "Environment Variables"
4. Update the `REACT_APP_API_URL` to point to your Render backend URL:
   - Value: `https://your-backend-name.onrender.com/api` (replace with your actual Render URL)
5. Click "Save"
6. Redeploy your frontend by clicking "Deployments" → select the latest deployment → "Redeploy"

## Step 4: Verify the Connection

1. Visit your frontend Vercel URL
2. Try logging in with existing credentials
3. Check browser console for any API connection errors
4. Verify that the authentication flow works properly

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Check your backend CORS configuration in `server.js`
2. Ensure your Vercel frontend URL is correctly listed in the allowed origins
3. Verify there are no typos in your URLs

### Database Connection Issues

If your application can't connect to the database:

1. Check your MongoDB Atlas connection string in Render environment variables
2. Ensure your database user has the correct permissions
3. Verify that your IP or 0.0.0.0/0 is in the Network Access allowlist

### Authentication Problems

If users can't authenticate:

1. Check JWT secret configuration in both backend and frontend
2. Verify token expiration handling
3. Check browser console for specific error messages

## Maintenance

- Monitor your Render logs for any errors
- Set up MongoDB Atlas monitoring for database performance
- Consider upgrading to a paid tier for production use if you have high traffic
