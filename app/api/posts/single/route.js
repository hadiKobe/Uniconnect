import { query } from "@/lib/db";
import { createPostInstance } from "@/lib/models/Posts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId || isNaN(Number(postId))) {
    return Response.json({ error: "Invalid or missing postId" }, { status: 400 });
  }

  const sqlQuery = `
    SELECT posts.id, posts.content, posts.created_at, posts.category, 
      users.id AS user_id, users.first_name, users.last_name, users.major,
      COUNT(CASE WHEN reactions.value = 0 THEN 1 END) AS dislikesCount,
      COUNT(CASE WHEN reactions.value = 1 THEN 1 END) AS likesCount,
      COUNT(DISTINCT CASE WHEN comments.is_deleted = 0 THEN comments.id END) AS commentsCount,
      (SELECT JSON_ARRAYAGG(post_media.path_url) FROM post_media WHERE post_media.post_id = posts.id) AS media_urls,

      (SELECT value FROM reactions WHERE reactions.post_id = posts.id AND reactions.user_id = ? LIMIT 1) AS currentUserReaction,

      CASE
        WHEN posts.category = 'tutor' THEN (
          SELECT JSON_OBJECT(
            'rate', tutoring_details.rate,
            'subject', tutoring_details.subject,
            'location', tutoring_details.location
          ) FROM tutoring_details WHERE tutoring_details.post_id = posts.id LIMIT 1)

        WHEN posts.category = 'market' THEN (
          SELECT JSON_OBJECT(
            'price', product_details.price,
            'location', product_details.location
          ) FROM product_details WHERE product_details.post_id = posts.id LIMIT 1)

        WHEN posts.category = 'job' THEN (
          SELECT JSON_OBJECT(
            'job_type', jobs_details.job_type,
            'salary', jobs_details.salary,
            'location', jobs_details.location
          ) FROM jobs_details WHERE jobs_details.post_id = posts.id LIMIT 1)

        ELSE NULL
      END AS details

    FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN reactions ON reactions.post_id = posts.id
      LEFT JOIN comments ON comments.post_id = posts.id

    WHERE posts.id = ? AND posts.is_deleted = 0
    GROUP BY posts.id, posts.content, posts.category, posts.created_at, users.id, users.first_name, users.last_name, users.major
    LIMIT 1;
  `;

  const params = [session.user.id, postId];

  try {
    const result = await query(sqlQuery, params);
    if (result.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const post = createPostInstance(result[0]);
    return Response.json(post);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
