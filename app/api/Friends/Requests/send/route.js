import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/functions/notifications/createNotification";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId } = body;
    const userId = Number(session.user.id); // Force number type

    if (userId === Number(receiverId)) {
      return Response.json({ error: "You cannot send a friend request to yourself." }, { status: 400 });
    }

    // Check if pending friend request exists
    const checkPending = `
      SELECT id FROM friend_requests 
      WHERE (
        (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
      ) AND status = 'pending'
    `;
    const pending = await query(checkPending, [userId, receiverId, receiverId, userId]);
    if (pending.length > 0) {
      return Response.json({ message: "Friend request already sent or received!" }, { status: 400 });
    }

    // Check if a declined request exists
    const checkDeclined = `
      SELECT id FROM friend_requests 
      WHERE (
        (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
      ) AND status = 'declined'
    `;
    const declined = await query(checkDeclined, [userId, receiverId, receiverId, userId]);

    if (declined.length > 0) {
      // If declined exists, update it to pending
      const updateQuery = `
        UPDATE friend_requests SET status = 'pending', created_at = NOW()
        WHERE id = ?
      `;
      const updateResult = await query(updateQuery, [declined[0].id]);

      if (updateResult && updateResult.affectedRows > 0) {
        // ✅ Send notification after updating
        await createNotification(
          userId,
          receiverId,
          "sent you a friend request",
          `/Friends`,
          "friend_request"
        );
        return Response.json({ message: "Friend request re-sent!" });
      } else {
        return Response.json({ error: "Failed to re-send friend request." }, { status: 500 });
      }
    }

    // If no declined request, insert new request
    const insertQuery = `
      INSERT INTO friend_requests (sender_id, receiver_id)
      VALUES (?, ?)
    `;
    const insertResult = await query(insertQuery, [userId, receiverId]);

    if (insertResult && insertResult.affectedRows > 0) {
      // ✅ Send notification after inserting
      await createNotification(
        userId,
        receiverId,
        "sent you a friend request",
        `/Friends`,
        "friend_request"
      );
      return Response.json({ message: "Friend request sent successfully!" });
    } else {
      return Response.json({ error: "Failed to send friend request." }, { status: 500 });
    }

  } catch (error) {
    console.error("Friend request error:", error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
