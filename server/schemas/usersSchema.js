import pool from '../database.js';

const createUsersTable = async () => {
  const queryText = `CREATE TABLE users (
      id SERIAL PRIMARY KEY, 
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );`;
  try {
    await pool.query(queryText);
    console.log('Users table with username, password, and email columns created successfully.');
  } catch (e) {
    console.error('Error creating users table:', e);
  }
};

createUsersTable();
