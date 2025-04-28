import { query } from "@/lib/db";
import { createPostInstance } from "@/lib/models/Posts";
import { createInteractionInstance } from "@/lib/models/Interactions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
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
    user_id: session.user.id,
    major: session.user.major
  };

  // const filters = {
  //   user_id: 14,
  //   major: 'Psychology'
  // };

  // conditions
  const conditions = ['posts.is_deleted = 0'];
  const params = [filters.user_id];
  if (filter)
    switch (filter) {
      case 'friends':
        conditions.push(`posts.user_id IN (SELECT friend_id FROM connections WHERE user_id = ?)`);
        params.push(filters.user_id);
        break;

      case 'major':
        conditions.push('users.major = ?');
        params.push(filters.major);
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
    params.push(section);
  }

  /*   const sqlQuery = `
      SELECT posts.id, posts.content, users.first_name, users.last_name, users.major, posts.category, 
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS commentsCount,
        (SELECT COUNT(*) FROM reactions WHERE reactions.post_id = posts.id AND value = 1) AS likesCount,
        (SELECT COUNT(*) FROM reactions WHERE reactions.post_id = posts.id AND value = 0) AS dislikesCount
      FROM posts JOIN users ON posts.user_id = users.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY posts.created_at DESC
    `;*/

  //   const sqlQuery = `
  //     SELECT posts.id, posts.content, users.id as user_id, users.first_name, users.last_name, users.major, posts.category, posts.created_at,
  //       COUNT(DISTINCT comments.id) AS commentsCount,
  //       COUNT(CASE WHEN reactions.value = 1 THEN 1 END) AS likesCount,
  //       COUNT(CASE WHEN reactions.value = 0 THEN 1 END) AS dislikesCount,
  //       user_reactions.value AS currentUserReaction

  //     FROM posts JOIN users ON posts.user_id = users.id 
  //       LEFT JOIN comments ON comments.post_id = posts.id
  //       LEFT JOIN reactions ON reactions.post_id = posts.id
  //       LEFT JOIN reactions AS user_reactions ON user_reactions.post_id = posts.id AND user_reactions.user_id = ?

  //     WHERE ${conditions.join(' AND ')}

  //     GROUP BY posts.id, posts.content, users.first_name, users.last_name, users.major, posts.category, user_reactions.value
  //     ORDER BY posts.created_at DESC;
  // `;


  /* 
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
  */

  const sqlQuery = `
    SELECT posts.id,posts.content, posts.created_at, posts.category,
      users.id AS user_id, users.first_name, users.last_name, users.major,
      COUNT(CASE WHEN reactions.value = 0 THEN 1 END) AS dislikesCount,
      COUNT(CASE WHEN reactions.value = 1 THEN 1 END) AS likesCount,
      COUNT(DISTINCT CASE WHEN comments.is_deleted = 0 THEN comments.id END) AS commentsCount,

    -- Current user reaction
      ( SELECT value
        FROM reactions
        WHERE reactions.post_id = posts.id AND reactions.user_id = ?
        LIMIT 1 ) AS currentUserReaction,

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


    FROM posts JOIN users ON posts.user_id = users.id LEFT JOIN reactions ON reactions.post_id = posts.id LEFT JOIN comments ON comments.post_id = posts.id
    WHERE ${conditions.join(' AND ')}
    GROUP BY posts.id, posts.content, posts.category, posts.created_at, users.id, users.first_name, users.last_name, users.major
    ORDER BY posts.created_at DESC;
`;
//console.log(sqlQuery, params);

  try {
    const result = await query(sqlQuery, params);
     //console.log(result);
    const posts = result.map((post) => {
      return createPostInstance(post);
    });
    // console.log(posts);
    return Response.json(posts);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


