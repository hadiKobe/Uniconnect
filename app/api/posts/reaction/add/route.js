import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/functions/notifications/createNotification"; // Import the function you made

export async function POST(request) {
   try {
      const session = await getServerSession(authOptions);
      if (!session) {
         return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { postId, reaction } = body;
      const userId = session.user.id;

      // Check if a reaction already exists
      const checkQuery = `SELECT id,value FROM reactions WHERE user_id = ? AND post_id = ?`;
      const existing = await query(checkQuery, [userId, postId]);

      let result;

      if (existing.length > 0) {
         if (reaction === existing[0].value) {
            return Response.json({ message: "Already reacted!" });
         }

         const updateQuery = `UPDATE reactions SET value = ? WHERE user_id = ? AND post_id = ?`;
         result = await query(updateQuery, [reaction, userId, postId]);
      } else {
         const insertQuery = `INSERT INTO reactions (user_id, post_id, value) VALUES (?, ?, ?)`;
         result = await query(insertQuery, [userId, postId, reaction]);
      }

      // Only after successful insert/update
      if (result && result.affectedRows > 0 && reaction === 1) {
         // 1. Find the post owner
         const postQuery = `SELECT user_id FROM posts WHERE id = ?`;
         const postResult = await query(postQuery, [postId]);

         if (postResult.length > 0) {
            const postOwnerId = postResult[0].user_id;

            // 2. Don't notify yourself if you liked your own post
            if (Number(postOwnerId) !== Number(userId)) {
               await createNotification(
                  userId,                     // From user (liker)
                  postOwnerId,                 // To user (post owner)
                  "liked your post",           // Message
                  `/post/${postId}`,            // Link to the post
                  "like"                        // Type
               );
            }
         }
      }

      return Response.json({ message: `${reaction ? 'Like' : 'Dislike'} saved successfully!` });

   } catch (error) {
      console.error(error);
      return Response.json({ error: "Failed to save reaction" }, { status: 500 });
   }
}
