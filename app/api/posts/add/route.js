import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Now we expect simple JSON, not FormData
    const { description, category, details, mediaUrls } = await req.json();

    const userId = session.user?.id;

    if (!description || !category || !userId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Insert the main post
    const result = await query(
      `INSERT INTO posts (user_id, content, category) VALUES (?, ?, ?)`,
      [userId, description, category]
    );
    const postId = result.insertId;

    const cat = category.toLowerCase();

    // ✅ Insert category-specific details
    if (cat === "tutor" && details) {
      const { subject, rate, location } = details;
      await query(
        `INSERT INTO tutoring_details (post_id, subject, rate, location) VALUES (?, ?, ?, ?)`,
        [postId, subject ?? null, rate ?? null, location ?? null]
      );
    }

    if (cat === "market" && details) {
      const { price, location, type, product_name } = details;
      await query(
        `INSERT INTO product_details (post_id, price, location, type, product_name) VALUES (?, ?, ?, ?, ?)`,
        [postId, price ?? null, location ?? null, type ?? null, product_name ?? null]
      );
    }

    if (cat === "job" && details) {
      const { type, location, salary, position } = details;
      // console.log(position);
      await query(
        `INSERT INTO jobs_details (post_id, job_type, location, salary, position) VALUES (?, ?, ?, ?, ?)`,
        [postId, type ?? null, location ?? null, salary ?? null, position ?? null]
      );
    }

    // ✅ Save media URLs (from Supabase) to post_media table
    if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
      for (const url of mediaUrls) {
        if (typeof url !== "string" || url.trim() === "") {
          throw new Error("Invalid media URL detected");
        }

        const type = url.includes(".mp4") ? "video" : "image";

        await query(
          `INSERT INTO post_media (post_id, path_url, type) VALUES (?, ?, ?)`,
          [postId, url, type]
        );
      }
    }


    return Response.json({ message: "Post and media uploaded successfully!" });
  } catch (error) {
    console.error("Post error:", error);
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}
