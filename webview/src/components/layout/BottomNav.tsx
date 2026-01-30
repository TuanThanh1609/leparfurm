import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-50 pb-safe safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                <button
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full ${isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-charcoal dark:hover:text-white'} transition-colors`}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button
                    onClick={() => navigate('/shop')}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full ${isActive('/shop') ? 'text-primary' : 'text-gray-400 hover:text-charcoal dark:hover:text-white'} transition-colors`}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/shop') ? "'FILL' 1" : "'FILL' 0" }}>search</span>
                    <span className="text-[10px] font-bold">Shop</span>
                </button>
                <button
                    onClick={() => navigate('/quiz-intro')}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full ${isActive('/quiz-intro') ? 'text-primary' : 'text-gray-400 hover:text-charcoal dark:hover:text-white'} transition-colors`}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/quiz-intro') ? "'FILL' 1" : "'FILL' 0" }}>psychology_alt</span>
                    <span className="text-[10px] font-medium">Quiz</span>
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className={`flex flex-col items-center justify-center gap-1 w-full h-full ${isActive('/profile') ? 'text-primary' : 'text-gray-400 hover:text-charcoal dark:hover:text-white'} transition-colors`}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/profile') ? "'FILL' 1" : "'FILL' 0" }}>person</span>
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </div>
            {/* Safe area spacer for mobile */}
            <div className="h-[env(safe-area-inset-bottom)] w-full bg-background-light dark:bg-background-dark"></div>
        </nav>
    );
};

export default BottomNav;
