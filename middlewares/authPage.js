const jwt = require('jsonwebtoken');

const verifyPageToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        res.clearCookie('user');
        return res.redirect('/login');
    }
};

const requirePageRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).render('403', { title: 'Accès interdit' });
        }
        next();
    };
};

module.exports = { verifyPageToken, requirePageRole };