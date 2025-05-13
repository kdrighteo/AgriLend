# AgriLend - Agricultural Lending Platform

A comprehensive agricultural lending platform built with the MERN (MongoDB, Express, React, Node.js) stack to connect farmers with financial institutions.

## Features

- **Role-based User System**: Farmers, Bank Admins, and Super Admins
- **Farmer Features**:
  - Profile management
  - Loan application submission
  - Application status tracking
- **Bank Admin Features**:
  - Review loan applications
  - Approve or reject loans
  - Manage farmer relationships
- **Super Admin Features**:
  - Manage bank registrations through invitations
  - View all registered banks
  - Assign loan applications to banks
  - Platform-wide oversight
- **Security**: JWT authentication and role-based access control
- **Responsive UI**: Modern interface with Tailwind CSS

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js and Express for the API server
- MongoDB for the database
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)

### Installation

1. Clone the repository

```
git clone https://github.com/kdrighteo/AgriLend.git
cd AgriLend
```

2. Install dependencies for both frontend and backend

```
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development servers

```
# Start the backend server (from the backend directory)
npm run dev

# In another terminal, start the frontend server (from the frontend directory)
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

- Backend: Deploy to Render or similar service
- Frontend: Deploy to Vercel or similar service
- Database: Use MongoDB Atlas for cloud database

## Folder Structure

```
├── backend/            # Backend Node.js server
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
│
└── frontend/           # React frontend
    ├── public/         # Static assets
    └── src/
        ├── components/ # Reusable components
        ├── contexts/   # Context providers
        ├── pages/      # Page components
        ├── services/   # API services
        └── utils/      # Utility functions
```
