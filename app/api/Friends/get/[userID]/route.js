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

    const sqlQuery = `
      SELECT 
        users.id, 
        users.first_name, 
        users.last_name, 
        users.profile_picture
      FROM connections 
      JOIN users ON connections.friend_id = users.id
      WHERE connections.user_id = ?
    `;

    const friends = await query(sqlQuery, [userID]);

    return Response.json({ friends });

  } catch (error) {
    console.error("Error fetching friends:", error);
    return Response.json({ error: "Failed to fetch friends." }, { status: 500 });
  }
}
