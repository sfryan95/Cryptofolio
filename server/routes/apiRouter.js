import express from 'express';
import apiController from '../controllers/apiController.js';

const router = express.Router();

router.get('/gainers-losers', apiController.fetchGainersOrLosers);

router.get('/autocomplete', apiController.fetchAutoCompleteCoinList);

router.get('/fetch-coins/:symbols', apiController.fetchCoinDataBySymbols);

export default router;
