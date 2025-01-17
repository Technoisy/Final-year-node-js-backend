const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const questionRoutes = require("./routes/questionFormRoute");
const authenticationRoute = require("./routes/AuthenticationRoute");
const correctAnswerRoute = require("./routes/correct_answer") 
const isAuth = require("./middlewares/auth")

// Initialize app
const app = express();

// Middleware
app.use(isAuth);
app.use(express.json()); // Parse JSON
app.use(cors()); // Handle CORS
app.use('/images', express.static('uploads/images'));

// Connect to database
connectDB();



// Routes
app.use("/api/questions", questionRoutes); // Question endpoints
app.use("/api/users", authenticationRoute); // Registration endpoints
app.use("/api/correct_answer", correctAnswerRoute)

// Server
const PORT = 5000; // Define port directly
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
