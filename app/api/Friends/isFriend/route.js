import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const friendId = searchParams.get("userId"); 

    if (!friendId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const userId = session.user.id; // ✅ you forgot to declare this correctly

    const sql = `
      SELECT 1 FROM connections
      WHERE (user_id = ? AND friend_id = ?)
         OR (user_id = ? AND friend_id = ?)
      LIMIT 1
    `;

    const result = await query(sql, [userId, friendId, friendId, userId]);
    const isFriend = result.length > 0;

    return Response.json({ isFriend });

  } catch (error) {
    console.error("Error checking friendship:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
