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

const getPortfolioData = async (req, res) => {
  console.log('portfolio symbol check');
  const symbols = req.params.symbol;
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

export { getAutoCompleteCoinList, getPortfolioData };
