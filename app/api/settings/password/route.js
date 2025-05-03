import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from 'bcryptjs';

export async function PATCH(req) {
   const userId = 14; // For testing purposes, remove this line in production

   // const session = await getServerSession(authOptions);
   // if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
   // const userId = session.user?.id;
   // if (!userId) return Response.json({ error: "User ID not found" }, { status: 400 });

   // get the old and new pass from the frontend
   const { old_password, new_password } = await req.json();
   if (!old_password || !new_password) return Response.json({ error: "All fields are required" }, { status: 400 });

   // check if the user exists
   const sqlQuery = `SELECT password FROM users WHERE id = ?`;
   let result;
   try { result = await query(sqlQuery, [userId]); }
   catch (error) { return Response.json({ error, message: 'Internal Server Error' }, { status: 500 }); }

   // if no, return user not found
   if (result.length === 0) return Response.json({ error: "User not found" }, { status: 404 });

   // if yes, check if the old password is correct
   const { password: hashedPassword } = result[0];
   const isMatch = await bcrypt.compare(old_password, hashedPassword);

   // if no return incorrect password
   if (!isMatch) return Response.json({ error: "Incorrect password" }, { status: 401 });

   // if yes, hash the new pass and update it in the db
   const newHashedPassword = await bcrypt.hash(new_password, 10);
   const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;
   let updateResult;
   try { updateResult = await query(updateQuery, [newHashedPassword, userId]); }
   catch (error) { console.error('Error:', error); }

   // if its not updated for some error, return fail
   if (updateResult.affectedRows === 0) return Response.json({ error: "Failed to update password" }, { status: 500 });

   // if yes, return success
   return Response.json({ message: "Password updated successfully" }, { status: 200 });
}