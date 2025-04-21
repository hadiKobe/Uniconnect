import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
   const session = await getServerSession(authOptions);
   if (!session) {
       return Response.json({ error: "Unauthorized" }, { status: 401 });
   }
   const user_id = session.user.id;

   const sqlQuery = `SELECT * FROM reports LIMIT 20`;
   try {
      await query(sqlQuery, []);
      return new Response(JSON.stringify({ message: "Reported successfully" }), { status: 200 });
   } catch (error) {
       console.error('Error:', error);
   }
}