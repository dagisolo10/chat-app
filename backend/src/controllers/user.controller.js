const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.terminateAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);

    // Error Check
    if (!user) return res.status(404).json({ message: "User not found" });

    // Response
    res.status(200).json({ message: "Account terminated successfully" });
});
