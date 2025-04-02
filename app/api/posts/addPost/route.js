import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, userId } = body;

    const sqlQuery = `
    INSERT INTO posts (user_id, content, category, created_at, is_deleted) 
    VALUES (?, ?, ?, NOW(), 0)`;
    await db.query(sqlQuery, [userId, content, "general"]);

    return Response.json({ message: "Post added successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}
