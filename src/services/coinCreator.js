// import CryptoCoin from '../models/CoinClass';
// import { updatePortfolio } from './api';

// export async function createCoins(arr) {
//   const coins = arr.map((item) => new CryptoCoin(item.id, item.name, item.symbol, item.quantity, item.price, item.percent_change_24h, item.allocation));
//   const totalValue = coins.reduce((acc, coin) => acc + coin.value, 0);
//   coins.forEach((coin) => (coin.allocation = coin.value / totalValue));
//   try {
//     await updatePortfolio(coins);
//   } catch (e) {
//     console.error('There was an error updating the coins`s prices and percentage change:', e);
//   }

//   return coins;
// }
