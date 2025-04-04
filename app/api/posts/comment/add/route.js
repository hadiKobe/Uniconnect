import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, postId, content } = body;

    const sqlQuery = `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`;
    const result = await query(sqlQuery, [userId, postId, content]);
    

    return Response.json({ message: "Comment added successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}