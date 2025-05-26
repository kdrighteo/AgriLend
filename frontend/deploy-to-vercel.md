# Deploying AgriLend Frontend to Vercel

Follow these steps to deploy your React frontend to Vercel:

## Prerequisites
- A Vercel account (sign up at https://vercel.com if you don't have one)
- Git repository for your project (your project is already in Git)

## Option 1: Deploy Using Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to https://vercel.com and log in or create an account

2. **Import Your Project**
   - Click "Add New" → "Project"
   - Connect to your Git provider (GitHub, GitLab, or Bitbucket) if not already connected
   - Select your AgriLend repository

3. **Configure Project**
   - In the configuration screen:
     - Set the framework preset to "Create React App"
     - Root Directory: `/frontend` (important to set this since your frontend is in a subdirectory)
     - Build Command: `npm run vercel-build`
     - Output Directory: `build`
   
4. **Environment Variables**
   - Add the following environment variable:
     - Name: `REACT_APP_API_URL`
     - Value: URL to your backend API (e.g., `https://your-backend-api.com/api`)
     - Note: If you're deploying the backend separately, you'll need that URL

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

## Option 2: Deploy Using Command Line

If you prefer the command line approach, follow these steps:

1. **Install Vercel CLI Locally**
   ```bash
   # Navigate to the frontend directory
   cd /Users/kdbf/Desktop/AgriLend/frontend
   
   # Install Vercel CLI locally
   npm install vercel --save-dev
   ```

2. **Initialize Vercel**
   ```bash
   # Navigate to the frontend directory
   cd /Users/kdbf/Desktop/AgriLend/frontend
   
   # Initialize Vercel project
   npx vercel
   ```
   - Follow the interactive prompts
   - Set the root directory to the current directory
   - When asked about build settings, use the following:
     - Build Command: `npm run vercel-build`
     - Output Directory: `build`

3. **Deploy to Production**
   ```bash
   # Deploy to production
   npx vercel --prod
   ```

## Configuring Your Backend

1. **Set Up Backend**
   - If your backend is not deployed yet, you'll need to deploy it separately
   - Options for your Express backend include:
     - Vercel Serverless Functions
     - Railway, Render, or Heroku
   - For MongoDB, use MongoDB Atlas

2. **CORS Configuration**
   - Make sure your backend allows requests from your Vercel frontend domain
   - Add this to your Express backend:

   ```javascript
   // In your backend/server.js or app.js
   const cors = require('cors');
   
   // Allow requests from your Vercel domain
   app.use(cors({
     origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000']
   }));
   ```

## After Deployment

1. **Verify API Connection**
   - Visit your deployed frontend
   - Check the network tab in browser dev tools to ensure API calls are working
   - If API calls are failing, verify your environment variables in the Vercel dashboard

2. **Update Environment Variables**
   - Once your backend is deployed, update the `REACT_APP_API_URL` in your Vercel project settings
   - You can do this in the Vercel dashboard under your project's Settings > Environment Variables

## Troubleshooting

- **Build Errors**: Check Vercel logs for details on any build failures
- **API Connection Issues**: Verify your REACT_APP_API_URL is correctly set
- **Routing Problems**: The `vercel.json` configuration should handle client-side routing
- **Page Not Found Errors**: If you get 404 errors on refresh, check your Vercel routing configuration
