import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display text-charcoal dark:text-white antialiased">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <button className="text-charcoal dark:text-white flex size-12 shrink-0 items-center justify-start focus:outline-none">
                    <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>menu</span>
                </button>
                <h2 className="text-charcoal dark:text-white text-xl font-bold leading-tight tracking-[0.1em] flex-1 text-center uppercase">Le Parfurm</h2>
                <div className="flex w-12 items-center justify-end">
                    <button onClick={() => navigate('/cart')} className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-charcoal dark:text-white gap-2 min-w-0 p-0 focus:outline-none">
                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>shopping_bag</span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="p-4 pt-2">
                <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-sm">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC8W0R-GzgcYNWIgLy0anQpUhuVV_mfOkVzv7WtS8aDzehhcXS4vQJWq4KV9ihfsdk8AfJI8zFTVI4rOOYeCYlTNXRq-AZZ9enq7qZrnSPSQyHSg0XiN9UXOajrY1CsqzrSNQSzWDAzRzVP8caUjb6QH_Mq5zw6yeTHVb5forBhoWg8oQqj6RxV9sfjM_piFMFL9ifUgBiBbx_gW74asHyZG_mstTxXGKskXEew0PTI6_14n2Na6sTfPfQRaj4AvZscWEZcwxzesc4")' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-3">
                        <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded text-[10px] font-bold text-white uppercase tracking-widest">Bộ Sưu Tập Mới</span>
                        <h1 className="text-white text-4xl font-light tracking-wide leading-tight">Tinh Hoa <br /><span className="font-bold font-serif italic">Mùa Hè</span></h1>
                        <p className="text-white/90 text-sm font-medium leading-normal max-w-[240px]">Khám phá những mùi hương được yêu thích nhất lấy cảm hứng từ vùng biển Amalfi.</p>
                        <button onClick={() => navigate('/shop')} className="mt-2 flex items-center justify-center rounded-md h-11 px-6 bg-primary text-charcoal text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors shadow-lg shadow-black/20">
                            Khám Phá Ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Quiz Banner */}
            <div className="px-4 py-2">
                <div className="relative w-full overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => navigate('/quiz-intro')}>
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwAXZMHw-ydQigVmeCmBalTmpjQjIwO9HkNC3upR-EwtKgaYp3xUTnlzNbah2lhODf_An6_JcXUhlgMCojpEFfCLXSJ4-2HLHVJ6ZrsFyBZNA9hVy0yYp8QyHctstkyLCclJgpTAuTaRpx4395Z6MBaqf0TBtwtClMD_8tyG2WA1vxZgm1UWadioxd6xt8Wuy8Wy9kFksiXwzaTcWpXq1kQPZRhaC1wHyp1_ELWyBnEeTB-xWbXi5TWIMK9IrSbHi8eUH05vPPkvo")' }}></div>
                    <div className="absolute inset-0 bg-black/60 bg-opacity-60 backdrop-blur-[1px]"></div>
                    <div className="relative flex flex-col items-center justify-center text-center p-8 gap-4">
                        <span className="material-symbols-outlined text-primary text-4xl animate-pulse">psychology_alt</span>
                        <h3 className="text-white text-2xl font-serif italic leading-snug">Tìm Kiếm <br /><span className="font-sans font-bold not-italic tracking-wide">Mùi Hương Hoàn Hảo</span></h3>
                        <p className="text-white/80 text-xs font-medium max-w-[260px] leading-relaxed">Trả lời vài câu hỏi để chúng tôi gợi ý hương thơm phù hợp nhất với phong cách của bạn.</p>
                        <button className="mt-2 flex items-center justify-center rounded-full h-10 px-8 bg-primary text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(236,182,19,0.3)]">
                            Bắt Đầu Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* Best Sellers Preview from Products */}
            <div className="px-4 pt-6 pb-4">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-charcoal dark:text-white tracking-wide text-xl font-bold leading-tight">Sản Phẩm Bán Chạy</h2>
                    <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700 ml-4"></div>
                </div>
                {/* Note: This data will need to be made dynamic in future, essentially reusing the Shop logic but limited to 2 items */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    {/* Placeholder for dynamic content - will implement ShopPage fully first to see data hook */}
                    <div className="col-span-2 text-center text-xs text-gray-500 italic">
                        Xem toàn bộ bộ sưu tập tại Cửa hàng
                    </div>
                </div>
            </div>

            <div className="h-10 bg-background-light dark:bg-background-dark"></div>
            <BottomNav />
        </div>
    );
};

export default HomePage;
