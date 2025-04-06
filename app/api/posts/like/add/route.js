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
      const { postId } = body;
      const userId = session.user.id; // ✅ from the session

      const sqlQuery = `INSERT INTO likes (user_id, post_id) VALUES (?, ?)`;

      const result = await query(sqlQuery, [userId, postId]);
      console.log(result);

      return Response.json({ message: "Like added successfully!" });
   } catch (error) {
      console.error(error);

      // handle duplicate like (violates UNIQUE constraint)
      if (error.code === "ER_DUP_ENTRY") {
         return Response.json({ error: "User already liked this post." }, { status: 400 });
      }

      return Response.json({ error: "Failed to add Like" }, { status: 500 });
   }
}
