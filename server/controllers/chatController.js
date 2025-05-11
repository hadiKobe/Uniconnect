const Chat = require("../models/chats");

async function getOrCreateChat(userA, userB) {
  let chat = await Chat.findOne({ participants: { $all: [userA, userB] } });

  if (!chat) {
    chat = await Chat.create({ participants: [userA, userB] });
  }

  return chat;
}

async function getUserChats(userId) {
  const chats = await Chat.find({ participants: userId }).sort({ lastUpdated: -1 }); // Most recent chats first
  return chats;
}

module.exports = { getOrCreateChat, getUserChats };
