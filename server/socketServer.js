const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectToDB = require("./db"); // Import DB connection function
const { saveMessage } = require("./controllers/messageController"); // Import your message saving function

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const sessions = {}; // In-memory session store

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", ({ userId }) => {
    sessions[userId] = socket.id;
    console.log(`User ${userId} logged in with socket ${socket.id}`);
  });

  socket.on("sendPrivateMessage", async ({ toUserId, message, fromUserId, media = [] }) => {
    try {
      const savedMessage = await saveMessage({ toUserId, fromUserId, message, media });
      const targetSocketId = sessions[toUserId];

      if (targetSocketId) {
        io.to(targetSocketId).emit("receivePrivateMessage", savedMessage);
      }
      socket.emit("messageSent", savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("errorMessage", { error: "Failed to send message." });
    }
  });

  socket.on("disconnect", () => {
    for (const userId in sessions) {
      if (sessions[userId] === socket.id) {
        delete sessions[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Ensure DB connection before starting the server
connectToDB().then(() => {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
