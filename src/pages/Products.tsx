import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { GolfCartModel } from '../types';
import { useSiteContent } from '../hooks/useSiteContent';
import { SEO } from '../components/SEO';
import { SEO } from '../components/SEO';

export function Products() {
    const { content } = useSiteContent();
    const [products, setProducts] = useState<GolfCartModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<GolfCartModel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch products:', err);
                setLoading(false);
            });
    }, []);

    const handleViewDetails = (model: GolfCartModel) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <SEO
                title="Premium Electric Golf Carts"
                description="Explore our curated collection of premium electric golf carts. Zero emissions, luxury design, perfect for resorts, campuses, and gated communities."
                url="https://evfarm.in/products"
            />
            {/* Hero Section */}
            <section className="pt-20 pb-20 bg-[#14211A] relative">
                {/* Home Button */}
                <Link
                    to="/"
                    className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-[#14211A] transition-all group"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold tracking-widest uppercase">Home</span>
                </Link>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-[#D4AF37]"
                    >
                        {content.productsTagline}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-4xl lg:text-8xl font-medium tracking-tighter text-white mb-6"
                    >
                        {content.productsTitle} <span className="italic text-gradient-gold">{content.productsTitleHighlight}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg max-w-2xl mx-auto"
                    >
                        {content.productsDescription}
                    </motion.p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section-padding bg-[#F8F9F8]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-[#14211A]/40">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#14211A]/40 text-lg">No products available yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {products.map((model, index) => (
                                <ProductCard
                                    key={model._id || model.id}
                                    model={model}
                                    index={index}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <h2 className="font-display text-3xl lg:text-5xl font-medium text-[#14211A] mb-6">
                        Can't find what you're looking for?
                    </h2>
                    <p className="text-[#14211A]/60 mb-8">
                        Contact us for custom configurations and bespoke solutions tailored to your needs.
                    </p>
                    <Link
                        to="/get-quote"
                        className="inline-block px-10 py-5 bg-[#14211A] text-white font-bold text-sm tracking-widest uppercase hover:bg-[#D4AF37] transition-all"
                    >
                        Request Custom Quote
                    </Link>
                </div>
            </section>

            <ProductModal
                model={selectedModel}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

            <Footer />
        </>
    );
}
