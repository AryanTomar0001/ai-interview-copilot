import { ArrowRight, CheckCircle } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function QuestionCard({ question, onSelect }) {
  const { isQuestionCompleted } = useContext(AppContext);
  const completed = isQuestionCompleted(question.question);

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
    <div className={`bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 transition-shadow ${completed ? 'opacity-75' : 'hover:shadow-lg'}`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <p className="text-sm md:text-base font-semibold text-gray-900 flex-1 break-words whitespace-normal leading-relaxed">
          {question.question}
        </p>
        {completed && (
          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
          {question.topic}
        </span>
        <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
        {completed && (
          <span className="bg-green-100 text-green-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
            ✓ Completed
          </span>
        )}
      </div>

      <button
        onClick={() => onSelect(question)}
        disabled={completed}
        className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
          completed
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {completed ? 'Completed' : 'Start Answer'}
        {!completed && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
