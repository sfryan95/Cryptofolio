import express from 'express';
import cors from 'cors';
import detectPort from 'detect-port';
import axios from 'axios';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3002;
const API_Key = '223ce7d7-adcb-43f6-80be-55ea1980d51b'; /* process.env.CMC_PRO_API_KEY */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));
app.use((err, req, res, next) => {
  console.error('An error occurred:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.get('/api/home/', async (req, res) => {
  console.log('made it to api in server');
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&sort=percent_change_24h&cryptocurrency_type=all&tag=all', {
      headers: {
        'X-CMC_PRO_API_KEY': API_Key,
      },
    });
    res.json(response.data);
  } catch (e) {
    console.error('Error fetching data from CoinMarketCap', e);
    res.status(500).json({ message: 'Failed to Fetch Data' });
  }
});

app.get('/api/portfolio/', async (req, res) => {
  console.log('coin list check');
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&sort=market_cap&cryptocurrency_type=all&tag=all', {
      headers: {
        'X-CMC_PRO_API_KEY': API_Key,
      },
    });
    res.json(response.data);
  } catch (e) {
    console.error('Error fetching data from CoinMarketCap', e);
    res.status(500).json({ message: 'Failed to Fetch Data' });
  }
});

app.get('/api/portfolio/:symbol', async (req, res) => {
  console.log('portfolio symbol check');
  const symbols = req.params.symbol;
  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`, {
      headers: {
        'X-CMC_PRO_API_KEY': API_Key,
      },
    });
    res.json(response.data);
  } catch (e) {
    console.error('Error fetching data from CoinMarketCap', e);
    res.status(500).json({ message: 'Failed to Fetch Data' });
  }
});

// app.use((req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     next(); // Pass control to the next middleware if it's an API call
//   } else {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Serve index.html for non-API requests
//   }
// });

detectPort(PORT, (err, availablePort) => {
  if (err) {
    console.log(err);
    return;
  }
  if (PORT !== availablePort) {
    console.warn(`Port ${PORT} was occupied, trying port ${availablePort}`);
  }
  const server = app.listen(availablePort, () => {
    console.log(`Server running on port ${availablePort}`);
  });
  server.on('error', (err) => {
    console.error('Server error', err);
  });
});
