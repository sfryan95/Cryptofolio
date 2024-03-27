import { useState, useEffect } from 'react';
//import {useDispatch} from 'react-redux';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import axios from 'axios';
import CryptoCoin from '../../models/CoinClass.jsx';
import './CryptoForm.css';

export default function ComboBox({ coinList, rows, setRows }) {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [quantity, setQuantity] = useState('0');

  function handleAutocompleteChange(event, newValue) {
    setSelectedCoin(newValue);
  }

  function handleQuantityChange(event) {
    const { value } = event.target;
    setQuantity(value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // add fetch new coin data - which involves making a way to fetch a new coin or a create new coin function
    if (selectedCoin !== null) {
      const coinExists = rows.find((row) => row.symbol === selectedCoin.symbol);
      if (!coinExists) {
        try {
          const { data } = await axios.get(`http://localhost:3002/api/fetch-coin/${selectedCoin.symbol}`);
          const coinData = data.data[selectedCoin.symbol];
          if (coinData) {
            const {
              id,
              name,
              symbol,
              quote: {
                USD: { price, percent_change_24h },
              },
            } = coinData;
            const newCoin = new CryptoCoin(id, name, symbol, quantity, price, percent_change_24h);
            setRows((currentRows) => {
              const totalValue = currentRows.reduce((acc, coin) => acc + coin.value, 0) + newCoin.value;
              newCoin.allocation = newCoin.value / totalValue;
              return [...currentRows, newCoin];
            });
          } else {
            console.log('No data recieved for coin list.');
          }
        } catch (e) {
          console.error('There was an error updating price for coin list', e);
        }
      }
    }
    setSelectedCoin(null);
    setQuantity('');
  };
  // create new coin
  // add update row state
  // later send to database

  return (
    <form
      onSubmit={handleSubmit}
      className="combo-box">
      <Autocomplete
        onChange={handleAutocompleteChange}
        className="form-component"
        disablePortal
        id="combo-box-demo"
        options={coinList}
        getOptionLabel={(option) => option.label || ''}
        sx={{ width: 300 }}
        value={selectedCoin}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Coin"
            name="symbol"
          />
        )}
        isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      />
      <TextField
        onChange={handleQuantityChange}
        className="form-component"
        type="number"
        id="outlined-helperText"
        label="Quantity"
        name="quantity"
        value={quantity}
      />
      <Button
        variant="outlined"
        id="submit"
        type="submit"
        value="submit">
        Submit
      </Button>
    </form>
  );
}
