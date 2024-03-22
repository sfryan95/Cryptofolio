import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { percent } from '../../utilities/DataTableUtils';
import './Home.css';

function card(coin) {
  return (
    <Box sx={{ minWidth: 375 }} key={coin.id}>
      <Card className="card" variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {coin.symbol}
          </Typography>
          <Typography variant="h5" component="div">
            {coin.name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="lime">
            {`${percent(coin.percent_change_24h / 100)} (24hr)`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function GainersCards({ coinList }) {
  const gainers = coinList.slice(0, 3).map((coin) => card(coin));

  return <div className="gainers">{gainers}</div>;
}
