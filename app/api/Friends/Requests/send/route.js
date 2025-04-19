import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { friendId } = body;
    const userId = session.user.id;

    if (userId === friendId) {
      return Response.json({ error: "You cannot send a friend request to yourself." }, { status: 400 });
    }

    // Check if a pending request exists in either direction
    const checkPending = `
      SELECT id FROM friend_requests 
      WHERE (
        (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
      ) AND status = 'pending'
    `;
    const pending = await query(checkPending, [userId, friendId, friendId, userId]);
    if (pending.length > 0) {
      return Response.json({ message: "Friend request already sent or received!" }, { status: 400 });
    }

    // Check if a declined request exists from sender to receiver
    const checkDeclined = `
      SELECT id FROM friend_requests 
      WHERE sender_id = ? AND receiver_id = ? AND status = 'declined'
    `;
    const declined = await query(checkDeclined, [userId, friendId]);
    if (declined.length > 0) {
      const updateQuery = `
        UPDATE friend_requests SET status = 'pending', created_at = NOW()
        WHERE id = ?
      `;
      await query(updateQuery, [declined[0].id]);
      return Response.json({ message: "Friend request re-sent!" });
    }

    // Insert a new friend request
    const insertQuery = `
      INSERT INTO friend_requests (sender_id, receiver_id)
      VALUES (?, ?)
    `;
    await query(insertQuery, [userId, friendId]);

    return Response.json({ message: "Friend request sent successfully!" });
  } catch (error) {
    console.error("Friend request error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
