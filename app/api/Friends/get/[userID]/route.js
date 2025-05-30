import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userID } = await params;
    const currentUserID = session.user.id;

    const sqlQuery = `
      SELECT 
        u.id, 
        u.first_name, 
        u.last_name, 
        u.profile_picture,
        (
          SELECT COUNT(*) 
          FROM connections c1
          JOIN connections c2 ON c1.friend_id = c2.friend_id
          WHERE c1.user_id = ?        -- current user
            AND c2.user_id = u.id     -- the friend
        ) AS mutual_friends
      FROM connections c
      JOIN users u ON u.id = c.friend_id
      WHERE c.user_id = ?

    `;

    const friends = await query(sqlQuery, [currentUserID,userID]);

    return Response.json({ friends });

  } catch (error) {
    console.error("Error fetching friends:", error);
    return Response.json({ error: "Failed to fetch friends." }, { status: 500 });
  }
}
