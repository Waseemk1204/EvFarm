import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useSiteContent } from '../hooks/useSiteContent';
import { SEO } from '../components/SEO';

const API_URL = '/api';

export function GetQuote() {
    const { content } = useSiteContent();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', phone: '', city: '', message: '' });
            }
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Get a Quote"
                description="Request a personalized quote for premium electric golf carts. Our team will craft a custom solution for your resort, campus, or community."
                url="https://evfarm.in/get-quote"
            />
            {/* Hero Section */}
            <section className="pt-20 pb-16 bg-[#14211A] relative">
                {/* Home Button */}
                <Link
                    to="/"
                    className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-[#14211A] transition-all group"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold tracking-widest uppercase">Home</span>
                </Link>

                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-[#D4AF37]"
                    >
                        {content.quoteTagline}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-5xl lg:text-7xl font-medium tracking-tighter text-white mb-6"
                    >
                        {content.quoteTitle} <span className="italic text-gradient-gold">{content.quoteTitleHighlight}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg max-w-xl mx-auto"
                    >
                        {content.quoteDescription}
                    </motion.p>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-[#F8F9F8]">
                <div className="max-w-3xl mx-auto px-6 lg:px-12">
                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
                            </div>
                            <h2 className="font-display text-3xl font-medium text-[#14211A] mb-4">
                                {content.quoteSuccessTitle}
                            </h2>
                            <p className="text-[#14211A]/60 mb-8">
                                {content.quoteSuccessDesc}
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-8 py-4 bg-[#14211A] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#D4AF37] transition-all"
                            >
                                Back to Home
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onSubmit={handleSubmit}
                            className="bg-white p-10 lg:p-14 shadow-xl"
                        >
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                        placeholder="john@company.com (optional)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                        placeholder="Your city"
                                    />
                                </div>
                            </div>



                            <div className="mb-8">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">
                                    Your Requirements *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none"
                                    placeholder="Tell us about your requirements, quantity needed, preferred features, delivery location, etc."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-[#14211A] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Submit Inquiry
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
