const { Redis } = require("@upstash/redis");
const ENV = require("./env");

const redis = new Redis({
    url: ENV.UPSTASH_REDIS_REST_URL,
    token: ENV.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = redis;
