import pool from '../database.js';
import axios from 'axios';
import 'dotenv/config';
const API_Key = process.env.CMC_PRO_API_KEY;

const apiController = {};

apiController.fetchGainersOrLosers = async (req, res) => {
  console.log('made it to fetchGainersOrLosers in server');
  const start = req.query.start || 1;
  const sort_dir = req.query.sort_dir || 'desc';
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`;
  try {
    const response = await axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': API_Key,
      },
      params: {
        start: start,
        limit: 12,
        sort: 'percent_change_24h',
        sort_dir: sort_dir,
        cryptocurrency_type: 'all',
        tag: 'all',
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
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&sort=market_cap&cryptocurrency_type=all&tag=all', {
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
