const express = require('express');
const { uploadResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { checkResumeLimit } = require('../middleware/limits');

const router = express.Router();

router.use(protect);

router.post('/upload', checkResumeLimit, uploadResume);

module.exports = router;
