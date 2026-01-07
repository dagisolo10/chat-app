const ENV = require("./env");
const { shield, detectBot, slidingWindow, default: arcjet } = require("@arcjet/node");

const aj = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
        shield({ mode: "LIVE" }),

        // Bot detection
        // detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),

        // Rate limit
        slidingWindow({ mode: "LIVE", max: 400, interval: 60 }),
    ],
});

module.exports = aj;
