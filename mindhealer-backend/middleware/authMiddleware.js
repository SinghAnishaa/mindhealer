const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("🔹 Incoming Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No valid token provided.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        console.log("🔍 Extracted Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔍 Decoded Token Data:", decoded);

        if (!decoded.id) { 
            return res.status(401).json({ error: "Invalid token: userId is missing" });
        }

        req.user = { _id: decoded.id };  
        next();
    } catch (error) {
        console.error('❌ Authentication Error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
