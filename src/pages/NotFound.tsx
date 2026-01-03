import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEO } from '../components/SEO';

export function NotFound() {
    return (
        <Layout>
            <SEO title="Page Not Found" description="The page you are looking for does not exist." />
            <section className="min-h-[70vh] flex items-center justify-center bg-[#F8F9F8] section-padding relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_70%)]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-display text-9xl lg:text-[12rem] text-[#14211A] leading-none opacity-10 font-bold mb-4">404</h1>
                        <h2 className="font-display text-3xl lg:text-5xl text-[#14211A] mb-6">Page Not Found</h2>
                        <p className="text-[#14211A]/60 text-lg mb-10 max-w-xl mx-auto font-light">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#14211A] text-white rounded-sm hover:bg-[#D4AF37] transition-colors duration-300 font-bold tracking-wide uppercase text-sm group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </Link>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
