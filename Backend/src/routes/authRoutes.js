// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");

// Map controller exports to the names used in routes
const {
  register: registerUser,
  adminCreateUser: registerAdmin,
  login
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { requireRole, ROLES } = require("../middleware/roles");

// --- Validators ---
const emailValidator = body("email")
  .isEmail().withMessage("Valid email required")
  .normalizeEmail();

const passwordValidator = body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 chars")
  .trim();

// Centralized validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// 🔍 Debug helper: remove after everything’s green
const assertFn = (fn, name) => {
  if (typeof fn !== "function") throw new TypeError(`${name} is ${typeof fn}`);
  return fn;
};

// --- Routes ---

// Public: register a normal user
router.post(
  "/register-user",
  assertFn(registerLimiter, "registerLimiter"),
  assertFn(emailValidator, "emailValidator"),
  assertFn(passwordValidator, "passwordValidator"),
  assertFn(handleValidation, "handleValidation"),
  assertFn(registerUser, "registerUser") // maps to controllers.register
);

// Admin-only: create another user (any role, typically admin)
router.post(
  "/register-admin",
  assertFn(protect, "protect"),
  assertFn(requireRole(ROLES.ADMIN), 'requireRole(ROLES.ADMIN)'),
  assertFn(registerLimiter, "registerLimiter"),
  assertFn(emailValidator, "emailValidator"),
  assertFn(passwordValidator, "passwordValidator"),
  assertFn(handleValidation, "handleValidation"),
  assertFn(registerAdmin, "registerAdmin") // maps to controllers.adminCreateUser
);

// Public: login
router.post(
  "/login",
  assertFn(loginLimiter, "loginLimiter"),
  assertFn(emailValidator, "emailValidator"),
  assertFn(body("password").notEmpty().withMessage("Password required").trim(), 'passwordNotEmpty'),
  assertFn(handleValidation, "handleValidation"),
  assertFn(login, "login")
);

// Quick sanity route
router.get(
  "/whoami",
  assertFn(protect, "protect"),
  (req, res) => res.json({ id: req.user.id, role: req.user.role, at: new Date() })
);



console.log("[authRoutes] stack size:", Array.isArray(router.stack) ? router.stack.length : "no stack");
router.stack
  ?.filter(l => l.route)
  ?.forEach(l => console.log("[authRoutes] route:", Object.keys(l.route.methods), l.route.path));

module.exports = router;