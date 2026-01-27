import { motion } from 'framer-motion';

interface LoadingProps {
    message?: string;
}

export function Loading({ message = "Analyzing your preferences..." }: LoadingProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-brand-cream">
            <motion.div
                className="relative flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {/* Spinning ring */}
                <motion.div
                    className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>

            <motion.p
                className="mt-6 text-brand-dark/70 text-lg font-serif"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {message}
            </motion.p>

            <motion.div
                className="mt-2 flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {[0, 1, 2].map(i => (
                    <motion.span
                        key={i}
                        className="w-2 h-2 bg-brand-gold rounded-full"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}
