import axios from 'axios';
import 'dotenv/config';
const API_Key = process.env.CMC_PRO_API_KEY;
import pool from '../database.js';

const getAutoCompleteCoinList = async (req, res) => {
  console.log('coin list check');
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&sort=market_cap&cryptocurrency_type=all&tag=all', {
      headers: {
        'X-CMC_PRO_API_KEY': API_Key,
      },
    });
    res.json(response.data);
  } catch (e) {
    console.error('Error fetching data from CoinMarketCap', e);
    res.status(500).json({ message: 'Failed to Fetch Data' });
  }
};

const updatePortfolioData = async (req, res) => {
  console.log('portfolio symbol check');
  const symbols = req.params.symbols;
  if (!symbols) {
    return res.status(400).json({ message: 'No symbols provided' });
  }
  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_Key,
      },
    });
    res.json(response.data);
  } catch (e) {
    console.error('Error fetching data from CoinMarketCap', e);
    res.status(500).json({ message: 'Failed to Fetch Data' });
  }
};

const insertPortfolioData = async (req, res) => {};
const fetchPortfolioData = async (req, res) => {
  const username = req.params.username;
  console.log(username);
  try {
    const dbQuery = `
      SELECT p.symbol, p.price
      FROM portfolios p
      JOIN users u ON p.user_id = u.id
      WHERE u.username = $1;
    `;
    const { rows } = await pool.query(dbQuery, [username]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Failed to fetch user portfolio', error);
    res.status(500).send('Internal Server Error');
  }
};

const updateQuantity = async (req, res) => {};
const deleteCoin = async (req, res) => {};

export { getAutoCompleteCoinList, updatePortfolioData, fetchPortfolioData };
