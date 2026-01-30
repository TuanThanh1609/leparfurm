import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { questions } from '../data/questions';

const QuizQuestion: React.FC = () => {
    const navigate = useNavigate();
    const { setAnswer, answers } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // If answers is longer than current index, it means we might be navigating back
    // But for simplicity, we just sync with local state if needed.
    // Actually, let's just use local state for index and update context on selection.

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const handleOptionSelect = (value: string) => {
        // Save answer to context
        setAnswer(currentQuestionIndex, value);

        // Move to next question or result after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                navigate('/quiz-result');
            }
        }, 300);
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            navigate('/quiz-intro');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
            <div className="max-w-md mx-auto min-h-screen flex flex-col px-6 py-8 relative">
                <header className="flex items-center justify-between mb-2">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-600 dark:text-slate-400">
                        <span className="material-icons">arrow_back</span>
                    </button>
                    <div className="text-xs font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase">
                        Câu {currentQuestionIndex + 1} / {totalQuestions}
                    </div>
                    <div className="w-10"></div>
                </header>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-10 overflow-hidden">
                    <div 
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
                <main className="flex-grow">
                    <h1 className="font-display text-3xl md:text-4xl text-accent-green dark:text-white mb-10 leading-tight">
                        {currentQuestion.text}
                    </h1>
                    <form className="space-y-4">
                        {currentQuestion.options.map((opt, i) => {
                            const isSelected = answers[currentQuestionIndex] === opt.value;
                            return (
                                <label 
                                    key={i} 
                                    onClick={() => handleOptionSelect(opt.value)} 
                                    className={`group relative flex items-center justify-between w-full p-5 rounded-xl shadow-soft border cursor-pointer transition-all duration-200 ${
                                        isSelected 
                                        ? 'bg-primary/10 border-primary dark:bg-primary/20' 
                                        : 'bg-surface-light dark:bg-surface-dark border-transparent hover:border-primary/30'
                                    }`}
                                >
                                    <span className={`text-base font-medium transition-colors ${
                                        isSelected 
                                        ? 'text-primary' 
                                        : 'text-slate-700 dark:text-slate-200 group-hover:text-accent-green dark:group-hover:text-primary'
                                    }`}>
                                        {opt.label}
                                    </span>
                                    <input 
                                        className="peer sr-only" 
                                        name={`question-${currentQuestion.id}`} 
                                        type="radio" 
                                        checked={isSelected}
                                        readOnly
                                    />
                                    <div className={`w-6 h-6 rounded-full border-2 relative flex items-center justify-center transition-all ${
                                        isSelected 
                                        ? 'border-primary bg-primary' 
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                        <div className={`w-2.5 h-2.5 bg-white rounded-full transition-opacity ${
                                            isSelected ? 'opacity-100' : 'opacity-0'
                                        }`}></div>
                                    </div>
                                </label>
                            );
                        })}
                    </form>
                </main>
            </div>
        </div>
    );
};

export default QuizQuestion;
