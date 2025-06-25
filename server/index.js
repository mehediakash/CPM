const express = require('express');
const dbconfig = require("./dbConfig/config.js");
require('dotenv').config(); 
const http = require("http");

const router = require("./routes");

var cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});


dbconfig();
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("locationUpdate", (data) => {
    io.emit("locationUpdated", data); // broadcast to all
  });

  socket.on("statusUpdate", (data) => {
    io.emit("statusUpdated", data); // real-time status change
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});



app.use(router);

app.listen(9000, () => {
    console.log("Server running on port 9000");
});
