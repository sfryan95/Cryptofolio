import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/portfolio', userController.authenticateToken, userController.fetchUserPortfolioData);

router.post('/signup', userController.insertUser);

router.post('/login', userController.findUserByEmail, userController.verifyUser, (req, res) => {
  res.status(200);
});

router.post('/insert-coin', userController.authenticateToken, userController.insertCoin);

router.patch('/update-quantity', userController.authenticateToken, userController.updateQuantity);

router.patch('/update-email', userController.authenticateToken, userController.updateEmail);

router.patch('/update-password', userController.authenticateToken, userController.updatePassword);

router.delete('/', userController.authenticateToken, userController.deleteUserById);

router.delete('/portfolio-entry', userController.authenticateToken, userController.deletePortfolioEntryById);

export default router;
