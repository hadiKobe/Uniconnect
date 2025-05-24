const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectToDB = require("./db");
const { saveMessage, markMessagesAsRead } = require("./controllers/messageController");

const app = express();
const server = http.createServer(app);

// Set up Socket.IO server with CORS enabled for all origins
const io = new Server(server, { cors: { origin: "*" } });

// Store active user sessions in memory (userId => socketId)
const sessions = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User logs in — store their socket session
  socket.on("login", ({ userId }) => {
    sessions[userId] = socket.id;
    console.log(`User ${userId} logged in with socket ${socket.id}`);
  });

  // Handle marking messages as read
  socket.on("markMessagesAsRead", async ({ chatId, userId }) => {
    try {
      const affectedSenders = await markMessagesAsRead({ chatId, userId });

      // Notify senders their messages were read
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

  // Handle sending a private message
  socket.on("sendPrivateMessage", ({ toUserId, fromUserId, message, media = [], chatId }) => {
    const tempId = `${fromUserId}-${Date.now()}`; // Temporary ID for optimistic UI

    const newMessage = {
      fromUserId,
      toUserId,
      message,
      media,
      chatId,
      timestamp: new Date().toISOString(),
      isRead: false,
      tempId,
    };

    const targetSocketId = sessions[toUserId];

    // Send message and notification to recipient if online
    if (targetSocketId) {
      io.to(targetSocketId).emit("newMessageNotification", {
        fromUserId,
        message,
        chatId,
      });

      io.to(targetSocketId).emit("receivePrivateMessage", newMessage);
    }

    // Immediately notify sender (optimistic update)
    socket.emit("messageSent", newMessage);

    // Save message in the database
    saveMessage({ toUserId, fromUserId, message, media, chatId, tempId })
      .then((savedMessage) => {
        socket.emit("messageSaved", { ...savedMessage.toObject(), tempId });
      })
      .catch((error) => {
        console.error("Failed to save message:", error);
        socket.emit("errorMessage", { error: "Message delivery failed to save in DB." });
      });
  });

  // Cleanup when user disconnects
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

// Connect to MongoDB, then start server
connectToDB().then(() => {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
