import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { Loader2 } from "lucide-react";

function Questions() {
  const { questions, setQuestions, setSelectedQuestion } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!questions) {
      fetchQuestions();
    }
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/questions/generate");
      setQuestions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (q) => {
    setSelectedQuestion(q);
    navigate("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Generating personalized questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchQuestions}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!questions) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Interview Questions
          </h1>
          <p className="text-gray-600">
            Select a question to start practicing your answer
          </p>
        </div>

        {questions.technical && questions.technical.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              💻 Technical Questions
            </h2>
            <div className="space-y-4">
              {questions.technical.map((q, i) => (
                <QuestionCard key={i} question={q} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        )}

        {questions.hr && questions.hr.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              👥 HR Questions
            </h2>
            <div className="space-y-4">
              {questions.hr.map((q, i) => (
                <QuestionCard key={i} question={q} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        )}

        {questions.project && questions.project.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🚀 Project-Based Questions
            </h2>
            <div className="space-y-4">
              {questions.project.map((q, i) => (
                <QuestionCard key={i} question={q} onSelect={handleSelect} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Questions;