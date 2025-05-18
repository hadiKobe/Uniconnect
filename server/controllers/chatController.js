const Chat = require("../models/chats");
const { query } = require("@/lib/db");

async function getOrCreateChat(userA, userB) {
  let chat = await Chat.findOne({ participants: { $all: [userA, userB] } });

  if (!chat) {
    chat = await Chat.create({ participants: [userA, userB] });
  }

  // Enrich participant info (excluding the current user, assumed to be userA)
  const otherUserId = chat.participants.find((id) => id !== userA);
  const sql = `SELECT id, first_name, last_name, profile_picture FROM users WHERE id = ?`;
  const [user] = await query(sql, [otherUserId]);

  return {
    _id: chat._id,
    participants: user
      ? [{
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_picture: user.profile_picture,
        }]
      : [],
    lastMessage: chat.lastMessage || "",
    lastUpdated: chat.lastUpdated,
  };
}


async function getUserChats(userId) {
  // Step 1: Get chats where user is a participant
  const chats = await Chat.find({ participants: userId }).sort({ lastUpdated: -1 });

  // Step 2: Extract other participants (excluding current user)
  const participantIds = new Set();
  chats.forEach((chat) => {
    chat.participants.forEach((id) => {
      if (id !== userId) participantIds.add(id);
    });
  });

 const participantIdsArray = [...participantIds].map(Number);


  if (participantIdsArray.length === 0) {
    // No participants, return chats without enrichment
    return chats.map((chat) => ({
      ...chat.toObject(),
      participants: [],
    }));
  }



const placeholders = participantIdsArray.map(() => '?').join(', ');
const sql = `SELECT id, first_name, last_name, profile_picture FROM users WHERE id IN (${placeholders})`;
const users = await query(sql, participantIdsArray);


  const userMap = {};
  users.forEach((user) => {
    userMap[user.id] = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture: user.profile_picture,
    };
  });

  // Step 4: Enrich chats with participant details
  const enrichedChats = chats.map((chat) => ({
    ...chat.toObject(),
  participants: chat.participants
  .filter((id) => Number(id) !== Number(userId))
  .map((id) => userMap[id] || { id, first_name: "Unknown", last_name: "", profile_picture: "" }),

  }));

  return enrichedChats;
}

module.exports = { getOrCreateChat, getUserChats };
