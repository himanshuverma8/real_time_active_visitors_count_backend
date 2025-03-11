# Real-Time Active Users Tracker with WebSockets  

This project is a **WebSocket-based active user tracking system** built with **Node.js, Express, and Socket.io**. It efficiently tracks active users based on their **IP addresses**, ensuring that multiple connections from the same IP (across different devices) are properly handled.  

## Features  
- ✅ Real-time active user count updates  
- ✅ Handles multiple devices with the same IP correctly  
- ✅ Uses Socket.io for WebSocket communication  
- ✅ CORS support for cross-origin requests  

## How It Works  
- When a user connects, their **IP address** is recorded, and the active user count is updated.  
- If the same user opens the website on another device, the connection count increases instead of treating it as a new user.  
- When a user disconnects, their IP is only removed when **all connections from that IP are closed**.  

## Installation & Usage  
1. Clone the repository:  
   ```sh
   git clone https://github.com/your-username/repository-name.git
   cd repository-name
