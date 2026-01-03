import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Products', href: '/products' },
        { name: 'Blogs', href: '/blogs' },
    ];

    return (
        <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
            <div className="glass-card rounded-full px-6 py-3 md:px-8 md:py-4 flex items-center justify-between shadow-2xl">
                <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
                    <img src="/navbar-logo.png" alt="EVFARM" className="h-10 w-10 md:h-14 md:w-14 object-contain rounded-full overflow-hidden" />
                    <span className="font-display text-lg md:text-xl font-bold tracking-wide text-[#14211A]">EVFARM</span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#14211A] hover:text-[#D4AF37] transition-all"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        to="/get-quote"
                        className="px-6 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase text-white rounded-full bg-[#14211A] hover:bg-[#D4AF37] transition-all shadow-lg"
                    >
                        Get Quote
                    </Link>
                </div>

                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1">
                    {isMobileMenuOpen ? <XIcon className="w-6 h-6 text-[#14211A]" /> : <MenuIcon className="w-6 h-6 text-[#14211A]" />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:hidden mt-4 glass-card rounded-2xl p-6 shadow-2xl">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-bold tracking-widest uppercase text-[#14211A]/70 py-3 block border-b border-[#14211A]/5"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to="/get-quote"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-bold tracking-widest uppercase text-[#D4AF37] py-3 block"
                        >
                            Get Quote
                        </Link>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
