import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./components/Layout";
import { Intro } from "./components/Intro";
import { QuizCard, type Question } from "./components/QuizCard";
import { Results, type Product } from "./components/Results";
import { getTopMatches } from "./logic/matchmaker";
import productsData from "./data/products.json";

// Using generic type for imported json to avoid strict check errors
const ALL_PRODUCTS = productsData as unknown as Product[];

type AppState = "intro" | "quiz" | "results";

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Where will you be wearing this scent?",
    options: [
      { label: "Daily / Office", value: "Office" },
      { label: "Date Night", value: "Sexy" },
      { label: "Party / Event", value: "Sexy" }, // Using Sexy/Party tags
      { label: "Gym / Sport", value: "Fresh" },
      { label: "Relaxing at Home", value: "Sweet" }
    ]
  },
  {
    id: 2,
    question: "What kind of vibe do you prefer?",
    options: [
      { label: "Fresh & Citrusy", value: "Fresh" },
      { label: "Sweet & Floral", value: "Sweet" },
      { label: "Woody & Warm", value: "Woody" },
      { label: "Spicy & Bold", value: "Spicy" }
    ]
  },
  {
    id: 3,
    question: "What is your budget?",
    options: [
      { label: "Under 1,000,000 VND", value: "Budget" },
      { label: "1M - 3M VND", value: "Mid" },
      { label: "Money is no object", value: "Luxury" }
    ]
  }
];

export default function App() {
  const [view, setView] = useState<AppState>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [matches, setMatches] = useState<Product[]>([]);

  const startQuiz = () => {
    setView("quiz");
    setStep(0);
    setAnswers([]);
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Finished
      calculateMatches(newAnswers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    } else {
      setView("intro");
    }
  };

  const calculateMatches = (userAnswers: string[]) => {
    // Use real matchmaker algorithm from Phase 4
    const topProducts = getTopMatches(userAnswers, ALL_PRODUCTS, 5);

    // Fallback if no match
    const finalMatches = topProducts.length > 0 ? topProducts : ALL_PRODUCTS.slice(0, 3);

    setMatches(finalMatches);
    setView("results");
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {view === "intro" && (
          <motion.div
            key="intro"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Intro onStart={startQuiz} />
          </motion.div>
        )}

        {view === "quiz" && (
          <motion.div
            key="quiz"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizCard
              data={QUESTIONS[step]}
              totalQuestions={QUESTIONS.length}
              currentStep={step + 1}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {view === "results" && (
          <motion.div
            key="results"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Results matches={matches} onRestart={() => setView("intro")} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
