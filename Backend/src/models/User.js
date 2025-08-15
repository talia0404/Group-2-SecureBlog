// Import mongoose to define the schema and interact with MongoDB
const mongoose = require("mongoose");

// Import bcrypt to hash and compare passwords securely
const bcrypt = require("bcryptjs");

// Define the schema for User documents in MongoDB
const userSchema = new mongoose.Schema({
  email: { 
    type: String,       // Field type: String
    unique: true,       // No two users can have the same email
    required: true      // Must be provided
  },
  password: { 
    type: String,       // Field type: String
    required: true      // Must be provided
  }
});

// runs before a user is saved to the databasr
userSchema.pre("save", async function (next) {
  // If the password wasn't changed, skip hashing
  if (!this.isModified("password")) return next();

  // generate a salt with 10 rounds - more rounds = more secure but slower
  // what's a salt?
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt and store the hashed value
  this.password = await bcrypt.hash(this.password, salt);

  // Continue with the save operation
  next();
});

// compares a plain password with the hashed password in DB
userSchema.methods.comparePassword = function (candidatePassword) {
  // Returns true or false based on whether passwords match
  return bcrypt.compare(candidatePassword, this.password);
};

// Export the model so it can be used elsewhere in the app
// This creates a 'users' collection in MongoDB
module.exports = mongoose.model("User", userSchema);