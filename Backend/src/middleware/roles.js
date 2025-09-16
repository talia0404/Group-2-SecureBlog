/* Central, readable guards. 
*/
// Single source of truth for roles (no utils folder)
const ROLES = Object.freeze({
  ADMIN:  'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  READER: 'reader',
});

// Generic role gate: requireRole('editor','admin')
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

// Specific guards for readability at routes
exports.onlyPublishers = (req, res, next) => {
  const ok = [ROLES.ADMIN, ROLES.EDITOR].includes(req.user?.role);
  return ok ? next() : res.status(403).json({ message: 'Forbidden' });
};

exports.onlyModerators = (req, res, next) => {
  const ok = [ROLES.ADMIN, ROLES.EDITOR].includes(req.user?.role);
  return ok ? next() : res.status(403).json({ message: 'Forbidden' });
};

exports.onlyAdmins = (req, res, next) => {
  return req.user?.role === ROLES.ADMIN
    ? next()
    : res.status(403).json({ message: 'Forbidden' });
};

// Small helper used in controllers when needed
exports.isAuthorRole = (role) => role === ROLES.AUTHOR;
exports.ROLES = ROLES;
