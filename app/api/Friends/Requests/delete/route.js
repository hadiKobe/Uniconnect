import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ✅ Get data from the BODY instead of URL
    const { friendId, requestId } = await request.json();

    if (!friendId && !requestId) {
      return Response.json({ error: "Missing friendId or requestId" }, { status: 400 });
    }

    if (requestId) {
      // ✅ Cancel directly by request ID
      const deleteRequest = `
        DELETE FROM friend_requests
        WHERE id = ?
      `;
      await query(deleteRequest, [requestId]);
      return Response.json({ message: "Friend request canceled successfully." });
    }

    if (friendId) {
      // ✅ Cancel friend request between two users
      const deleteFriendRequest = `
        DELETE FROM friend_requests
        WHERE 
          (sender_id = ? AND receiver_id = ?)
          OR
          (sender_id = ? AND receiver_id = ?)
      `;
      await query(deleteFriendRequest, [userId, friendId, friendId, userId]);
      return Response.json({ message: "Friend request canceled successfully." });
    }

  } catch (error) {
    console.error("Error canceling friend request:", error);
    return Response.json({ error: "Failed to cancel friend request." }, { status: 500 });
  }
}
