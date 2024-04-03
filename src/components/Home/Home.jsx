import React, { useState, useEffect } from 'react';
import CoinList from './CoinList.jsx';
import { fetchGainers, fetchLosers } from '../../utilities/HomeUtils.js';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

function Home({ successOpen, setLoginSuccessOpen, isDarkMode }) {
  const [coinList, setCoinList] = useState([]);
  const [viewMode, setViewMode] = useState(true);
  useEffect(() => {
    const fetchAndSetGainersOrLosers = async () => {
      try {
        const coinList = viewMode ? await fetchGainers() : await fetchLosers();
        console.log('coinList', coinList);
        setCoinList(coinList);
      } catch (e) {
        console.error('Failed to fetch coin list:', e);
      }
    };
    fetchAndSetGainersOrLosers();
  }, [viewMode]);

  const AntSwitch = styled(Switch)(({ theme, isDarkMode, checked }) => ({
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
      backgroundColor: checked ? (isDarkMode ? '#7b1c1c' : '#7b1c1c') : isDarkMode ? '#50fa7b' : '#388e3c',
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: 'width 200ms',
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,.5)', // Lighter track in dark mode for contrast
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
          <AntSwitch checked={!viewMode} inputProps={{ 'aria-label': 'ant design' }} onChange={() => setViewMode(!viewMode)} />
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
    </div>
  );
}

export default Home;
