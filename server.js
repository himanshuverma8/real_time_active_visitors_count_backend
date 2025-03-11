import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors()); 

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://links.hvin.tech/", 
        methods: ["GET", "POST"]
    }
});

const activeUsers = new Set();

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    activeUsers.add(socket.id);
    io.emit("update_count", activeUsers.size);

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        activeUsers.delete(socket.id);
        io.emit("update_count", activeUsers.size);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`✅ WebSocket Server running on http://localhost:${PORT}`);
});
