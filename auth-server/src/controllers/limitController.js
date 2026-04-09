const { MAX_DAILY_ATTEMPTS, MAX_DAILY_RESUME_UPLOADS } = require('../config/constants');

exports.checkAttemptLimit = async (req, res) => {
  try {
    const remaining = MAX_DAILY_ATTEMPTS - req.user.dailyAttempts;
    const canProceed = remaining > 0;

    res.status(200).json({
      success: true,
      canProceed,
      remaining,
      used: req.user.dailyAttempts,
      limit: MAX_DAILY_ATTEMPTS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.checkResumeLimit = async (req, res) => {
  try {
    const remaining = MAX_DAILY_RESUME_UPLOADS - req.user.dailyResumeUploads;
    const canProceed = remaining > 0;

    res.status(200).json({
      success: true,
      canProceed,
      remaining,
      used: req.user.dailyResumeUploads,
      limit: MAX_DAILY_RESUME_UPLOADS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.incrementResumeUpload = async (req, res) => {
  try {
    req.user.dailyResumeUploads += 1;
    await req.user.save();

    const remaining = MAX_DAILY_RESUME_UPLOADS - req.user.dailyResumeUploads;

    res.status(200).json({
      success: true,
      remaining,
      used: req.user.dailyResumeUploads,
      limit: MAX_DAILY_RESUME_UPLOADS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
