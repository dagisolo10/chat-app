const { login, logout, signup, getProfile, refreshToken, updateProfile } = require("../controllers/auth.controller");
const { arcjetProtection } = require("../middlewares/arcjet.middleware");
const { protect } = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router.use(arcjetProtection);

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

router.post("/refresh-token", refreshToken);
router.get("/get-profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);

module.exports = router;
