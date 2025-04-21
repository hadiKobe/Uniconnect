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

    const sqlQuery = `
      DELETE FROM connections 
      WHERE (user_id = ? AND friend_id = ?)
         OR (user_id = ? AND friend_id = ?)
    `;

    await query(sqlQuery, [userId, friendId, friendId, userId]);

    return Response.json({ message: "Friend removed successfully." });
  } catch (error) {
    console.error("Error removing friend:", error);
    return Response.json({ error: "Failed to remove friend." }, { status: 500 });
  }
}
