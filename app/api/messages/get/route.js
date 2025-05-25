import connectToDB from "@/server/db"; // Ensure DB connection before using the controller
import { getMessages } from "@/server/controllers/messageController";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
   const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  const limit = parseInt(searchParams.get("limit")) || 100;
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
