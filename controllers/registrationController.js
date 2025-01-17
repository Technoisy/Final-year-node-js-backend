const User = require("../models/Users");

const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password, // This will be hashed by the pre-save hook in the User model
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser };
