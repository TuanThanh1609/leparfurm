import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "outline";
    children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
    const baseStyles = "px-8 py-4 rounded-full font-serif text-lg font-bold tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer";
    const variants = {
        primary: "bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-dark hover:shadow-xl active:scale-95 border-none",
        outline: "border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white active:scale-95"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
}
