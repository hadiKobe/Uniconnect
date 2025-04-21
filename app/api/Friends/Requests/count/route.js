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
      SELECT COUNT(*) AS count
      FROM friend_requests
      WHERE receiver_id = ? AND status = 'pending'
    `;

    const result = await query(sqlQuery, [userId]);
    const count = result[0]?.count || 0;

    return Response.json({ count });
  } catch (error) {
    console.error("Error fetching request count:", error);
    return Response.json({ error: "Failed to fetch count." }, { status: 500 });
  }
}
