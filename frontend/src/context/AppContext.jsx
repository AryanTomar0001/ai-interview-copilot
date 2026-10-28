
import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [questions, setQuestions] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [result, setResult] = useState(null);

  const [interviewId, setInterviewId] = useState(null);
  const [interviewType, setInterviewType] = useState("combined");
  const [totalQuestions, setTotalQuestions] = useState(10);

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [currentAttemptId, setCurrentAttemptId] = useState(null);

const markQuestionCompleted = (questionId) => {
  if (!questionId) return;

  setCompletedQuestions((prev) => {
    const updated = new Set(prev);
    updated.add(String(questionId));
    return updated;
  });
};

const isQuestionCompleted = (questionId) => {
  if (!questionId) return false;

  return completedQuestions.has(String(questionId));
};

  const generateAttemptId = () => {
    const id = crypto.randomUUID();
    setCurrentAttemptId(id);
    return id;
  };

  const resetState = () => {
    setQuestions(null);
    setSelectedQuestion(null);
    setResult(null);
    setInterviewId(null);
    setInterviewType("combined");
    setTotalQuestions(10);
    setResumeUploaded(false);
    setCompletedQuestions(new Set());
    setCurrentAttemptId(null);
  };

  return (
    <AppContext.Provider
      value={{
        questions,
        setQuestions,
        selectedQuestion,
        setSelectedQuestion,
        result,
        setResult,
        interviewId,
        setInterviewId,
        interviewType,
        setInterviewType,
        totalQuestions,
        setTotalQuestions,
        resumeUploaded,
        setResumeUploaded,
        completedQuestions,
        markQuestionCompleted,
        isQuestionCompleted,
        currentAttemptId,
        generateAttemptId,
        resetState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
