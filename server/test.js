import pool from './database.js'; // Adjust the path to where your database.js file is located

async function testDbConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful, current time from DB:', res.rows[0]);
    pool.end(); // Close the pool connection after the query
  } catch (err) {
    console.error('Connection failed', err.stack);
  }
}

testDbConnection();
