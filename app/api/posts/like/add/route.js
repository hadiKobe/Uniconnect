import { query } from "@/lib/db";

export async function POST(request) {
   const sqlQuery = `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`;
   try {
      const body = await request.json();
      const { userId, postId } = body;

      const result = await query(sqlQuery, [userId, postId]);
      console.log(result);

      return Response.json({ message: "Like added successfully!" });
   } catch (error) {
      console.error(error);
      return Response.json({ error: "Failed to add Like" }, { status: 500 });
   }
}