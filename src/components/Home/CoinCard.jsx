import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { percent } from '../../utilities/DataTableUtils';

function CoinCard({ coin, viewMode, isDarkMode }) {
  const textColor = viewMode ? (isDarkMode ? 'lime' : 'action.active') : isDarkMode ? 'red' : 'error.main';

  return (
    <Box sx={{ minWidth: 375 }}>
      <Card className="card" variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {coin.symbol}
          </Typography>
          <Typography variant="h5" component="div">
            {coin.name}
          </Typography>
          <Typography color={textColor} sx={{ mb: 1.5 }}>{`${percent(coin.percent_change_24h / 100)} (24hr)`}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CoinCard;
