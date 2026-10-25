// import { ArrowRight, CheckCircle } from "lucide-react";
// import { useContext } from "react";
// import { AppContext } from "../context/AppContext";

// export default function QuestionCard({ question, onSelect }) {
//   const { isQuestionCompleted } = useContext(AppContext);
//   const completed = isQuestionCompleted(question.question);

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case "Easy":
//         return "bg-green-100 text-green-700";
//       case "Medium":
//         return "bg-yellow-100 text-yellow-700";
//       case "Hard":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className={`bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 transition-shadow ${completed ? 'opacity-75' : 'hover:shadow-lg'}`}>
//       <div className="flex items-start justify-between mb-3 gap-2">
//         <p className="text-sm md:text-base font-semibold text-gray-900 flex-1 break-words whitespace-normal leading-relaxed">
//           {question.question}
//         </p>
//         {completed && (
//           <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0" />
//         )}
//       </div>

//       <div className="flex flex-wrap items-center gap-2 mb-4">
//         <span className="bg-blue-100 text-blue-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
//           {question.topic}
//         </span>
//         <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
//           {question.difficulty}
//         </span>
//         {completed && (
//           <span className="bg-green-100 text-green-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
//             ✓ Completed
//           </span>
//         )}
//       </div>

//       <button
//         onClick={() => onSelect(question)}
//         disabled={completed}
//         className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${
//           completed
//             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             : 'bg-black text-white hover:bg-gray-800'
//         }`}
//       >
//         {completed ? 'Completed' : 'Start Answer'}
//         {!completed && <ArrowRight className="w-4 h-4" />}
//       </button>
//     </div>
//   );
// }


import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function QuestionCard({ question, onSelect }) {
  const { isQuestionCompleted } = useContext(AppContext);
  const completed = isQuestionCompleted(question.question_id);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Hard":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div
      className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 md:p-6 ${
        completed
          ? "border-slate-200 opacity-70"
          : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div
          className={`hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-semibold sm:flex ${
            completed
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <span>Q</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold leading-6 text-slate-900 sm:text-base">
              {question.question}
            </p>

            {completed && (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            )}
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {question.topic}
            </span>

            <span
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>

            {completed && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock3 className="h-3.5 w-3.5" />
          AI-powered evaluation
        </div>

        <button
          onClick={() => onSelect(question)}
          disabled={completed}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all sm:w-auto ${
            completed
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow active:scale-[0.98]"
          }`}
        >
          {completed ? "Completed" : "Start Answer"}

          {!completed && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}