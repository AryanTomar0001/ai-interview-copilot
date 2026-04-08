import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import API from "../services/api";
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

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("question", selectedQuestion.question);
    formData.append(
      "expected_answer",
      selectedQuestion.expected_answer || "Sample expected answer"
    );

    try {
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
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/questions")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedQuestion.question}
            </h2>

            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedQuestion.topic}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Record Your Answer
            </h3>

            <div className="flex flex-col items-center py-8">
              {!recording && !audioBlob && (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  <Mic className="w-6 h-6" />
                  <span className="font-semibold">Start Recording</span>
                </button>
              )}

              {recording && (
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <Mic className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  </div>
                  <p className="text-red-600 font-semibold mb-4">Recording in progress...</p>
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    Stop Recording
                  </button>
                </div>
              )}

              {audioBlob && !recording && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-600 font-semibold mb-2">Recording Complete!</p>
                  <p className="text-gray-600 text-sm mb-4">Duration: {formatTime(recordingTime)}</p>
                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Re-record
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={submitAnswer}
              disabled={!audioBlob || loading}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
  );
}

export default Interview;