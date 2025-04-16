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
      const { postId, reaction } = body;
      const userId = session.user.id;


      // used for testing in postman only
      // const { userId, postId, reaction } = body;

      // Check if a reaction already exists
      const checkQuery = `SELECT id,value FROM reactions WHERE user_id = ? AND post_id = ?`;
      const existing = await query(checkQuery, [userId, postId]);

      let result;

      if (existing.length > 0) {

         // If exists, check if the reaction is the same and if true it return
         if (reaction === existing[0].value) return Response.json({ message: "Already reacted!" });

         // If exists, update the value to 1
         const updateQuery = `UPDATE reactions SET value = ? WHERE user_id = ? AND post_id = ?`;
         result = await query(updateQuery, [reaction, userId, postId]);
      } else {
         // If not, insert a new reaction
         const insertQuery = `INSERT INTO reactions (user_id, post_id, value) VALUES (?, ?, ?)`;
         result = await query(insertQuery, [userId, postId, reaction]);
      }

      return Response.json({ message: `${reaction ? 'Like' : 'Dislike'} saved successfully!` });
   } catch (error) {
      console.error(error);
      return Response.json({ error: "Failed to save reaction" }, { status: 500 });
   }
}