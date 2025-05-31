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
    const sql = `
      UPDATE users
SET profile_picture = NULL
WHERE id = 1;
    `;
    await connection.execute(sql);
    console.log('✅ Default value of profile_picture set to NULL');
  } catch (error) {
    console.error('❌ Error updating column:', error.message);
  } finally {
    await connection.end();
  }
}

setProfilePictureDefaultNull();
