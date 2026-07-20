const express = require('express');
const { signup, login, seedAdmin, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/seed-admin', seedAdmin); // remove/disable in production after first use
router.put('/profile', protect, updateProfile);

module.exports = router;
