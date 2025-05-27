import connectToDB from "@/server/db";
import { getUserChats } from "@/server/controllers/chatController";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    await connectToDB();
    const chats = await getUserChats(userId);

    return Response.json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return Response.json({ error: "Failed to fetch chats." }, { status: 500 });
  }
}
