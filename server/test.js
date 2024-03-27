import pool from './database.js'; // Adjust the path to where your database.js file is located

async function testDbConnection() {
  try {
    const { rows } = await pool.query(`
    SELECT p.* FROM portfolio p
    JOIN users u ON u.id = p.user_id
    WHERE u.username = 'seanryan9five';
  `);
    console.log('Connection successful, current time from DB:', rows[0]);
    pool.end(); // Close the pool connection after the query
  } catch (err) {
    console.error('Connection failed', err.stack);
  }
}

testDbConnection();
