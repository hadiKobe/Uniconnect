import { query } from '@/lib/db';

export async function GET(req, { params }) {
   const { postID } = await params;
   console.log(postID);
   const sqlQuery = `
      SELECT comments.*, users.first_name, users.last_name 
      FROM comments JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
    `
   try {
      const comments = await query(sqlQuery, [postID]);

      return Response.json(comments);
   } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Error fetching comments' }), { status: 500 });
   }
}
