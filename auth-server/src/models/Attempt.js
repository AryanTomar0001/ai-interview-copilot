
const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  interviewId: {
    type: String,
    required: true,
    index: true
  },

  questionId: {
    type: String,
    required: true
  },

  question: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ['technical', 'project', 'hr'],
    required: true
  },

  answer: {
    type: String,
    required: true
  },

  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  feedback: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  attemptId: {
    type: String,
    unique: true,
    sparse: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

AttemptSchema.index({ userId: 1, createdAt: -1 });
AttemptSchema.index({ userId: 1, interviewId: 1 });
AttemptSchema.index({ userId: 1, interviewId: 1, questionId: 1 });

module.exports = mongoose.model('Attempt', AttemptSchema);
