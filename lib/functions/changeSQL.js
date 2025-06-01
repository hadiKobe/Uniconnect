import mysql from 'mysql2/promise';

// Replace this with your Railway MySQL credentials
const connectionConfig = {
  host: 'shinkansen.proxy.rlwy.net',
  user: 'root',
  password: 'grPsOgcVNLxwsJuFmZpJbpTjCrMauZeK',
  database: 'railway',
  port: 19238
};

async function setProfilePictureDefaultNull() {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    const queries = [
      `UPDATE jobs_details SET job_type = 'Part-time' WHERE post_id = 4`,
      `UPDATE jobs_details SET job_type = 'Part-time' WHERE post_id = 9`,
      `UPDATE jobs_details SET job_type = 'Full-time' WHERE post_id = 11`,
      `UPDATE jobs_details SET job_type = 'Internship' WHERE post_id = 15`,
      `UPDATE jobs_details SET job_type = 'Part-time' WHERE post_id = 16`,
      `UPDATE jobs_details SET job_type = 'Part-time' WHERE post_id = 17`
    ];
    for (const query of queries) {
      await connection.execute(query);
    }
  } catch (error) {
    console.error('❌ Error updating column:', error.message);
  } finally {
    await connection.end();
  }
}

setProfilePictureDefaultNull();
