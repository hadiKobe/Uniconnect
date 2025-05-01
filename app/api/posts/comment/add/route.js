import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/functions/notifications/createNotification";
import { createInteractionInstance } from "@/lib/models/Interactions";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { post_id, content } = body;
    const userId = session.user.id;

    //First: find the post owner
    const [postOwner] = await query(
      `SELECT user_id FROM posts WHERE id = ?`,
      [post_id]
    );

    if (!postOwner) {
      return Response.json({ error: "Post not found." }, { status: 404 });
    }

    // insert the comment
    const result = await query(
      `INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)`,
      [userId, post_id, content]
    );

    if (result && result.affectedRows > 0) {
      const postQuery = `SELECT user_id FROM posts WHERE id = ?`;
      const postResult = await query(postQuery, [post_id]);

      const commentId = result.insertId;
      // Fetch full comment with user info
      const [newComment] = await query(
        `SELECT c.id, c.content, c.created_at, u.id AS user_id, u.first_name, u.last_name
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.id = ?`,
        [commentId]
      );

      if (postResult.length > 0) {
        const postOwnerId = postResult[0].user_id;
        //create notification if not commenting on your own post
        if (Number(postOwnerId) !== Number(userId)) {
          await createNotification(
            userId,
            postOwner.user_id,
            "commented on your post",
            `/post/${post_id}`,
            "comment"
          );
        }
      }
      const comment = createInteractionInstance([newComment]);
      return Response.json(comment);
    } else {
      return Response.json({ error: "Failed to add comment." }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
