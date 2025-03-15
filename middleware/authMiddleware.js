const jwt = require("jsonwebtoken");
require('dotenv').config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt; 

    if (!token) {
        console.log("❌ No token found. Redirecting to login.");
        return res.status(401).json({ error: "Session expired. Please log in again." });
    } 

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("❌ Token verification failed:", err.message);
            return res.status(401).json({ error: "Session expired. Please log in again." });
        }
        req.user = decoded;
        next();
    });
};

module.exports = { requireAuth };
