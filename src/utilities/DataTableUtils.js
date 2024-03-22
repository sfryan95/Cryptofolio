export const fakeDataBaseEntry = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    quantity: 1,
    percent_change_24h: 0.03,
    price: 70000,
    allocation: null,
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    quantity: 8,
    percent_change_24h: 0.04,
    price: 4000,
    allocation: null,
  },
  {
    id: 3,
    name: 'Cardano',
    symbol: 'ADA',
    quantity: 234,
    percent_change_24h: 0.075,
    price: 5,
    allocation: null,
  },
  {
    id: 4,
    name: 'Solana',
    symbol: 'SOL',
    quantity: 553,
    percent_change_24h: 0.025,
    price: 10,
    allocation: null,
  },
  {
    id: 5,
    name: 'Ripple',
    symbol: 'XRP',
    quantity: 1230,
    percent_change_24h: 0.1,
    price: 0.75,
    allocation: null,
  },
];

// helper functions

export function cash(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);
}

export function percent(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(num);
}

export function sumColumn(arr, propName) {
  return arr.map((item) => item[propName]).reduce((acc, cur) => acc + cur, 0);
}

// export function createData(coin) {
//   return {
//     id: coin.id,
//     coin: coin.name,
//     symbol: coin.symbol,
//     quantity: coin.quantity,
//     price: coin.price,
//     percent_change_24h: coin.percent_change_24h,
//     value: coin.value,
//     allocation: coin.allocation,
//   };
// }
