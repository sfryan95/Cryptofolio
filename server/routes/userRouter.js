import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', userController.insertUser);

router.post('/insert-coin', userController.authenticateToken, userController.insertCoin);

router.get('/portfolio', userController.authenticateToken, userController.fetchUserPortfolioData);

export default router;
