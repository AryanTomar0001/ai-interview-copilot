// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import ScoreCard from "../components/ScoreCard";
// import { saveAttempt } from "../services/api";
// import { Home, CheckCircle, AlertCircle, Lightbulb, FileText, LayoutDashboard } from "lucide-react";

// function Result() {
//   const { result, selectedQuestion, resetState, currentAttemptId, markQuestionCompleted } = useContext(AppContext);
//   const navigate = useNavigate();
//   const [saved, setSaved] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     if (result && selectedQuestion && !saved && currentAttemptId) {
//       saveAttemptToBackend();
//     }
//   }, [result, selectedQuestion, saved, currentAttemptId]);

//   const saveAttemptToBackend = async () => {
//     // 🔥 Step 1: check complete data
//     if (!result.transcript || !result.feedback) {
//       setErrorMessage("Processing not complete yet. Please wait...");
//       return;
//     }

//     // 🔥 Step 2: check short/invalid answer
//     if (!result.transcript.trim() || result.transcript.trim().length < 5) {
//       setErrorMessage("Your answer is too short. Please try again.");
//       return;
//     }

//     try {
//       await saveAttempt({
//         question: selectedQuestion.question,
//         answer: result.transcript,
//         score: result.evaluation?.score || 0,
//         feedback: result.feedback,
//         attemptId: currentAttemptId
//       });

//       setSaved(true);
//       markQuestionCompleted(selectedQuestion.question);

//     } catch (error) {
//       setErrorMessage("Failed to save attempt. Please try again.");
//     }
//   };

//   const handleStartOver = () => {
//     resetState();
//     navigate("/");
//   };

//   if (!result) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="bg-white rounded-xl shadow-md p-8 text-center">
//           <p className="text-gray-600 mb-4">No results available</p>
//           <button
//             onClick={handleStartOver}
//             className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
//           >
//             Start Over
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { transcript, evaluation, feedback } = result;

//   return (
//     <>
//       <div className="min-h-screen">
//         <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
//           <div className="mb-6">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//               Interview Results
//             </h1>
//             <p className="text-sm md:text-base text-gray-600">
//               Here's how you performed on your answer
//             </p>
//           </div>

//           <div className="space-y-4 md:space-y-6">
//             {errorMessage && (
//               <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
//                 {errorMessage}
//               </div>
//             )}
//             <ScoreCard score={evaluation?.score || 0} breakdown={evaluation?.breakdown} />

//             {transcript && (
//               <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <FileText className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold text-gray-900">Your Answer Transcript</h2>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <p className="text-gray-700 leading-relaxed">{transcript}</p>
//                 </div>
//               </div>
//             )}

//             {feedback && (
//               <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Feedback</h2>

//                 {feedback.missing && feedback.missing.length > 0 && (
//                   <div className="mb-4 md:mb-6">
//                     <div className="flex items-center gap-2 mb-3">
//                       <AlertCircle className="w-5 h-5 text-red-500" />
//                       <h3 className="text-lg font-semibold text-red-600">Missing Points</h3>
//                     </div>
//                     <ul className="space-y-2">
//                       {feedback.missing.map((item, i) => (
//                         <li key={i} className="flex items-start gap-2">
//                           <span className="text-red-500 mt-1 flex-shrink-0">•</span>
//                           <span className="text-sm md:text-base text-gray-700 break-words">{item}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {feedback.improvements && feedback.improvements.length > 0 && (
//                   <div className="mb-4 md:mb-6">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Lightbulb className="w-5 h-5 text-yellow-500" />
//                       <h3 className="text-lg font-semibold text-yellow-600">Suggestions for Improvement</h3>
//                     </div>
//                     <ul className="space-y-2">
//                       {feedback.improvements.map((item, i) => (
//                         <li key={i} className="flex items-start gap-2">
//                           <span className="text-yellow-500 mt-1 flex-shrink-0">•</span>
//                           <span className="text-sm md:text-base text-gray-700 break-words">{item}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {feedback.ideal_answer && (
//                   <div>
//                     <div className="flex items-center gap-2 mb-3">
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                       <h3 className="text-lg font-semibold text-green-600">Ideal Answer</h3>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                       <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words whitespace-normal">{feedback.ideal_answer}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
//               <button
//                 onClick={() => navigate("/questions")}
//                 className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm md:text-base"
//               >
//                 Back to Questions
//               </button>
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
//               >
//                 <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
//                 Go to Dashboard
//               </button>
//               <button
//                 onClick={handleStartOver}
//                 className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
//               >
//                 <Home className="w-4 h-4 md:w-5 md:h-5" />
//                 Start Over
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Result;

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ScoreCard from "../components/ScoreCard";
import { saveAttempt } from "../services/api";
import {
  Home,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  LayoutDashboard,
  ArrowLeft,
  Sparkles,
  Target,
  MessageSquareText,
  RotateCcw,
  Brain,
  ChevronRight,
} from "lucide-react";

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-500" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              No Results Available
            </h2>

            <p className="text-sm text-slate-500 mb-6">
              There is no interview result to display right now.
            </p>

            <button
              onClick={handleStartOver}
              className="w-full bg-slate-950 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/10"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { transcript, evaluation, feedback } = result;

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-[45%] -left-40 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Top navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/questions")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 group-hover:shadow-sm transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span className="hidden sm:inline">Back to Questions</span>
          </button>

          {saved && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Attempt Saved
            </div>
          )}
        </div>

        {/* Hero section */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 md:p-10 mb-6 shadow-2xl shadow-slate-300/40">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_35%)]" />

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-slate-300 mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  AI Interview Analysis
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
                  Interview Results
                </h1>

                <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                  Review your answer, understand what you missed, and use the
                  feedback to improve your next response.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Question context */}
        {selectedQuestion && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-50 items-center justify-center flex-shrink-0">
                <MessageSquareText className="w-5 h-5 text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Question
                </p>

                <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  {selectedQuestion.question}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedQuestion.topic && (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                      {selectedQuestion.topic}
                    </span>
                  )}

                  {selectedQuestion.difficulty && (
                    <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                      {selectedQuestion.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <p className="font-semibold text-red-800 text-sm mb-1">
                  Something went wrong
                </p>
                <p className="text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Score */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-violet-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Performance Overview
              </h2>
              <p className="text-xs text-slate-500">
                Your evaluation breakdown
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-1 shadow-sm overflow-hidden">
            <ScoreCard
              score={evaluation?.score || 0}
              breakdown={evaluation?.breakdown}
            />
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-6">

            <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Your Answer
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Transcribed response
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                Transcript
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
                <div className="absolute left-0 top-5 bottom-5 w-1 bg-blue-500 rounded-r-full" />

                <p className="text-sm sm:text-base text-slate-700 leading-8 pl-3 break-words whitespace-pre-wrap">
                  {transcript}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-6">

            <div className="px-5 sm:px-7 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Detailed Feedback
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Review the key areas from your response
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-8">

              {/* Missing points */}
              {feedback.missing && feedback.missing.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Missing Points
                      </h3>
                      <p className="text-xs text-slate-500">
                        Areas that were not covered
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {feedback.missing.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-red-50/60 border border-red-100"
                      >
                        <span className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>

                        <p className="text-sm text-slate-700 leading-relaxed break-words">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {feedback.improvements && feedback.improvements.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Suggestions for Improvement
                      </h3>
                      <p className="text-xs text-slate-500">
                        Practical ways to strengthen your answer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {feedback.improvements.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-100"
                      >
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </span>

                        <p className="text-sm text-slate-700 leading-relaxed break-words">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ideal answer */}
              {feedback.ideal_answer && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Ideal Answer
                      </h3>
                      <p className="text-xs text-slate-500">
                        Reference answer for comparison
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl bg-emerald-50/70 border border-emerald-200 p-5 sm:p-6">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400" />

                    <p className="text-sm sm:text-base text-slate-700 leading-8 break-words whitespace-pre-wrap">
                      {feedback.ideal_answer}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="font-bold text-slate-900">
                Ready for the next question?
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Continue practicing or return to your dashboard.
              </p>
            </div>

            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-100 items-center justify-center">
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <button
              onClick={() => navigate("/questions")}
              className="group w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-800 py-3.5 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Questions
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="group w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleStartOver}
              className="group w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/15 text-sm"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
              Start Over
            </button>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <p className="text-xs text-slate-400">
            Keep practicing. Every interview attempt is a step forward.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Result;