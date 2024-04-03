import express from 'express';
import apiController from '../controllers/apiController.js';

const router = express.Router();

router.get('/gainers', apiController.fetchGainers);

router.get('/losers', apiController.fetchLosers);

router.get('/autocomplete', apiController.fetchAutoCompleteCoinList);

router.get('/update-portfolio/:symbols', apiController.fetchCoinDataBySymbols);

router.get('/fetch-coin/:symbols', apiController.fetchCoinDataBySymbols);

export default router;
