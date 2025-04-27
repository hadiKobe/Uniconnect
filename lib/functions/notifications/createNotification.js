import { query } from "@/lib/db";

export async function createNotification(fromUserId, toUserId, message, link, type) {
    if (!fromUserId || !toUserId || !message || !link || !type) {
        throw new Error("All fields are required to create a notification.");
    }

    const sql = `
        INSERT INTO notifications (from_user_id, to_user_id, message, link, type)
        VALUES (?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [fromUserId, toUserId, message, link, type]);

    if (!result || result.affectedRows === 0) {
        throw new Error("Failed to create notification.");
    }

    return result; // You can return result if needed, or just return true/ok
}
