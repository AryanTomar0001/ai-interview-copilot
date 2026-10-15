// import { useContext, useEffect, useState } from "react";
// import { AppContext } from "../context/AppContext";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";
// import QuestionCard from "../components/QuestionCard";
// import { Loader2 } from "lucide-react";

// function Questions() {
//   const { questions, setQuestions, setSelectedQuestion, isQuestionCompleted, generateAttemptId } = useContext(AppContext);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

// useEffect(() => {
//     const hasQuestions =
//         questions &&
//         (
//             (questions.technical?.length > 0) ||
//             (questions.hr?.length > 0) ||
//             (questions.project?.length > 0)
//         );

//     if (hasQuestions) {
//         setLoading(false);
//         return;
//     }

//     fetchQuestions();
// }, []);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await API.get("/questions/generate");
//       setQuestions(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to generate questions. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (q) => {
//     if (isQuestionCompleted(q.question)) {
//       return;
//     }
//     setSelectedQuestion(q);
//     generateAttemptId();
//     navigate("/interview");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Generating personalized questions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6">
//         <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
//           <p className="text-red-600 mb-4">{error}</p>
//           <button
//             onClick={fetchQuestions}
//             className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!questions) return null;

//   return (
//     <>
//       <div className="min-h-screen">
//         <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
//           <div className="mb-6">
//             <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
//               Your Interview Questions
//             </h1>
//             <p className="text-sm md:text-base text-gray-600 break-words whitespace-normal">
//               Select a question to start practicing your answer
//             </p>
//           </div>

//           <div className="flex flex-col gap-4">
//           {questions.technical && questions.technical.length > 0 && (
//             <div>
//               <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
//                 💻 Technical Questions
//               </h2>
//               <div className="flex flex-col gap-4">
//                 {questions.technical.map((q, i) => (
//                   <QuestionCard key={i} question={q} onSelect={handleSelect} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {questions.hr && questions.hr.length > 0 && (
//             <div>
//               <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
//                 👥 HR Questions
//               </h2>
//               <div className="flex flex-col gap-4">
//                 {questions.hr.map((q, i) => (
//                   <QuestionCard key={i} question={q} onSelect={handleSelect} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {questions.project && questions.project.length > 0 && (
//             <div>
//               <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
//                 🚀 Project-Based Questions
//               </h2>
//               <div className="flex flex-col gap-4">
//                 {questions.project.map((q, i) => (
//                   <QuestionCard key={i} question={q} onSelect={handleSelect} />
//                 ))}
//               </div>
//             </div>
//           )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Questions;

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import {
  Loader2,
  Sparkles,
  Code2,
  Users,
  Rocket,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

function Questions() {
  const {
    questions,
    setQuestions,
    setSelectedQuestion,
    isQuestionCompleted,
    generateAttemptId,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
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
      setLoading(false);
      return;
    }

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/questions/generate");
      setQuestions(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate questions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (q) => {
    if (isQuestionCompleted(q.question)) {
      return;
    }

    setSelectedQuestion(q);
    generateAttemptId();
    navigate("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-lg">
            <Sparkles className="h-7 w-7 text-white animate-pulse" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">
            Preparing your interview
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Our AI is generating personalized questions based on your profile
            and experience.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating questions...
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <RefreshCw className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchQuestions}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!questions) return null;

  const technicalCount = questions.technical?.length || 0;
  const hrCount = questions.hr?.length || 0;
  const projectCount = questions.project?.length || 0;

  const totalQuestions = technicalCount + hrCount + projectCount;

  const categories = [
    {
      key: "technical",
      title: "Technical",
      description: "Test your technical knowledge and problem-solving skills.",
      icon: Code2,
      count: technicalCount,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      key: "hr",
      title: "HR & Behavioral",
      description: "Practice common behavioral and personality questions.",
      icon: Users,
      count: hrCount,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      key: "project",
      title: "Project-Based",
      description: "Explain your projects, decisions, and technical approach.",
      icon: Rocket,
      count: projectCount,
      iconStyle: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-slate-900" />
            AI Interview Practice
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your Interview Questions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Practice personalized questions generated from your profile,
                projects, and technical background.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                <Sparkles className="h-4 w-4 text-white" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Questions</p>
                <p className="text-sm font-semibold text-slate-900">
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.iconStyle}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {category.count}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {category.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-10">

          {/* Technical */}
          {questions.technical && questions.technical.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Code2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Technical Questions
                    </h2>
                    <p className="text-xs text-slate-500">
                      {technicalCount} questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {questions.technical.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          )}

          {/* HR */}
          {questions.hr && questions.hr.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <Users className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      HR & Behavioral Questions
                    </h2>
                    <p className="text-xs text-slate-500">
                      {hrCount} questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {questions.hr.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Project */}
          {questions.project && questions.project.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Rocket className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Project-Based Questions
                    </h2>
                    <p className="text-xs text-slate-500">
                      {projectCount} questions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {questions.project.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Bottom hint */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ArrowRight className="h-3.5 w-3.5" />
          Select a question to start your AI-powered interview
        </div>
      </div>
    </div>
  );
}

export default Questions;