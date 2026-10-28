
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { saveAttempt ,completeInterview} from "../services/api";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function Result() {
  const {
    result,
    selectedQuestion,
    questions,
    currentAttemptId,
    markQuestionCompleted,
    completedQuestions,
    interviewId,
    setSelectedQuestion,
    setResult,
    generateAttemptId,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const startedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    if (
      !result ||
      !selectedQuestion ||
      !interviewId ||
      !currentAttemptId ||
      startedRef.current
    ) {
      return;
    }

    startedRef.current = true;

    const processAnswer = async () => {
      const evaluation = result?.evaluation;
      const transcript = result?.transcript;

      if (!evaluation || !transcript?.trim()) {
        setErrorMessage("Your answer or evaluation is missing.");
        setSaving(false);
        return;
      }

      if (!selectedQuestion.question_id || !selectedQuestion.category) {
        setErrorMessage("Question details are missing.");
        setSaving(false);
        return;
      }

      try {
        // 1. Save the current answer and evaluation.
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

        // 2. Mark the question complete only after saving succeeds.
        markQuestionCompleted(selectedQuestion.question_id);

        // 3. Find the next unanswered question.
        const allQuestions = [
          ...(questions?.technical || []).map((q) => ({
            ...q,
            category: "technical",
          })),
          ...(questions?.project || []).map((q) => ({
            ...q,
            category: "project",
          })),
          ...(questions?.hr || []).map((q) => ({
            ...q,
            category: "hr",
          })),
        ];

        const completedIds = new Set(
          [...(completedQuestions || [])].map(String)
        );

        completedIds.add(String(selectedQuestion.question_id));

        const nextQuestion = allQuestions.find(
          (q) => !completedIds.has(String(q.question_id))
        );


      if (nextQuestion) {
        setSelectedQuestion(nextQuestion);
        setResult(null);
        generateAttemptId();
        navigate("/interview", { replace: true });
      } else {
        // All answers have been saved. Verify completion on the backend.
        await completeInterview({
          interviewId,
          totalQuestions: allQuestions.length,
        });

        navigate(
          `/interview-summary?interviewId=${encodeURIComponent(interviewId)}`,
          { replace: true }
        );
      }

      } catch (error) {
        console.error(
          "Failed to save interview answer:",
          error.response?.data || error.message
        );

        setErrorMessage(
          error.response?.data?.message ||
            "Could not save your answer. Please retry."
        );
      } finally {
        setSaving(false);
      }
    };

    processAnswer();
  }, []);

  if (errorMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to continue
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          {saving ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          )}
        </div>

        <h1 className="mt-5 text-xl font-bold text-slate-900">
          {saving ? "Saving your response..." : "Response saved"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Your evaluation is being saved securely. Please wait while we
          prepare your next question.
        </p>
      </section>
    </main>
  );
}

export default Result;
