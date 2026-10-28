
const express = require("express");

const {
  saveAttempt,
  getInterviewResults,
  completeInterview,
} = require("../controllers/attemptController");

const { protect } = require("../middleware/auth");
const { checkAttemptsLimit } = require("../middleware/limits");

const router = express.Router();

router.use(protect);

router.post("/save", checkAttemptsLimit, saveAttempt);

router.get("/interview/:interviewId/results", getInterviewResults);

router.post("/complete", completeInterview);

module.exports = router;
