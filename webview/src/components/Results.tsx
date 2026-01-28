import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

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
    const runnersUp = matches.slice(1, 5); // Take up to 4 alternates

    if (!winner) return <div>Không tìm thấy sản phẩm phù hợp</div>;

    // Helper to format currency
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="w-full h-full flex flex-col bg-brand-cream overflow-y-auto custom-scrollbar relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-green/10 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

            {/* Main Result Section */}
            <div className="px-6 pt-12 pb-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="absolute top-0 right-0 z-20 bg-brand-gold text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg transform -translate-y-1/2 translate-x-2"
                    >
                        <Sparkles size={14} fill="currentColor" />
                        <span className="text-xs font-bold tracking-wider uppercase">Perfect Match</span>
                    </motion.div>

                    {/* Main Card */}
                    <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xl border border-white/50 text-center overflow-hidden relative">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-50" />

                        <div className="mb-6 relative inline-block group cursor-pointer" onClick={() => onBuyNow(winner)}>
                            <div className="absolute inset-0 bg-brand-green/5 rounded-full blur-xl group-hover:bg-brand-gold/20 transition-colors duration-500" />
                            <motion.img
                                src={winner.image}
                                alt={winner.title}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="w-48 h-48 md:w-64 md:h-64 object-cover object-center rounded-full shadow-2xl relative z-10 border-4 border-white bg-white mx-auto"
                            />
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl md:text-3xl font-serif text-brand-green mb-1 leading-tight"
                        >
                            {winner.title}
                        </motion.h2>

                        <p className="text-sm font-sans text-brand-dark/50 tracking-widest uppercase mb-4">{winner.brand}</p>

                        <div className="flex justify-center gap-2 flex-wrap mb-6">
                            {winner.tags.slice(0, 4).map((tag, i) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="px-3 py-1 bg-brand-green/5 text-brand-green text-[10px] rounded-full font-medium border border-brand-green/10"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        <p className="text-brand-dark/70 text-sm leading-relaxed mb-6 font-light italic px-4">
                            "{winner.description}"
                        </p>

                        <div className="flex items-center justify-between bg-brand-cream/50 rounded-2xl p-4 border border-brand-green/5">
                            <div className="text-left">
                                <span className="block text-brand-dark/40 text-[10px] uppercase tracking-wider font-bold">Giá bán</span>
                                <span className="text-xl font-serif text-brand-green font-bold">
                                    {formatPrice(winner.price)}
                                </span>
                            </div>
                            <Button className="px-6 shadow-brand-gold/30 shadow-lg" onClick={() => onBuyNow(winner)}>
                                Mua Ngay <ArrowRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Runners Up Section */}
            {runnersUp.length > 0 && (
                <div className="px-6 pb-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[1px] bg-brand-dark/10 flex-1" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark/40">Gợi Ý Khác</h3>
                        <div className="h-[1px] bg-brand-dark/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {runnersUp.map((p, idx) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + (idx * 0.1) }}
                                onClick={() => onBuyNow(p)}
                                className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-brand-gold/30 cursor-pointer group flex flex-col"
                            >
                                <div className="relative mb-3 aspect-square rounded-xl overflow-hidden bg-brand-cream ring-1 ring-black/5">
                                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ShoppingBag size={12} className="text-brand-green" />
                                    </div>
                                </div>

                                <h4 className="font-serif text-brand-dark text-sm truncate mb-1 group-hover:text-brand-green transition-colors">{p.title}</h4>
                                <p className="text-[10px] text-brand-dark/50 mb-2 truncate">{p.brand}</p>
                                <p className="text-xs text-brand-gold font-bold mt-auto">
                                    {formatPrice(p.price)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Action Bar (Sticky Bottom) - Mobile friendly */}
            <div className="fixed bottom-6 left-6 right-6 z-30 md:static md:p-6 md:bg-transparent">
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={onRestart}
                    className="w-full bg-white/90 backdrop-blur-md shadow-xl text-brand-dark/60 hover:text-brand-dark py-3 rounded-2xl text-sm font-medium border border-white/50 transition-colors"
                >
                    Thử lại bài trắc nghiệm
                </motion.button>
            </div>
        </div>
    );
}
