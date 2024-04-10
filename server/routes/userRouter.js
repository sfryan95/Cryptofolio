import express from 'express';
import multer from 'multer';
import userController from '../controllers/userController.js';
import passport from 'passport';
const router = express.Router();

const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/avatars/'); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, uniqueSuffix + '-' + file.originalname); // Specify the filename for uploaded files
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

router.get('/avatar', passport.authenticate('jwt', { session: false }), userController.getUserAvatar);

router.get('/portfolio', passport.authenticate('jwt', { session: false }), userController.fetchUserPortfolioData);

router.post('/signup', userController.insertUser);

router.post('/login', userController.findUserByEmail, userController.verifyUser, (req, res) => {
  res.status(200).json({ message: 'Login successful' });
});

router.post('/insert-coin', passport.authenticate('jwt', { session: false }), userController.insertCoin);

router.patch('/update-quantity', passport.authenticate('jwt', { session: false }), userController.updateQuantity);

router.patch('/update-email', passport.authenticate('jwt', { session: false }), userController.updateEmail);

router.patch('/update-password', passport.authenticate('jwt', { session: false }), userController.updatePassword);

router.put('/update-avatar', passport.authenticate('jwt', { session: false }), upload.single('avatar'), userController.updateAvatar);

router.delete('/', passport.authenticate('jwt', { session: false }), userController.deleteUserById);

router.delete('/portfolio-entry', passport.authenticate('jwt', { session: false }), userController.deletePortfolioEntryById);

export default router;
