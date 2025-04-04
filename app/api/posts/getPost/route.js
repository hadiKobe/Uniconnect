import { query } from "@/lib/db";

export async function GET(request) {

  // filters
  const {searchParams} = new URL(request.url);
  const filters = {
    user_id: searchParams.get("user_id"),
    category: searchParams.get("category"),
    major: searchParams.get("major")
  };

  // conditions
  const conditions = ['posts.is_deleted = 0'];
  const params = [];

  // add filetrs dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if(value)
      switch (key){
        case 'user_id':
          conditions.push('posts.user_id = ?');
          params.push(value);
          break;

        case 'category':
          conditions.push('posts.category = ?');
          params.push(value);
          break;
          
        case 'major':
          conditions.push('users.major = ?');
          params.push(value);
          break;

        default:
          break;  
      }
  });

   const sqlQuery = `
      SELECT posts.id, posts.content, users.first_name, users.last_name, users.major, posts.category, 
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS commentsCount,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likesCount
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY posts.created_at DESC
    `;
    console.log(sqlQuery, params, conditions);
  try {
    const posts = await query(sqlQuery,params);
    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


