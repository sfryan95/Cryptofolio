import axios from 'axios';

async function fetchGainersAndLosers() {
  try {
    const response = await axios.get('http://localhost:3002/api/gainers-losers');
    const data = response.data.data;
    if (data) {
      return data.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        percent_change_24h: coin.quote.USD.percent_change_24h,
      }));
    }
  } catch (e) {
    console.error('There was an error fetching coin list', e);
    return [];
  }
}

export default fetchGainersAndLosers;
