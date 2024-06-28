import pool from '../database.js';

const createUsersTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, 
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      avatar_url VARCHAR(255) DEFAULT '/images/bigSean.png'
    );`;
  try {
    await pool.query(queryText);
    console.log('Users table with username, password, and email columns created successfully.');
  } catch (e) {
    console.error('Error creating users table:', e);
  }
};

createUsersTable();
