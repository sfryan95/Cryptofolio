import { useEffect, useState } from 'react';
import PieChart from './PieChart.jsx';
import CryptoForm from './CryptoForm.jsx';
import DataTable from './DataTable.jsx';
import './Portfolio.css';
import CryptoCoin from '../../models/CoinClass.jsx';
import axios from 'axios';

function Portfolio({ isDarkMode }) {
  const [rows, setRows] = useState([]);
  const [coinList, setCoinList] = useState([]);

  async function fetchUserPortfolio() {
    const token = localStorage.getItem('token');
    const url = 'http://localhost:3002/user/portfolio/';
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.get(url, config);
      if (response.data.length === 0) {
        console.log('No coins found for this user.');
        return [];
      }
      return response.data;
    } catch (e) {
      console.error('There was an error fetching the portfolio:', e.message);
    }
  }

  async function updatePortfolio(arr) {
    try {
      const url = `http://localhost:3002/api/update-portfolio/${arr.map((coin) => coin.symbol).join(',')}`;
      const response = await axios.get(url);
      const data = response.data.data;
      if (data) {
        arr.forEach((coin) => {
          const coinData = data[coin.symbol];
          if (coinData && coinData.name && coinData.id) {
            coin.id = coinData.id;
            coin.name = coinData.name;
          }
          if (coinData && coinData.quote && coinData.quote.USD) {
            coin.price = coinData.quote.USD.price;
            coin.percent_change_24h = coinData.quote.USD.percent_change_24h;
          }
        });
      } else {
        console.log('No data recieved to update portfolio');
      }
    } catch (e) {
      console.error(`There was an error updating the portfolio:`, e);
    }
  }

  useEffect(() => {
    async function fetchCoinList() {
      const cacheKey = 'autoCompleteCoinListKey';
      const cachedData = localStorage.getItem(cacheKey);
      const currentTime = new Date().getTime();
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const isCacheValid = currentTime - timestamp < 24 * 60 * 60 * 1000;
        if (isCacheValid) {
          setCoinList(data);
          return;
        }
      }
      try {
        const response = await axios.get('http://localhost:3002/api/autocomplete');
        const coinData = response.data.data;
        if (coinData) {
          const coinsArrLabel = coinData.map((coin) => ({
            label: coin.name,
            symbol: coin.symbol,
          }));
          setCoinList(coinsArrLabel);
          const cacheValue = JSON.stringify({ timestamp: currentTime, data: coinsArrLabel });
          localStorage.setItem(cacheKey, cacheValue);
        } else {
          console.log('No data recieved for coin list.');
        }
      } catch (e) {
        console.error('There was an error fetching the coin list', e);
      }
    }

    async function initAndFetchData() {
      try {
        const dbData = await fetchUserPortfolio();

        const coinArr = dbData.map((dbItem) => {
          const apiItem = dbData.find((apiCoin) => apiCoin.symbol === dbItem.symbol);
          if (!apiItem) {
            console.error(`No API data found for symbol: ${dbItem.symbol}`);
            return null;
          }
          return new CryptoCoin(apiItem.id, apiItem.name, dbItem.symbol, dbItem.quantity, apiItem.price, apiItem.percent_change_24h);
        });

        await updatePortfolio(coinArr);
        const totalValue = coinArr.reduce((acc, coin) => acc + coin.value, 0);
        coinArr.forEach((coin) => (coin.allocation = coin.value / totalValue));
        setRows(coinArr);
      } catch (e) {
        console.error('There was an error updating your potfolio', e);
      }
    }
    initAndFetchData();
    fetchCoinList();
  }, []);

  return (
    <div className="portfolio-body">
      <PieChart rows={rows} />
      <CryptoForm coinList={coinList} rows={rows} setRows={setRows} />
      <DataTable rows={rows} setRows={setRows} isDarkMode={isDarkMode} />
    </div>
  );
}

export default Portfolio;
