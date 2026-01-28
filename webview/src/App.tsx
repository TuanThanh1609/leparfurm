import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./components/Layout";
import { Intro } from "./components/Intro";
import { QuizCard, type Question } from "./components/QuizCard";
import { Results, type Product } from "./components/Results";
import { Checkout } from "./components/Checkout";
import { getTopMatches } from "./logic/matchmaker";
import { fetchProducts } from "./services/productApi";
import staticProductsData from "./data/products.json";

// Fallback static products
const STATIC_PRODUCTS = staticProductsData as unknown as Product[];

type AppState = "intro" | "quiz" | "results" | "checkout";

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Bạn sẽ dùng nước hoa ở đâu?",
    options: [
      { label: "Đi làm / Văn phòng", value: "Office" },
      { label: "Hẹn hò", value: "Sexy" },
      { label: "Tiệc / Sự kiện", value: "Sexy" },
      { label: "Gym / Thể thao", value: "Fresh" },
      { label: "Ở nhà thư giãn", value: "Sweet" }
    ]
  },
  {
    id: 2,
    question: "Bạn thích phong cách nào?",
    options: [
      { label: "Tươi mát & Cam chanh", value: "Fresh" },
      { label: "Ngọt ngào & Hoa cỏ", value: "Sweet" },
      { label: "Gỗ ấm & Trầm", value: "Woody" },
      { label: "Cay nồng & Mạnh mẽ", value: "Spicy" }
    ]
  },
  {
    id: 3,
    question: "Ngân sách của bạn?",
    options: [
      { label: "Dưới 1 triệu VND", value: "Budget" },
      { label: "1 - 3 triệu VND", value: "Mid" },
      { label: "Không giới hạn", value: "Luxury" }
    ]
  }
];

export default function App() {
  const [view, setView] = useState<AppState>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [matches, setMatches] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>(STATIC_PRODUCTS);

  // Fetch products from NocoDB on mount
  useEffect(() => {
    const loadProducts = async () => {
      const result = await fetchProducts();

      if (result.success && result.products.length > 0) {
        console.log("📦 Using NocoDB products:", result.products.length);
        setAllProducts(result.products);
      } else {
        console.log("📦 Using static products:", STATIC_PRODUCTS.length);
        setAllProducts(STATIC_PRODUCTS);
      }
    };

    loadProducts();
  }, []);


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
    const topProducts = getTopMatches(userAnswers, allProducts, 5);

    // Fallback if no match
    const finalMatches = topProducts.length > 0 ? topProducts : allProducts.slice(0, 3);

    setMatches(finalMatches);
    setView("results");
  };

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setView("checkout");
  };

  const handleCheckoutBack = () => {
    setView("results");
  };

  const handleCheckoutComplete = () => {
    setSelectedProduct(null);
    setView("intro");
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
            <Results
              matches={matches}
              onRestart={() => setView("intro")}
              onBuyNow={handleBuyNow}
            />
          </motion.div>
        )}

        {view === "checkout" && selectedProduct && (
          <motion.div
            key="checkout"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Checkout
              product={selectedProduct}
              onBack={handleCheckoutBack}
              onComplete={handleCheckoutComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
