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
      SELECT COUNT(*) as count
      FROM notifications
      WHERE to_user_id = ? AND is_read = 0
    `;

    const [result] = await query(sqlQuery, [userId]); // ✅ result is an array with one object

    return Response.json({ count: result.count }); // ✅ return only the number directly

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch unread notifications count." }, { status: 500 });
  }
}
