import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = (await params)?.userID;

    if (!userID) {
      return Response.json({ error: "Missing user ID" }, { status: 400 });
    }

    const sqlQuery = `
      SELECT 
        users.id,
        users.first_name, 
        users.last_name, 
        users.profile_picture,
        users.major,
        users.bio,
        users.email,
        users.phone,
        users.address,
        users.expected_graduation_date,
        users.graduation_progress,
        users.gpa,
        users.joined_at,
        users.joined_in
      FROM users
      WHERE users.id = ?
      LIMIT 1
    `;

    const userInfo = await query(sqlQuery, [userID]);

    if (!userInfo || userInfo.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ userInfo: userInfo[0] });

  } catch (error) {
    console.error("Error fetching user info:", error);
    return Response.json({ error: "Failed to fetch user info." }, { status: 500 });
  }
}
