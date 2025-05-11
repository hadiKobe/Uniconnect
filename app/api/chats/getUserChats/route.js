import connectToDB from "@/server/db";
import { getUserChats } from "@/server/controllers/chatController";

export async function GET(req) {
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
