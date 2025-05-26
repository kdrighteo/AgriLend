# AgriLend Backend API

This is the backend API for the AgriLend application, a platform connecting farmers with financial institutions for agricultural loans.

## Getting Started

### Local Development

1. Clone the repository
2. Navigate to the backend folder:
   ```
   cd /path/to/AgriLend/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and fill in your MongoDB connection string and JWT secret
5. Run the development server:
   ```
   npm run dev
   ```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new farmer
- `POST /api/auth/register-admin` - Register a new admin
- `POST /api/auth/login` - Login and get authentication token
- `GET /api/auth/me` - Get current user information
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password
- `GET /api/auth/health` - Check API health status

#### Loans
- `POST /api/loans` - Submit a new loan application
- `GET /api/loans/my-loans` - Get loans for the current farmer
- `GET /api/loans/all` - Get all loans (admins only)
- `GET /api/loans/:id` - Get a specific loan by ID
- `PUT /api/loans/:id/status` - Update a loan's status
- `PUT /api/loans/:id/repaid` - Mark a loan as repaid
- `PUT /api/loans/:id/funded` - Mark a loan as funded
- `PUT /api/loans/:id/assign` - Assign a loan to a bank

#### Invitations
- `POST /api/invitations` - Create a new invitation
- `GET /api/invitations` - Get all invitations
- `DELETE /api/invitations/:id` - Delete an invitation

## Deployment

See [deploy-backend.md](./deploy-backend.md) for detailed deployment instructions.

## Environment Variables

- `PORT` - Port to run the server (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `NODE_ENV` - Environment (development, production)
- `FRONTEND_URL` - URL of the frontend application (for CORS)

## Tech Stack

- Node.js
- Express
- MongoDB/Mongoose
- JWT Authentication
