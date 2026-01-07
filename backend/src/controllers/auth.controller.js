const jwt = require("jsonwebtoken");
const ENV = require("../config/env");
const User = require("../models/User");
const redis = require("../config/redis");
const asyncHandler = require("express-async-handler");
const { storeAccessToken, setCookies, generateToken } = require("../utils/generateToken");
const { sendWelcomeEmail } = require("../emails/email.handler");
const cloudinary = require("../config/cloudinary");

exports.signup = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ email });
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Error Checks
    if (existing) return res.status(400).json({ message: "Email already exists" });
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });

    const user = await User.create({ fullName, email, password });

    // Setting cookies
    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);
    await storeAccessToken(user._id, refreshToken);

    // Response
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ message: "Account created successfully!", user: userObj });

    try {
        await sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL);
    } catch (error) {
        console.log("Failed to send welcome email");
    }
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Error checks // Never let them know which is wrong
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Setting Cookies
    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);
    await storeAccessToken(user._id, refreshToken);

    // Response
    // user.password = undefined;
    res.status(200).json({ message: "Logged in successfully!", user });
});

exports.logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    // Cookie Check
    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN);
        await redis.del(`refresh-token:${decoded.userId}`);
    }

    // Clearing cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Response
    res.status(200).json({ message: "Logged out successfully!" });
});

exports.refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    // Error check
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    // Create new token
    const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN);
    const storedToken = await redis.get(`refresh-token:${decoded.userId}`);

    // Check for valid token
    if (refreshToken !== storedToken) return res.status(401).json({ message: "Invalid refresh token" });
    const accessToken = jwt.sign({ userId: decoded.userId }, ENV.ACCESS_TOKEN, { expiresIn: "15m" });

    // Setting refreshed cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevents XSS attacks
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax", // prevents CSRF attack
        maxAge: 15 * 60 * 1000,
        path: "/",
    });

    // Response
    res.json({ message: "Token refreshed successfully!" });
});

exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    // Error check
    if (!user) return res.status(404).json({ message: "User not found" });
    // Response
    res.status(200).json(user);
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const { profilePic } = req.body;

    // Error check
    if (!profilePic) return res.status(400).json({ message: "Profile picture is required" });

    // Get user id and upload profile pic to cloudinary
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Update data base
    const updated = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
    ).select("-password");

    // Response
    res.status(200).json(updated);
});

/*
REVIEW AND EXPLANATION:
Line 1-8: Imports dependencies: JWT for tokens, env config, User model, Redis for caching, async handler, token utils, email handler, and Cloudinary.

Line 10: signup controller.
Line 11: Destructures body data (fullName, email, password).
Line 12: Checks if user already exists in DB.
Line 13: Regex for email validation.
Line 16-17: Returns error if email exists or format is invalid.
Line 19: Creates new user in DB.
Line 22-24: Generates access/refresh tokens, sets them in cookies, and stores refresh token in Redis.
Line 27-28: Prepares response user object (converts to object and deletes password).
Line 29: Sends success response with user data.
Line 31-35: Asynchronously sends welcome email (wrapped in try-catch to not block response).

Line 38: login controller.
Line 39-40: Finds user by email.
Line 43: Checks if user exists.
Line 45-46: Checks password match using model method.
Line 49-51: Generates tokens, sets cookies, stores refresh token.
Line 55: Sends success response with user data.

Line 58: logout controller.
Line 59: Gets refresh token from cookie.
Line 62-65: If token exists, verifies it and deletes the corresponding entry from Redis.
Line 68-69: Clears access and refresh cookies.
Line 72: Sends success response.

Line 75: refreshToken controller.
Line 76: Gets refresh token from cookie.
Line 79: Checks if token exists.
Line 82-83: Verifies token signature and retrieves stored token from Redis.
Line 86: Compares provided token with stored token to ensure it hasn't been revoked/rotated.
Line 87: Generates new access token.
Line 90-96: Sets new access token cookie with security flags.
Line 99: Sends success response.

Line 102: getProfile controller.
Line 103: Finds user by ID (from req.user set by middleware).
Line 105: Checks if user found.
Line 107: Returns user data.

Line 110: updateProfile controller.
Line 111: Gets profilePic (base64) from body.
Line 114: Validation check.
Line 117-118: Uploads image to Cloudinary.
Line 121-125: Updates user's profilePic field in the database and returns the updated document.
Line 128: Returns updated user data.
*/
