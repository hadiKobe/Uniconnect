import { query } from '@/lib/db';

export async function GET(req, { params }) {
  const { postID } = await params;
  const sqlQuery = `
      SELECT likes.*, users.first_name, users.last_name, users.major
      FROM likes
      JOIN users ON likes.user_id = users.id
      WHERE likes.post_id = ?
      ORDER BY likes.liked_at DESC
    `;

  try {
    const likes = await query(sqlQuery, [postID]);

    return Response.json(likes);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching likes' }), { status: 500 });
  }
}
