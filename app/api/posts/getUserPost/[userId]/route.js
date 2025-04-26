import { query } from "@/lib/db";
import { createPostInstance } from "@/lib/models/Posts";
import { createInteractionInstance } from "@/lib/models/Interactions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request,{params}) {
   const session = await getServerSession(authOptions);
if (!session) {
     return Response.json({ error: "Unauthorized" }, { status: 401 });
   }

  const { searchParams } = new URL(request.url);
  // filters : friends, major
  const filter = searchParams.get("filter") || "";
  // sections : general, job, market, tutor
  const section = searchParams.get("section") || "";

  const sections = ['job', 'market', 'tutor'];


  const filters = {
    user_id: params.userId,
    // user_id: session.user.id,
    
    major: session.user.major
  };

  // conditions
  const conditions = ['posts.is_deleted = 0'];
  const sqlparams = [filters.user_id];
  if (filter)
    switch (filter) {
      case 'friends':
        conditions.push(`posts.user_id IN (SELECT friend_id FROM connections WHERE user_id = ?)`);
        sqlparams.push(filters.user_id);
        break;

      case 'major':
        conditions.push('users.major = ?');
        sqlparams.push(filters.major);
        break;

      default:
        // Optional: return an error for unknown filters
        return Response.json({ error: "Invalid filter" }, { status: 400 });
    }

  if (section && section !== 'home') {
    if (!sections.includes(section)) {
      return Response.json({ error: "Invalid section" }, { status: 400 });
    }

    conditions.push('posts.category = ?');
    sqlparams.push(section);
  }



  const sqlQuery = `
    SELECT posts.id,posts.content, posts.created_at, posts.category,
      users.id AS user_id, users.first_name, users.last_name, users.major,
      COUNT(CASE WHEN reactions.value = 0 THEN 1 END) AS dislikesCount,

    -- Current user reaction
      ( SELECT value
        FROM reactions
        WHERE reactions.post_id = posts.id AND reactions.user_id = ?
        LIMIT 1
      ) AS currentUserReaction,

    -- Likes JSON
      ( SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name
          )
      ) FROM reactions JOIN users u ON reactions.user_id = u.id
        WHERE reactions.post_id = posts.id AND reactions.value = 1
      ) AS likedBy,

    -- Comments JSON
      ( SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', comments.id,
            'content', comments.content,
            'created_at', comments.created_at,
            'user', JSON_OBJECT(
              'id', cu.id,
              'first_name', cu.first_name,
              'last_name', cu.last_name
            )
          )
        )FROM comments JOIN users cu ON comments.user_id = cu.id
        WHERE comments.post_id = posts.id AND is_deleted = 0
      ) AS comments,

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


    FROM posts JOIN users ON posts.user_id = users.id LEFT JOIN reactions ON reactions.post_id = posts.id
    WHERE ${conditions.join(' AND ')}
    GROUP BY posts.id, posts.content, posts.category, posts.created_at, users.id, users.first_name, users.last_name, users.major
    ORDER BY posts.created_at DESC;
`;

  try {
    const result = await query(sqlQuery, sqlparams);
    // console.log(result);
    const posts = result.map((post) => {
      const comments = createInteractionInstance(post.comments);
      const likes = createInteractionInstance(post.likedBy);

      return createPostInstance({ ...post, comments, likes, });
    });
    // console.log(posts);
    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


