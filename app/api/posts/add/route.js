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
    const { content, category } = body;
    const userId = session.user.id; // ✅ secure source

    const sqlQuery = `INSERT INTO posts (user_id, content, category) VALUES (?, ?, ?)`;
    await query(sqlQuery, [userId, content, category]);

    return Response.json({ message: "Post added successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}

