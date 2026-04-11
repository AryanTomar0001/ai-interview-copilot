import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ScoreCard from "../components/ScoreCard";
import { saveAttempt } from "../services/api";
import { Home, CheckCircle, AlertCircle, Lightbulb, FileText, LayoutDashboard } from "lucide-react";

function Result() {
  const { result, selectedQuestion, resetState, currentAttemptId, markQuestionCompleted } = useContext(AppContext);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (result && selectedQuestion && !saved && currentAttemptId) {
      saveAttemptToBackend();
    }
  }, [result, selectedQuestion, saved, currentAttemptId]);

  const saveAttemptToBackend = async () => {
    // 🔥 Step 1: check complete data
    if (!result.transcript || !result.feedback) {
      setErrorMessage("Processing not complete yet. Please wait...");
      return;
    }

    // 🔥 Step 2: check short/invalid answer
    if (!result.transcript.trim() || result.transcript.trim().length < 5) {
      setErrorMessage("Your answer is too short. Please try again.");
      return;
    }

    try {
      await saveAttempt({
        question: selectedQuestion.question,
        answer: result.transcript,
        score: result.evaluation?.score || 0,
        feedback: result.feedback,
        attemptId: currentAttemptId
      });

      setSaved(true);
      markQuestionCompleted(selectedQuestion.question);

    } catch (error) {
      setErrorMessage("Failed to save attempt. Please try again.");
    }
  };

  const handleStartOver = () => {
    resetState();
    navigate("/");
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No results available</p>
          <button
            onClick={handleStartOver}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const { transcript, evaluation, feedback } = result;

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Interview Results
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Here's how you performed on your answer
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {errorMessage && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}
            <ScoreCard score={evaluation?.score || 0} breakdown={evaluation?.breakdown} />

            {transcript && (
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Your Answer Transcript</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{transcript}</p>
                </div>
              </div>
            )}

            {feedback && (
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Feedback</h2>

                {feedback.missing && feedback.missing.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-red-600">Missing Points</h3>
                    </div>
                    <ul className="space-y-2">
                      {feedback.missing.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                          <span className="text-sm md:text-base text-gray-700 break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.improvements && feedback.improvements.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-yellow-600">Suggestions for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {feedback.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
                          <span className="text-sm md:text-base text-gray-700 break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.ideal_answer && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-green-600">Ideal Answer</h3>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words whitespace-normal">{feedback.ideal_answer}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <button
                onClick={() => navigate("/questions")}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm md:text-base"
              >
                Back to Questions
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                Go to Dashboard
              </button>
              <button
                onClick={handleStartOver}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Result;