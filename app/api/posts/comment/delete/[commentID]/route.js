import { query } from "@/lib/db";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   const { commentID } = await params;
   const sqlQuery = `UPDATE comments SET is_deleted = 1 WHERE id = ?`;
   try {
      const result = await query(sqlQuery, [commentID]);

      return Response.json({ message: "Comment deleted successfully!" });
   } catch (error) {
      return Response.json({ error: "Failed to delete comment", error }, { status: 500 });
   }
}