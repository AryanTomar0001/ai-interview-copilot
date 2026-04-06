import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [questions, setQuestions] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [result, setResult] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const resetState = () => {
    setQuestions(null);
    setSelectedQuestion(null);
    setResult(null);
    setResumeUploaded(false);
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
        resetState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};