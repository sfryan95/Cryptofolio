import pool from '../database.js';

const createPortfolioTable = async () => {
  const queryText = `CREATE TABLE portfolio (
      id SERIAL PRIMARY KEY, 
      user_id INTEGER NOT NULL,
      symbol VARCHAR(10) NOT NULL,
      quantity DECIMAL(10, 4) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;
  try {
    await pool.query(queryText);
    console.log('Portfolio table with user_id, symbol, and quantity columns created successfully.');
  } catch (e) {
    console.error('Error creating portfolio table:', e);
  }
};

createPortfolioTable();
