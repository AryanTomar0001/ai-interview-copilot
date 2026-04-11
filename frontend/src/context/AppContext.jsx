import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [questions, setQuestions] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [result, setResult] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [currentAttemptId, setCurrentAttemptId] = useState(null);

  const markQuestionCompleted = (questionText) => {
    setCompletedQuestions(prev => new Set([...prev, questionText]));
  };

  const isQuestionCompleted = (questionText) => {
    return completedQuestions.has(questionText);
  };

  const generateAttemptId = () => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setCurrentAttemptId(id);
    return id;
  };

  const resetState = () => {
    setQuestions(null);
    setSelectedQuestion(null);
    setResult(null);
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