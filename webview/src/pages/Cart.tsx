import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, totalAmount } = useCart();

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-[#f2f0e9] font-display antialiased overflow-x-hidden min-h-screen flex flex-col transition-colors duration-200">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors duration-200">
                <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="text-xl font-semibold tracking-wide text-center flex-1 pr-10">Lựa Chọn Của Bạn</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-32">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart</span>
                        <p className="text-gray-500 text-lg mb-6">Giỏ hàng đang trống</p>
                        <button 
                            onClick={() => navigate('/shop')} 
                            className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-[#d9a610] transition-colors"
                        >
                            Bắt Đầu Mua Sắm
                        </button>
                    </div>
                ) : (
                    <div className="p-4 flex flex-col gap-4">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm text-text-main dark:text-white line-clamp-1">{item.title}</h3>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-text-muted dark:text-gray-400 mt-0.5">{item.brand}</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="font-bold text-primary">{formatPrice(item.price)}</div>
                                        <div className="flex items-center h-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-background-light dark:bg-black/20">
                                            <button 
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-full flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-sm">remove</span>
                                            </button>
                                            <span className="w-6 text-center text-xs font-bold text-text-main dark:text-white">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-full flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between mb-2">
                                <span className="text-text-muted dark:text-gray-400">Tạm tính</span>
                                <span className="font-bold text-text-main dark:text-white">{formatPrice(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-text-muted dark:text-gray-400">Vận chuyển</span>
                                <span className="text-green-500 text-sm font-medium">Miễn phí</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-text-main dark:text-white">Tổng cộng</span>
                                <span className="text-primary">{formatPrice(totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {items.length > 0 && (
                <div className="fixed bottom-0 w-full bg-white dark:bg-[#1a160d] border-t border-gray-100 dark:border-gray-800 pb-safe pt-4 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full h-12 bg-primary hover:bg-[#d9a610] text-[#1b180d] rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 mb-4"
                    >
                        <span>Thanh Toán • {formatPrice(totalAmount)}</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
