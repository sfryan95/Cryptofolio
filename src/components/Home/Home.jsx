import { useState, useEffect } from 'react';
import GainersAndLosersCards from './Gainers.jsx';
import fetchGainersAndLosers from '../../utilities/HomeUtils.js';

function Home() {
  const [gainersAndLosers, setGainersAndLosers] = useState([]);
  useEffect(() => {
    const fetchAndSetGainersAndLosers = async () => {
      const cacheKey = 'coinListKey';
      const cachedData = localStorage.getItem(cacheKey);
      const currentTime = new Date().getTime();
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        const isCacheValid = currentTime - timestamp < 24 * 60 * 60 * 1000;
        if (isCacheValid) {
          setGainersAndLosers(data);
          return;
        }
      }
      const coinList = await fetchGainersAndLosers();
      if (coinList) {
        setGainersAndLosers(coinList);
        const cacheValue = JSON.stringify({ timestamp: currentTime, data: coinList });
        localStorage.setItem(cacheKey, cacheValue);
      }
    };
    fetchAndSetGainersAndLosers();
  }, []);

  return (
    <div className="grid-container">
      <GainersAndLosersCards coinList={gainersAndLosers} />
    </div>
  );
}

export default Home;
