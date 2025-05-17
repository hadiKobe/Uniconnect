// server/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    message: { type: String },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video", "audio", "file"], required: true },
      },
    ],
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },

    // ✅ TEMP ID for optimistic UI tracking
    tempId: { type: String, default: null, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Message || mongoose.model("Message", MessageSchema);
