// import axios from 'axios';

// async function fetchGainers() {
//   try {
//     const response = await axios.get('http://localhost:3002/api/gainers');
//     const data = response.data.data;
//     if (data) {
//       return data.map((coin) => ({
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol,
//         percent_change_24h: coin.quote.USD.percent_change_24h,
//       }));
//     }
//   } catch (e) {
//     console.error('There was an error fetching gainers coin list', e);
//     return [];
//   }
// }

// async function fetchLosers() {
//   try {
//     const response = await axios.get('http://localhost:3002/api/losers');
//     const data = response.data.data;
//     if (data) {
//       return data.map((coin) => ({
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol,
//         percent_change_24h: coin.quote.USD.percent_change_24h,
//       }));
//     }
//   } catch (e) {
//     console.error('There was an error fetching losers coin list', e);
//     return [];
//   }
// }

// export { fetchGainers, fetchLosers };
