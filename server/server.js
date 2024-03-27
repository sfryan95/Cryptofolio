import express from 'express';
import cors from 'cors';
import detectPort from 'detect-port';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import apitRouter from './routes/apiRouter.js';

const app = express();
const PORT = 3002;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use(express.json()); // parses the request body if it is JSON and stores result in req.body
app.use(express.urlencoded({ extended: true })); // parses data sent by HTML forms
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
// app.use(express.static(path.join(__dirname, 'dist'))); // Serve static files from the 'dist' directory
app.use('/api', apitRouter);
// app.use('/api/portfolio', portfolioRoutes);

app.use((req, res) => res.status(404).send("This is not the page you're looking for...")); // handles requests to unknown routes

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

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
