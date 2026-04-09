const express = require('express');
const { getProfile, getHistory, getStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/me', getProfile);
router.get('/history', getHistory);
router.get('/stats', getStats);

module.exports = router;
