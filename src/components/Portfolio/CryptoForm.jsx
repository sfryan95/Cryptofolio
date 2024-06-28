import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import axios from 'axios';
import CryptoCoin from '../../models/CoinClass.jsx';
import './CryptoForm.css';

export default function ComboBox({ coinList, rows, setRows }) {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [quantity, setQuantity] = useState('0');

  function handleCoinNameChange(event) {
    setSelectedCoin(event.target.value);
  }

  const validQuantityFormat = /^-?\d*(\.\d*)?$/;

  function handleQuantityChange(event) {
    const { value } = event.target;
    if (validQuantityFormat.test(value) || value === '-') setQuantity(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCoin !== '' && validQuantityFormat.test(quantity) && quantity !== '') {
      const coinExists = rows.find((row) => row.symbol === selectedCoin.toUpperCase());
      if (!coinExists) {
        try {
          const { data } = await axios.get(`http://localhost:3002/api/fetch-coins/${selectedCoin.toUpperCase()}`);
          const coinData = data.data[selectedCoin.toUpperCase()];
          if (coinData) {
            const token = localStorage.getItem('token');
            const url = 'http://localhost:3002/user/insert-coin/';
            const postData = {
              symbol: selectedCoin.toUpperCase(),
              quantity: quantity,
            };
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            };
            try {
              const response = await axios.post(url, postData, config);
            } catch (e) {
              console.error('Error:', e);
            }
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
              const updatedTotalValue = currentRows.reduce((acc, coin) => acc + coin.value, 0) + newCoin.value;

              const updatedRows = currentRows.map((coin) => ({
                ...coin,
                value: coin.price * coin.quantity,
                allocation: coin.value / updatedTotalValue,
              }));
              newCoin.allocation = newCoin.value / updatedTotalValue;
              return [...updatedRows, newCoin];
            });
          } else {
            console.log('No data received for coin list.');
          }
        } catch (e) {
          console.error('There was an error updating price for coin list', e);
        }
      } else {
        const index = rows.findIndex((row) => row.symbol === selectedCoin.toUpperCase());
        const coinToUpdate = { ...rows[index] };
        const updatedQuantity = Number(coinToUpdate.quantity) + Number(quantity);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        if (updatedQuantity <= 0) {
          const url = 'http://localhost:3002/user/portfolio-entry';
          await axios.delete(url, { ...config, data: { symbol: coinToUpdate.symbol } });
          setRows((currentRows) => {
            const remainingRows = currentRows.filter((row) => row.symbol !== coinToUpdate.symbol);
            const updatedTotalValue = remainingRows.reduce((acc, coin) => acc + coin.value, 0);
            return updatedTotalValue > 0
              ? remainingRows.map((coin) => ({
                  ...coin,
                  allocation: coin.value / updatedTotalValue,
                }))
              : remainingRows;
          });
        } else {
          const url = 'http://localhost:3002/user/update-quantity';
          const data = {
            symbol: selectedCoin.toUpperCase(),
            quantity: updatedQuantity,
          };
          try {
            const response = await axios.patch(url, data, config);
            console.log('Response:', response.data);
          } catch (e) {
            console.error('Error:', e);
          }
          setRows((currentRows) => {
            const index = currentRows.findIndex((row) => row.symbol === selectedCoin.toUpperCase());

            if (index !== -1) {
              const { id, name, symbol, price, percent_change_24h } = coinToUpdate;
              const newCoin = new CryptoCoin(id, name, symbol, updatedQuantity, price, percent_change_24h);
              const updatedRows = currentRows.map((coin, i) => {
                if (i === index) {
                  return newCoin;
                } else {
                  return coin;
                }
              });
              const updatedTotalValue = updatedRows.reduce((acc, coin) => acc + Number(coin.value), 0);
              const finalRows = updatedRows.map((coin) => ({
                ...coin,
                value: coin.price * coin.quantity,
                allocation: coin.value / updatedTotalValue,
              }));
              return finalRows;
            }
            return currentRows;
          });
        }
      }
    } else {
      alert('Please enter a valid coin name and quantity');
      return;
    }
    setSelectedCoin('');
    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} className="combo-box">
      <TextField id="outlined-helperText" name="symbol" label="Coin" onChange={handleCoinNameChange} sx={{ width: 300, rightMargin: 10 }} value={selectedCoin} />
      <TextField onChange={handleQuantityChange} className="form-component" type="number" id="outlined-helperText" label="Quantity" name="quantity" value={quantity} />
      <Button variant="outlined" id="submit" type="submit" value="submit">
        Submit
      </Button>
    </form>
  );
}

{
  /* <Autocomplete
        onChange={handleAutocompleteChange}
        className="form-component"
        disablePortal
        id="combo-box-demo"
        options={coinList}
        getOptionLabel={(option) => option.label || ''}
        sx={{ width: 300 }}
        value={selectedCoin}
        renderInput={(params) => <TextField {...params} label="Coin" name="symbol" />}
        isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      /> */
}
