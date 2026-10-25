
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  X,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  FileText,
  Sparkles,
  Brain,
  Copy,
  Check,
  Target,
  Calendar,
  MessageSquareText,
} from "lucide-react";

const FeedbackModal = ({ attempt, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!attempt) return null;

  const {
    question,
    answer,
    score,
    feedback,
    createdAt,
    category,
  } = attempt;

  // Support the evaluation object saved by the backend.
  const evaluation = feedback || {};
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0));

  const scoreColor =
    numericScore >= 70
      ? "#10b981"
      : numericScore >= 50
        ? "#f59e0b"
        : "#f43f5e";

  const chartData = [
    { name: "Score", value: numericScore },
    { name: "Remaining", value: 100 - numericScore },
  ];

  const scoreLabel =
    numericScore >= 80
      ? "Excellent performance"
      : numericScore >= 70
        ? "Strong performance"
        : numericScore >= 50
          ? "Good start — keep improving"
          : "More practice will help";

  const copyIdealAnswer = async () => {
    if (!evaluation.ideal_answer) return;

    try {
      await navigator.clipboard.writeText(evaluation.ideal_answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Could not copy ideal answer:", error);
    }
  };

  const SectionHeading = ({ icon: Icon, title, subtitle, color }) => (
    <div className="mb-4 flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );

  const FeedbackList = ({ items, color, emptyText }) => {
    const styles = {
      green: "border-emerald-100 bg-emerald-50/60",
      amber: "border-amber-100 bg-amber-50/60",
      blue: "border-blue-100 bg-blue-50/60",
      red: "border-rose-100 bg-rose-50/60",
    };

    const iconColors = {
      green: "text-emerald-600",
      amber: "text-amber-600",
      blue: "text-blue-600",
      red: "text-rose-600",
    };

    if (!items?.length) {
      return (
        <p className="text-sm leading-6 text-slate-500">{emptyText}</p>
      );
    }

    return (
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 rounded-xl border p-3.5 ${styles[color]}`}
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold">
              {color === "green" ? (
                <CheckCircle className={`h-4 w-4 ${iconColors[color]}`} />
              ) : color === "red" ? (
                <AlertCircle className={`h-4 w-4 ${iconColors[color]}`} />
              ) : (
                <span className={iconColors[color]}>{index + 1}</span>
              )}
            </span>
            <p className="break-words text-sm leading-6 text-slate-700">
              {typeof item === "string" ? item : JSON.stringify(item)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attempt-details-title"
        className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/50 bg-[#f8fafc] shadow-2xl shadow-slate-950/20"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-slate-950 px-5 py-5 text-white sm:px-7 sm:py-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.28),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.2),transparent_40%)]" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                AI Interview Analysis
              </div>

              <h2
                id="attempt-details-title"
                className="text-xl font-bold tracking-tight sm:text-2xl"
              >
                Attempt Details
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                {createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                )}
                {category && (
                  <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 capitalize">
                    {category}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close attempt details"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {/* Question */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading
              icon={MessageSquareText}
              title="Interview Question"
              subtitle="The question you answered"
              color="bg-blue-50 text-blue-600"
            />
            <p className="break-words text-sm font-medium leading-7 text-slate-800 sm:text-base">
              {question || "Question information is unavailable."}
            </p>
          </section>

          {/* Score overview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeading
              icon={Target}
              title="Performance Overview"
              subtitle="Your saved interview score"
              color="bg-violet-50 text-violet-600"
            />

            <div className="grid items-center gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="relative h-44 w-full max-w-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={57}
                        outerRadius={76}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={2}
                        stroke="none"
                      >
                        {chartData.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={index === 0 ? scoreColor : "#e2e8f0"}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {numericScore}
                    </span>
                    <span className="text-xs text-slate-500">out of 100</span>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {scoreLabel}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Score
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {numericScore}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    / 100
                  </span>
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${numericScore}%`,
                      backgroundColor: scoreColor,
                    }}
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Review the feedback below to understand what went well and
                  what to work on next.
                </p>
              </div>
            </div>
          </section>

          {/* Student answer */}
          {answer && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeading
                icon={FileText}
                title="Your Answer"
                subtitle="Your saved transcribed response"
                color="bg-blue-50 text-blue-600"
              />
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                  {answer}
                </p>
              </div>
            </section>
          )}

          {/* Overall feedback */}
          {evaluation.overall_feedback && (
            <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
              <SectionHeading
                icon={Brain}
                title="Overall AI Feedback"
                subtitle="Summary of your performance"
                color="bg-violet-100 text-violet-700"
              />
              <p className="text-sm leading-7 text-slate-700">
                {evaluation.overall_feedback}
              </p>
            </section>
          )}

          {/* Strengths */}
          <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <SectionHeading
              icon={CheckCircle}
              title="Your Strengths"
              subtitle="What you did well"
              color="bg-emerald-50 text-emerald-600"
            />
            <FeedbackList
              items={evaluation.strengths}
              color="green"
              emptyText="No specific strengths were saved for this attempt."
            />
          </section>

          {/* Missing points */}
          <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <SectionHeading
              icon={AlertCircle}
              title="What You Missed"
              subtitle="Areas that could be covered in more detail"
              color="bg-amber-50 text-amber-600"
            />
            <FeedbackList
              items={evaluation.missing}
              color="amber"
              emptyText="No missing points were reported."
            />
          </section>

          {/* Incorrect claims */}
          <section className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
            <SectionHeading
              icon={AlertCircle}
              title="Incorrect Claims"
              subtitle="Statements that may need correction"
              color="bg-rose-50 text-rose-600"
            />

            {evaluation.incorrect_claims?.length > 0 ? (
              <FeedbackList
                items={evaluation.incorrect_claims}
                color="red"
                emptyText=""
              />
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-slate-700">
                  No incorrect claims were identified in this answer.
                </p>
              </div>
            )}
          </section>

          {/* Improvements */}
          <section className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
            <SectionHeading
              icon={Lightbulb}
              title="Suggestions for Improvement"
              subtitle="Actionable ways to improve your next response"
              color="bg-blue-50 text-blue-600"
            />
            <FeedbackList
              items={evaluation.improvements}
              color="blue"
              emptyText="No improvement suggestions were saved."
            />
          </section>

          {/* Ideal answer */}
          {evaluation.ideal_answer && (
            <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
              <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <SectionHeading
                    icon={FileText}
                    title="Ideal Answer"
                    subtitle="Reference answer for learning"
                    color="bg-indigo-100 text-indigo-700"
                  />

                  <button
                    type="button"
                    onClick={copyIdealAnswer}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
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

              <div className="p-5">
                <p className="whitespace-pre-wrap break-words rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm leading-7 text-slate-700">
                  {evaluation.ideal_answer}
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Understand the key ideas and explain them in your own words
                  in future interviews.
                </p>
              </div>
            </section>
          )}

          {/* Legacy data notice */}
          {!feedback && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              Detailed evaluation data is not available for this saved attempt.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
          >
            Close Attempt Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
