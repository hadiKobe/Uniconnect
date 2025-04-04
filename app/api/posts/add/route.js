import { query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, userId, category } = body;

    const sqlQuery = `INSERT INTO posts (user_id, content, category) VALUES (?, ?, ?)`;
    const result = await query(sqlQuery, [userId, content, category]);


    return Response.json({ message: "Post added successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}
