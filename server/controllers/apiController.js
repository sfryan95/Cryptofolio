import pool from '../database.js';
import axios from 'axios';
import 'dotenv/config';
const API_Key = process.env.CMC_PRO_API_KEY;

const apiController = {};

apiController.fetchGainersAndLosers = async (req, res) => {
  console.log('made it to api in server');
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&sort=percent_change_24h&cryptocurrency_type=all&tag=all', {
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

apiController.fetchAutoCompleteCoinList = async (req, res) => {
  console.log('autocomplete check');
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

apiController.fetchUserPortfolioData = async (req, res) => {
  console.log(req.params);
  const username = req.params.username;
  console.log(username);
  try {
    const dbQuery = `
      SELECT p.symbol, p.quantity
      FROM portfolio p
      JOIN users u ON p.user_id = u.id
      WHERE u.username = $1;
    `;
    const { rows } = await pool.query(dbQuery, [username]);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch user portfolio', error);
    res.status(500).send('Internal Server Error');
  }
};

apiController.fetchCoinDataBySymbols = async (req, res) => {
  console.log('portfolio update symbol check');
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

export default apiController;
