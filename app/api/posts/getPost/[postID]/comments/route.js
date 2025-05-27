import { query } from '@/lib/db';
import { createInteractionInstance } from '@/lib/models/Interactions';

export async function GET(request, { params }) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   const { postID } = await params;
   const sqlQuery = `
      SELECT comments.*, users.first_name, users.last_name 
      FROM comments JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ? AND comments.is_deleted = 0
      ORDER BY comments.created_at ASC
    `;
   try {
      const commentsRaw = await query(sqlQuery, [postID]);
      const comments = createInteractionInstance(commentsRaw);
      return Response.json(comments);
   } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Error fetching comments' }), { status: 500 });
   }
}
