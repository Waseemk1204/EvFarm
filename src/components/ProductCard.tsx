import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Zap, MoveHorizontal } from 'lucide-react';
import { GolfCartModel } from '../types';

interface ProductCardProps {
    model: GolfCartModel;
    index: number;
    onViewDetails: (model: GolfCartModel) => void;
}

export function ProductCard({
    model,
    index,
    onViewDetails
}: ProductCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative bg-white overflow-hidden"
        >
            {/* Image Showcase */}
            <div className="relative aspect-square overflow-hidden bg-[#F8F9F8]">
                <img
                    src={model.image}
                    alt={model.name}
                    className={`w-full h-full ${model.imageFit === 'cover' ? 'object-cover' : 'object-contain'} p-4 group-hover:scale-105 transition-transform duration-500`}
                />

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14211A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-6 left-6">
                    <span className="px-3 py-1.5 bg-[#14211A] text-white text-[9px] font-bold tracking-[0.2em] uppercase shadow-lg">
                        {model.seating} SEATER
                    </span>
                </div>

                <button
                    onClick={() => onViewDetails(model)}
                    className="absolute bottom-8 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center translate-y-20 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl"
                >
                    <ArrowUpRight className="w-5 h-5 text-[#14211A]" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 md:px-6 md:py-8">
                <div className="mb-4">
                    <h3 className="font-display text-3xl font-medium tracking-tight text-[#14211A]">
                        {model.name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase mt-1">
                        LIMITED EDITION
                    </p>
                </div>

                <p className="text-sm text-[#14211A]/60 font-light mb-8 line-clamp-2">
                    {model.tagline}
                </p>

                {/* Minimal Specs */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#14211A]/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F8F9F8] flex items-center justify-center shrink-0">
                            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="text-[10px] font-bold text-[#14211A] whitespace-nowrap">{model.seating} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 border-x border-[#14211A]/5 px-2">
                        <div className="w-8 h-8 rounded-full bg-[#F8F9F8] flex items-center justify-center shrink-0">
                            <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="text-[10px] font-bold text-[#14211A] whitespace-nowrap">{model.power}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#F8F9F8] flex items-center justify-center shrink-0">
                            <MoveHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="text-[10px] font-bold text-[#14211A] whitespace-nowrap">{model.range}</span>
                    </div>
                </div>

                <button
                    onClick={() => onViewDetails(model)}
                    className="w-full mt-8 py-4 text-[10px] font-bold tracking-[0.3em] text-[#14211A] border border-[#14211A]/10 hover:bg-[#14211A] hover:text-white transition-all duration-500"
                >
                    VIEW SPECIFICATIONS
                </button>
            </div>
        </motion.article>
    );
}
