
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API, { checkAttemptLimit } from "../services/api";
import {
  Mic,
  Square,
  Loader2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Circle,
} from "lucide-react";

function Interview() {
  const { selectedQuestion, setResult } = useContext(AppContext);
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [limitInfo, setLimitInfo] = useState(null);

  useEffect(() => {
    checkLimit();
  }, []);

  const checkLimit = async () => {
    try {
      const response = await checkAttemptLimit();
      setLimitInfo(response);
      if (!response.canProceed) {
        setError(
          `Daily attempt limit reached (${response.limit}). Try again tomorrow.`
        );
      }
    } catch (err) {
      console.error("Error checking limit:", err);
    }
  };

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      setTimerInterval(interval);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);

      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  const submitAnswer = async () => {
    if (!audioBlob) {
      setError("Please record your answer first");
      return;
    }

    if (limitInfo && !limitInfo.canProceed) {
      setError(
        `Daily attempt limit reached (${limitInfo.limit}). Try again tomorrow.`
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const limitCheck = await checkAttemptLimit();

      if (!limitCheck.canProceed) {
        setError(
          `Daily attempt limit reached (${limitCheck.limit}). Try again tomorrow.`
        );
        setLoading(false);
        return;
      }


    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("question_id", selectedQuestion.question_id);

    const res = await API.post("/evaluate/", formData);

    setResult(res.data);
    navigate("/result");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to evaluate answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!selectedQuestion) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Sparkles className="h-6 w-6 text-slate-700" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No question selected
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select an interview question before starting your practice session.
          </p>

          <button
            onClick={() => navigate("/questions")}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Top navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-24" aria-hidden="true" />

          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-8 items-center justify-center rounded-lg bg-slate-900 sm:flex">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <span className="text-sm font-semibold text-slate-900">
              AI Interview
            </span>
          </div>

          {limitInfo && (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />

              <span className="text-xs font-medium text-slate-600">
                {limitInfo.used}/{limitInfo.limit} Max Questions Attempts
              </span>
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Page intro */}
        <div className="mb-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Interview Practice</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">Answer</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Give your best answer
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Speak naturally and explain your answer as you would in a real
            interview. Your response will be evaluated by AI.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Question panel */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-950 px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  AI Generated Question
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Interview Question
                </span>
              </div>

              <h2 className="mt-6 text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                {selectedQuestion.question}
              </h2>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {selectedQuestion.topic}
                </span>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    selectedQuestion.difficulty === "Easy"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : selectedQuestion.difficulty === "Medium"
                      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                      : "border-red-400/20 bg-red-400/10 text-red-300"
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Question guidance */}
            <div className="grid grid-cols-1 divide-y border-b border-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interview tip
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Structure your answer clearly and support your explanation
                  with a practical example when possible.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Evaluation
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  AI evaluates your response
                </div>
              </div>
            </div>
          </section>

          {/* Recording panel */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Response
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Record your answer
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Find a quiet place, speak clearly, and answer as if you were
                sitting in an actual interview.
              </p>
            </div>

            {/* Recording area */}
            <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8">
              {!recording && !audioBlob && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-slate-300 opacity-40 blur-xl" />

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 shadow-xl">
                      <Mic className="h-9 w-9 text-white" />
                    </div>
                  </div>

                  <p className="mt-6 text-sm font-semibold text-slate-900">
                    Ready when you are
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Click below to start recording
                  </p>

                  <button
                    onClick={startRecording}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 sm:w-auto"
                  >
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </button>
                </>
              )}

              {recording && (
                <div className="w-full text-center">
                  <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-red-200 opacity-50" />
                    <div className="absolute inset-2 animate-pulse rounded-full bg-red-100" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-xl shadow-red-500/20">
                      <Mic className="h-9 w-9 text-white" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      <span className="text-xs font-semibold text-red-600">
                        Recording
                      </span>
                    </div>

                    <div className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-slate-900">
                      {formatTime(recordingTime)}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Speak naturally. Take your time.
                    </p>
                  </div>

                  <button
                    onClick={stopRecording}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/10 transition hover:bg-red-600 active:scale-[0.98] sm:w-auto"
                  >
                    <Square className="h-4 w-4 fill-current" />
                    Stop Recording
                  </button>
                </div>
              )}

              {audioBlob && !recording && (
                <div className="w-full text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>

                  <div className="mt-6">
                    <div className="text-base font-bold text-slate-900">
                      Recording ready
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Duration:{" "}
                      <span className="font-semibold text-slate-700">
                        {formatTime(recordingTime)}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Record Again
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <span className="text-xs font-bold text-red-600">!</span>
                </div>

                <p className="text-sm leading-5 text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={submitAnswer}
              disabled={!audioBlob || loading}
              className={`mt-5 w-full rounded-xl px-5 py-3.5 text-sm font-semibold transition-all ${
                !audioBlob || loading
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Evaluating your answer...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Submit Answer
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </span>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your response is securely processed for evaluation
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Interview;

