import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { getTopMatches } from '../logic/matchmaker';
import productsData from '../data/products.json';
import type { Product } from '../components/Results';

const QuizResult: React.FC = () => {
    const navigate = useNavigate();
    const { answers } = useQuiz();

    // Compute top match
    const topMatches = useMemo(() => {
        // Cast productsData to Product[] if needed, or ensure it matches the interface
        return getTopMatches(answers, productsData as unknown as Product[], 3);
    }, [answers]);

    const bestMatch = topMatches[0];
    const matchPercentage = 95 + Math.floor(Math.random() * 5); // Mock high score for best match

    if (!bestMatch) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-text-main dark:text-white">
                <div className="text-center p-6">
                    <h2 className="text-2xl font-bold mb-4">Chưa tìm thấy kết quả</h2>
                    <p className="mb-6">Hãy thử lại với các lựa chọn khác nhé.</p>
                    <button onClick={() => navigate('/quiz-intro')} className="bg-primary px-6 py-2 rounded-full text-white font-bold">
                        Làm lại Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-body antialiased transition-colors duration-300 min-h-screen flex justify-center">
            <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen relative flex flex-col shadow-2xl overflow-hidden">
                <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                    <button onClick={() => navigate('/')} className="p-2 rounded-full bg-surface-light/20 dark:bg-surface-dark/40 backdrop-blur-sm text-text-main dark:text-white hover:bg-surface-light/40 transition">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="p-2 rounded-full bg-surface-light/20 dark:bg-surface-dark/40 backdrop-blur-sm text-text-main dark:text-white hover:bg-surface-light/40 transition">
                            <span className="material-symbols-outlined text-2xl">favorite_border</span>
                        </button>
                    </div>
                </header>
                <main className="flex-grow flex flex-col items-center pt-24 pb-48 px-6 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-text-main dark:text-primary border border-primary/30 mb-6 animate-fade-in-up">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        <span className="text-xs font-bold tracking-wider uppercase">Lựa Chọn Hoàn Hảo</span>
                    </div>
                    <div className="relative w-full aspect-[4/5] mb-8 rounded-2xl overflow-hidden shadow-soft dark:shadow-none group cursor-pointer" onClick={() => navigate(`/product/${bestMatch.id}`)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#E8E8E8] to-[#F5F5F5] dark:from-[#1A2640] dark:to-[#0F1C30] opacity-100 transition-colors"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
                        <img alt={bestMatch.title} className="absolute inset-0 w-full h-full object-contain p-8 drop-shadow-xl transform group-hover:scale-105 transition duration-700 ease-out" src={bestMatch.image} />
                        <div className="absolute top-4 right-4 z-10">
                            <div className="relative w-24 h-24 rounded-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md shadow-xl border border-primary/20 flex items-center justify-center p-1">
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[10px] uppercase tracking-widest text-text-muted dark:text-gray-400 font-bold mb-0.5">Match</span>
                                    <span className="font-display font-bold text-2xl text-primary leading-none">{matchPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center w-full space-y-3 mb-8">
                        <h3 className="text-accent-green dark:text-primary font-display text-lg tracking-widest uppercase opacity-80">{bestMatch.brand}</h3>
                        <h1 className="text-4xl font-display font-bold text-accent-green dark:text-white leading-tight">{bestMatch.title}</h1>
                        <p className="text-lg text-text-muted dark:text-gray-400 font-display italic">
                            {bestMatch.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                    </div>

                    {/* Fragrance Notes (Mocked for now as data is missing) */}
                    <div className="w-full mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-gray-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Thông tin mùi hương</h2>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center text-center p-3 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-lg">spa</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-text-muted dark:text-gray-500 mb-1">Hương đầu</span>
                                <span className="text-xs font-semibold dark:text-white">Cam Bergamot</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 w-full h-0.5 bg-primary"></div>
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-lg">filter_vintage</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-text-muted dark:text-gray-500 mb-1">Hương giữa</span>
                                <span className="text-xs font-semibold dark:text-white">Nhài Dạ</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-lg">forest</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-text-muted dark:text-gray-500 mb-1">Hương cuối</span>
                                <span className="text-xs font-semibold dark:text-white">Đàn Hương</span>
                            </div>
                        </div>
                    </div>

                    {/* Why it matches */}
                    <div className="w-full mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted dark:text-gray-400 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Tại sao phù hợp với bạn</h2>
                        <p className="text-sm dark:text-gray-300">
                            Dựa trên sở thích của bạn về {answers.includes('Office') ? 'môi trường công sở' : answers.includes('Romantic') ? 'những buổi hẹn hò' : 'phong cách sống năng động'} 
                            {' '}và hương thơm {answers.includes('Fresh') ? 'tươi mát' : answers.includes('Sweet') ? 'ngọt ngào' : 'sang trọng'}.
                        </p>
                    </div>
                </main>
                <div className="fixed bottom-0 w-full z-40 bg-white dark:bg-[#1a160d] border-t border-gray-100 dark:border-gray-800 pb-safe pt-4 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                    <button onClick={() => navigate(`/product/${bestMatch.id}`)} className="w-full bg-primary hover:bg-[#d9a610] text-[#1b180d] rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 h-12">
                        <span>Xem chi tiết</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
