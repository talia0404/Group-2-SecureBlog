/* mounting everything
Resource-grouped routes make scanning & testing dead simple.
*/
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const configureSecurity = require("./security/helmet");
const { registerLimiter, loginLimiter } = require("./middleware/rateLimiter"); // ⬅ add
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
const app = express();

// 🔑 real client IPs when behind a proxy/load balancer (Render/Heroku/Nginx)
app.set("trust proxy", 1);

configureSecurity(app);
app.use(cors({
  origin: ["http://localhost:5173", "https://localhost:5173"], // match your FE
  credentials: true
}));
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

// 👇 apply limiters only where abuse happens
// (If you already added them inside authRoutes, skip these lines.)
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register-user", registerLimiter);
app.use("/api/auth/register-admin", registerLimiter);

// mount routers
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes); // ensure router uses { mergeParams: true }


// DEV: robust route inspector (handles nested routers + mounts)
app.get("/__routes", (req, res) => {
  const results = [];

  const toPaths = (p) => Array.isArray(p) ? p : [p];

  const walk = (stack, prefix = "") => {
    if (!Array.isArray(stack)) return;

    for (const layer of stack) {
      // Direct route (e.g., app.METHOD('/x', ...))
      if (layer.route) {
        const routePaths = toPaths(layer.route.path);
        const methods = Object.keys(layer.route.methods || {}).map(m => m.toUpperCase());
        routePaths.forEach((p) => results.push({ methods, path: prefix + p }));
        continue;
      }

      // Mounted router
      const child = layer.handle;
      if (child && Array.isArray(child.stack)) {
        // Figure out the mount path for this router
        // Prefer layer.path (Express 5), else parse regexp (Express 4)
        let mount = "";
        if (typeof layer.path === "string") {
          mount = layer.path; // Express 5
        } else if (layer.regexp && layer.regexp.source) {
          // Extract "/mount" from /^\/mount\/?(?=\/|$)/i
          const m = layer.regexp.source.match(/^\\\/(.*?)\\\/\?\(\?=\\\/\|\$\)$/);
          if (m && m[1]) mount = "/" + m[1].replace(/\\\//g, "/");
        }

        walk(child.stack, prefix + (mount || ""));
      }
    }
  };

  try {
    walk(app._router?.stack || [], "");
    results.sort((a, b) => a.path.localeCompare(b.path));
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: "introspection failed", message: e.message });
  }
});



module.exports = app;
