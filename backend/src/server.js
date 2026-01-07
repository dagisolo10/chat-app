const cors = require("cors");
const express = require("express");
const ENV = require("./config/env");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const errorMiddleware = require("./middlewares/error.middleware");
const { app, server } = require("./config/socket");

const PORT = ENV.PORT || 5000;

// --- Global Middleware ---
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// CORS setup
app.use(cors({ origin: [ENV.CLIENT_URL, "http://localhost:5174"], credentials: true }));

// Rate limiting (basic)
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

// --- Error Middleware ---
app.use(errorMiddleware);

// --- Connect DB & start server ---
connectDB().then(() => {
    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
