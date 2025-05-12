import connectToDB from "@/server/db"; // Ensure DB connection before using the controller
import { getMessages } from "@/server/controllers/messageController";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  const limit = parseInt(searchParams.get("limit")) || 20;
  const skip = parseInt(searchParams.get("skip")) || 0;

  if (!chatId) {
    return Response.json({ error: "chatId is required" }, { status: 400 });
  }

  try {
    await connectToDB(); // ✅ Ensure DB is connected before querying

    const result = await getMessages(chatId, limit, skip);
  
    return Response.json(result);
  } catch (error) {
    console.error("❌ Failed to fetch messages:", error);
    return Response.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}
