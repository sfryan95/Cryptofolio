import express from 'express';
import { getAutoCompleteCoinList, updatePortfolioData, fetchPortfolioData } from '../controllers/portfolioController';

const router = express.Router();

router.get('/users/:username', fetchPortfolioData);

router.get('/:symbols', updatePortfolioData);

router.get('/', getAutoCompleteCoinList);

export default router;
