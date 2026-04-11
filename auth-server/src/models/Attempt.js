const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
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
AttemptSchema.index({ userId: 1, attemptId: 1 });

module.exports = mongoose.model('Attempt', AttemptSchema);
