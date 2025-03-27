import mysql from "mysql2/promise";

// ✅ Ensure MySQL connection reads from `.env.local`
export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "liuunity", // ✅ Change this to match your actual database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
