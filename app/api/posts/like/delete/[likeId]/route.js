import { query } from "@/lib/db";

export async function DELETE(request,{params}) {
   const { likeId } = await params;
   const sqlQuery = `Delete from likes WHERE id = ?`;
   try {
      const result = await query(sqlQuery,[likeId]);
      console.log(result);

      return Response.json({ message: "Like deleted successfully!" });
   } catch (error) {
      return Response.json({ error: "Failed to delete Like",error }, { status: 500 });
   }
}