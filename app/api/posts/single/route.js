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

  // conditions
  const conditions = ['posts.is_deleted = 0', 'posts.id = ?'];
  const sqlParams = [session.user.id, postId]; //for current user reaction and id of the post to get it

  const joins = [
    'posts JOIN users ON posts.user_id = users.id',
    'LEFT JOIN reactions ON reactions.post_id = posts.id',
    'LEFT JOIN comments ON comments.post_id = posts.id'
  ];

  const additional_attributes = {
    tutor: `
        WHEN posts.category = 'tutor' THEN (
          SELECT JSON_OBJECT(
          'rate', tutoring_details.rate,
          'subject', tutoring_details.subject,
          'location', tutoring_details.location
        ) FROM tutoring_details WHERE tutoring_details.post_id = posts.id LIMIT 1)
    `,
    market: `
        WHEN posts.category = 'market' THEN (
          SELECT JSON_OBJECT(
            'price', product_details.price,
            'location', product_details.location,
            'product_name',product_details.product_name,
            'type', product_details.type
          ) FROM product_details WHERE product_details.post_id = posts.id LIMIT 1)
    `,
    job: `
        WHEN posts.category = 'job' THEN (
          SELECT JSON_OBJECT(
            'job_type', jobs_details.job_type,
            'salary', jobs_details.salary,
            'location', jobs_details.location,
            'position', jobs_details.position
          ) FROM jobs_details WHERE jobs_details.post_id = posts.id LIMIT 1)
        `,
  };

  const sqlQuery = `
    SELECT posts.id,posts.content, posts.created_at, posts.category, 
      users.id AS user_id, users.first_name, users.last_name, users.major, users.profile_picture,
      COUNT(DISTINCT CASE WHEN reactions.value = 1 THEN reactions.id END) AS likesCount,
      COUNT(DISTINCT CASE WHEN reactions.value = 0 THEN reactions.id END) AS dislikesCount,
      COUNT(DISTINCT CASE WHEN comments.is_deleted = 0 THEN comments.id END) AS commentsCount,
      (SELECT JSON_ARRAYAGG(post_media.path_url) FROM post_media WHERE post_media.post_id = posts.id) AS media_urls,

    -- Current user reaction
      ( SELECT value
        FROM reactions
        WHERE reactions.post_id = posts.id AND reactions.user_id = ?
        LIMIT 1 ) AS currentUserReaction,

      CASE
        ${Object.values(additional_attributes).join('\n')}
        ELSE NULL
      END AS details

    FROM ${joins.join(' ')}
    WHERE ${conditions.join(' AND ')}
    GROUP BY posts.id, posts.content, posts.category, posts.created_at, users.id, users.first_name, users.last_name, users.major
    ORDER BY posts.created_at DESC;
`;

  try {
    const result = await query(sqlQuery, sqlParams);
    if (result.length === 0) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const post = createPostInstance(result[0]);
    return Response.json(post);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
