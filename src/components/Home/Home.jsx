import React, { useState, useEffect, useRef } from 'react';
import CoinList from './CoinList.jsx';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';

function Home({ successOpen, setLoginSuccessOpen, isDarkMode }) {
  const [coinList, setCoinList] = useState([]);
  const [viewMode, setViewMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevViewMode = usePrevious(viewMode);

  const fetchCryptocurrencies = async (page, reset = false) => {
    // console.log('Fetching cryptocurrencies for viewMode:', viewMode, 'and page:', page);
    setIsLoading(true);
    try {
      const apiUrl = viewMode ? 'http://localhost:3002/api/gainers' : 'http://localhost:3002/api/losers';
      const response = await axios.get(apiUrl, {
        params: {
          start: 1 + (page - 1) * 9,
        },
      });
      const data = response.data.data;
      const fetchedCoinList = data.map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        percent_change_24h: coin.quote.USD.percent_change_24h,
      }));

      setCoinList((currentList) => (reset ? [...fetchedCoinList] : [...currentList, ...fetchedCoinList]));
      setCurrentPage(page + 1);
    } catch (e) {
      console.error('Failed to fetch coin list:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const reset = prevViewMode !== undefined && prevViewMode !== viewMode;
    fetchCryptocurrencies(1, reset);
  }, [viewMode]);

  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  useEffect(() => {
    const debouncedHandleScroll = debounce(() => {
      const nearBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;
      if (nearBottom && !isLoading) {
        fetchCryptocurrencies(currentPage, false);
      }
    }, 500);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [isLoading, currentPage, viewMode]);

  const AntSwitch = styled(Switch, {
    shouldForwardProp: (prop) => prop !== 'isDarkMode',
  })(({ isDarkMode, checked }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: isDarkMode ? '#ff5555' : '#d32f2f',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: checked ? '#7b1c1c' : isDarkMode ? 'lime' : '#50fa7b',
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: 'width 200ms',
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,.5)',
      boxSizing: 'border-box',
    },
  }));

  const textColorGainers = viewMode ? (isDarkMode ? 'lime' : 'action.active') : 'text.primary';
  const textColorsLosers = !viewMode ? (isDarkMode ? 'red' : 'error.main') : 'text.primary';

  return (
    <div className="grid-container">
      <Box sx={{ alignSelf: 'flex-start' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ pl: '25px', color: textColorGainers === 'lime' ? 'lime' : textColorGainers }}>Gainers</Typography>
          <AntSwitch
            checked={!viewMode}
            isDarkMode={isDarkMode}
            inputProps={{ 'aria-label': 'ant design' }}
            onChange={() => {
              // console.log('Toggling viewMode from', viewMode, 'to', !viewMode);
              setViewMode(!viewMode);
            }}
          />
          <Typography sx={{ color: textColorsLosers === 'red' ? 'red' : textColorsLosers }}>Losers</Typography>
        </Stack>
      </Box>
      <Box sx={{ width: '50%', marginBottom: '50px' }}>
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
      <CoinList coinList={coinList} viewMode={viewMode} isDarkMode={isDarkMode} />
      {isLoading && <div>Loading more cryptocurrencies...</div>}
    </div>
  );
}

export default Home;
