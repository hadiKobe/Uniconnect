// server/models/Message.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    fromUserId: { type: String, required: true },
    toUserId: { type: String, required: true },
    message: { type: String }, // Can be empty if it's a media-only message
    media: [
      {
        url: { type: String, required: true }, // Link to media (Supabase, AWS S3, or local)
        type: { type: String, enum: ["image", "video", "audio", "file"], required: true } // Helps frontend display accordingly
      }
    ],
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Message || mongoose.model("Message", MessageSchema);

