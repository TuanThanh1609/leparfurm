import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export interface Question {
    id: number;
    question: string;
    options: { label: string; value: string; icon?: string }[];
}

interface QuizCardProps {
    data: Question;
    totalQuestions: number;
    currentStep: number;
    onAnswer: (value: string) => void;
    onBack: () => void;
}

export function QuizCard({ data, totalQuestions, currentStep, onAnswer, onBack }: QuizCardProps) {
    const progress = ((currentStep) / totalQuestions) * 100;

    return (
        <div className="w-full h-full flex flex-col bg-brand-cream relative p-6 pt-10">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    aria-label="Go Back"
                    className="p-2 -ml-2 text-brand-dark/60 hover:text-brand-dark hover:bg-black/5 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase text-brand-dark/40">
                    Câu {currentStep} / {totalQuestions}
                </span>
                <div className="w-8" /> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-brand-dark/5 rounded-full mb-12 overflow-hidden">
                <motion.div
                    className="h-full bg-brand-gold"
                    initial={{ width: `${Math.max(0, ((currentStep - 1) / totalQuestions) * 100)}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <motion.div
                key={data.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full flex-1 flex flex-col"
            >
                <h2 className="text-3xl md:text-4xl font-serif text-brand-green mb-10 text-lef leading-tight">
                    {data.question}
                </h2>

                <div className="grid grid-cols-1 gap-4 w-full overflow-y-auto pb-4 custom-scrollbar">
                    {data.options.map((opt, idx) => (
                        <motion.button
                            key={opt.value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => onAnswer(opt.value)}
                            className="group relative w-full p-6Rounded-2xl bg-white border border-transparent shadow-sm hover:shadow-lg hover:border-brand-gold/30 text-left transition-all duration-300 active:scale-[0.98] rounded-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-brand-dark group-hover:text-brand-green transition-colors">
                                    {opt.label}
                                </span>
                                <div className="w-5 h-5 rounded-full border-2 border-brand-dark/20 group-hover:border-brand-gold flex items-center justify-center transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
