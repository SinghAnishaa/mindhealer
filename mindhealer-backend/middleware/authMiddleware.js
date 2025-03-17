const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("🔹 Incoming Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("❌ No valid token provided.");
        return res.status(401).json({ error: "Access denied. No valid token provided." });
    }

    try {
        const token = authHeader.split(" ")[1];
        console.log("🔍 Extracted Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔍 Decoded Token Data:", decoded);

        if (!decoded.id) {
            console.error("❌ Invalid token: userId missing");
            return res.status(401).json({ error: "Invalid token: userId is missing" });
        }

        req.user = { _id: decoded.id };
        next();

    } catch (error) {
        console.error("❌ Access Token Error:", error.message);

        if (error.name === "TokenExpiredError") {
            console.warn("⚠️ Token expired.");
            return res.status(401).json({ error: "Token expired" });
        }

        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
