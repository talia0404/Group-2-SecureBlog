const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// email: unique login identifier (not username) -> enforce uniqueness
// password: NEVER store plain text; will be hashed pre-save
// role: limits what a user can do; enforce enum so only valid roles are stored

const ROLE_VALUES = ['admin', 'editor', 'author', 'reader'];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,          // enforces one account per email at DB level
      lowercase: true,       // emails are case-insensitive in practice
      trim: true,
      // optional extra validation for safety:
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      index: true,           // faster lookups on login (findOne by email)
    },
    password: {
      type: String,
      required: true,
      minlength: 8,          // basic password strength baseline
      // we store the HASH here, not the plain password
    },
    role: {
      type: String,
      enum: ROLE_VALUES,     // prevent invalid roles
      default: 'reader',     // least privilege by default
      index: true,
    },
  },
  { timestamps: true }
);

// storing the password in json
// when sending user objects to clients, do NOT leak the hash
userSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.password;
    return ret;
  },
});

// hash password before saving 
// even if DB is breached, hashes + salt protect users
// hash only when password is created/changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // no re-hash if unchanged
  const saltRounds = 12; // WHY: good balance security/speed for servers
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare candidate password at login
// we need a safe way to verify user-provided password vs stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
