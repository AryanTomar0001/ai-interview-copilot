const { MAX_DAILY_ATTEMPTS, MAX_DAILY_RESUME_UPLOADS } = require('../config/constants');

exports.checkAttemptsLimit = async (req, res, next) => {
  try {
    if (req.user.dailyAttempts >= MAX_DAILY_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: `Daily limit of ${MAX_DAILY_ATTEMPTS} attempts reached. Try again tomorrow.`,
        remaining: 0
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking attempt limit'
    });
  }
};

exports.checkResumeLimit = async (req, res, next) => {
  try {
    if (req.user.dailyResumeUploads >= MAX_DAILY_RESUME_UPLOADS) {
      return res.status(429).json({
        success: false,
        message: `Daily limit of ${MAX_DAILY_RESUME_UPLOADS} resume uploads reached. Try again tomorrow.`,
        remaining: 0
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error checking resume limit'
    });
  }
};
