const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require('path');

// Import Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const loanRoutes = require("./routes/loanRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://agrilend-frontend.vercel.app', 'https://www.agrilend.com']
    : 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// Import the super admin seeder
const seedSuperAdmin = require("./seeders/superAdminSeeder");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Seed the super admin user
    seedSuperAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MERN application" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the React app (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
