const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectToDB = require("./db");
const { saveMessage, markMessagesAsRead } = require("./controllers/messageController");
const dotenv = require("dotenv");
const helmet = require("helmet"); // ✅ Add helmet
dotenv.config(); // Load environment variables from .env file


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(helmet());
io.use((socket, next) => {
  const token = socket.handshake.auth.token;


  if (typeof token === "object" && token?.sub) {
  //  console.log("Socket token is already decoded:", token);
    // ✅ Already decoded
    socket.user = token;
    return next();
  }

  // Optional fallback for raw JWT string
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    socket.user = decoded;
    return next();
  } catch (err) {
    return next(new Error("Unauthorized: Invalid token"));
  }
});

// 🔁 Store active socket connections
const sessions = {};

io.on("connection", (socket) => {
  const userId = socket.user.sub; // from token payload (NextAuth uses 'sub' as user ID)
  sessions[userId] = socket.id;

  //console.log(`User ${userId} connected via socket ${socket.id}`);



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
     // console.error("Error marking messages as read:", error);
      socket.emit("errorMessage", { error: "Failed to mark messages as read." });
    }
  });

  socket.on("sendPrivateMessage", ({ toUserId, fromUserId, message, media = [], chatId }) => {
    const tempId = `${fromUserId}-${Date.now()}`;

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

    if (targetSocketId) {
      io.to(targetSocketId).emit("newMessageNotification", {
        fromUserId,
        message,
        chatId,
      });

      io.to(targetSocketId).emit("receivePrivateMessage", newMessage);
    }

    socket.emit("messageSent", newMessage);

    saveMessage({ toUserId, fromUserId, message, media, chatId, tempId })
      .then((savedMessage) => {
        socket.emit("messageSaved", { ...savedMessage.toObject(), tempId });
      })
      .catch((error) => {
      //console.error("Failed to save message:", error);
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
   // console.log("User disconnected:", socket.id);
  });
});

connectToDB().then(() => {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
