const User = require('../models/User');
const Attempt = require('../models/Attempt');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        dailyAttempts: user.dailyAttempts,
        dailyResumeUploads: user.dailyResumeUploads,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const attempts = await Attempt.find({ userId: req.user.id });

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts
      : 0;

    const scoresByQuestion = {};
    attempts.forEach(attempt => {
      if (!scoresByQuestion[attempt.question]) {
        scoresByQuestion[attempt.question] = [];
      }
      scoresByQuestion[attempt.question].push(attempt.score);
    });

    const weakAreas = Object.entries(scoresByQuestion)
      .map(([question, scores]) => ({
        question,
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        attempts: scores.length
      }))
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore: Math.round(averageScore * 10) / 10,
        dailyAttempts: user.dailyAttempts,
        dailyResumeUploads: user.dailyResumeUploads,
        weakAreas,
        recentAttempts: attempts.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
