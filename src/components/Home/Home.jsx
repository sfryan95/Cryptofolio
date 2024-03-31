import React, { useState, useEffect } from 'react';
import GainersAndLosersCards from './Gainers.jsx';
import fetchGainersAndLosers from '../../utilities/HomeUtils.js';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Home({ successOpen, setLoginSuccessOpen }) {
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
      <Box sx={{ width: '100%', marginBottom: '50px' }}>
        <Collapse in={successOpen}>
          <Alert
            variant="filled"
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setLoginSuccessOpen(false);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}>
            Login success!
          </Alert>
        </Collapse>
      </Box>
      <GainersAndLosersCards coinList={gainersAndLosers} />
    </div>
  );
}

export default Home;
