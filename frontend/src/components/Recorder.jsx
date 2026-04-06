import { useState, useRef } from "react";

export default function Recorder({ onStop }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/wav" });
      onStop(blob);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-full shadow-lg ${
          recording ? "bg-red-500 animate-pulse" : "bg-green-500"
        }`}
      >
        {recording ? "⏹ Stop" : "🎤 Start"}
      </button>

      {recording && <p className="text-red-400">Recording...</p>}
    </div>
  );
}