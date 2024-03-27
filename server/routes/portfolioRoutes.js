import express from 'express';
import { getAutoCompleteCoinList, updatePortfolioData } from '../controllers/portfolioController';

const router = express.Router();

router.get('/', getAutoCompleteCoinList);

router.get('/:symbols', updatePortfolioData);

export default router;
