import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request, { params }) {

   const session = await getServerSession(authOptions);
   if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   const userId = session.user.id;

   const { postId } = await params;
   const sqlQuery = `Delete from reactions WHERE post_id = ? AND user_id = ?`;
   try {
      const result = await query(sqlQuery, [postId, userId]);

      return Response.json({ message: "Reaction deleted successfully!" });
   } catch (error) {
      return Response.json({ error: "Failed to delete Like", error }, { status: 500 });
   }
}