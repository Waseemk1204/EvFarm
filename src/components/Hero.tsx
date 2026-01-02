import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export function Hero() {
  const { content } = useSiteContent();

  return (
    <section id="home" className="relative h-[85vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="/hero-bg.jpg"
          alt="EV Farm Luxury Golf Cart"
          className="w-full h-full object-cover object-[30%_center] md:object-center opacity-80"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] leading-none">
            {content.heroTagline}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-7xl lg:text-9xl text-white mb-8 leading-[1.0] lg:leading-[0.9] tracking-tighter"
        >
          {content.heroTitle} <br />
          <span className="text-gradient-gold italic font-medium">{content.heroTitleHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
        >
          {content.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <a href="#models" className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-[#D4AF37] text-[#14211A] font-bold rounded-sm transition-all duration-500 hover:bg-white overflow-hidden shadow-lg hover:shadow-xl">
            <span className="relative z-10">{content.heroCta1}</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#contact" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold rounded-sm transition-all duration-500 hover:bg-white/20 hover:border-white/40">
            {content.heroCta2}
          </a>
        </motion.div>
      </div>


      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/30 tracking-[0.4em] uppercase font-bold">Scroll to Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-[#D4AF37] to-transparent"
        />
      </motion.div>
    </section>
  );
}