const express = require('express');
const { saveAttempt } = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');
const { checkAttemptsLimit } = require('../middleware/limits');

const router = express.Router();

router.use(protect);

router.post('/save', checkAttemptsLimit, saveAttempt);

module.exports = router;
