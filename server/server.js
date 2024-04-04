import express from 'express';
import cors from 'cors';
import detectPort from 'detect-port';
import path from 'path';
import multer from 'multer';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import apiRouter from './routes/apiRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();
const PORT = 3002;

console.log('current enviornment', process.env.NODE_ENV);

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use(express.json()); // parses the request body if it is JSON and stores result in req.body
app.use(express.urlencoded({ extended: true })); // parses data sent by HTML forms
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.static(path.resolve(__dirname, 'dist'))); // Serve static files from the 'dist' directory

app.use('/api', apiRouter);
app.use('/user', userRouter);

app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
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
