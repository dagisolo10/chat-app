const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const ENV = require("./env");
const { socketAuthMiddleware } = require("../middlewares/socket.auth.middleware");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});
console.log("CORS allowed client URL:", ENV.CLIENT_URL);

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};

io.use(socketAuthMiddleware);

// to store online users
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
    // socket.on is an event listener ( connect / disconnect )
    console.log("A user connected", socket.user.fullName);

    const userId = socket.user._id;
    userSocketMap[userId] = socket.id;

    // io.emit used to send event to all connected users (ping users)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
        // updated online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, server, io, getReceiverSocketId };
