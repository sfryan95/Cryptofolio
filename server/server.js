import express from 'express';
import cors from 'cors';
import detectPort from 'detect-port';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import homeRoutes from './routes/homeRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
// import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // parses the request body if it is JSON and stores result in req.body
app.use(express.urlencoded({ extended: true })); // parses data sent by HTML forms
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from the 'dist' directory

app.use('/api/home', homeRoutes);
app.use('/api/portfolio', portfolioRoutes);

// app.use((req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     next(); // Pass control to the next middleware if it's an API call
//   } else {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Serve index.html for non-API requests
//   }
// });

// app.use((err, req, res, next) => {
//   // Error handling middleware
//   console.error('An error occurred:', err);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

app.use('*', (req, res) => res.sendStatus(404)); // handles requests to unknown routes

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

// import express from 'express';
// import cors from 'cors';
// import detectPort from 'detect-port';
// import axios from 'axios';
// import path from 'path';
// import 'dotenv/config';
// import { fileURLToPath } from 'url';

// const app = express();
// const PORT = 3002;
// const API_Key = process.env.CMC_PRO_API_KEY;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.json()); // parses the request body if it is JSON and stores result in req.body
// app.use(express.urlencoded({ extended: true })); // parses data sent by HTML forms
// app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
// app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from the 'dist' directory

// // app.use('/api/home', homeRouter) // tells express to direct any request matching 'api/home'
// app.get('/api/home/', async (req, res) => {
//   console.log('made it to api in server');
//   try {
//     const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&sort=percent_change_24h&cryptocurrency_type=all&tag=all', {
//       headers: {
//         'X-CMC_PRO_API_KEY': API_Key,
//       },
//     });
//     res.json(response.data);
//   } catch (e) {
//     console.error('Error fetching data from CoinMarketCap', e);
//     res.status(500).json({ message: 'Failed to Fetch Data' });
//   }
// });

// app.get('/api/portfolio/', async (req, res) => {
//   console.log('coin list check');
//   try {
//     const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&sort=market_cap&cryptocurrency_type=all&tag=all', {
//       headers: {
//         'X-CMC_PRO_API_KEY': API_Key,
//       },
//     });
//     res.json(response.data);
//   } catch (e) {
//     console.error('Error fetching data from CoinMarketCap', e);
//     res.status(500).json({ message: 'Failed to Fetch Data' });
//   }
// });

// app.get('/api/portfolio/:symbol', async (req, res) => {
//   console.log('portfolio symbol check');
//   const symbols = req.params.symbol;
//   try {
//     const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`, {
//       headers: {
//         'X-CMC_PRO_API_KEY': API_Key,
//       },
//     });
//     res.json(response.data);
//   } catch (e) {
//     console.error('Error fetching data from CoinMarketCap', e);
//     res.status(500).json({ message: 'Failed to Fetch Data' });
//   }
// });

// app.use((req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     next(); // Pass control to the next middleware if it's an API call
//   } else {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Serve index.html for non-API requests
//   }
// });

// app.use((err, req, res, next) => {
//   // Error handling middleware
//   console.error('An error occurred:', err);
//   res.status(500).json({ message: 'Internal Server Error' });
// });

// app.use('*', (req, res) => res.sendStatus(404)); // handles requests to unknown routes

// detectPort(PORT, (err, availablePort) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   if (PORT !== availablePort) {
//     console.warn(`Port ${PORT} was occupied, trying port ${availablePort}`);
//   }
//   const server = app.listen(availablePort, () => {
//     console.log(`Server running on port ${availablePort}`);
//   });
//   server.on('error', (err) => {
//     console.error('Server error', err);
//   });
// });
