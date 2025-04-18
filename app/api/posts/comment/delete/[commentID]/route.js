import { query } from "@/lib/db";

export async function DELETE(request,{params}) {
   const { commentID } = await params;
   const sqlQuery = `UPDATE comments SET is_deleted = 1 WHERE id = ?`;
   try {
      const result = await query(sqlQuery,[commentID]);

      return Response.json({ message: "Comment deleted successfully!" });
   } catch (error) {
      return Response.json({ error: "Failed to delete comment",error }, { status: 500 });
   }
}