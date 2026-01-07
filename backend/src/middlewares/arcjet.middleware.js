const aj = require("../config/arcjet");
const { isSpoofedBot } = require("@arcjet/inspect");
const asyncHandler = require("express-async-handler");

exports.arcjetProtection = asyncHandler(async (req, res, next) => {
    const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket

    if (decision.isDenied()) {
        // Rate limit
        if (decision.reason.isRateLimit()) res.status(429).json({ error: "Rate limit exceeded. Try again later" });
        // Bot
        else if (decision.reason.isBot()) res.status(403).json({ error: "No bots allowed" });
        // General
        else res.status(403).json({ error: "Forbidden" });
    }
    //
    else if (decision.results.some(isSpoofedBot)) res.status(403).json({ error: "Forbidden" });
    // Passed all checks, go to next function
    else next();
});
