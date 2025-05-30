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
     SELECT 
      u.id, 
      u.first_name, 
      u.last_name, 
      u.profile_picture,
      COUNT(DISTINCT mf.friend_id) AS mutual_friends
    FROM users u

    -- mutual friends logic
    LEFT JOIN connections AS mf
      ON mf.friend_id IN (
        SELECT friend_id FROM connections WHERE user_id = ?
      )
      AND mf.user_id = u.id

    WHERE 
      u.id != ?
      AND u.id NOT IN (
        SELECT friend_id FROM connections WHERE user_id = ?
      )
      AND u.id NOT IN (
        SELECT receiver_id FROM friend_requests WHERE sender_id = ? AND status = 'pending'
        UNION
        SELECT sender_id FROM friend_requests WHERE receiver_id = ? AND status = 'pending'
      )

    GROUP BY u.id, u.first_name, u.last_name, u.profile_picture
    ORDER BY mutual_friends DESC
    LIMIT 10;
    `;
    // 1- friends, 2- exclude self, 3- exclude current friends, 4- pending requests by self, 5- pending requests by other
    const sqlParams = [userId, userId, userId, userId, userId];

    const nonFriends = await query(sqlQuery, sqlParams);

    return Response.json({ nonFriends });

  } catch (error) {
    console.error("Error fetching non-friends:", error);
    return Response.json({ error: "Failed to load users." }, { status: 500 });
  }
}
