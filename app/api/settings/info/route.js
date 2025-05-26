import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const patchDate = (date) => {
   const dateFormat = new Date(parseInt(date.year), parseInt(date.month));
   return dateFormat;
}

// user can change his name, major, joined_in, bio, profile_picture, address, phone, expected_graduation_date, graduation process, and gpa
export async function PATCH(req) {
   const userId = 14; // For testing purposes, remove this line in production

   // const session = await getServerSession(authOptions);
   // if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
   // const userId = session.user?.id;
   // if (!userId) return Response.json({ error: "User ID not found" }, { status: 400 });

   const params = [];
   const { info } = await req.json();

   if (info.major) {
      const sqlQuery = `SELECT changed_at FROM major_changes WHERE user_id = ? ORDER BY changed_at DESC LIMIT 1`;

      let result;
      try { result = await query(sqlQuery, [userId]); }
      catch (error) { return Response.json({ error, message: 'Internal Server Error', params }, { status: 500 }); }

      if (result.length === 0) return;

      const { changed_at } = result[0];
      const lastChangeDate = new Date(changed_at);
      const now = new Date();
      const monthDifference = (now.getFullYear() - lastChangeDate.getFullYear()) * 12 + (now.getMonth() - lastChangeDate.getMonth());

      if (monthDifference < 5) return Response.json({ notAllowedChangeMajor: true }, { status: 400 });
   }

   if (info.expected_graduation_date){
      info.expected_graduation_date = patchDate(info.expected_graduation_date);
      // console.log(info.expected_graduation_date);
   }

   if (info.joined_in){
      info.joined_in = patchDate(info.joined_in);
      // console.log(info.joined_in);
   }

   if (info.phone){
      info.phone = parseInt(info.phone) // Remove non-numeric characters
   }

   const changedFields = Object.entries(info).map(([key, value]) => {
      params.push(value);
      return `${key} = ?`;
   }).join(", ");
   params.push(userId);

   const sqlQuery = `UPDATE users SET ${changedFields} WHERE id = ?`;
   console.log(sqlQuery, params);

   let result;
   try { result = await query(sqlQuery, params); }

   catch (error) { 
      console.log(result);
      return Response.json({ error, message: 'Internal Server Error', params }, { status: 500 }); }

   if (result.affectedRows === 0) return Response.json({ error: "Failed to update user info" }, { status: 500 });
   return Response.json({ message: "User info updated successfully" }, { status: 200 });
}

