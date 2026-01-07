const mongoose = require("mongoose");
const ENV = require("./env");

const connectDB = async () => {
    await mongoose
        .connect(ENV.MONGO_DB_URI)
        .then(() => console.log("Connected to MongoDB ✅"))
        .catch(() => console.log("Failed to connect to MongoDB ❌"));
};

module.exports = connectDB;
