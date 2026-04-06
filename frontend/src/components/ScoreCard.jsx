export default function ScoreCard({ score, breakdown }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className={`rounded-xl p-6 border-2 ${getScoreBackground(score)}`}>
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm font-medium mb-2">Your Score</p>
        <p className={`text-6xl font-bold ${getScoreColor(score)}`}>
          {score}
        </p>
        <p className="text-gray-500 text-sm mt-1">out of 100</p>
      </div>

      {breakdown && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {breakdown.similarity || 0}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Similarity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {breakdown.keyword_match || 0}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Keywords</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {breakdown.length_score || 0}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Length</p>
          </div>
        </div>
      )}
    </div>
  );
}
