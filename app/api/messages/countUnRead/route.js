// app/api/messages/countUnRead/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUnreadCountsByChat } from "@/server/controllers/messageController";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const counts = await getUnreadCountsByChat(userId);
    console.log("Unread counts:", counts);

    return NextResponse.json(counts, { status: 200 }); // ✅ Correct way
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    return NextResponse.json({ error: "Failed to fetch unread counts" }, { status: 500 }); // ✅ Correct way
  }
}
