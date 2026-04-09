const express = require('express');
const { checkAttemptLimit, checkResumeLimit, incrementResumeUpload } = require('../controllers/limitController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/check-attempt', checkAttemptLimit);
router.get('/check-resume', checkResumeLimit);
router.post('/increment-resume', incrementResumeUpload);

module.exports = router;
