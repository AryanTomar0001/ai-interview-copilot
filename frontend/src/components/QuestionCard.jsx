import { ArrowRight } from "lucide-react";

export default function QuestionCard({ question, onSelect }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <p className="text-lg font-semibold text-gray-900 mb-4">
        {question.question}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {question.topic}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
      </div>

      <button
        onClick={() => onSelect(question)}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
      >
        Start Answer
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
