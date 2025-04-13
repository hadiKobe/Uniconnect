import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Helper to convert Web API Request to a Node.js Readable stream
function toNodeReadableStream(webReq) {
  const reader = webReq.body.getReader();

  return new Readable({
    async read() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.push(value);
      }
      this.push(null);
    },
  });
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = new IncomingForm({ multiples: true, keepExtensions: true, uploadDir });

    // Convert Web API request to Node-readable stream
    const nodeReq = toNodeReadableStream(req);
    nodeReq.headers = Object.fromEntries(req.headers.entries());

    // Wrap formidable's callback-based parsing in a Promise
    const parseForm = () =>
      new Promise((resolve, reject) => {
        form.parse(nodeReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    const { fields, files } = await parseForm();

    const userId = session.user?.id;
    const description = fields.description?.[0];
    const category = fields.category?.[0];
    const details = fields.details?.[0] ? JSON.parse(fields.details[0]) : null;

    if (!description || !category || !userId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO posts (user_id, content, category) VALUES (?, ?, ?)`,
      [userId, description, category]
    );
    const postId = result.insertId;

    const cat = category.toLowerCase();

    if (cat === "tutor" && details) {
      const { subject, rate, location } = details;
      await query(
        `INSERT INTO tutoring_details (post_id, subject, rate, location) VALUES (?, ?, ?, ?)`,
        [postId, subject ?? null, rate ?? null, location ?? null]
      );
    }

    if (cat === "market" && details) {
      const { price, location } = details;
      await query(
        `INSERT INTO product_details (post_id, price, location) VALUES (?, ?, ?)`,
        [postId, price ?? null, location ?? null]
      );
    }

    if (cat === "job" && details) {
      const { type, location, salary } = details;
      await query(
        `INSERT INTO jobs_details (post_id, job_type, location, salary) VALUES (?, ?, ?, ?)`,
        [postId, type ?? null, location ?? null, salary ?? null]
      );
    }

    // === Handle Media Uploads ===
    const uploadedFiles = files.media instanceof Array ? files.media : [files.media];

    for (const file of uploadedFiles) {
      if (!file) continue;

      // Extract file extension and create a clean, unique file name
      const ext = path.extname(file.originalFilename || file.newFilename);
      const cleanName = path.basename(file.originalFilename || file.newFilename, ext);
      const newFileName = `post-${postId}-${Date.now()}-${cleanName}${ext}`;
      const newPath = path.join(uploadDir, newFileName);

      // Rename (move) the uploaded file to our final /uploads location
      fs.renameSync(file.filepath, newPath);

      // Store the media file info in the database
      const fileUrl = `/uploads/${newFileName}`;
      const type = file.mimetype?.split("/")?.[0] || "file";
      await query(
        `INSERT INTO post_media (post_id, path_url, type) VALUES (?, ?, ?)`,
        [postId, fileUrl, type]
      );
    }

    return Response.json({ message: "Post and media uploaded successfully!" });
  } catch (error) {
    console.error("Post error:", error);
    return Response.json({ error: "Failed to add post" }, { status: 500 });
  }
}
