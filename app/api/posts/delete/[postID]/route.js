import { query } from "@/lib/db";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   const { postID } = await params;
   const sqlQuery = `UPDATE posts SET is_deleted = 1 WHERE id = ?`;
   try {
      const result = await query(sqlQuery, [postID]);
      // console.log(result);

      return Response.json({ message: "Post deleted successfully!" });
   } catch (error) {
      return Response.json({ error: "Failed to delete post", error }, { status: 500 });
   }
}