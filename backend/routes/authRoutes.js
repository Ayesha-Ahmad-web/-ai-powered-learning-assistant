const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');
const { protect }    = require('../middleware/authMiddleware');

console.log('authController:', authController);

router.post('/register', authController.registerUser);
router.post('/login',    authController.loginUser);
router.get('/profile',   protect, authController.getUserProfile);
router.put('/password',  protect, authController.updatePassword);

module.exports = router;