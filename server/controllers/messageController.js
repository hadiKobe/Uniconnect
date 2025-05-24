const Message = require("../models/messages");
const Chat = require("../models/chats");
const connectToDB = require("../db")


async function getUnreadCountsByChat(userId) {
  if (!userId) throw new Error("userId is required");
  await connectToDB();
  const unreadCounts = await Message.aggregate([
    {
      $match: {
        toUserId: userId,
        isRead: false,
      },
    },
    {
      $group: {
        _id: "$chatId",
        count: { $sum: 1 },
      },
    },
  ]);

  // Return as object: { chatId1: 3, chatId2: 7, ... }
  const result = {};
  unreadCounts.forEach(({ _id, count }) => {
    result[_id.toString()] = count;
  });
console.log("Unread counts by chat:", result); // Log the counts for debugging
  return result;
}




async function saveMessage({ toUserId, fromUserId, message, media = [] }) {
  if (!toUserId || !fromUserId || (!message && media.length === 0)) {
    throw new Error("Missing required fields: toUserId, fromUserId, or message/media.");
  }

  try {
    // Find or create the chat
    let chat = await Chat.findOne({ participants: { $all: [fromUserId, toUserId] } });

    if (!chat) {
      chat = await Chat.create({ participants: [fromUserId, toUserId] });
      if (!chat) throw new Error("Failed to create a new chat.");
    }

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

    if (!newMessage) throw new Error("Failed to save the message.");

    // Update chat metadata
    chat.lastMessage = message || (validatedMedia.length > 0 ? "Media Sent" : "");
    chat.lastUpdated = new Date();
    await chat.save();

    return newMessage;
  } catch (err) {
    console.error("Error in saveMessage:", err);
    throw new Error("Failed to save message: " + err.message);
  }
}

async function getMessages(chatId, limit = 20, skip = 0) {
  if (!chatId) {
    throw new Error("chatId is required to fetch messages.");
  }

  try {
   const messages = await Message.find({ chatId })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

    const totalCount = await Message.countDocuments({ chatId });

    return { messages: messages.reverse(), totalCount };
  } catch (err) {
    console.error("Error in getMessages:", err);
    throw new Error("Failed to retrieve messages: " + err.message);
  }
}

async function markMessagesAsRead({ chatId, userId }) {
  if (!chatId || !userId) {
    throw new Error("chatId and userId are required to mark messages as read.");
  }

  try {
    const result = await Message.updateMany(
      { chatId, toUserId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      console.warn("No messages were marked as read.");
    }

    const affectedSenders = await Message.find({
      chatId,
      toUserId: userId,
    }).distinct("fromUserId");

    return affectedSenders;
  } catch (err) {
    console.error("Error in markMessagesAsRead:", err);
    throw new Error("Failed to mark messages as read: " + err.message);
  }
}

module.exports = { saveMessage, getMessages, markMessagesAsRead ,getUnreadCountsByChat };
