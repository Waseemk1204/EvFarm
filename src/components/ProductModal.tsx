import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GolfCartModel } from '../types';

interface ProductModalProps {
    model: GolfCartModel | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ model, isOpen, onClose }: ProductModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && model && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-5xl bg-white overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[85vh]"
                    >
                        {/* Left: Visual Content */}
                        <div className="lg:w-1/2 relative bg-[#F8F9F8] overflow-hidden h-48 lg:h-auto">
                            <img
                                src={model.image}
                                alt={model.name}
                                className="w-full h-full object-contain p-4"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#14211A]/20 to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-[#14211A] transition-all rounded-full group lg:hidden"
                            >
                                <span className="text-[10px] font-bold tracking-widest uppercase">Close</span>
                            </button>
                        </div>

                        {/* Right: Specifications & Features */}
                        <div className="lg:w-1/2 p-6 lg:p-16 overflow-y-auto">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-2 block">Official Catalog</span>
                                    <h2 className="font-display text-2xl lg:text-4xl font-medium text-[#14211A] tracking-tighter">{model.name}</h2>
                                    <p className="text-[#14211A]/40 text-xs mt-1">{model.tagline}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-4 hover:bg-[#F8F9F8] rounded-full transition-all group hidden lg:block"
                                >
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#14211A]/30 group-hover:text-[#14211A]">Close</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Core Performance */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-[9px] font-bold tracking-widest uppercase text-[#14211A]/20 mb-1">Top Speed</h4>
                                        <p className="text-xl font-display text-[#14211A]">{model.speed}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] font-bold tracking-widest uppercase text-[#14211A]/20 mb-1">Max Range</h4>
                                        <p className="text-xl font-display text-[#14211A]">{model.range}</p>
                                    </div>
                                </div>

                                {/* Detailed Specs */}
                                <div className="space-y-3">
                                    <h4 className="text-[9px] font-bold tracking-widest uppercase text-[#14211A]/20 pb-2 border-b border-[#14211A]/5">Technical Specifications</h4>
                                    <div className="grid gap-2">
                                        {[
                                            { label: 'Battery Type', value: model.batteryType },
                                            { label: 'Capacity', value: model.batteryCapacity },
                                            { label: 'Motor Power', value: model.motorPower },
                                            { label: 'Charging', value: model.chargingTime },
                                            { label: 'Dimensions', value: model.dimensions },
                                            { label: 'Ground Clearance', value: model.groundClearance },
                                        ].map((spec) => (
                                            <div key={spec.label} className="flex justify-between items-center py-1">
                                                <span className="text-xs text-[#14211A]/40">{spec.label}</span>
                                                <span className="text-xs font-bold text-[#14211A]">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Premium Features */}
                                <div className="space-y-3">
                                    <h4 className="text-[9px] font-bold tracking-widest uppercase text-[#14211A]/20 pb-2 border-b border-[#14211A]/5">Standard Features</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {model.features.map((feature) => (
                                            <span key={feature} className="px-3 py-1.5 bg-[#F8F9F8] text-[9px] font-bold tracking-widest uppercase text-[#14211A]/60">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
