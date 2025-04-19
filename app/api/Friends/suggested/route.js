import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const sqlQuery = `
      SELECT id, first_name, last_name, profile_picture
      FROM users
      WHERE id != ?
        AND id NOT IN (
          SELECT friend_id FROM connections WHERE user_id = ?
        )
        AND id NOT IN (
          SELECT receiver_id FROM friend_requests WHERE sender_id = ? AND status = 'pending'
          UNION
          SELECT sender_id FROM friend_requests WHERE receiver_id = ? AND status = 'pending'
        )
    `;

    const nonFriends = await query(sqlQuery, [userId, userId, userId, userId]);

    return Response.json({ nonFriends });

  } catch (error) {
    console.error("Error fetching non-friends:", error);
    return Response.json({ error: "Failed to load users." }, { status: 500 });
  }
}
