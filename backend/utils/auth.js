const jwt = require('jsonwebtoken');

function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
  } catch (_err) {
    // ignore token errors for optional auth
  }
  return next();
}

function requiredAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const secret = process.env.JWT_SECRET || 'dev_secret';
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function requireAdmin(req, res, next) {
  return requiredAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
}

module.exports = { optionalAuth, requiredAuth, requireAdmin };
