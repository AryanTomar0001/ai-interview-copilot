import { X, AlertCircle, Lightbulb, CheckCircle, FileText } from 'lucide-react';

const FeedbackModal = ({ attempt, onClose }) => {
  if (!attempt) return null;

  const { question, answer, score, feedback, createdAt } = attempt;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attempt Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Question</h3>
            <p className="text-gray-700">{question}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className={`text-6xl font-bold ${
                score >= 70 ? 'text-green-600' :
                score >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {score}%
              </div>
            </div>
            <p className="text-center text-gray-600">Your Score</p>
          </div>

          {answer && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Your Answer</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{answer}</p>
            </div>
          )}

          {feedback && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Detailed Feedback</h3>

              {feedback.missing && feedback.missing.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-red-600">Missing Points</h4>
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
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-semibold text-yellow-600">Suggestions for Improvement</h4>
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
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-semibold text-green-600">Ideal Answer</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feedback.ideal_answer}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
