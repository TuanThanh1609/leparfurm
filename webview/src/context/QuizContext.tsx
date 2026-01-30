import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface QuizContextType {
  answers: string[];
  setAnswer: (questionIndex: number, answer: string) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<string[]>([]);

  const setAnswer = (questionIndex: number, answer: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  };

  const resetQuiz = () => {
    setAnswers([]);
  };

  return (
    <QuizContext.Provider value={{ answers, setAnswer, resetQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
