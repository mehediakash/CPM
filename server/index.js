const express = require('express');
const dbconfig = require("./dbConfig/config.js");
require('dotenv').config();
const http = require("http");
const socketIo = require("socket.io");
const router = require("./routes");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

dbconfig();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🚀 New client connected");

  socket.on("joinParcelRoom", (parcelId) => {
    console.log(`📦 Joined room: ${parcelId}`);
    socket.join(parcelId);
  });

  socket.on("leaveParcelRoom", (parcelId) => {
    console.log(`🚪 Left room: ${parcelId}`);
    socket.leave(parcelId);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

app.use(router);

// IMPORTANT: Start the HTTP server with Socket.IO attached
server.listen(8000, () => {
  console.log("Server running on port 8000");
});
