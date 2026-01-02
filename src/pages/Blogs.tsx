import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarIcon, ArrowRightIcon, ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Blog } from '../types';
import { useSiteContent } from '../hooks/useSiteContent';
import { SEO } from '../components/SEO';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Blogs() {
    const { content } = useSiteContent();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch blogs:', err);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <>
            <SEO
                title="Blog & Insights"
                description="Discover insights, news, and expert articles about electric vehicles, sustainable mobility, and the future of premium transport."
                url="https://evfarm.in/blogs"
            />
            <div className="pt-20 pb-24 relative">
                {/* Home Button */}
                <Link
                    to="/"
                    className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-[#14211A]/5 backdrop-blur-md border border-[#14211A]/10 rounded-full text-[#14211A] hover:bg-[#14211A] hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold tracking-widest uppercase">Home</span>
                </Link>

                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="mb-12 lg:mb-20">
                        <h1 className="font-display text-4xl lg:text-8xl font-medium tracking-tighter text-[#14211A]">
                            {content.blogsTitle} <span className="italic">{content.blogsTitleHighlight}</span>
                        </h1>
                        <p className="text-[#14211A]/60 text-lg mt-8 max-w-2xl leading-relaxed">
                            {content.blogsDescription}
                        </p>
                    </div>

                    {loading ? (
                        <LoadingSpinner message="Loading blogs" />
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-24 bg-[#F8F9F8] rounded-sm">
                            <p className="text-[#14211A]/40 font-display text-2xl">No insights published yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, index) => (
                                <motion.article
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#14211A]/5"
                                >
                                    <Link to={`/blogs/${blog._id}`} className="block">
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-[#14211A]/30 mb-6">
                                                <CalendarIcon className="w-3 h-3" />
                                                {formatDate(blog.createdAt)}
                                            </div>
                                            <h3 className="font-display text-2xl font-medium text-[#14211A] mb-4 group-hover:text-[#D4AF37] transition-colors line-clamp-2 min-h-[4rem]">
                                                {blog.title}
                                            </h3>
                                            <p className="text-[#14211A]/50 text-sm line-clamp-3 leading-relaxed mb-6">
                                                {blog.content}
                                            </p>
                                            <div className="mt-auto pt-6 border-t border-[#14211A]/5 flex items-center justify-between">
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-[#14211A]/30">
                                                    By {blog.author}
                                                </span>
                                                <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-[10px] uppercase tracking-widest">
                                                    Read More
                                                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
