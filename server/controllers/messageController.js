const Message = require("../models/messages");
const Chat = require("../models/chats");

async function saveMessage({ toUserId, fromUserId, message, media = [] }) {
  if (!toUserId || !fromUserId || !message) {
    throw new Error("Missing required fields: toUserId, fromUserId, or message.");
  }

  // Find or create the chat
  let chat = await Chat.findOne({ participants: { $all: [fromUserId, toUserId] } });

  if (!chat) {
    chat = await Chat.create({ participants: [fromUserId, toUserId] });
  }

  // Validate media (ensure correct structure if media is sent)
  const validatedMedia = media.map((item) => ({
    url: item.url,
    type: item.type,
  }));

  // Create and save the new message
  const newMessage = await Message.create({
    chatId: chat._id,
    fromUserId,
    toUserId,
    message,
    media: validatedMedia,
  });

  // Update chat metadata
  chat.lastMessage = message || (validatedMedia.length > 0 ? "Media Sent" : "");
  chat.lastUpdated = new Date();
  await chat.save();

  return newMessage;
}

async function getMessages(chatId, limit = 20, skip = 0) {
  if (!chatId) {
    throw new Error("chatId is required to fetch messages.");
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 }) // Oldest first for chat display
    .skip(skip)
    .limit(limit);

  const totalCount = await Message.countDocuments({ chatId });

  return { messages, totalCount };
}

// ✅ Proper Export for Importing in Other Files
module.exports = { saveMessage, getMessages };
