// middleware/rateLimiter.js
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// Safe, proxy-aware IP key
const keyByIp = (req) => {
  return ipKeyGenerator(
    req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.connection?.remoteAddress ||
      "unknown"
  );
};

// Tighter on register: few attempts per 15 min
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  keyGenerator: keyByIp,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many registration attempts. Please try again later.",
    });
  },
});

// Login limiter: per-IP + email, and don't punish successful logins
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    return `${keyByIp(req)}:${email}`;
  },
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Please try again later.",
    });
  },
});

module.exports = { registerLimiter, loginLimiter };
