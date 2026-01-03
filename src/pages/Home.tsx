import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { QuoteForm } from '../components/QuoteForm';
import { Layout } from '../components/Layout';
import { useSiteContent } from '../hooks/useSiteContent';
import { SEO } from '../components/SEO';
import {
    ShieldCheckIcon,
    LeafIcon,
    WrenchIcon,
    TruckIcon,
    BuildingIcon,
    TreesIcon,
    GraduationCapIcon,
    HotelIcon,
    CalendarIcon,
    ArrowRightIcon
} from 'lucide-react';
import { Blog, GolfCartModel } from '../types';

function BlogsSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data.slice(0, 3)))
            .catch(err => console.error('Failed to fetch blogs:', err));
    }, []);

    if (blogs.length === 0) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <section id="blogs" className="section-padding bg-[#F8F9F8]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-12 lg:mb-20">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 lg:mb-6 block text-[#D4AF37]">
                        Insights & News
                    </span>
                    <h2 className="font-display text-4xl lg:text-7xl font-medium tracking-tighter text-[#14211A]">
                        Latest from <span className="italic">EVFARM</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <motion.article
                            key={blog._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
                        >
                            <Link to={`/blogs/${blog._id}`} className="block h-full cursor-pointer">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-[#14211A]/30 mb-6">
                                        <CalendarIcon className="w-3 h-3" />
                                        {formatDate(blog.createdAt)}
                                    </div>
                                    <h3 className="font-display text-2xl font-medium text-[#14211A] mb-4 group-hover:text-[#D4AF37] transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-[#14211A]/50 text-sm line-clamp-3 leading-relaxed">
                                        {blog.content}
                                    </p>
                                    <div className="mt-6 pt-6 border-t border-[#14211A]/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#14211A]/30">
                                            By {blog.author}
                                        </span>
                                        <ArrowRightIcon className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-4 text-[11px] font-bold tracking-[0.3em] uppercase text-[#14211A] hover:text-[#D4AF37] transition-all group"
                    >
                        View All Insights
                        <div className="w-10 h-10 rounded-full border border-[#14211A]/10 flex items-center justify-center group-hover:border-[#D4AF37] transition-all">
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function Home() {
    const [products, setProducts] = useState<GolfCartModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<GolfCartModel | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { content } = useSiteContent();

    useEffect(() => {
        fetch('/api/products/featured')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Failed to fetch products:', err));
    }, []);

    const handleViewDetails = (model: GolfCartModel) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Dynamic benefits from site content
    const benefits = [
        { icon: <ShieldCheckIcon className="w-8 h-8" />, title: content.benefit1Title, desc: content.benefit1Desc },
        { icon: <LeafIcon className="w-8 h-8" />, title: content.benefit2Title, desc: content.benefit2Desc },
        { icon: <WrenchIcon className="w-8 h-8" />, title: content.benefit3Title, desc: content.benefit3Desc },
        { icon: <TruckIcon className="w-8 h-8" />, title: content.benefit4Title, desc: content.benefit4Desc }
    ];

    // Dynamic use cases from site content
    const useCases = [
        { icon: <BuildingIcon className="w-8 h-8" />, label: content.useCase1 },
        { icon: <TreesIcon className="w-8 h-8" />, label: content.useCase2 },
        { icon: <HotelIcon className="w-8 h-8" />, label: content.useCase3 },
        { icon: <GraduationCapIcon className="w-8 h-8" />, label: content.useCase4 }
    ];

    return (
        <Layout>
            <SEO />
            <Hero />

            {/* About Section */}
            <section id="about" className="section-padding bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-[#D4AF37]">{content.aboutTagline}</span>
                            <h2 className="font-display text-4xl lg:text-8xl font-medium mb-8 leading-[1.1] lg:leading-[0.85] tracking-tighter text-[#14211A]">{content.aboutTitle} <br /><span className="text-gradient-forest italic">{content.aboutTitleHighlight}</span></h2>
                            <p className="text-[#14211A]/60 text-base lg:text-lg leading-relaxed mb-12 font-light">{content.aboutDescription}</p>
                            <div className="grid grid-cols-2 gap-8">
                                <div><h4 className="text-3xl font-display text-[#14211A] mb-2">{content.aboutStat1Value}</h4><p className="text-[10px] font-bold tracking-widest uppercase text-[#14211A]/40">{content.aboutStat1Label}</p></div>
                                <div><h4 className="text-3xl font-display text-[#14211A] mb-2">{content.aboutStat2Value}</h4><p className="text-[10px] font-bold tracking-widest uppercase text-[#14211A]/40">{content.aboutStat2Label}</p></div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative mt-8 lg:mt-0">
                            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200" alt="EV Manufacturing Facility" className="rounded-sm shadow-2xl w-full" />
                            <div className="absolute -bottom-5 -left-5 lg:-bottom-10 lg:-left-10 w-24 h-24 lg:w-40 lg:h-40 bg-[#D4AF37] p-4 lg:p-8 hidden md:flex items-center justify-center">
                                <span className="text-white font-display text-2xl lg:text-4xl font-bold">#1</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Models Section */}
            <section id="models" className="section-padding bg-[#F8F9F8]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-12 lg:mb-24">
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-[#D4AF37]">{content.modelsTagline}</span>
                        <h2 className="font-display text-4xl lg:text-8xl font-medium tracking-tighter text-[#14211A]">{content.modelsTitle} <span className="italic">{content.modelsTitleHighlight}</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {products.map((model, index) => (
                            <ProductCard key={model._id || model.id} model={model} index={index} onViewDetails={handleViewDetails} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-4 text-[11px] font-bold tracking-[0.3em] uppercase text-[#14211A] hover:text-[#D4AF37] transition-all group"
                        >
                            View All Products
                            <div className="w-10 h-10 rounded-full border border-[#14211A]/10 flex items-center justify-center group-hover:border-[#D4AF37] transition-all">
                                <ArrowRightIcon className="w-4 h-4" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="section-padding bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#D4AF37_0%,_transparent_50%)]" />
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-[#D4AF37]">Our Mission</span>
                            <h3 className="font-display text-4xl lg:text-6xl font-medium mb-6 text-[#14211A]">Unmatched <span className="italic text-gradient-gold">Value</span></h3>
                            <p className="text-[#14211A]/60 text-lg leading-relaxed font-light">
                                To give best PRICE, QUALITY DELIVERY & SERVICES to customer.
                            </p>
                            <div className="absolute -left-6 top-0 w-1 h-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group lg:text-right"
                        >
                            <div className="flex flex-col items-start lg:items-end">
                                <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-[#D4AF37]">Our Vision</span>
                                <h3 className="font-display text-4xl lg:text-6xl font-medium mb-6 text-[#14211A]">Sustainable <span className="italic text-gradient-gold">Future</span></h3>
                                <p className="text-[#14211A]/60 text-lg leading-relaxed font-light">
                                    We only have one world, we have to protect it, EVFARM wants to work together with everyone to build up a clean, green and beautiful world.
                                </p>
                            </div>
                            <div className="absolute -right-6 top-0 w-1 h-full bg-[#14211A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="section-padding bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-16">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="group p-4 md:p-6 bg-[#F8F9F8] rounded-xl lg:bg-transparent lg:p-0 transition-colors hover:bg-white hover:shadow-lg lg:hover:shadow-none lg:hover:bg-transparent text-center lg:text-left">
                                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-[#14211A]/5 flex items-center justify-center text-[#14211A] group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500 mb-3 lg:mb-8 mx-auto lg:mx-0">{benefit.icon}</div>
                                <h4 className="font-display text-sm md:text-lg lg:text-2xl font-medium text-[#14211A] mb-1 lg:mb-4">{benefit.title}</h4>
                                <p className="text-[#14211A]/50 text-[10px] md:text-sm leading-relaxed hidden md:block">{benefit.desc}</p>
                                <p className="text-[#14211A]/50 text-[10px] leading-relaxed md:hidden line-clamp-3">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 lg:mt-40 grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 p-2 lg:p-4 bg-[#F8F9F8] rounded-xl lg:rounded-3xl border border-[#14211A]/5 shadow-inner">
                        {useCases.map((useCase) => (
                            <div key={useCase.label} className="bg-white rounded-lg lg:rounded-2xl p-3 lg:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-1">
                                <div className="text-[#D4AF37] mb-2 lg:mb-6 scale-75 lg:scale-100">{useCase.icon}</div>
                                <span className="text-[8px] lg:text-[10px] font-bold tracking-widest uppercase text-[#14211A]/60">{useCase.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <BlogsSection />

            {/* Contact Section */}
            <section id="contact" className="section-padding bg-[#14211A] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-8 block text-[#D4AF37]">Reserve Your Experience</span>
                        <h2 className="font-display text-4xl lg:text-8xl text-white mb-10 tracking-tighter leading-[1.1] lg:leading-[0.85]">{content.contactTitle} <br /><span className="italic text-gradient-gold">{content.contactTitleHighlight}</span></h2>
                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 lg:p-12 rounded-2xl shadow-2xl"><QuoteForm /></div>
                    </div>
                </div>
            </section>

            <ProductModal model={selectedModel} isOpen={isModalOpen} onClose={handleCloseModal} />
        </Layout>
    );
}
