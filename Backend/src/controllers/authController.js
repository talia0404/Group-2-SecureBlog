// Import the jsonwebtoken package to create and verify JWT tokens
const jwt = require("jsonwebtoken");

// Import the User model to interact with the users collection in MongoDB
const User = require("../models/User");

// Helper function to generate a JWT token using the user's ID and role
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },   // Payload: include both ID and role
    process.env.JWT_SECRET,              // Secret key from .env file (must be kept private)
    { expiresIn: "1h" }                  // Token expires in 1 hour
  );

// Controller: Handles user registration
exports.register = async (req, res) => {
  const { email, password, role } = req.body;  // also allow role (default will be "reader")

  try {
    // Check if the email already exists in the database
    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Create a new user (password gets hashed via the pre-save hook in User.js)
    // Role will default to "reader" if none is passed
    const user = await User.create({ email, password, role });

    // Generate a JWT token for the new user (with role)
    const token = generateToken(user);

    // Send back the token and role info to the client
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Controller: Handles user login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalise email and find user
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    // If user not found or password mismatch, fail login
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If login is successful, generate a JWT token (with role)
    const token = generateToken(user);

    // Send token and user info back
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin-only route to create users of any role
exports.adminCreateUser = async (req, res) => {
  try {
    // Only admins can use this (protect + requireRole middleware needed)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { email, password, role } = req.body;

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ email, password, role });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
