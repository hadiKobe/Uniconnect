import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // filters : friends, major, job, market,tutor

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "";

  const filters = {
    user_id: session.user.id,
    major: session.user.major,
    category: ['job', 'market', 'tutor']
  };

  // conditions
  const conditions = ['posts.is_deleted = 0'];
  const params = [];
  if (filter)
    switch (filter) {
      case 'friends':
        conditions.push(
          `posts.user_id IN 
          (SELECT CASE WHEN user_id_1 = ? THEN user_id_2 ELSE user_id_1 END FROM connections WHERE user_id_1 = ? OR user_id_2 = ?)`
        );
        params.push(filters.user_id, filters.user_id, filters.user_id);
        break;

      case 'major':
        conditions.push('users.major = ?');
        params.push(filters.major);
        break;

      case filters.category[0]:
      case filters.category[1]:
      case filters.category[2]:
        conditions.push('posts.category = ?');
        params.push(filter);
        break;

      default:
        // Optional: return an error for unknown filters
        return Response.json({ error: "Invalid filter" }, { status: 400 });
    }

  const sqlQuery = `
      SELECT posts.id, posts.content, users.first_name, users.last_name, users.major, posts.category, 
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS commentsCount,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likesCount
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY posts.created_at DESC
    `;

  try {
    const posts = await query(sqlQuery, params);
    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


