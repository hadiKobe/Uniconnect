import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { postId, content } = body;
    const userId = session.user.id; // ✅ Secure source

    const sqlQuery = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;
    await query(sqlQuery, [userId, postId, content]);

    return Response.json({ message: "Comment added successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
