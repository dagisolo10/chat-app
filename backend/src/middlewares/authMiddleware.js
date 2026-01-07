const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ENV = require("../config/env");

exports.protect = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(401).json({ message: "No access token token provided" });

    try {
        const decoded = jwt.verify(accessToken, ENV.ACCESS_TOKEN);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.adminOnly = async (req, res, next) => {
    const user = req.user;
    if (user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized. Only Admin allowed" });
    }
    next();
};
