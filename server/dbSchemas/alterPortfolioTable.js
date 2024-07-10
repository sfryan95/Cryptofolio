import pool from '../database.js';

const alterPortfolioTable = async () => {
  const queryText = `ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;`;
  try {
    await pool.query(queryText);
    console.log('Column is_demo added to the portfolio table successfully.');
  } catch (e) {
    console.error('Error adding column is_demo to portfolio table:', e);
  }
};

alterPortfolioTable();