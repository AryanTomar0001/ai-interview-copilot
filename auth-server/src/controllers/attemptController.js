const Attempt = require('../models/Attempt');
const User = require('../models/User');
const crypto = require('crypto');

exports.saveAttempt = async (req, res) => {
  try {
    const { question, answer, score, feedback, attemptId } = req.body;

    if (!question || !answer || score === undefined || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (attemptId) {
      const existingAttempt = await Attempt.findOne({ 
        userId: req.user.id, 
        attemptId 
      });

      if (existingAttempt) {
        return res.status(200).json({
          success: true,
          data: existingAttempt,
          message: 'Attempt already saved'
        });
      }
    }

    const attempt = await Attempt.create({
      userId: req.user.id,
      question,
      answer,
      score,
      feedback,
      attemptId: attemptId || crypto.randomBytes(16).toString('hex')
    });

    req.user.dailyAttempts += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
