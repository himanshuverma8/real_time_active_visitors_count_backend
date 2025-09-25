import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import fetch from "node-fetch";

const app = express();
const server = http.createServer(app);

app.use(cors());
// Trust AWS Elastic Load Balancer/X-Forwarded-* headers
app.set("trust proxy", true);

// Basic health checks for Elastic Beanstalk
app.get("/", async (_req, res) => {
	const imageURL = "https://cdn.hv6.dev/images/logos/lighting_thunderbolt_red.jpg?q=50";

    try{
        const response = await fetch(imageURL);
        const buffer = await response.arrayBuffer();

        res.set("Content-Type", response.headers.get("Content-Type"));
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching image");
    }
});

app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

const io = new Server(server, {
	cors: {
		origin: process.env.CORS_ORIGIN || "*",
		methods: ["GET", "POST"],
	},
});

const activeUsers = new Map();
//fix issue: when same ip user opens the website in two diffrent devices and closes in of them the active visitors count becomes 0 bit it needs to zero as the same ip user has open the website on his other device with same ip
io.on("connection", (socket) => {
    let userIP = socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;
    if (typeof userIP === "string") {
        userIP = userIP.split(",")[0].trim();
    }

    if (activeUsers.has(userIP)) {
        activeUsers.set(userIP, activeUsers.get(userIP) + 1);
    } else {
        activeUsers.set(userIP, 1);
        io.emit("new-user", userIP);
    }

    io.emit("active-users", activeUsers.size);

    socket.on("disconnect", () => {
        if (activeUsers.has(userIP)) {
            let count = activeUsers.get(userIP);
            if (count === 1) {
                activeUsers.delete(userIP);
            } else {
                activeUsers.set(userIP, count - 1);
            }
        }
        io.emit("active-users", activeUsers.size);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ WebSocket Server running on http://0.0.0.0:${PORT}`);
});
