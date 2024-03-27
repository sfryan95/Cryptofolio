import { useEffect, useState } from 'react';
import PieChart from './PieChart.jsx';
import CryptoForm from './CryptoForm.jsx';
import DataTable from './DataTable.jsx';
import './Portfolio.css';
import { fakeDataBaseEntry } from '../../utilities/DataTableUtils.js';
import { updatePortfolio } from '../../services/api.js';
import CryptoCoin from '../../models/CoinClass.jsx';
import axios from 'axios';

function Portfolio() {
  const [rows, setRows] = useState([]);
  const [coinList, setCoinList] = useState([]);

  async function fetchUserPortfolio(username) {
    try {
      const response = await axios.get(`http://localhost:3002/api/portfolio/users/${username}`);
      if (response.data.length === 0) {
        console.log('No coins found for this user.');
        return [];
      }
      return response.data;
    } catch (error) {
      console.error('There was an error fetching the portfolio:', error.message);
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
        const response = await axios.get('http://localhost:3002/api/portfolio');
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
        const apiData = await fetchUserPortfolio('seanryan9five');

        const coinArr = rows.map((dbItem) => {
          const apiItem = apiData.find((apiCoin) => apiCoin.symbol === dbItem.symbol);
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
    console.log('portfolio component mounted');
  }, []);

  return (
    <div className="portfolio-body">
      <PieChart rows={rows} />
      <CryptoForm
        coinList={coinList}
        rows={rows}
        setRows={setRows}
      />
      <DataTable rows={rows} />
    </div>
  );
}

export default Portfolio;
