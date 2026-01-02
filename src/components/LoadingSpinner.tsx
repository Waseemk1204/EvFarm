import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
}

export function LoadingSpinner({ fullScreen = false, message = 'Loading Excellence' }: LoadingSpinnerProps) {
    const containerClasses = fullScreen
        ? 'fixed inset-0 bg-[#FAFAFA] flex items-center justify-center z-50'
        : 'flex items-center justify-center py-20';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center">
                {/* Animation Window */}
                <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center mb-6">

                    {/* Parallax Background (Mountains/Trees) */}
                    <motion.div
                        className="absolute bottom-4 left-0 flex opacity-20"
                        animate={{ x: [-200, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <svg key={i} width="100" height="40" viewBox="0 0 100 40" className="text-[#14211A] fill-current">
                                <path d="M0 40L20 20L40 40H0Z" />
                                <path d="M30 40L60 10L90 40H30Z" />
                            </svg>
                        ))}
                    </motion.div>

                    {/* Road Line */}
                    <div className="absolute bottom-2 w-full h-[2px] bg-[#14211A]/10">
                        <motion.div
                            className="absolute top-0 bottom-0 bg-[#D4AF37]"
                            style={{ width: '30%' }}
                            animate={{
                                left: ['-30%', '100%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    {/* Golf Cart SVG - Premium Silhouette */}
                    <motion.div
                        className="relative z-10 mb-2"
                        animate={{ y: [0, -1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Chassis */}
                            <path
                                d="M20 45 L80 45 L85 30 L90 30 L90 25 L80 25 L75 10 L25 10 L20 25 L10 25 L10 30 L15 30 L20 45"
                                stroke="#14211A"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                            {/* Roof */}
                            <path
                                d="M25 10 L25 5 L75 5 L75 10"
                                stroke="#14211A"
                                strokeWidth="2"
                            />
                            {/* Roof Top Solid */}
                            <path d="M25 5 L75 5" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />

                            {/* Windshield */}
                            <path d="M75 10 L80 25" stroke="#14211A" strokeWidth="1.5" />

                            {/* Seat */}
                            <path d="M35 25 L45 25 L45 35 L35 35 Z" fill="#14211A" />

                            {/* Wheels */}
                            <g className="origin-center">
                                <motion.g
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformOrigin: '30px 45px' }}
                                >
                                    <circle cx="30" cy="45" r="8" stroke="#14211A" strokeWidth="2" />
                                    <circle cx="30" cy="45" r="3" fill="#D4AF37" />
                                    <path d="M30 37 L30 53 M22 45 L38 45" stroke="#14211A" strokeWidth="1" />
                                </motion.g>
                            </g>

                            <g className="origin-center">
                                <motion.g
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformOrigin: '70px 45px' }}
                                >
                                    <circle cx="70" cy="45" r="8" stroke="#14211A" strokeWidth="2" />
                                    <circle cx="70" cy="45" r="3" fill="#D4AF37" />
                                    <path d="M70 37 L70 53 M62 45 L78 45" stroke="#14211A" strokeWidth="1" />
                                </motion.g>
                            </g>
                        </svg>
                    </motion.div>

                    {/* Speed Lines */}
                    <motion.div
                        className="absolute right-0 bottom-10"
                        animate={{ x: [20, -100], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-8 h-[1px] bg-[#D4AF37]" />
                    </motion.div>
                    <motion.div
                        className="absolute right-0 bottom-6"
                        animate={{ x: [20, -100], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.2 }}
                    >
                        <div className="w-12 h-[1px] bg-[#14211A]/20" />
                    </motion.div>

                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-[#14211A] text-lg tracking-widest uppercase">
                        {message}
                    </span>
                    <div className="flex gap-1.5">
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
