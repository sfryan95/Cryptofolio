import axios from 'axios';
/* Persistence: To reflect changes in an external database, you would need additional steps:
After successful updates (as indicated by the resolution of promises in Promise.allSettled), make API calls or use your database's SDK to write the updated data back to the database.
This step might involve batch operations or individual updates, depending on the database's capabilities and the structure of your data.
Using Promise.allSettled allows you to make decisions based on the success or failure of each operation, which can be particularly useful for complex error handling and when synchronizing in-memory data with persistent storage. */

export async function updatePortfolio(arr) {
  try {
    const url = `http://localhost:3002/api/portfolio/${arr.map((coin) => coin.symbol).join(',')}`;
    const response = await axios.get(url);
    const data = response.data.data;
    if (data) {
      arr.forEach((coin) => {
        const coinData = data[coin.symbol];
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

function promiseThrottle(func, delay) {
  let cache = new Map();
  let timers = new Map();
  const cachedCache = localStorage.getItem('throttleCache');
  const cachedTimers = localStorage.getItem('throttleTimers');
  if (cachedCache) {
    cache = new Map(JSON.parse(cachedCache));
  }
  if (cachedTimers) {
    timers = new Map(JSON.parse(cachedTimers));
  }

  return async (...args) => {
    console.log(args);
    const argHash = JSON.stringify(args);
    let promise;
    if (!cache.has(argHash)) {
      console.log('Making API call for', argHash);
      promise = func(...args).catch((e) => {
        clearTimeout(timers.get(argHash));
        timers.delete(argHash);
        throw e;
      });
      cache.set(argHash, true);
      timers.set(
        argHash,
        setTimeout(() => {
          cache.delete(argHash);
          timers.delete(argHash);
          localStorage.setItem('throttleCache', JSON.stringify(Array.from(cache.entries())));
          localStorage.setItem('throttleTimers', JSON.stringify(Array.from(timers.entries())));
        }, delay)
      );
    } else {
      console.log('Retrieving from cache for', argHash);
    }
    return await promise;
  };
}

export const throttledUpdatePortfolio = promiseThrottle(updatePortfolio, 60000);
