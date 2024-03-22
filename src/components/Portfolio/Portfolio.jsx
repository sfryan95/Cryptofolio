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
        const coinArr = fakeDataBaseEntry.map((item) => new CryptoCoin(item.id, item.name, item.symbol, item.quantity, item.price, item.percent_change_24h, item.allocation));
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
      <CryptoForm coinList={coinList} rows={rows} setRows={setRows} />
      <DataTable rows={rows} />
    </div>
  );
}

export default Portfolio;
