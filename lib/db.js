import mysql from "mysql2/promise";

// ✅ Ensure MySQL connection reads from `.env.local`
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function test() {
  try {
    const [rows] = db.execute('Select 1 + 1 as result');
    // console.log('✅ Connected. Result:', rows)
  } catch (err) {
    console.error('❌ Connection failed:', err)
  }
}

export async function query(sql, params) {
  const [results] = await db.execute(sql, params);
  return results;
}
