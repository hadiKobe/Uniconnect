import { query } from "@/lib/db";
import { createPostInstance } from "@/lib/models/Posts";

export async function GET(request) {
   // const session = await getServerSession(authOptions);
   // if (!session) {
   //   return Response.json({ error: "Unauthorized" }, { status: 401 });
   // }
   // const userId = session.user.id;

   const userId = 14; // For testing purposes, replace with actual user ID

   const { searchParams } = new URL(request.url);
   const q = searchParams.get('query');

   const postQuery = `
   SELECT posts.id,posts.content, posts.created_at, posts.category,
      users.id AS user_id, users.first_name, users.last_name, users.major,
      COUNT(CASE WHEN reactions.value = 0 THEN 1 END) AS dislikesCount,
      COUNT(CASE WHEN reactions.value = 1 THEN 1 END) AS likesCount,
      COUNT(DISTINCT comments.id) AS commentsCount,

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
   WHERE (posts.content LIKE ? OR users.first_name LIKE ? OR users.last_name LIKE ?) AND posts.is_deleted = 0
   GROUP BY posts.id, posts.content, posts.category, posts.created_at, users.id, users.first_name, users.last_name, users.major
   ORDER BY posts.created_at DESC
   LIMIT 5
      `;

   const userQuery = `
   SELECT id, CONCAT(first_name, ' ', last_name) AS name, profile_picture
      FROM users
      WHERE first_name LIKE ? OR last_name LIKE ?
      LIMIT 5
      `;

   if (!q) {
      return Response.json({ users: [], posts: [] });
   }

   const [users, postsRaw] = await Promise.all([
      query(userQuery, [`${q}%`, `${q}%`]),
      query(postQuery, [userId, `%${q}%`, `${q}%`, `${q}%`])
   ]);

   try {
      const posts = postsRaw.map((post) => {
         return createPostInstance(post);
      });
      //  console.log(posts);
      return Response.json({ users, posts });

   } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });

   }
}
