import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { ShoppingBag } from "lucide-react";

// Matches the JSON structure
export interface Product {
    id: string;
    title: string;
    brand: string;
    price: number;
    image: string;
    description: string;
    tags: string[];
    link?: string;
}

interface ResultsProps {
    matches: Product[];
    onRestart: () => void;
    onBuyNow: (product: Product) => void;
}

export function Results({ matches, onRestart, onBuyNow }: ResultsProps) {
    const winner = matches[0];
    const runnersUp = matches.slice(1, 4); // Take up to 3 alternates

    if (!winner) return <div>Không tìm thấy sản phẩm phù hợp</div>;

    return (
        <div className="w-full h-full flex flex-col bg-brand-cream overflow-y-auto custom-scrollbar">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-brand-green text-white p-8 pt-16 rounded-b-[3rem] relative shadow-2xl z-10 text-center"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                >
                    Hương Thơm Dành Cho Bạn
                </motion.span>

                <h2 className="text-3xl md:text-4xl font-serif mb-1 leading-none">{winner.title}</h2>
                <p className="opacity-70 text-sm font-sans tracking-wide">{winner.brand}</p>

                <div className="mt-8 mb-[-3rem] relative inline-block">
                    <div className="absolute inset-0 bg-brand-gold blur-2xl opacity-40 animate-pulse" />
                    <img
                        src={winner.image}
                        alt={winner.title}
                        className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border-4 border-white shadow-2xl relative z-10 bg-white"
                    />
                </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-6 pt-16 pb-8 flex-1 flex flex-col"
            >
                <div className="text-center mb-10 mt-4">
                    <p className="text-brand-green font-serif text-2xl mb-3">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(winner.price)}
                    </p>
                    <p className="text-brand-dark/70 text-sm leading-relaxed max-w-xs mx-auto font-light">
                        {winner.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {winner.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] border border-brand-dark/20 px-2 py-0.5 rounded-full text-brand-dark/60">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Runners Up */}
                {runnersUp.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/30 mb-4 text-center">Lựa Chọn Khác</h3>
                        <div className="space-y-3">
                            {runnersUp.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (idx * 0.1) }}
                                    onClick={() => onBuyNow(p)}
                                    className="bg-white p-3 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-brand-gold/30 transition-colors cursor-pointer"
                                >
                                    <img src={p.image} alt={p.title} className="w-14 h-14 rounded-full object-cover bg-gray-100" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-serif text-brand-dark text-base truncate">{p.title}</h4>
                                        <p className="text-xs text-brand-green font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto space-y-3 pt-6">
                    <Button
                        className="w-full"
                        onClick={() => onBuyNow(winner)}
                    >
                        <ShoppingBag size={18} /> Mua Ngay
                    </Button>
                    <button onClick={onRestart} className="w-full py-3 text-sm text-brand-dark/40 hover:text-brand-dark transition-colors font-medium">
                        Làm Lại
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
