import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { ArrowLeft, ShoppingBag, CheckCircle } from "lucide-react";
import type { Product } from "./Results";

interface CheckoutProps {
    product: Product;
    onBack: () => void;
    onComplete: () => void;
}

interface OrderForm {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note: string;
}

export function Checkout({ product, onBack, onComplete }: CheckoutProps) {
    const [form, setForm] = useState<OrderForm>({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<Partial<OrderForm>>({});

    const validate = (): boolean => {
        const newErrors: Partial<OrderForm> = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = "Vui lòng nhập họ tên";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!form.address.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ giao hàng";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API call - replace with actual backend integration
        try {
            // TODO: Send order to backend (Supabase/NocoDB)
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Order submitted:", {
                product: {
                    id: product.id,
                    title: product.title,
                    price: product.price
                },
                customer: form
            });

            setIsSuccess(true);
        } catch (error) {
            console.error("Order failed:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof OrderForm) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Success Screen
    if (isSuccess) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-cream p-8 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <CheckCircle size={80} className="text-brand-green mb-6" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-serif text-brand-dark mb-3"
                >
                    Đặt Hàng Thành Công!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-brand-dark/60 mb-8"
                >
                    Chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button onClick={onComplete}>Quay Về Trang Chủ</Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-brand-cream overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 bg-brand-cream/95 backdrop-blur-sm z-10 px-4 py-4 border-b border-brand-dark/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        aria-label="Quay lại"
                        className="p-2 -ml-2 text-brand-dark/60 hover:text-brand-dark hover:bg-black/5 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-serif text-brand-dark">Thông Tin Đặt Hàng</h1>
                </div>
            </div>

            {/* Product Summary */}
            <div className="px-4 py-4">
                <div className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-brand-dark truncate">{product.title}</h3>
                        <p className="text-sm text-brand-dark/50">{product.brand}</p>
                        <p className="text-brand-green font-medium mt-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="px-4 py-2 flex-1">
                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.fullName}
                            onChange={handleChange("fullName")}
                            placeholder="Nguyễn Văn A"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all ${errors.fullName ? "border-red-400" : "border-brand-dark/10"
                                }`}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={handleChange("phone")}
                            placeholder="0912345678"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all ${errors.phone ? "border-red-400" : "border-brand-dark/10"
                                }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">
                            Email (không bắt buộc)
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleChange("email")}
                            placeholder="email@example.com"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all ${errors.email ? "border-red-400" : "border-brand-dark/10"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">
                            Địa chỉ giao hàng <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={form.address}
                            onChange={handleChange("address")}
                            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            rows={3}
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all resize-none ${errors.address ? "border-red-400" : "border-brand-dark/10"
                                }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                        )}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-brand-dark/70 mb-1.5">
                            Ghi chú (không bắt buộc)
                        </label>
                        <textarea
                            value={form.note}
                            onChange={handleChange("note")}
                            placeholder="Ghi chú cho đơn hàng..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-brand-dark/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-brand-cream/95 backdrop-blur-sm px-4 py-4 border-t border-brand-dark/5">
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Đang xử lý...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <ShoppingBag size={18} />
                            Xác Nhận Đặt Hàng
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}
