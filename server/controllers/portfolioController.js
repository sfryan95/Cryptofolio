import axios from 'axios';
import 'dotenv/config';
const API_Key = process.env.CMC_PRO_API_KEY;

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

const insertPortfolioData = async (req, res) => {}
const fetchPortfolioData = async (req, res) => {
  const {username} = req.params;
  if (!username) {
    return res.status(400).json({ message: 'No username provided' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT portfolio.* FROM portfolio 
      JOIN users ON users.id = portfolio.user_id
      WHERE users.username = $1`,
      [username]
    );
    res.json(rows.length ? rows : null); // Return the found portfolio data or null
  } catch (e) {
    console.error('Error finding portfolio data by username:', e);
  }
}
const updateQuantity = async (req, res) => {}
const deleteCoin = async (req, res) => {}

export { getAutoCompleteCoinList, updatePortfolioData, fetchPortfolioData };
