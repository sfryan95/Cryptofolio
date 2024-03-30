import pool from '../database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const userController = {};

userController.insertUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return next({
      log: 'Missing email or password in userController.insertUser.',
      status: 400,
      message: { error: 'Email and/or password cannot be empty.' },
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);
    const user = userResult.rows[0];
    res.locals.user = user; //might need to be '_.id';
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token });
    return next();
  } catch (e) {
    let errorStatus = 500;
    let errorMessage = 'An unexpected error occurred.';

    if (e.code === '23505') {
      errorStatus = 409;
      errorMessage = 'Email already exists.';
    }
    return next({
      log: `An error occured in userController.insertUser: ${e}`,
      status: errorStatus,
      message: { error: errorMessage },
    });
  }
};

userController.fetchUserPortfolioData = async (req, res) => {
  const userId = req.user.id;
  console.log(`fetched user portfolio for: ${userId}`);
  try {
    const dbQuery = `
      SELECT p.symbol, p.quantity
      FROM portfolio p
      JOIN users u ON p.user_id = u.id
      WHERE u.id = $1;
    `;
    const { rows } = await pool.query(dbQuery, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch user portfolio', error);
    res.status(500).send('Internal Server Error');
  }
};

userController.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.sendStatus(401);
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

userController.insertCoin = async (req, res, next) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;
  console.log('symbol', symbol);
  console.log('quantity', quantity);
  try {
    if (!userId) {
      console.error('User not found.');
      return null;
    }
    const { rows } = await pool.query('INSERT INTO portfolio (user_id, symbol, quantity) VALUES ($1, $2, $3) RETURNING *', [userId, symbol, quantity]);
    console.log(`Portfolio data added for user ID: ${userId}, Symbol: ${rows[0].symbol}`);
    res.json();
  } catch (e) {
    console.error('Error adding portfolio data to portfolioTable:', e);
  }
};

userController.updateQuantity = async (req, res, next) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;
  console.log('symbol', symbol);
  console.log('quantity', quantity);
  try {
    if (!userId) {
      console.error('User not found.');
      return res.status(404).send('User not found.');
    }
    const { rows } = await pool.query('UPDATE portfolio SET quantity = $1 WHERE user_id = $2 AND symbol = $3 RETURNING *', [quantity, userId, symbol]);
    if (rows.length === 0) {
      return res.status(404).send(`No portolio entry found or updated for : ${userId}, Symbol: ${symbol}`);
    }
    console.log(`Quantity updated for user ID: ${rows[0].userId}, Symbol: ${rows[0].symbol}, New Quantity: ${rows[0].quantity}`);
    return res.status(200).send('Quantity successfully updated.');
  } catch (e) {
    console.error('Error updating quantity:', e);
    return res.status(500).send('Error updating quantity');
  }
};

export default userController;
