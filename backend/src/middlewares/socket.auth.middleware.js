const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ENV = require("../config/env");
const cookie = require("cookie");

exports.socketAuthMiddleware = async (socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie;
        if (!cookies) return next(new Error("No cookies found"));
        console.log("🛰️ Incoming socket handshake:", socket.handshake.headers.origin);


        const { accessToken } = cookie.parse(cookies);
        if (!accessToken) {
            return next(new Error("Socket connection rejected. No access token token provided"));
        }

        const decoded = jwt.verify(accessToken, ENV.ACCESS_TOKEN);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return next(new Error("Socket connection rejected. User not found"));

        // 4️⃣ Attach user to socket
        socket.user = user;

        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
        next();
    } catch (error) {
        console.error("Socket Auth Error:", error.message);
        next(new Error("Invalid or expired token"));
    }
};
