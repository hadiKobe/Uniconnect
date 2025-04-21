import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await request.json(); // ✅ destructure correctly

    const sqlQuery = `
      DELETE FROM friend_requests 
      WHERE id = ?
    `;
    await query(sqlQuery, [requestId]);

    return Response.json({ message: "Friend request deleted successfully." });
  } catch (error) {
    console.error("Error deleting friend request:", error);
    return Response.json({ error: "Failed to delete request." }, { status: 500 });
  }
}
