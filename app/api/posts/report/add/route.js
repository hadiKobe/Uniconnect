import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// /api/posts/report/add/route.js
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sqlQuery = 'INSERT INTO reports (user_id, post_id, reason, details) VALUES (?, ?, ?, ?)';

  // const user_id = 14; // Replace with session.user.id when auth is ready

  try {
    const body = await req.json();
    const { postId, reason, details } = body;

    if (!postId || !reason) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    await query(sqlQuery, [user_id, postId, reason, details]);

    return new Response(JSON.stringify({ message: "Reported successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error submitting report:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
