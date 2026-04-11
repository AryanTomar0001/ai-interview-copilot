import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API, { checkAttemptLimit } from "../services/api";
import { Mic, Square, Loader2, ArrowLeft } from "lucide-react";

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
        setError(`Daily attempt limit reached (${response.limit}). Try again tomorrow.`);
      }
    } catch (err) {
      console.error('Error checking limit:', err);
    }
  };

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
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
      setError(`Daily attempt limit reached (${limitInfo.limit}). Try again tomorrow.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const limitCheck = await checkAttemptLimit();
      
      if (!limitCheck.canProceed) {
        setError(`Daily attempt limit reached (${limitCheck.limit}). Try again tomorrow.`);
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("question", selectedQuestion.question);
      formData.append(
        "expected_answer",
        selectedQuestion.expected_answer || "Sample expected answer"
      );

      const res = await API.post("/evaluate/", formData);
      setResult(res.data);
      navigate("/result");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No question selected</p>
          <button
            onClick={() => navigate("/questions")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <button
              onClick={() => navigate("/questions")}
              className="flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Questions
            </button>
            {limitInfo && (
              <span className="text-xs md:text-sm text-gray-600">
                Attempts today: {limitInfo.used}/{limitInfo.limit}
              </span>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4">
            <div className="mb-4">
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 break-words whitespace-normal leading-relaxed">
                {selectedQuestion.question}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                  {selectedQuestion.topic}
                </span>
                <span
                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${
                    selectedQuestion.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : selectedQuestion.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 text-center">
                Record Your Answer
              </h3>

              <div className="flex flex-col items-center justify-center text-center py-6 md:py-8">
                {!recording && !audioBlob && (
                  <button
                    onClick={startRecording}
                    className="w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full shadow-md text-sm md:text-base font-semibold transition"
                  >
                    <Mic className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Start Recording</span>
                  </button>
                )}

                {recording && (
                  <div className="text-center w-full">
                    <div className="relative mb-6 inline-block">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <Mic className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-red-100 text-red-700 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold">
                          {formatTime(recordingTime)}
                        </span>
                      </div>
                    </div>
                    <p className="text-red-600 text-sm md:text-base font-semibold mb-4">Recording in progress...</p>
                    <button
                      onClick={stopRecording}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base transition"
                    >
                      <Square className="w-4 h-4 md:w-5 md:h-5" />
                      Stop Recording
                    </button>
                  </div>
                )}

                {audioBlob && !recording && (
                  <div className="text-center w-full">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-600 text-sm md:text-base font-semibold mb-2">Recording Complete!</p>
                    <p className="text-gray-600 text-xs md:text-sm mb-4">Duration: {formatTime(recordingTime)}</p>
                    <button
                      onClick={() => {
                        setAudioBlob(null);
                        setRecordingTime(0);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs md:text-sm font-medium"
                    >
                      Re-record
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-xs md:text-sm break-words whitespace-normal">{error}</p>
                </div>
              )}

              <button
                onClick={submitAnswer}
                disabled={!audioBlob || loading}
                className="w-full mt-4 md:mt-6 bg-black text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Evaluating your answer...
                  </span>
                ) : (
                  "Submit Answer"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Interview;