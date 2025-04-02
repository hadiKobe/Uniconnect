import { query } from "@/lib/db";

export async function GET() {
   const sqlQuery = `
      SELECT posts.id,posts.content, users.first_name, users.last_name, users.major
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.is_deleted = 0
      ORDER BY posts.created_at DESC
    `;
  try {
    const posts = await query(sqlQuery,[]);

    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
