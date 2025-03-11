import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "https://links.hvin.tech/",
    },
});

const activeUsers = new Set();

io.on("connection", (socket) => {
    const userIP = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;

    if (!activeUsers.has(userIP)) {
        activeUsers.add(userIP);
        io.emit("new-user", userIP);
    }

    io.emit("active-users", activeUsers.size);

    socket.on("disconnect", () => {
        activeUsers.delete(userIP); 
        io.emit("active-users", activeUsers.size);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`✅ WebSocket Server running on http://localhost:${PORT}`);
});
