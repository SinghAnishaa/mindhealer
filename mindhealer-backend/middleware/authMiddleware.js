
// making critical chatbot fixes

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
        const authToken = authHeader.split(" ")[1]; // ✅ Fixed: Use `authToken`
        console.log("🔍 Extracted Token:", authToken);

        const decoded = jwt.verify(authToken, process.env.JWT_SECRET); // ✅ Fixed variable name
        console.log("🔍 Decoded Token Data:", decoded);

        if (!decoded.id) {
            console.error("❌ Invalid authToken: userId missing");
            return res.status(401).json({ error: "Invalid authToken: userId is missing" });
        }

        req.user = { _id: decoded.id };
        next();

    } catch (error) {
        console.error("❌ Auth Token Error:", error.message);

        if (error.name === "TokenExpiredError") {
            console.warn("⚠️ Auth Token expired.");
            return res.status(401).json({ error: "Auth Token expired" });
        }

        return res.status(401).json({ error: "Invalid or expired authToken." });
    }
};

module.exports = authMiddleware;
