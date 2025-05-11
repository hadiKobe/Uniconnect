const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      { type: String, required: true } // Storing user IDs as strings
    ],
    lastMessage: { type: String, default: "" }, // Optional: content of the last message
    lastUpdated: { type: Date, default: Date.now } // For ordering chats by recent activity
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Prevent OverwriteModelError in development/hot reload
module.exports = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
