const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const ENV = require("../config/env");

exports.generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, ENV.ACCESS_TOKEN, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, ENV.REFRESH_TOKEN, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};
exports.setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevents XSS attacks
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax", // prevents CSRF attack
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevents XSS attacks
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax", // prevents CSRF attack
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.storeAccessToken = async (userId, refreshToken) => {
    await redis.set(`refresh-token:${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 });
};
