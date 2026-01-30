import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const product = useMemo(() => {
        return productsData.find(p => p.id === id);
    }, [id]);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <p className="text-lg font-medium mb-4">Sản phẩm không tồn tại.</p>
                <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-primary text-white rounded-full font-bold">
                    Quay lại cửa hàng
                </button>
            </div>
        );
    }

    const [quantity, setQuantity] = React.useState(1);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
            showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-[#f2f0e9] font-display min-h-screen flex flex-col transition-colors duration-200">
            <div className="fixed top-0 z-50 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md transition-colors duration-200">
                <div className="flex items-center justify-between p-4 max-w-md mx-auto">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="font-bold tracking-widest text-sm uppercase text-text-main dark:text-white truncate max-w-[200px]">{product.title}</div>
                    <button onClick={() => navigate('/cart')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-main dark:text-white relative">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {/* <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span> */}
                    </button>
                </div>
            </div>

            <main className="flex-grow pt-20 pb-32 max-w-md mx-auto w-full px-4 overflow-x-hidden">
                <div className="flex flex-col gap-4 mb-8">
                    <div className="w-full bg-surface-light dark:bg-surface-dark aspect-[4/5] rounded-2xl overflow-hidden shadow-sm relative group">
                        <div className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${product.image}")` }}></div>
                        <button className="absolute top-4 right-4 size-10 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-text-main dark:text-white hover:bg-primary hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                        </button>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-1 mb-3 text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                        <span>4.9 (Đã xác minh)</span>
                    </div>
                    <h1 className="text-text-main dark:text-white text-3xl md:text-3xl font-bold leading-tight mb-2 tracking-tight">{product.title}</h1>
                    <p className="text-text-muted dark:text-gray-400 text-base mb-4 font-sans italic">{product.brand}</p>
                    <div className="text-2xl font-bold text-text-main dark:text-white">{formatPrice(product.price)}</div>
                </div>

                {product.tags && product.tags.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold text-center mb-6 text-text-main dark:text-white uppercase tracking-widest text-xs border-b border-gray-200 dark:border-gray-800 pb-2 mx-10">Nhãn Hương Thơm</h2>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {product.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-10 px-2">
                    <h3 className="text-lg font-bold mb-3 text-text-main dark:text-white">Mô tả</h3>
                    <p className="text-text-muted dark:text-gray-300 leading-relaxed text-[15px] font-sans">
                        {product.description || 'Không có mô tả sản phẩm.'}
                    </p>
                </div>
            </main>

            <div className="fixed bottom-0 w-full z-40 bg-white dark:bg-[#1a160d] border-t border-gray-100 dark:border-gray-800 pb-safe pt-4 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto flex items-center gap-4 pb-4">
                    <div className="flex items-center h-12 border border-gray-200 dark:border-gray-700 rounded-xl bg-background-light dark:bg-surface-dark">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white"
                        >
                            <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-text-main dark:text-white">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 h-12 bg-primary hover:bg-[#d9a610] text-[#1b180d] rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span>Thêm Vào Giỏ</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
