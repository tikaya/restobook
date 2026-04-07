const jwt = require('jsonwebtoken');

// Vérifier que le token est valide
const verifyToken = (req, res, next) => {
    // ✅ Header d'abord, puis cookie comme fallback
    const header = req.headers.authorization;
    const tokenFromHeader = header && header.startsWith('Bearer ')
        ? header.split(' ')[1]
        : null;
    const tokenFromCookie = req.cookies?.token;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
};

// Vérifier le rôle
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès interdit — rôle insuffisant' });
        }
        next();
    };
};

module.exports = { verifyToken, requireRole };