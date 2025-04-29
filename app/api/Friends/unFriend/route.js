import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { friendId } = await request.json();

    // ✅ Step 1: Remove friendship from connections
    const deleteConnectionQuery = `
      DELETE FROM connections 
      WHERE (user_id = ? AND friend_id = ?)
         OR (user_id = ? AND friend_id = ?)
    `;
    await query(deleteConnectionQuery, [userId, friendId, friendId, userId]);

    // ✅ Step 2: Remove any friend request between the users (pending/declined/accepted)
    const deleteRequestQuery = `
      DELETE FROM friend_requests 
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
    `;
    await query(deleteRequestQuery, [userId, friendId, friendId, userId]);

    return Response.json({ message: "Friend and related requests removed successfully." });

  } catch (error) {
    console.error("Error removing friend:", error);
    return Response.json({ error: "Failed to remove friend." }, { status: 500 });
  }
}
