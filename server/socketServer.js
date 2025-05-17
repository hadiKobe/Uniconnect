const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectToDB = require("./db");
const { saveMessage,markMessagesAsRead } = require("./controllers/messageController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const sessions = {}; // userId => socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", ({ userId }) => {
    sessions[userId] = socket.id;
    console.log(`User ${userId} logged in with socket ${socket.id}`);
  });
  
socket.on("markMessagesAsRead", async ({ chatId, userId }) => {
  try {
    const affectedSenders = await markMessagesAsRead({ chatId, userId });

    affectedSenders.forEach((senderId) => {
      const targetSocketId = sessions[senderId];
      if (targetSocketId) {
        io.to(targetSocketId).emit("messagesMarkedAsRead", { chatId });
      }
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    socket.emit("errorMessage", { error: "Failed to mark messages as read." });
  }
});



socket.on("sendPrivateMessage", ({ toUserId, fromUserId, message, media = [], chatId }) => {
  // ✅ Generate a tempId for optimistic tracking
  const tempId = `${fromUserId}-${Date.now()}`;

  const newMessage = {
    fromUserId,
    toUserId,
    message,
    media,
    chatId,
    timestamp: new Date().toISOString(),
    isRead: false,
    tempId, // ✅ Just assign the generated value here
  };

  const targetSocketId = sessions[toUserId];

  // ✅ Send to recipient if online
  if (targetSocketId) {
    io.to(targetSocketId).emit("newMessageNotification", {
      fromUserId,
      message,
      chatId,
    });

    io.to(targetSocketId).emit("receivePrivateMessage", newMessage);
  }

  // ✅ Acknowledge to sender immediately (optimistic UI)
  socket.emit("messageSent", newMessage);

  
  saveMessage({ toUserId, fromUserId, message, media, chatId, tempId })
    .then((savedMessage) => {
      // Optional: Let sender replace optimistic message with real saved one
      socket.emit("messageSaved", { ...savedMessage.toObject(), tempId });
    })
    .catch((error) => {
      console.error("Failed to save message:", error);
      socket.emit("errorMessage", { error: "Message delivery failed to save in DB." });
    });
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

connectToDB().then(() => {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
