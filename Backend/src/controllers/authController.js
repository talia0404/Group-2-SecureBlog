// Import the jsonwebtoken package to create and verify JWT tokens
const jwt = require("jsonwebtoken");

// Import the User model to interact with the users collection in MongoDB
const User = require("../models/User");

// Helper function to generate a JWT token using the user's ID
const generateToken = (userId) =>
  jwt.sign(
    { id: userId },                  // Payload: we include the user ID
    process.env.JWT_SECRET,         // Secret key from .env file (must be kept private)
    { expiresIn: "1h" }             // Token expires in 1 hour
  );

// Controller: handles user registratiom
exports.register = async (req, res) => {
  const { email, password } = req.body;  // Get email and password from request body
  try {
    // Check if the email already exists in the database
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Create a new user (password gets hashed via the pre-save hook in User.js)
    const user = await User.create({ email, password });

    // Generate a JWT token for the new user
    const token = generateToken(user._id);

    // Send back the token to the client
    res.status(201).json({ token });
  } catch (err) {
    // Catch unexpected errors and return a generic server error response
    res.status(500).json({ error: "Server error" });
  }
};

// Controller: Handles user login
exports.login = async (req, res) => {
  const { email, password } = req.body;  // Get login credentials from the request
  try {
    // Look for a user with the given email
    const user = await User.findOne({ email });

    // If user not found or password is incorrect, return error
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If login is successful, generate a JWT token
    const token = generateToken(user._id);

    // Send the token back to the client
    res.json({ token });
  } catch (err) {
    // Catch unexpected errors and return a generic server error response
    res.status(500).json({ error: "Server error" });
  }
};