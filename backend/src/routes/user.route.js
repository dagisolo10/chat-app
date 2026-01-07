const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { terminateAccount } = require("../controllers/user.controller");
const router = express.Router();

router.delete("/terminate", protect, terminateAccount);

module.exports = router;
