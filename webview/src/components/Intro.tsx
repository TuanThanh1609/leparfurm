import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { ArrowRight } from "lucide-react";

interface IntroProps {
    onStart: () => void;
}

export function Intro({ onStart }: IntroProps) {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-end pb-12 md:pb-20 text-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 bg-brand-dark">
                <img
                    src="https://images.unsplash.com/photo-1615634260167-c8c9c3138499?q=80&w=1887&auto=format&fit=crop"
                    alt="Luxury Perfume"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 px-8 w-full"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-6"
                >
                    <span className="inline-block border border-brand-gold/30 rounded-full px-4 py-1 text-xs text-brand-gold uppercase tracking-widest backdrop-blur-sm">
                        Tìm Hương Phù Hợp
                    </span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-[1.1]">
                    Khám Phá <br />
                    <span className="text-brand-gold italic">Hương Thơm Của Bạn</span>
                </h1>

                <p className="text-white/70 text-base md:text-lg mb-10 font-light leading-relaxed max-w-xs mx-auto">
                    Trả lời 3 câu hỏi đơn giản và để chúng tôi tìm mùi hương phù hợp nhất cho bạn.
                </p>

                <Button onClick={onStart} className="w-full">
                    Bắt Đầu Ngay <ArrowRight size={20} />
                </Button>
            </motion.div>
        </div>
    );
}
