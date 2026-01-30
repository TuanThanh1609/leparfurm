import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';

// Helper to format VND
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ShopPage: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [searchTerm] = useState('');

    // Filter products based on search
    const filteredProducts = productsData.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark font-display antialiased">
            <header className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
                <button className="text-charcoal dark:text-white flex size-12 shrink-0 items-center justify-start focus:outline-none">
                    <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>menu</span>
                </button>
                <h2 className="text-charcoal dark:text-white text-xl font-bold leading-tight tracking-[0.1em] flex-1 text-center uppercase">Cửa hàng</h2>
                <div className="flex w-12 items-center justify-end">
                    <button onClick={() => navigate('/cart')} className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-charcoal dark:text-white gap-2 min-w-0 p-0 focus:outline-none">
                        <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>shopping_bag</span>
                    </button>
                </div>
            </header>

            <div className="sticky top-[65px] z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm px-4 py-4 flex items-center justify-between border-b border-transparent transition-all duration-300">
                <span className="text-sm font-medium text-charcoal-light dark:text-gray-400">{filteredProducts.length} sản phẩm</span>
                <button className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-charcoal-light border border-charcoal/10 dark:border-white/10 rounded-full shadow-sm active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[18px] text-charcoal dark:text-white">tune</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal dark:text-white">Lọc & Sắp xếp</span>
                </button>
            </div>

            <div className="px-4 pb-4 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="flex flex-col group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-white dark:bg-gray-800 mb-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${p.image}")` }}>
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em]">{p.brand || 'Lumière'}</p>
                                <h3 className="font-serif text-[17px] font-bold text-charcoal dark:text-white leading-tight line-clamp-2">{p.title}</h3>
                                <p className="text-xs font-medium text-charcoal-light/70 dark:text-gray-400 mb-2 truncate">
                                    {p.tags && p.tags.length > 0 ? p.tags.join(', ') : 'Eau de Parfum'}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm font-semibold text-charcoal dark:text-gray-200">{formatPrice(p.price)}</span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(p);
                                        }}
                                        className="flex items-center justify-center w-7 h-7 rounded-full border border-charcoal/20 dark:border-white/20 text-charcoal dark:text-white hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-charcoal transition-colors active:scale-90"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default ShopPage;
