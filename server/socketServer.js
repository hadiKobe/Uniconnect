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
  // Generate a temporary client-side ID to track the message before it is saved
  const tempId = `${fromUserId}-${Date.now()}`;

  // Construct the message object to be sent and/or saved
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

  // Find the recipient's socket ID if they are currently connected
  const targetSocketId = sessions[toUserId];

  // If the recipient is online, emit message events to their socket
  if (targetSocketId) {
    // Notify the recipient about a new message (for alerts or UI indicators)
    io.to(targetSocketId).emit("newMessageNotification", {
      fromUserId,
      message,
      chatId,
    });

    // Deliver the actual message to the recipient in real time
    io.to(targetSocketId).emit("receivePrivateMessage", newMessage);
  }

  // Echo the message back to the sender to update their UI instantly
  socket.emit("messageSent", newMessage);

  // Save the message in the database
  saveMessage({ toUserId, fromUserId, message, media, chatId, tempId })
    .then((savedMessage) => {
      // Acknowledge the save operation with the finalized DB message
      socket.emit("messageSaved", { ...savedMessage.toObject(), tempId });
    })
    .catch((error) => {
      // Send an error message to the sender if saving fails
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
