import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const sqlQuery = `
      UPDATE notifications
      SET is_read = 1
      WHERE to_user_id = ? AND is_read = 0
    `;

    const result = await query(sqlQuery, [userId]);

    return Response.json({ message: "All unread notifications marked as read.", affected: result.affectedRows });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update notifications." }, { status: 500 });
  }
}
