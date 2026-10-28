const mongoose = require("mongoose");
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

exports.getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    const attempts = await Attempt.find({
      userId: req.user.id,
      interviewId,
    }).sort({ createdAt: 1 });

    if (attempts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No saved results found for this interview",
      });
    }

    const totalScore = attempts.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );

    const overallScore = Number(
      (totalScore / attempts.length).toFixed(2)
    );

    return res.status(200).json({
      success: true,
      data: {
        interviewId,
        totalAnswered: attempts.length,
        overallScore,
        attempts,
      },
    });
  } catch (error) {
    console.error("Get interview results error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview results",
    });
  }
};



exports.completeInterview = async (req, res) => {
  try {
    const { interviewId, totalQuestions } = req.body;

    if (
      !interviewId ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid interviewId and totalQuestions are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    // Fetch only this user's saved answers for this interview.
    const attempts = await Attempt.find({
      userId: new mongoose.Types.ObjectId(req.user.id),
      interviewId,
    })
      .select("questionId score")
      .lean();

    // Count distinct questions, not duplicate submissions.
    const answeredQuestionIds = new Set(
      attempts.map((attempt) => String(attempt.questionId))
    );

    if (answeredQuestionIds.size < totalQuestions) {
      return res.status(409).json({
        success: false,
        message: "Some interview answers are still missing",
        answeredQuestions: answeredQuestionIds.size,
        totalQuestions,
      });
    }

    const overallScore = Number(
      (
        attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
        attempts.length
      ).toFixed(2)
    );

    // Update the existing Python interview session.
    const sessionsCollection = mongoose.connection
      .useDb("ai_interview")
      .collection("interview_sessions");

    const updateResult = await sessionsCollection.updateOne(
      {
        _id: interviewId,
        user_id: String(req.user.id),
      },
      {
        $set: {
          status: "completed",
          total_questions: totalQuestions,
          overall_score: overallScore,
          completed_at: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Interview session not found. Check that Python and Express use the same MongoDB database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully",
      data: {
        interviewId,
        status: "completed",
        totalQuestions,
        overallScore,
      },
    });
  } catch (error) {
    console.error("Interview completion failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete interview",
    });
  }
};
