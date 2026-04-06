import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ScoreCard from "../components/ScoreCard";
import { Home, CheckCircle, AlertCircle, Lightbulb, FileText } from "lucide-react";

function Result() {
  const { result, resetState } = useContext(AppContext);
  const navigate = useNavigate();

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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Results
          </h1>
          <p className="text-gray-600">
            Here's how you performed on your answer
          </p>
        </div>

        <div className="space-y-6">
          <ScoreCard score={evaluation?.score || 0} breakdown={evaluation?.breakdown} />

          {transcript && (
            <div className="bg-white rounded-xl shadow-md p-6">
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Feedback</h2>

              {feedback.missing && feedback.missing.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-red-600">Missing Points</h3>
                  </div>
                  <ul className="space-y-2">
                    {feedback.missing.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements && feedback.improvements.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-yellow-600">Suggestions for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {feedback.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
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
                    <p className="text-gray-700 leading-relaxed">{feedback.ideal_answer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/questions")}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Try Another Question
            </button>
            <button
              onClick={handleStartOver}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;