import pool from '../server/database.js';
import User from './usersModel.js';

class Portfolio {
  static async createPortfolioData(username, symbol, quantity) {
    try {
      const user = await User.findDataByUsername(username);
      if (!user) {
        console.error('User not found.');
        return null;
      }
      const { rows } = await pool.query('INSERT INTO portfolio (user_id, symbol, quantity) VALUES ($1, $2, $3) RETURNING *', [user.id, symbol, quantity]);
      console.log(`Portfolio data added for user ID: ${user.id}, Symbol: ${rows[0].symbol}`);
      return rows[0];
    } catch (e) {
      console.error('Error adding portfolio data to portfolioTable:', e);
    }
  }
  // perfer this method over find by username, it's more efficient
  static async findDataById(userId) {
    try {
      const { rows } = await pool.query('SELECT * FROM portfolio WHERE user_id = $1', [userId]);
      return rows.length ? rows : null; // Return the found portfolio data or null
    } catch (e) {
      console.error('Error finding portfolio data by userId:', e);
    }
  }
  static async findDataByUsername(username) {
    try {
      const { rows } = await pool.query(
        `SELECT portfolio.* FROM portfolio 
        JOIN users ON users.id = portfolio.user_id
        WHERE users.username = $1`,
        [username]
      );
      return rows.length ? rows : null; // Return the found portfolio data or null
    } catch (e) {
      console.error('Error finding portfolio data by username:', e);
    }
  }
  //make a method for updating portfolio information
  static async updateQuantity(username, symbol, quantity) {
    try {
      const user = await User.findDataByUsername(username);
      if (!user) {
        console.error('User not found.');
        return null;
      }
      const { rows } = await pool.query('UPDATE portfolio SET quantity = $1 WHERE user_id = $2 AND symbol = $3 RETURNING *', [quantity, user.id, symbol]);
      if (rows.length === 0) {
        console.log(`No portolio entry found or updated for : ${user.id}, Symbol: ${symbol}`);
        return null;
      }
      console.log(`Quantity updated for user ID: ${user.id}, Symbol: ${symbol}, New Quantity: ${rows[0].quantity}`);
      return rows[0];
    } catch (e) {
      console.error('Error updating quantity:', e);
    }
  }
  //make a method for deleting portfolio information
  static async deleteCoin(username, symbol) {}
}

export default Portfolio;
