// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// 1) Define functions
const protect = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized: missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized: invalid/expired token' });
  }
};

// Ownership check for resources with { author } and optional { status }
const requireOwnership = (Model) => async (req, res, next) => {
  try {
    const _id = req.params.id || req.params.postId;
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const doc = await Model.findById(_id).select('author status');
    if (!doc) return res.status(404).json({ message: 'Not found' });

    const isOwner = String(doc.author) === String(req.user.id);
    if (!isOwner) return res.status(403).json({ message: 'Forbidden: not owner' });

    req.resource = doc; // pass it forward
    next();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// 2) Export once, consistently
module.exports = { protect, requireOwnership };
