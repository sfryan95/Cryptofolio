import pool from '../database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const userController = {};

// expected input - email and password on req.body
// expected output - JWT and/or response status/message
userController.insertUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('email:', email);
  console.log('password:', password);
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

    if (userResult.rows.length === 0) {
      throw new Error('User insertion failed.');
    }

    const user = userResult.rows[0];
    res.locals.user = user;

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token });
  } catch (e) {
    let errorStatus = 500;
    let errorMessage = 'An unexpected error occurred. Please try again!';
    if (e.code === '23505') {
      errorStatus = 409;
      errorMessage = 'Email already exists.';
    }

    console.error(`Error in userController.insertUser: ${e.message || e}`);

    return next({
      log: `An error occurred in userController.insertUser: ${e.message || e}`,
      status: errorStatus,
      message: { error: errorMessage },
    });
  }
};

// expected input - email on req.body
// expected output - user saved to req.user and/or response status/message
userController.findUserByEmail = async (req, res, next) => {
  const email = req.body.email || req.user.email;
  try {
    const response = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = response.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    if (req.method === 'POST') {
      req.user = {
        id: user.id,
        password: user.password,
        email: user.email,
      };
    } else if (req.method === 'DELETE') {
      req.user = {
        id: user.id,
        email: user.email,
      };
    }
    return next();
  } catch (e) {
    return next({
      log: `An error occured in userController.findUserByEmail: ${e}`,
      status: 401,
      message: { error: 'An unexpected error occurred.' },
    });
  }
};

// expected input - user on req.user
// expected output - avatar url from DB and/or response status/message
userController.getUserAvatar = async (req, res, next) => {
  const userId = req.user.id;
  console.log(`fetched avatar for: ${userId}`);
  try {
    const result = await pool.query('SELECT avatar_url FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const avatarUrl = result.rows[0].avatar_url;
    return res.json({ avatarUrl });
  } catch (e) {
    console.error('Error fetching user avatar:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// expected input - password on req.body; user on req.user
// expected output - JWT and/or response status/message
userController.verifyUser = async (req, res, next) => {
  const { password } = req.body;
  const user = req.user;
  try {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (e) {
    return next({
      log: `An error occured in userController.verifyUser: ${e}`,
      status: 401,
      message: { error: 'An unexpected error occurred.' },
    });
  }
};

// expected input - userId on req.user
// expected output - portfolio data from db and/or response status/message
userController.fetchUserPortfolioData = async (req, res) => {
  console.log('made it to fetchUserPortfolioData');
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
    return next({
      log: `An error occured in userController.fetchUserPortfolioData: ${e}`,
      status: 500,
      message: { error: 'An unexpected errcdor occurred.' },
    });
  }
};

// expected input - token from req.headers
// expected output - forbidden/unauthorized response status/message or moves on to next middleware
userController.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = { id: user.id, email: user.email };
    return next();
  });
};

// expected input - userId on req.user; symbol and quantity on req.body
// expected output - response status/message
userController.insertCoin = async (req, res, next) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;
  console.log('symbol', symbol);
  console.log('quantity', quantity);
  try {
    if (!userId) {
      return res.status(404).json({ error: 'Unable to save coin in the database.' });
    }
    const { rows } = await pool.query('INSERT INTO portfolio (user_id, symbol, quantity) VALUES ($1, $2, $3) RETURNING *', [userId, symbol, quantity]);
    console.log(`Portfolio data added for user ID: ${userId}, Symbol: ${rows[0].symbol}`);
    res.json();
  } catch (e) {
    console.error('Error adding portfolio data to portfolioTable:', e);
  }
};

// expected input - userId on req.user; symbol and quantity on req.body
// expected output - quantity of coin changed in db and/or status/message
userController.updateQuantity = async (req, res, next) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;
  console.log('symbol', symbol);
  console.log('quantity', quantity);
  try {
    if (!userId) {
      console.error('User not found.');
      return res.status(404).json({ error: 'User not found.' });
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

// expected input - userId on req.user; email on req.body
// expected output - email of user changed in db and/or status/message
userController.updateEmail = async (req, res, next) => {
  const userId = req.user.id;
  const { email } = req.body;
  try {
    if (!userId) {
      console.error('User not found.');
      return res.status(404).json({ error: 'User not found.' });
    }
    const { rows } = await pool.query('UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email', [email, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: `No user email found or updated for : ${userId}, Email: ${email}` });
    }
    console.log(`Email updated for user ID: ${rows[0].id}, Email: ${rows[0].email}`);
    return res.status(200).json({ message: 'Email successfully updated.', email: rows[0].email });
  } catch (e) {
    console.error('Error updating user:', e);
    return res.status(500).json({ error: 'Error updating email.' });
  }
};

// expected input - userId on req.user; password on req.body
// expected output - password of user changed in db and/or status/message
userController.updatePassword = async (req, res, next) => {
  const userId = req.user.id;
  const { password } = req.body;
  try {
    if (!userId) {
      console.error('User not found.');
      return res.status(404).json({ error: 'User not found.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING id', [hashedPassword, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: `No user password found or updated for : ${userId}` });
    }
    console.log(`Password updated for user ID: ${rows[0].id}`);
    return res.status(200).json({ message: 'Password successfully updated.' });
  } catch (e) {
    console.error('Error updating user:', e);
    return res.status(500).json({ error: 'Error updating password.' });
  }
};

// expected input - userId on req.user; avatar file on req.body
// expected output - avatar of user changed in db and/or status/message
userController.updateAvatar = async (req, res, next) => {
  const userId = req.user.id;
  const avatarFile = req.file;
  try {
    if (!userId) {
      console.error('User not found.');
      return res.status(404).json({ error: 'User not found.' });
    }
    if (!avatarFile) {
      console.error('No avatar file uploaded.');
      return res.status(404).json({ error: 'No avatar file uploaded.' });
    }

    const avatarUrl = `/avatars/${avatarFile.filename}`;

    const { rows } = await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING id, avatar_url', [avatarUrl, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: `No user avatar found or updated for : ${userId}` });
    }
    console.log(`Avatar updated for user ID: ${rows[0].id}`, rows);
    return res.status(200).json({ message: 'Avatar successfully updated.' });
  } catch (e) {
    if (e instanceof multer.MulterError) {
      // Handle Multer errors
      console.error('Multer error:', e);
      return res.status(400).json({ error: e.message });
    } else {
      // Handle other errors
      console.error('Error updating avatar:', e);
      return res.status(500).json({ error: 'Error updating avatar.' });
    }
  }
};

// expected input - userId on req.user
// expected output - user deleted in db which will trigger deletion of user's portfolio data in portfolio table and/or status/message
userController.deleteUserById = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const deleteResult = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    if (deleteResult.rowCount > 0) {
      return res.status(204).send(); // or res.status(200).json({ message: 'User successfully deleted' });
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (e) {
    return next({
      log: `An error occured in userController.deleteUserById: ${e}`,
      status: 500,
      message: { error: 'Error deleting user by id.' },
    });
  }
};

userController.deletePortfolioEntryById = async (req, res, next) => {
  const userId = req.user.id;
  const { symbol } = req.body;
  try {
    const deleteResult = await pool.query('DELETE FROM portfolio USING users WHERE portfolio.user_id = users.id AND users.id = $1 AND portfolio.symbol = $2', [userId, symbol]);
    if (deleteResult.rowCount > 0) {
      console.log(`Deleted coin with symbol ${symbol} for user with id ${userId}`);
      return res.status(204).send(); // or res.status(200).json({ message: 'User successfully deleted' });
    } else {
      return res.status(404).json({ error: 'Coin entry not found.' });
    }
  } catch (e) {
    return next({
      log: `An error occured in userController.deletePortfolioEntryById: ${e}`,
      status: 500,
      message: { error: 'Error deleting portfolio entry by user id.' },
    });
  }
};

export default userController;
