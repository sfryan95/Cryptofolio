import axios from 'axios';

export default class CryptoCoin {
  constructor(id, name, symbol, quantity, price, percent_change_24h, allocation = 0) {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.percent_change_24h = percent_change_24h;
    this.allocation = allocation;
  }
  get value() {
    return this.price * this.quantity;
  }
  async updatePriceAndPercentChange() {
    try {
      const response = await axios.get(`/portfolio/${this.symbol}`);
      const data = response.data;
      if (data) {
        this.price = data.data[this.symbol].quote.USD.price;
        this.percent_change_24h = data.data[this.symbol].quote.USD.percent_change_24h;
      } else {
        console.log('No data recieved for symbol: ', this.symbol);
      }
    } catch (e) {
      console.error(`There was an error updating price for ${this.symbol}:`, e);
    }
  }
}
