import { Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

type FormData = {
    name: string;
    email: string;
    phone: string;
    city: string;
    model: string;
    message: string;
};

const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    city: '',
    model: '',
    message: ''
};

export function QuoteForm() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsSubmitted(true);
                setFormData(initialFormData);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
            alert('Failed to submit. Please try again or contact us directly.');
        }

        setIsSubmitting(false);
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
            >
                <CheckCircle className="w-16 h-16 mx-auto mb-6 text-[#D4AF37]" />
                <h3 className="font-display text-3xl text-white mb-3">Inquiry Received</h3>
                <p className="text-white/60 mb-8 font-light italic">
                    One of our private consultants will reach out to you shortly.
                </p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37] hover:text-white transition-colors"
                >
                    SUBMIT ANOTHER INQUIRY
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Full Name</label>
                    <input
                        type="text" id="name" name="name" required
                        value={formData.name} onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Email (Optional)</label>
                    <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Phone</label>
                    <input
                        type="tel" id="phone" name="phone" required
                        value={formData.phone} onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        placeholder="+91"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="city" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Location</label>
                    <input
                        type="text" id="city" name="city" required
                        value={formData.city} onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        placeholder="City"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">Requirements</label>
                <textarea
                    id="message" name="message" rows={3}
                    value={formData.message} onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                    placeholder="Tell us about your needs..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex items-center justify-center gap-3 py-5 bg-[#D4AF37] text-[#14211A] font-bold rounded-sm transition-all duration-500 hover:bg-white disabled:opacity-50"
            >
                {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-[#14211A]/30 border-t-[#14211A] rounded-full animate-spin" />
                ) : (
                    <>
                        <span className="text-[11px] tracking-[0.2em] uppercase">SEND INQUIRY</span>
                        <Send className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </button>
        </form>
    );
}
