import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_API } from "../services/api";
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
  Loader2,
  FileText,
} from "lucide-react";

function InterviewSummary() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Read interviewId from the current URL.
        const params = new URLSearchParams(window.location.search);
        const interviewId = params.get("interviewId");

        if (!interviewId) {
          setError("Interview ID is missing. Please open your interview summary again.");
          return;
        }

        const response = await AUTH_API.get(
          `/attempt/interview/${encodeURIComponent(interviewId)}/results`
        );

        setSummary(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your interview summary."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-gray-600">Loading your interview report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 rounded-2xl bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Could not load report
        </h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const attempts = summary?.attempts || [];
  const score = Number(summary?.overallScore || 0);

  const getScoreColor = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getFeedbackItems = (feedback, key) => {
    if (!feedback) return [];

    const value = feedback[key];

    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return [value];

    return [];
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-3">
          <Trophy className="h-7 w-7 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Interview Summary
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your performance and feedback for each answer.
          </p>
        </div>
      </div>

      {/* Overall Score */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 sm:grid-cols-3 sm:items-center">
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-gray-500">
              Overall Interview Score
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={`text-5xl font-extrabold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-lg text-gray-400">/ 100</span>
            </div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 p-5 text-center">
            <FileText className="mx-auto h-7 w-7 text-indigo-600" />
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {summary?.totalAnswered ?? attempts.length}
            </p>
            <p className="text-sm text-gray-600">Answers evaluated</p>
          </div>
        </div>
      </section>

      {/* Question-wise Feedback */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Question-wise Feedback
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            See your score and saved feedback for every answer.
          </p>
        </div>

        {attempts.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-gray-500 shadow-sm">
            No saved answers found.
          </div>
        ) : (
          <div className="space-y-5">
            {attempts.map((attempt, index) => {
              const strengths = getFeedbackItems(attempt.feedback, "strengths");
              const improvements = getFeedbackItems(
                attempt.feedback,
                "improvements"
              );
              const missing = getFeedbackItems(attempt.feedback, "missing");
              const incorrectClaims = getFeedbackItems(
                attempt.feedback,
                "incorrect_claims"
              );

              return (
                <article
                  key={attempt._id || attempt.attemptId || index}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-bold text-indigo-700">
                        {index + 1}
                      </span>
                      <div>
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
                          {attempt.category}
                        </span>
                        <h3 className="mt-2 font-semibold leading-6 text-gray-900">
                          {attempt.question}
                        </h3>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-2xl font-bold ${getScoreColor(
                          Number(attempt.score || 0)
                        )}`}
                      >
                        {attempt.score}/100
                      </p>
                      <p className="text-xs text-gray-400">Score</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Your Answer
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {attempt.answer || "No answer available."}
                    </p>
                  </div>

                  {attempt.feedback?.overall_feedback && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-800">
                        Overall Feedback
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {attempt.feedback.overall_feedback}
                      </p>
                    </div>
                  )}

                  {strengths.length > 0 && (
                    <div className="mt-5">
                      <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Strengths
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-600">
                        {strengths.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {improvements.length > 0 && (
                    <div className="mt-5">
                      <p className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                        <Lightbulb className="h-4 w-4" />
                        Areas to Improve
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-600">
                        {improvements.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {missing.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-amber-700">
                        Missing Points
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-600">
                        {missing.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {incorrectClaims.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-red-700">
                        Incorrect Claims
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-600">
                        {incorrectClaims.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {attempt.feedback?.ideal_answer && (
                    <details className="mt-5 rounded-xl border border-indigo-100 p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-indigo-700">
                        View Ideal Answer
                      </summary>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {attempt.feedback.ideal_answer}
                      </p>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}

export default InterviewSummary;