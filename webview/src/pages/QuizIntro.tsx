import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizIntro: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark font-body antialiased min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md h-[800px] max-h-[90vh] bg-[#0E1525] rounded-[32px] overflow-hidden relative flex flex-col shadow-2xl border border-gray-800">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-900 rounded-full mix-blend-screen filter blur-[60px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-950 rounded-full mix-blend-screen filter blur-[80px]"></div>
                </div>
                <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-8 text-center mt-12">
                    <div className="inline-flex items-center justify-center px-6 py-2 border border-yellow-600/50 rounded-full bg-blue-900/20 backdrop-blur-sm mb-10">
                        <span className="text-[#E6B325] text-xs font-semibold tracking-[0.15em] uppercase">Tìm hương phù hợp</span>
                    </div>
                    <h1 className="font-display text-5xl md:text-6xl leading-tight mb-2">
                        <span className="text-white block">Khám Phá</span>
                        <span className="text-primary italic font-medium block mt-2">Hương Thơm</span>
                        <span className="text-primary italic font-medium block">Của Bạn</span>
                    </h1>
                    <p className="text-blue-100/70 text-base leading-relaxed font-light mt-8 max-w-xs mx-auto">
                        Trả lời 3 câu hỏi đơn giản và để chúng tôi tìm mùi hương phù hợp nhất cho bạn.
                    </p>
                </div>
                <div className="relative z-10 p-8 pb-12 w-full">
                    <button onClick={() => navigate('/quiz-question')} className="w-full group bg-primary hover:bg-primary-hover transition-all duration-300 text-[#0E1525] font-bold py-4 px-6 rounded-full flex items-center justify-center shadow-glow transform hover:scale-[1.02] active:scale-[0.98]">
                        <span className="font-display font-bold text-lg tracking-wide mr-2">Bắt Đầu Ngay</span>
                        <span className="material-icons-round text-xl transform group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                    </button>
                </div>
                <button onClick={() => navigate('/')} className="absolute top-6 left-6 text-white/50 hover:text-white z-20">
                    <span className="material-icons-round">close</span>
                </button>
            </div>
        </div>
    );
};

export default QuizIntro;
