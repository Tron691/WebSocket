const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = 3000;

// Enable CORS
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // this means allow to connect from any origin
    methods: ["GET", "POST"],
  },
});

// connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Send a message to a room
  socket.on("send_message", (data) => {
    const { roomId, message, senderId } = data;

    // Send message to everyone in the room except sender
    socket.to(roomId).emit("receive_message", {
      message,
      senderId,
      roomId,
    });

    console.log(`Message from ${senderId} to room ${roomId}: ${message}`);
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
