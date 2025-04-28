import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendIds } = await request.json(); // ✅ Read array of friend IDs

    if (!Array.isArray(friendIds) || friendIds.length === 0) {
      return Response.json({ error: "No friend IDs provided." }, { status: 400 });
    }

    const userId = session.user.id;

    // Query for confirmed friends
    const friendsQuery = `
      SELECT 
        CASE 
          WHEN user_id = ? THEN friend_id
          WHEN friend_id = ? THEN user_id
        END AS friend_id
      FROM connections
      WHERE (user_id = ? AND friend_id IN (${friendIds.map(() => '?').join(',')}))
         OR (friend_id = ? AND user_id IN (${friendIds.map(() => '?').join(',')}))
    `;

    const friendsParams = [
      userId, userId,
      userId, ...friendIds,
      userId, ...friendIds
    ];

    const friendsResult = await query(friendsQuery, friendsParams);

    // Query for pending friend requests
    const pendingQuery = `
      SELECT 
        CASE 
          WHEN sender_id = ? THEN receiver_id
          WHEN receiver_id = ? THEN sender_id
        END AS friend_id
      FROM friend_requests
      WHERE (sender_id = ? AND receiver_id IN (${friendIds.map(() => '?').join(',')}))
         OR (receiver_id = ? AND sender_id IN (${friendIds.map(() => '?').join(',')}))
    `;

    const pendingParams = [
      userId, userId,
      userId, ...friendIds,
      userId, ...friendIds
    ];

    const pendingResult = await query(pendingQuery, pendingParams);

    // Build combined statuses
    const statuses = {};
    friendIds.forEach(id => {
      statuses[id] = {
        isFriend: false,
        pendingRequest: false,
      };
    });

    friendsResult.forEach(row => {
      statuses[row.friend_id].isFriend = true;
    });

    pendingResult.forEach(row => {
      statuses[row.friend_id].pendingRequest = true;
    });

    return Response.json({ statuses });

  } catch (error) {
    console.error("Error checking bulk friends:", error);
    return Response.json({ error: "Failed to check friends." }, { status: 500 });
  }
}
