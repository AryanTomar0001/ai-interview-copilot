
const mongoose = require("mongoose");
const User = require("../models/User");
const Attempt = require("../models/Attempt");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        dailyAttempts: user.dailyAttempts,
        dailyResumeUploads: user.dailyResumeUploads,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Python interview sessions are stored in ai_interview.
    const sessionsCollection = mongoose.connection
      .useDb("ai_interview")
      .collection("interview_sessions");

    const sessions = await sessionsCollection
      .find({
        user_id: String(req.user.id),
        status: "completed",
      })
      .sort({ completed_at: -1 })
      .limit(50)
      .toArray();

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const interviewIds = sessions.map((session) => session._id);

    // Attempts remain in Express's current database.
    const groupedAttempts = await Attempt.aggregate([
      {
        $match: {
          userId,
          interviewId: { $in: interviewIds },
        },
      },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$interviewId",
          interviewId: { $first: "$interviewId" },
          startedAt: { $min: "$createdAt" },
          lastAnsweredAt: { $max: "$createdAt" },
          totalAnswered: { $sum: 1 },
          categories: { $addToSet: "$category" },
          attempts: { $push: "$$ROOT" },
        },
      },
    ]);

    const attemptsByInterview = new Map(
      groupedAttempts.map((item) => [item.interviewId, item])
    );

    const interviews = sessions
      .map((session) => {
        const saved = attemptsByInterview.get(session._id);

        if (!saved) return null;

        return {
          interviewId: session._id,
          interviewType: session.interview_type,
          status: session.status,
          startedAt: saved.startedAt,
          lastAnsweredAt: saved.lastAnsweredAt,
          completedAt: session.completed_at,
          totalAnswered: saved.totalAnswered,
          totalQuestions: session.total_questions,
          overallScore: session.overall_score,
          categories: saved.categories,
          attempts: saved.attempts,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error("Failed to fetch interview history:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const attempts = await Attempt.find({
      userId: new mongoose.Types.ObjectId(req.user.id),
    }).sort({ createdAt: -1 });

    const totalAttempts = attempts.length;

    const averageScore =
      totalAttempts > 0
        ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
          totalAttempts
        : 0;

    const scoresByQuestion = {};

    attempts.forEach((attempt) => {
      if (!scoresByQuestion[attempt.question]) {
        scoresByQuestion[attempt.question] = [];
      }

      scoresByQuestion[attempt.question].push(attempt.score);
    });

    const weakAreas = Object.entries(scoresByQuestion)
      .map(([question, scores]) => ({
        question,
        averageScore:
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        attempts: scores.length,
      }))
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore: Math.round(averageScore * 10) / 10,
        dailyAttempts: user.dailyAttempts,
        dailyResumeUploads: user.dailyResumeUploads,
        weakAreas,
        recentAttempts: attempts.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Failed to fetch user stats:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user stats",
    });
  }
};
