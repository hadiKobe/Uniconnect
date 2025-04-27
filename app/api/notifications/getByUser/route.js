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
      SELECT * FROM notifications
      WHERE to_user_id = ?
      ORDER BY created_at DESC
    `;
    const notifications = await query(sqlQuery, [userId]);

    if (notifications.length === 0) {
      return Response.json({ message: "No notifications found." });
    }

    return Response.json({ notifications });
    
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}
