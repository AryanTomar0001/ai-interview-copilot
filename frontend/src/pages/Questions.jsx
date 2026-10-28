
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Code2,
  Users,
  Rocket,
  ArrowRight,
  RefreshCw,
  Loader2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import { AppContext } from "../context/AppContext";
import API from "../services/api";

function Questions() {
  const {
    questions,
    setQuestions,
    setSelectedQuestion,
    generateAttemptId,
    interviewType,
    totalQuestions: selectedTotalQuestions,
    setInterviewId,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const hasQuestions =
      questions &&
      (
        (questions.technical?.length > 0) ||
        (questions.hr?.length > 0) ||
        (questions.project?.length > 0)
      );

    if (hasQuestions) {
      if (questions.interview_id) {
        setInterviewId(questions.interview_id);
      }

      setLoading(false);
      return;
    }

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/questions/generate", {
        mode: interviewType || "combined",
        total_questions: selectedTotalQuestions ?? 10,
      });

      setQuestions(res.data);
      setInterviewId(res.data.interview_id);
    } catch (err) {
      console.error(
        "Generate questions error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to generate questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const technical = questions?.technical || [];
  const hr = questions?.hr || [];
  const project = questions?.project || [];

  const total =
    technical.length + hr.length + project.length;

  const modeLabels = {
    technical: "Technical Interview",
    project: "Project Interview",
    hr: "HR Interview",
    combined: "Combined Interview",
  };

  const modeLabel =
    modeLabels[interviewType] || "Combined Interview";

  const categories = [
    {
      key: "technical",
      title: "Technical",
      count: technical.length,
      icon: Code2,
      color: "bg-blue-50 text-blue-600",
    },
    {
      key: "project",
      title: "Projects",
      count: project.length,
      icon: Rocket,
      color: "bg-orange-50 text-orange-600",
    },
    {
      key: "hr",
      title: "HR & Behavioral",
      count: hr.length,
      icon: Users,
      color: "bg-violet-50 text-violet-600",
    },
  ].filter((item) => item.count > 0);

  const startInterview = () => {
    if (starting || total === 0) return;

    // Keep the existing generated questions and select
    // only the first question for the interview screen.
    const firstQuestion = [
      ...technical.map((q) => ({ ...q, category: "technical" })),
      ...project.map((q) => ({ ...q, category: "project" })),
      ...hr.map((q) => ({ ...q, category: "hr" })),
    ][0];

    if (!firstQuestion) {
      setError("No questions are available. Please try again.");
      return;
    }

    setStarting(true);
    setSelectedQuestion(firstQuestion);
    generateAttemptId();
    navigate("/interview");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950">
            <Sparkles className="h-7 w-7 animate-pulse text-white" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Preparing your interview
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your personalized questions are being generated
            from your resume and experience.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating questions...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <RefreshCw className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchQuestions}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!questions || total === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <h2 className="text-lg font-bold text-slate-900">
            No questions found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please try generating your interview questions again.
          </p>
          <button
            onClick={fetchQuestions}
            className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Generate Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl" />

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-950">
              AI Interview Copilot
            </p>
            <p className="text-xs text-slate-500">
              Your personal interview coach
            </p>
          </div>
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="px-6 pb-8 pt-9 sm:px-10 sm:pb-10 sm:pt-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                Your personalized session is ready
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                It's interview time.
                <span className="mt-2 block text-blue-600">
                  Show what you know.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Answer one question at a time. Focus on explaining
                your thinking clearly. Your detailed feedback and
                results will be available after the interview.
              </p>
            </div>

            {/* Interview details */}
            <div className="mx-auto mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Interview type
                </p>
                <p className="mt-2 font-bold text-slate-900">
                  {modeLabel}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Total questions
                </p>
                <p className="mt-2 font-bold text-slate-900">
                  {total} questions
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Estimated duration
                </p>
                <p className="mt-2 flex items-center gap-2 font-bold text-slate-900">
                  <Clock3 className="h-4 w-4 text-blue-600" />
                  {total * 2}–{total * 3} min
                </p>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mx-auto mt-9 max-w-2xl">
                <h2 className="mb-3 text-sm font-bold text-slate-900">
                  Your interview will cover
                </h2>

                <div className="space-y-3">
                  {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <div
                        key={category.key}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {category.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Personalized questions
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                          {category.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mx-auto mt-7 flex max-w-2xl items-start gap-3 rounded-2xl bg-blue-50/70 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Before you begin
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  Find a quiet place and take your time answering.
                  You will see one question at a time, with your
                  detailed evaluation saved for the final report.
                </p>
              </div>
            </div>

            {/* Start */}
            <div className="mx-auto mt-8 max-w-2xl">
              <button
                onClick={startInterview}
                disabled={starting || total === 0}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {starting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Starting interview...
                  </>
                ) : (
                  <>
                    Start Interview
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Your question-wise feedback will be revealed after completion.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Stay focused. Be yourself. Learn with every answer.
        </p>
      </main>
    </div>
  );
}

export default Questions;
