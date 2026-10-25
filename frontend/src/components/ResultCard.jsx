
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileText,
  Sparkles,
  Brain,
  Copy,
  Check,
  Target,
} from "lucide-react";

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result?.evaluation) {
    return (
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-amber-500" />
        <p className="font-semibold text-slate-800">
          Evaluation data is not available.
        </p>
      </div>
    );
  }

  const evaluation = result.evaluation;
  const score = Math.max(
    0,
    Math.min(100, Number(evaluation.score) || 0)
  );

  // Evaluation fields are nested inside result.evaluation.
  const feedback = evaluation;
  const transcript = result.transcript;

  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const COLORS = ["#6366f1", "#e2e8f0"];

  const scoreLabel =
    score >= 80
      ? "Excellent performance"
      : score >= 60
        ? "Good effort — keep improving"
        : score >= 40
          ? "You're making progress"
          : "More practice will help";

  const copyIdealAnswer = async () => {
    if (!feedback.ideal_answer) return;

    try {
      await navigator.clipboard.writeText(feedback.ideal_answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy ideal answer:", error);
    }
  };

  const SectionHeading = ({ icon: Icon, title, subtitle, color }) => (
    <div className="mb-5 flex items-center gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </h3>
        <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );

  const FeedbackList = ({ items, emptyText, color = "blue" }) => {
    const styles = {
      green: "border-emerald-100 bg-emerald-50/60 text-emerald-600",
      amber: "border-amber-100 bg-amber-50/60 text-amber-600",
      blue: "border-blue-100 bg-blue-50/60 text-blue-600",
      red: "border-rose-100 bg-rose-50/60 text-rose-600",
    };

    if (!items?.length) {
      return <p className="text-sm leading-6 text-slate-500">{emptyText}</p>;
    }

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`flex items-start gap-3 rounded-2xl border p-4 ${styles[color]}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80 text-xs font-bold">
              {color === "green" ? (
                <CheckCircle className="h-4 w-4" />
              ) : color === "red" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </span>
            <p className="break-words text-sm leading-6 text-slate-700">
              {typeof item === "string" ? item : JSON.stringify(item)}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 space-y-5"
    >
      {/* Score overview */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="relative">
          <SectionHeading
            icon={Target}
            title="Performance Overview"
            subtitle="Your AI-powered interview evaluation"
            color="bg-indigo-100 text-indigo-700"
          />

          <div className="grid items-center gap-5 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-52 w-full max-w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={67}
                      outerRadius={88}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {data.map((item, index) => (
                        <Cell key={item.name} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    {score}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    out of 100
                  </span>
                </div>
              </div>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                {scoreLabel}
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Your Score
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {score}
                  <span className="ml-1 text-base font-medium text-slate-400">
                    / 100
                  </span>
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-indigo-600"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-violet-700">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-sm font-bold">Next step</p>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Review your feedback, practice the missing points, and use
                  the ideal answer as a reference for your next attempt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student transcript */}
      {transcript && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionHeading
            icon={FileText}
            title="Your Answer"
            subtitle="Your recorded response, converted to text"
            color="bg-blue-100 text-blue-700"
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
              {transcript}
            </p>
          </div>
        </section>
      )}

      {/* Overall feedback */}
      {feedback.overall_feedback && (
        <section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5 shadow-sm sm:p-7">
          <SectionHeading
            icon={Brain}
            title="Overall AI Feedback"
            subtitle="What your performance tells us"
            color="bg-violet-100 text-violet-700"
          />
          <p className="text-sm leading-7 text-slate-700 sm:text-base">
            {feedback.overall_feedback}
          </p>
        </section>
      )}

      {/* Strengths */}
      <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={CheckCircle}
          title="Your Strengths"
          subtitle="What you did well in your answer"
          color="bg-emerald-100 text-emerald-700"
        />
        <FeedbackList
          items={feedback.strengths}
          color="green"
          emptyText="No specific strengths were provided."
        />
      </section>

      {/* Missing points */}
      <section className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={AlertCircle}
          title="What You Missed"
          subtitle="Important points to cover next time"
          color="bg-amber-100 text-amber-700"
        />
        <FeedbackList
          items={feedback.missing}
          color="amber"
          emptyText="No major missing points were reported."
        />
      </section>

      {/* Incorrect claims */}
      <section className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={AlertCircle}
          title="Incorrect Claims"
          subtitle="Statements that may need correction"
          color="bg-rose-100 text-rose-700"
        />
        {feedback.incorrect_claims?.length > 0 ? (
          <FeedbackList
            items={feedback.incorrect_claims}
            color="red"
            emptyText=""
          />
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-sm leading-6 text-slate-700">
              No incorrect claims were identified in your answer.
            </p>
          </div>
        )}
      </section>

      {/* Improvements */}
      <section className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-7">
        <SectionHeading
          icon={Lightbulb}
          title="Suggestions for Improvement"
          subtitle="Practical ways to strengthen your response"
          color="bg-blue-100 text-blue-700"
        />
        <FeedbackList
          items={feedback.improvements}
          color="blue"
          emptyText="No improvement suggestions were provided."
        />
      </section>

      {/* Ideal answer */}
      {feedback.ideal_answer && (
        <section className="overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-sm">
          <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SectionHeading
                icon={FileText}
                title="Ideal Answer"
                subtitle="Learn from this reference response"
                color="bg-indigo-100 text-indigo-700"
              />

              <button
                type="button"
                onClick={copyIdealAnswer}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
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
            <p className="whitespace-pre-wrap break-words rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-sm leading-7 text-slate-700 sm:p-6 sm:text-base">
              {feedback.ideal_answer}
            </p>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Tip: Understand the key points and explain them naturally in
              your own words instead of memorizing the entire answer.
            </p>
          </div>
        </section>
      )}
    </motion.div>
  );
}
