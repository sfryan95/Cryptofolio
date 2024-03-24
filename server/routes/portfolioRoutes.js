import express from 'express';
import { getAutoCompleteCoinList, getPortfolioData } from '../controllers/portfolioController';

const router = express.Router();

router.get('/', getAutoCompleteCoinList);

router.get('/:symbol', getPortfolioData);

export default router;
