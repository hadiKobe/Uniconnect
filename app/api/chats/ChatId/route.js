import connectToDB from "@/server/db";
import { getOrCreateChat } from "@/server/controllers/chatController";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const userA = searchParams.get("userA");
  const userB = searchParams.get("userB");

  if (!userA || !userB) {
    return Response.json({ error: "Both user IDs are required." }, { status: 400 });
  }

  try {
    await connectToDB();
    const chat = await getOrCreateChat(userA, userB); // This should ONLY return a Chat document
    return Response.json(chat);
  } catch (error) {
    console.error("Error fetching/creating chat:", error);
    return Response.json({ error: "Failed to fetch chat." }, { status: 500 });
  }
}
