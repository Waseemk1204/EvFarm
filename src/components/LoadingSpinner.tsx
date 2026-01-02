import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
}

export function LoadingSpinner({ fullScreen = false, message = 'Loading...' }: LoadingSpinnerProps) {
    const containerClasses = fullScreen
        ? 'fixed inset-0 bg-[#14211A] flex items-center justify-center z-50'
        : 'flex items-center justify-center py-20';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-6">
                {/* Golf Cart Animation Container */}
                <div className="relative w-48 h-32">
                    {/* Road/Ground */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                    {/* Moving Golf Cart */}
                    <motion.div
                        className="absolute bottom-2"
                        animate={{
                            x: [0, 120, 0],
                        }}
                        transition={{
                            duration: 3,
                            ease: "easeInOut",
                            repeat: Infinity,
                        }}
                    >
                        {/* Golf Cart SVG */}
                        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Cart Body */}
                            <path
                                d="M10 25 L15 10 L45 10 L50 25 L10 25"
                                fill="#D4AF37"
                                stroke="#C4A030"
                                strokeWidth="1"
                            />
                            {/* Roof */}
                            <path
                                d="M12 10 L12 5 L48 5 L48 10"
                                fill="none"
                                stroke="#D4AF37"
                                strokeWidth="2"
                            />
                            {/* Roof Top */}
                            <rect x="10" y="3" width="40" height="3" rx="1" fill="#D4AF37" />
                            {/* Seat */}
                            <rect x="20" y="15" width="20" height="8" rx="2" fill="#1a2f22" />
                            {/* Steering */}
                            <circle cx="18" cy="18" r="3" fill="none" stroke="#1a2f22" strokeWidth="1.5" />
                            {/* Front Wheel */}
                            <motion.g
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                style={{ transformOrigin: '45px 30px' }}
                            >
                                <circle cx="45" cy="30" r="6" fill="#333" stroke="#222" strokeWidth="1" />
                                <circle cx="45" cy="30" r="2" fill="#666" />
                                <line x1="45" y1="24" x2="45" y2="26" stroke="#666" strokeWidth="1" />
                                <line x1="45" y1="34" x2="45" y2="36" stroke="#666" strokeWidth="1" />
                                <line x1="39" y1="30" x2="41" y2="30" stroke="#666" strokeWidth="1" />
                                <line x1="49" y1="30" x2="51" y2="30" stroke="#666" strokeWidth="1" />
                            </motion.g>
                            {/* Back Wheel */}
                            <motion.g
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                style={{ transformOrigin: '15px 30px' }}
                            >
                                <circle cx="15" cy="30" r="6" fill="#333" stroke="#222" strokeWidth="1" />
                                <circle cx="15" cy="30" r="2" fill="#666" />
                                <line x1="15" y1="24" x2="15" y2="26" stroke="#666" strokeWidth="1" />
                                <line x1="15" y1="34" x2="15" y2="36" stroke="#666" strokeWidth="1" />
                                <line x1="9" y1="30" x2="11" y2="30" stroke="#666" strokeWidth="1" />
                                <line x1="19" y1="30" x2="21" y2="30" stroke="#666" strokeWidth="1" />
                            </motion.g>
                        </svg>
                    </motion.div>

                    {/* Dust Particles */}
                    <motion.div
                        className="absolute bottom-3 left-0"
                        animate={{
                            opacity: [0, 0.5, 0],
                            x: [-10, -30],
                            scale: [0.5, 1.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    >
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30" />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-4 left-2"
                        animate={{
                            opacity: [0, 0.3, 0],
                            x: [-10, -25],
                            scale: [0.3, 1],
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: 0.3,
                        }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/20" />
                    </motion.div>
                </div>

                {/* Loading Text */}
                <motion.div
                    className="flex items-center gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <span className="text-[#D4AF37] text-sm tracking-[0.2em] uppercase font-light">
                        {message}
                    </span>
                </motion.div>

                {/* Progress Dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#D4AF37]"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
