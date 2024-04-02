import pool from '../server/database.js';

class User {
  static async createUser(username, password) {
    try {
      const res = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [username, password]);
      console.log(`User added with ID: ${res.rows[0].id}`);
      return res.rows[0]; // returns newly created user object
    } catch (e) {
      console.error('Error adding user to userTable:', e);
    }
  }
  static async findById(userId) {
    try {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      return res.rows.length > 0 ? res.rows[0] : null; // Return the found user or null
    } catch (e) {
      console.error('Error finding user by id:', e);
    }
  }
  static async findByUsername(username) {
    try {
      const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return res.rows.length > 0 ? res.rows[0] : null; // Return the found user or null
    } catch (e) {
      console.error('Error finding user by username:', e);
    }
  }
  //make a method for updating user information

  //make a method for deleting a user
  static async deleteById(userId) {
    try {
      const res = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      if (res.rows.length > 0) {
        return res.rows[0]; // Return the found user
      } else {
        return null; // No user found
      }
    } catch (e) {
      console.error('Error deleting user by id:', e);
    }
  }
}

export default User;
