import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, UserIcon, ArrowLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Layout } from '../components/Layout';
import { SEO } from '../components/SEO';
import { Blog } from '../types';

export function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/blogs/${id}`)
            .then(res => res.json())
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch blog post:', err);
                setLoading(false);
            });
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="pt-40 pb-24 text-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-4 w-32 bg-[#F8F9F8] mb-8" />
                        <div className="h-16 w-3/4 bg-[#F8F9F8] mb-12" />
                        <div className="grid grid-cols-1 gap-4 w-full max-w-3xl">
                            <div className="h-4 bg-[#F8F9F8]" />
                            <div className="h-4 bg-[#F8F9F8]" />
                            <div className="h-4 bg-[#F8F9F8]" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!blog) {
        return (
            <Layout>
                <div className="pt-40 pb-24 text-center">
                    <h1 className="font-display text-4xl text-[#14211A] mb-8">Post Not Found</h1>
                    <Link to="/blogs" className="text-[#D4AF37] font-bold uppercase tracking-widest text-[10px] hover:text-[#14211A] transition-colors">
                        Back to Insights
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO
                title={blog.title}
                description={blog.content.substring(0, 160) + '...'}
                url={`https://evfarm.in/blogs/${id}`}
                type="article"
                article={{
                }}
            />
            <article className="pt-32 lg:pt-40 pb-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    {/* Navigation/Breadcrumb */}
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-12">
                        <Link to="/" className="hover:text-[#14211A] transition-colors">Home</Link>
                        <ChevronRightIcon className="w-3 h-3" />
                        <Link to="/blogs" className="hover:text-[#14211A] transition-colors">Insights</Link>
                        <ChevronRightIcon className="w-3 h-3" />
                        <span className="text-[#14211A]/40 truncate max-w-[150px]">{blog.title}</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <header className="mb-16">
                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-[#14211A]/30 mb-8">
                                <span className="flex items-center gap-2">
                                    <CalendarIcon className="w-3 h-3" />
                                    {formatDate(blog.createdAt)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <UserIcon className="w-3 h-3" />
                                    {blog.author}
                                </span>
                                {blog.author}
                            </div>
                            <h1 className="font-display text-4xl lg:text-7xl font-medium tracking-tighter text-[#14211A] leading-[1.1]">
                                {blog.title}
                            </h1>
                        </header>

                        <div className="prose prose-base lg:prose-lg prose-forest max-w-none">
                            <div className="text-[#14211A]/70 text-base lg:text-lg leading-relaxed space-y-8 font-light whitespace-pre-wrap">
                                {blog.content}
                            </div>
                        </div>

                        <footer className="mt-20 pt-12 border-t border-[#14211A]/10">
                            <Link
                                to="/blogs"
                                className="inline-flex items-center gap-3 text-[#D4AF37] hover:text-[#14211A] transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#14211A] transition-colors">
                                    <ArrowLeftIcon className="w-4 h-4 group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to All Insights</span>
                            </Link>
                        </footer>
                    </motion.div>
                </div>
            </article>
        </Layout>
    );
}
