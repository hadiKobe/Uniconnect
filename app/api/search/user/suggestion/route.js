import { query } from "@/lib/db";

export async function GET(request) {
   // const session = await getServerSession(authOptions);
   // if (!session) {
   //   return Response.json({ error: "Unauthorized" }, { status: 401 });
   // }
   // const userId = session.user.id;
   const userId = 14; // For testing purposes, replace with actual user ID from session

   const { searchParams } = new URL(request.url);
   const q = searchParams.get('term');
   if (!q) {
      return Response.json({ users: [] });
   }

   const sqlQuery = `
      SELECT users.id, CONCAT(users.first_name, ' ', users.last_name) as name, users.profile_picture,
      -- Calculate mutual friends count
         (SELECT COUNT(*) FROM connections AS c1 JOIN connections AS c2 ON c1.friend_id = c2.friend_id
         WHERE c1.user_id = ? AND c2.user_id = users.id) AS mutualFriendsCount
      FROM users
      WHERE (users.first_name LIKE ? OR users.last_name LIKE ?) AND users.id != ?

      ORDER BY 
      CASE 
         WHEN users.first_name = ? THEN 0
         WHEN users.last_name = ? THEN 0
         ELSE 1
      END,
      mutualFriendsCount DESC

      LIMIT 10;
   `;
   const params = [userId, `${q}%`, `${q}%`, userId,`${q}%`, `${q}%`];
   

   // const sqlQuery = `
   // SELECT id, CONCAT(first_name, ' ', last_name) AS name, profile_picture
   //    FROM users
   //    WHERE first_name LIKE ? OR last_name LIKE ?
   //    LIMIT 5
   //    `;
   // const params = [`%${q}%`, `%${q}%`];

   

   try {
      const results = await query(sqlQuery, params);
      console.log("Results:", results); // Debugging line to check the results
      return Response.json( {users : results} );
   } catch (error) {
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
   }
}