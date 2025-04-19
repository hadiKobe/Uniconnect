import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, status } = body;
    const userId = session.user.id;

    if (!["accepted", "declined"].includes(status)) {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Check if the request exists and belongs to this user
    const checkQuery = `
      SELECT sender_id FROM friend_requests 
      WHERE id = ? AND receiver_id = ?
    `;
    const existing = await query(checkQuery, [requestId, userId]);

    if (existing.length === 0) {
      return Response.json({ error: "Friend request not found or unauthorized" }, { status: 404 });
    }

    const senderId = existing[0].sender_id;

    // Update request status
    const updateQuery = `
      UPDATE friend_requests SET status = ? WHERE id = ?
    `;
    await query(updateQuery, [status, requestId]);

    // If accepted, insert mutual friendship
    if (status === "accepted") {
        const insertQuery = `
          INSERT IGNORE INTO connections (user_id, friend_id)
            VALUES (?, ?), (?, ?)

        `;//ignore to avoid duplicate entries
        await query(insertQuery, [userId, senderId, senderId, userId]);
      }
      

    return Response.json({ message: `Friend request ${status}` });

  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
