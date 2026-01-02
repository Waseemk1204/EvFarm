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

                    {/* Golf Cart SVG - Premium Detailed Silhouette */}
                    <motion.div
                        className="relative z-10 mb-2"
                        animate={{ y: [0, -1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Main Body Bodywork */}
                            <path
                                d="M15 50 L10 50 Q5 50 5 45 L5 40 Q5 35 15 35 L25 35 L30 30 L85 30 L95 40 L110 40 Q115 40 115 45 L115 50 L105 50"
                                stroke="#14211A"
                                strokeWidth="2"
                                fill="none"
                            />

                            {/* Roof Supports */}
                            <path d="M30 30 L35 10" stroke="#14211A" strokeWidth="1.5" /> {/* Rear Support */}
                            <path d="M85 30 L80 10" stroke="#14211A" strokeWidth="1.5" /> {/* Front Support */}

                            {/* Roof */}
                            <path d="M25 10 L90 10" stroke="#14211A" strokeWidth="2" />
                            <path d="M25 6 L90 6" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />

                            {/* Windshield */}
                            <path d="M80 10 L85 28" stroke="#14211A" strokeWidth="1" strokeOpacity="0.5" />

                            {/* Steering Wheel */}
                            <path d="M75 22 L82 16" stroke="#14211A" strokeWidth="1.5" />
                            <circle cx="82" cy="16" r="3" stroke="#14211A" strokeWidth="1.5" />

                            {/* Seats */}
                            <path d="M35 30 L45 30 L45 20 L38 20 Q35 20 35 25 Z" fill="#14211A" /> {/* Rear Seat Back */}
                            <path d="M45 30 L65 30 L65 32 L45 32 Z" fill="#14211A" /> {/* Seat Cushion */}

                            {/* Front Lights */}
                            <path d="M110 42 L112 42" stroke="#D4AF37" strokeWidth="2" />

                            {/* Wheels */}
                            <g className="origin-center">
                                <motion.g
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformOrigin: '30px 50px' }}
                                >
                                    <circle cx="30" cy="50" r="10" stroke="#14211A" strokeWidth="2" />
                                    <circle cx="30" cy="50" r="7" stroke="#14211A" strokeWidth="0.5" strokeDasharray="2 2" />
                                    <circle cx="30" cy="50" r="3" fill="#D4AF37" />
                                </motion.g>
                            </g>

                            <g className="origin-center">
                                <motion.g
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                    style={{ transformOrigin: '90px 50px' }}
                                >
                                    <circle cx="90" cy="50" r="10" stroke="#14211A" strokeWidth="2" />
                                    <circle cx="90" cy="50" r="7" stroke="#14211A" strokeWidth="0.5" strokeDasharray="2 2" />
                                    <circle cx="90" cy="50" r="3" fill="#D4AF37" />
                                </motion.g>
                            </g>

                            {/* Bottom Chassis Connection */}
                            <path d="M42 50 L78 50" stroke="#14211A" strokeWidth="2" />

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
