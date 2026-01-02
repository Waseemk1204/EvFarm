import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export function Footer() {
    const { content } = useSiteContent();

    const socialLinks = [
        { Icon: Instagram, url: content.socialInstagram, label: 'Instagram' },
        { Icon: Facebook, url: content.socialFacebook, label: 'Facebook' },
        { Icon: Linkedin, url: content.socialLinkedin, label: 'LinkedIn' },
        { Icon: Youtube, url: content.socialYoutube, label: 'YouTube' },
    ].filter(item => item.url);

    return (
        <footer className="bg-[#080A09] text-white pt-24 pb-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 lg:mb-24">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6 lg:mb-8">
                            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                                <img src={content.siteLogo} alt="EVFARM" className="h-16 w-16 lg:h-24 lg:w-24 object-contain rounded-full overflow-hidden" />
                                <span className="font-display text-2xl lg:text-3xl font-bold tracking-wide text-white">EV Farm</span>
                            </Link>
                        </div>
                        <p className="text-white/40 text-lg font-light leading-relaxed max-w-sm mb-8">
                            {content.footerTagline}
                        </p>

                        {/* Social Media Links */}
                        {socialLinks.length > 0 && (
                            <div className="flex gap-4">
                                {socialLinks.map(({ Icon, url, label }) => (
                                    <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-[#D4AF37] transition-all group" aria-label={label}>
                                        <Icon className="w-5 h-5 text-white/60 group-hover:text-[#14211A]" />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Products', href: '/products' },
                                { name: 'Blog & News', href: '/blogs' },
                                { name: 'Get Quote', href: '/get-quote' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link to={item.href} className="text-sm text-white/40 hover:text-white transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] mb-8">Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-sm h-fit">
                                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold uppercase text-white/30 mb-1">Direct Line</span>
                                    <a href={`tel:${content.footerPhone}`} className="text-white/80 hover:text-white transition-colors">{content.footerPhone}</a>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-sm h-fit">
                                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold uppercase text-white/30 mb-1">Inquiries</span>
                                    <a href={`mailto:${content.footerEmail}`} className="text-white/80 hover:text-white transition-colors">{content.footerEmail}</a>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-sm h-fit">
                                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold uppercase text-white/30 mb-1">Headquarters</span>
                                    <span className="text-white/80">{content.footerAddress}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </footer>
    );
}
