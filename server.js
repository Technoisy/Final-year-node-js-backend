const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const questionRoutes = require("./routes/questionFormRoute");
const authenticationRoute = require("./routes/AuthenticationRoute");
const correctAnswerRoute = require("./routes/correct_answer") 
const profilePicRoute = require("./routes/Profile/ProfilePicRoute")
const isAuth = require("./middlewares/auth")

// Initialize app
const app = express();

// Middleware
app.use(isAuth);
app.use(express.json()); // Parse JSON
app.use(
    cors({
      origin: ["http://localhost:3000","https://final-year-frontend-2c5g-fzy55lkwr-faisal-irfan-s-projects.vercel.app"], // Allowed frontend URL
      credentials: true, // If sending cookies/auth headers
    })
  );
app.use('/images', express.static('middlewares/uploads/images'));

// Connect to database
connectDB();



// Routes
app.use("/api/questions", questionRoutes); // Question endpoints
app.use("/api/users", authenticationRoute); // Registration endpoints
app.use("/api/correct_answer", correctAnswerRoute)
app.use("/profile", profilePicRoute)

// Server
const PORT = 5000; // Define port directly
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
