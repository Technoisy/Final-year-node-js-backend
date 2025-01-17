const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const router = express.Router();

// JWT Secret Key
const JWT_SECRET = "your_jwt_secret_key";

// Registration Route
router.post("/register", async (req, res) => {
  const { username, email, password, designation } = req.body;
  console.log("Received registration request:", { username, email, designation });
  console.log(req.body);
  

  if (!username || !email || !password) {
    console.log("Registration failed: Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.log("Checking if user already exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Creating new user...");
    const newUser = new User({ username, email, password: hashedPassword, designation });
    await newUser.save();

    console.log("User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:",  req.body );

  if (!email || !password) {
    console.log("Login failed: Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.log("Checking if user exists...");
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Validating password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid credentials for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );

    console.log("Login successful for:", email);
    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
