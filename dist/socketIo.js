"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const initializeSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
        },
        // reconnection: true,
        // reconnectionAttempts: 3, // Number of reconnection attempts
        // reconnectionDelay: 1000, // Delay in milliseconds between reconnection attempts
    });
    io.on("connection", (socket) => {
        console.log("connected", socket === null || socket === void 0 ? void 0 : socket.id);
        socket.on("message", (message) => {
            console.log(message);
        });
        socket.on("disconnect", () => {
            console.log(`ID: ${socket.id} disconnected`);
        });
        // Additional Socket.IO event handlers can be added here
    });
    return io;
};
exports.default = initializeSocketIO;
