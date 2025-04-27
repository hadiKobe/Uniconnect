import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const userId = session.user.id;
        const { toUser, message, link, type } = body;

        if (!toUser || !message || !link || !type) {
            return Response.json({ error: "All fields are required" }, { status: 400 });
        }

        const sqlQuery = `
            INSERT INTO notifications (from_user_id, to_user_id, message, link, type)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await query(sqlQuery, [userId, toUser, message, link, type]);

        if (result.affectedRows > 0) {
            return Response.json({ message: "Notified successfully!" });
        } else {
            return Response.json({ error: "Failed to notify" }, { status: 500 });
        }

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}
