import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock order submission
        console.log('Order submitted:', { items, totalAmount, formData });
        
        // Simulate API call
        setTimeout(() => {
            clearCart();
            setStep('success');
        }, 1000);
    };

    if (step === 'success') {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark text-text-main dark:text-[#f2f0e9] p-4 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Đặt Hàng Thành Công!</h2>
                <p className="text-text-muted dark:text-gray-400 mb-8 max-w-xs">
                    Cảm ơn bạn, {formData.name}. Chúng tôi đã nhận được đơn hàng và sẽ liên hệ với bạn sớm nhất có thể.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="w-full max-w-xs h-12 bg-primary hover:bg-[#d9a610] text-[#1b180d] rounded-xl font-bold text-base tracking-wide flex items-center justify-center transition-colors shadow-lg shadow-primary/20"
                >
                    Quay về Trang Chủ
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark text-text-main dark:text-[#f2f0e9] p-4 text-center">
                <p className="mb-4">Giỏ hàng của bạn đang trống.</p>
                <button onClick={() => navigate('/shop')} className="text-primary font-bold">Đi đến Cửa hàng</button>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-[#f2f0e9] font-display antialiased overflow-x-hidden min-h-screen flex flex-col transition-colors duration-200">
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors duration-200">
                <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>
                <h1 className="text-xl font-semibold tracking-wide text-center flex-1 pr-10">Thanh Toán</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-32 px-4 pt-4 max-w-lg mx-auto w-full">
                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">Tóm tắt đơn hàng</h3>
                    <div className="flex flex-col gap-3">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start text-sm">
                                <div>
                                    <span className="font-medium">{item.title}</span>
                                    <span className="text-text-muted dark:text-gray-400 ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                            <span>Tổng cộng</span>
                            <span className="text-primary">{formatPrice(totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg mb-1 border-b border-gray-100 dark:border-gray-800 pb-2">Thông tin giao hàng</h3>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted dark:text-gray-400">Họ và tên</label>
                        <input 
                            type="text" 
                            name="name" 
                            required 
                            value={formData.name}
                            onChange={handleInputChange}
                            className="h-12 px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                            placeholder="Nhập họ tên của bạn"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted dark:text-gray-400">Số điện thoại</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            required 
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="h-12 px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted dark:text-gray-400">Địa chỉ</label>
                        <input 
                            type="text" 
                            name="address" 
                            required 
                            value={formData.address}
                            onChange={handleInputChange}
                            className="h-12 px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                            placeholder="Nhập địa chỉ giao hàng"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted dark:text-gray-400">Ghi chú (Tùy chọn)</label>
                        <textarea 
                            name="note" 
                            value={formData.note}
                            onChange={handleInputChange}
                            className="h-24 p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                            placeholder="Ví dụ: Giao giờ hành chính"
                        />
                    </div>
                </form>
            </main>

            <div className="fixed bottom-0 w-full bg-white dark:bg-[#1a160d] border-t border-gray-100 dark:border-gray-800 pb-safe pt-4 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="max-w-lg mx-auto">
                    <button 
                        type="submit"
                        form="checkout-form"
                        className="w-full h-12 bg-primary hover:bg-[#d9a610] text-[#1b180d] rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 mb-4"
                    >
                        <span>Đặt Hàng • {formatPrice(totalAmount)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
