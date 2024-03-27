import express from 'express';

import apiController from '../controllers/apiController.js';

const router = express.Router();

router.get('/gainers-losers', apiController.fetchGainersAndLosers);

router.get('/autocomplete', apiController.fetchAutoCompleteCoinList);

router.get('/user-portfolio/:username', apiController.fetchUserPortfolioData);

router.get('/update-portfolio/:symbols', apiController.fetchCoinDataBySymbols);

router.get('/fetch-coin/:symbols', apiController.fetchCoinDataBySymbols);

export default router;
