const rows = [
  {
    id: 1,
    coin: 'Cupcake',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 2,
    coin: 'Donut',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 3,
    coin: 'Eclair',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 4,
    coin: 'Frozen yoghurt',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 5,
    coin: 'Gingerbread',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 6,
    coin: 'Honeycomb',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 7,
    coin: 'Ice cream sandwich',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 8,
    coin: 'Jelly Bean',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 9,
    coin: 'KitKat',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
  {
    id: 10,
    coin: 'Lollipop',
    symbol: 305,
    quantity: 3.7,
    price: 67,
    change24: 4.3,
    value: 10,
    allocation: 10,
  },
];

const obj = {
  id: 1,
  coin: 'Cupcake',
  symbol: 305,
  quantity: 3.7,
  price: 67,
  change24: 4.3,
  value: 10,
  allocation: 10,
};

const { value } = obj;
console.log(obj);
console.log(value);

function sumColumn(arr, propName) {
  return arr.reduce((sum, item) => sum + (item[propName] || 0), 0);
}

const allocationTotal = sumColumn(rows, 'allocation');
const valueTotal = sumColumn(rows, 'value');

console.log(allocationTotal);
console.log(valueTotal);

/* 
export const cryptocurrencies = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    slug: 'bitcoin',
    cmc_rank: 1,
    num_market_pairs: 9205,
    circulating_supply: 5339,
    total_supply: 2783,
    max_supply: 3336,
    infinite_supply: null,
    last_updated: '2024-03-16T03:35:04.523Z',
    date_added: '2024-03-16T03:35:04.523Z',
    tags: ['crypto'],
    platform: null,
    self_reported_circulating_supply: null,
    self_reported_market_cap: null,
    quote: {
      USD: {
        price: 0.9184398395677849,
        volume_24h: 2670,
        volume_change_24h: 0.18268483947672398,
        percent_change_1h: 0.8759271552007142,
        percent_change_24h: 0.16829644419648981,
        percent_change_7d: 0.6298510330165468,
        market_cap: 0.7924025361175113,
        market_cap_dominance: 9304,
        fully_diluted_market_cap: 0.01273288189490196,
        last_updated: '2024-03-16T03:35:04.524Z',
      },
      BTC: {
        price: 2691,
        volume_24h: 8060,
        volume_change_24h: null,
        percent_change_1h: null,
        percent_change_24h: null,
        percent_change_7d: null,
        market_cap: 8404,
        market_cap_dominance: 3652,
        fully_diluted_market_cap: 0.09544593944514301,
        last_updated: '2024-03-16T03:35:04.524Z',
      },
    },
  },
];
 */
