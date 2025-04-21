import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const sqlQuery = `
    SELECT 
        friend_requests.id AS request_id,
        users.id, 
        users.first_name, 
        users.last_name, 
        users.profile_picture
    FROM friend_requests 
    JOIN users ON friend_requests.sender_id = users.id
    WHERE friend_requests.receiver_id = ? 
        AND friend_requests.status = 'pending'
    `;


    const friendRequests = await query(sqlQuery, [userId]);

    return Response.json({ friendRequests });
    
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return Response.json({ error: "Failed to fetch requests." }, { status: 500 });
  }
}
