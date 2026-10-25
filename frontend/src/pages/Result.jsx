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
  Copy,
  Check,
} from "lucide-react";

function Result() {
  
  const {
    result,
    selectedQuestion,
    resetState,
    currentAttemptId,
    markQuestionCompleted,
    interviewId,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (result && selectedQuestion && interviewId && !saved && currentAttemptId) {
      saveAttemptToBackend();
    }
  }, [result, selectedQuestion, interviewId, saved, currentAttemptId]);

 
  const saveAttemptToBackend = async () => {
    const evaluation = result?.evaluation;
    const transcript = result?.transcript;

    if (!transcript || !evaluation) {
      setErrorMessage("Evaluation data is missing.");
      return;
    }

    if (transcript.trim().length < 5) {
      setErrorMessage("Your answer is too short. Please try again.");
      return;
    }
    if (
      !interviewId ||
      !selectedQuestion?.question_id ||
      !selectedQuestion?.category
    ) {
      setErrorMessage(
        "Interview or question details are missing. Please return to Questions and try again."
      );
      return;
    }

    try {
      await saveAttempt({
        interviewId,
        questionId: selectedQuestion.question_id,
        category: selectedQuestion.category.toLowerCase(),
        question: selectedQuestion.question,
        answer: transcript,
        score: evaluation.score,
        feedback: evaluation,
        attemptId: currentAttemptId,
      });

      markQuestionCompleted(selectedQuestion.question_id);
      setSaved(true);
      setErrorMessage("");
    } catch (error) {
      console.error(
        "Failed to save attempt:",
        error.response?.data || error.message
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save attempt. Please try again."
      );
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

  const { transcript, evaluation } = result;
  const feedback = evaluation;

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
   
{/* Detailed AI Evaluation */}
{feedback && (
  <section className="mb-6 space-y-5">
    {/* Section heading */}
    <div className="flex items-center gap-3 px-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
        <Sparkles className="h-5 w-5 text-violet-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Detailed AI Evaluation
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Understand your performance and how to improve
        </p>
      </div>
    </div>

    {/* Overall feedback */}
    {feedback.overall_feedback && (
      <div className="relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5 shadow-sm sm:p-7">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <Brain className="h-5 w-5 text-violet-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">
                Overall Feedback
              </h3>
              <p className="text-xs text-slate-500">
                AI assessment of your response
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            {feedback.overall_feedback}
          </p>
        </div>
      </div>
    )}

    {/* Strengths */}
    <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-emerald-50/70 p-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <CheckCircle className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              Your Strengths
            </h3>
            <p className="text-xs text-slate-500">
              What you did well in your answer
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-7">
        {feedback.strengths?.length > 0 ? (
          feedback.strengths.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4"
            >
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No specific strengths were provided for this answer.
          </p>
        )}
      </div>
    </div>

    {/* Missing points */}
    <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
      <div className="border-b border-amber-100 bg-amber-50/70 p-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <AlertCircle className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              What You Missed
            </h3>
            <p className="text-xs text-slate-500">
              Important points to include next time
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-7">
        {feedback.missing?.length > 0 ? (
          feedback.missing.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700">
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No missing points were reported.
          </p>
        )}
      </div>
    </div>

    {/* Incorrect claims */}
    <div className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-sm">
      <div className="border-b border-rose-100 bg-rose-50/60 p-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
            <AlertCircle className="h-5 w-5 text-rose-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              Incorrect Claims
            </h3>
            <p className="text-xs text-slate-500">
              Statements that may need correction
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {feedback.incorrect_claims?.length > 0 ? (
          <div className="space-y-3">
            {feedback.incorrect_claims.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-4"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <p className="text-sm leading-6 text-slate-700">
                  {typeof item === "string"
                    ? item
                    : JSON.stringify(item)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-sm leading-6 text-slate-700">
              No incorrect claims were identified in your answer.
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Improvements */}
    <div className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-blue-50/70 p-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Lightbulb className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              Suggestions for Improvement
            </h3>
            <p className="text-xs text-slate-500">
              Practical steps to strengthen your next answer
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-7">
        {feedback.improvements?.length > 0 ? (
          feedback.improvements.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No improvement suggestions were provided.
          </p>
        )}
      </div>
    </div>

    {/* Ideal answer */}
    {feedback.ideal_answer && (
      <IdealAnswerCard answer={feedback.ideal_answer} />
    )}
  </section>
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

function IdealAnswerCard({ answer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy ideal answer:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-sm">
      <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <FileText className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Ideal Answer</h3>
              <p className="text-xs text-slate-500">
                A reference answer to learn from
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Answer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 sm:p-6">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-base">
            {answer}
          </p>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Use this as a reference, understand the key points, and answer in your own words.
        </p>
      </div>
    </div>
  );
}

export default Result;
