const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const token = authHeader.replace('Bearer ', '').trim();

        const decoded = jwt.verify(token, "secrettoken");
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = auth;
