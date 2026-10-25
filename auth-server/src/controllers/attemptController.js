
const Attempt = require('../models/Attempt');
const crypto = require('crypto');

exports.saveAttempt = async (req, res) => {
  try {
    const {
      interviewId,
      questionId,
      question,
      category,
      answer,
      score,
      feedback,
      attemptId
    } = req.body;

    if (
      !interviewId ||
      !questionId ||
      !question ||
      !category ||
      typeof answer !== 'string' ||
      !answer.trim() ||
      score === undefined ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 100 ||
      feedback == null
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid interview, question, answer, score and feedback fields'
      });
    }

    if (!['technical', 'project', 'hr'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question category'
      });
    }

    // Idempotency: do not save the same submission twice.
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
      interviewId,
      questionId,
      question,
      category,
      answer: answer.trim(),
      score,
      feedback,
      attemptId: attemptId || crypto.randomBytes(16).toString('hex')
    });

    req.user.dailyAttempts += 1;
    await req.user.save();

    return res.status(201).json({
      success: true,
      data: attempt
    });

  } catch (error) {
    console.error('Save attempt error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to save interview attempt'
    });
  }
};
