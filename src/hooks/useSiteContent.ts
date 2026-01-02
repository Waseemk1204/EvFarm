import { useState, useEffect } from 'react';

const API_URL = '/api';

export interface SiteContent {
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    heroCta1: string;
    heroCta2: string;
    heroTagline: string;
    // About Section
    aboutTagline: string;
    aboutTitle: string;
    aboutTitleHighlight: string;
    aboutDescription: string;
    aboutStat1Value: string;
    aboutStat1Label: string;
    aboutStat2Value: string;
    aboutStat2Label: string;
    // Benefits
    benefit1Title: string;
    benefit1Desc: string;
    benefit2Title: string;
    benefit2Desc: string;
    benefit3Title: string;
    benefit3Desc: string;
    benefit4Title: string;
    benefit4Desc: string;
    // Use Cases
    useCase1: string;
    useCase2: string;
    useCase3: string;
    useCase4: string;
    // Models Section
    modelsTagline: string;
    modelsTitle: string;
    modelsTitleHighlight: string;
    // Products Page
    productsTitle: string;
    productsTitleHighlight: string;
    productsTagline: string;
    productsDescription: string;
    productsCtaTitle: string;
    productsCtaDesc: string;
    // Blogs Page
    blogsTitle: string;
    blogsTitleHighlight: string;
    blogsDescription: string;
    // Get Quote Page
    quoteTitle: string;
    quoteTitleHighlight: string;
    quoteTagline: string;
    quoteDescription: string;
    quoteSuccessTitle: string;
    quoteSuccessDesc: string;
    // Footer
    footerTagline: string;
    footerAddress: string;
    footerEmail: string;
    footerPhone: string;
    footerCopyright: string;
    // Social Links
    socialInstagram: string;
    socialFacebook: string;
    socialLinkedin: string;
    socialTwitter: string;
    socialYoutube: string;
    // Contact
    contactTitle: string;
    contactTitleHighlight: string;
    contactDescription: string;
    siteLogo: string;
}

const defaultContent: SiteContent = {
    heroTitle: 'Redefining',
    heroTitleHighlight: 'Luxury',
    heroSubtitle: "Experience the pinnacle of electric mobility. Handcrafted brilliance meets sustainable innovation for India's most exclusive destinations.",
    heroCta1: 'EXPLORE THE FLEET',
    heroCta2: 'REQUEST PRIVATE CONSULTATION',
    heroTagline: 'Choose Future, Choose Electric',
    // About Section
    aboutTagline: 'Heritage & Innovation',
    aboutTitle: 'Crafted with',
    aboutTitleHighlight: 'Excellence',
    aboutDescription: 'EVFARM is an ISO-certified manufacturer of electric vehicles, specializing in electric golf carts and battery-based mobility solutions for institutional and commercial applications. With a focus on quality, customization, and reliability, we deliver efficient electric mobility solutions tailored to Indian operating conditions.',
    aboutStat1Value: '10+',
    aboutStat1Label: 'Years Exp',
    aboutStat2Value: '5k+',
    aboutStat2Label: 'Vehicles',
    // Benefits
    benefit1Title: 'Premium Reliability',
    benefit1Desc: 'Engineered for consistent performance across demanding environments.',
    benefit2Title: 'Zero Emissions',
    benefit2Desc: 'Sustainable luxury that preserves the tranquility of your surroundings.',
    benefit3Title: 'Minimal Upkeep',
    benefit3Desc: 'Advanced electric powertrains requiring significantly less maintenance.',
    benefit4Title: 'Swift Support',
    benefit4Desc: 'India-wide service network for specialized on-site technical assistance.',
    // Use Cases
    useCase1: 'Gated Communities',
    useCase2: 'Eco Resorts',
    useCase3: 'Luxury Hotels',
    useCase4: 'Elite Campuses',
    // Models Section
    modelsTagline: 'The Collection',
    modelsTitle: 'Curated',
    modelsTitleHighlight: 'Fleet',
    // Products Page
    productsTitle: 'Our Premium',
    productsTitleHighlight: 'Fleet',
    productsTagline: 'The Collection',
    productsDescription: 'Discover our curated selection of luxury electric golf carts, each designed to elevate your destination experience.',
    productsCtaTitle: "Can't find what you're looking for?",
    productsCtaDesc: 'Contact us for custom configurations and bespoke solutions tailored to your needs.',
    // Blogs Page
    blogsTitle: 'Latest',
    blogsTitleHighlight: 'Insights',
    blogsDescription: 'Discover the future of mobility, technical excellence, and sustainable luxury in the world of electric vehicles.',
    // Get Quote Page
    quoteTitle: 'Request a',
    quoteTitleHighlight: 'Quote',
    quoteTagline: "Let's Connect",
    quoteDescription: "Tell us about your requirements and we'll craft a personalized solution for your premium transport needs.",
    quoteSuccessTitle: 'Thank You!',
    quoteSuccessDesc: 'Your inquiry has been submitted successfully. Our team will get back to you within 24 hours.',
    // Footer
    footerTagline: 'Pioneering Sustainable Mobility for Premium Destinations',
    footerAddress: 'Premium Headquarters, Business District, City 400001',
    footerEmail: 'contact@evfarm.in',
    footerPhone: '+91 98765 43210',
    footerCopyright: '© 2024 EVFARM. All rights reserved.',
    // Social Links
    socialInstagram: '',
    socialFacebook: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialYoutube: '',
    // Contact
    contactTitle: 'Begin Your',
    contactTitleHighlight: 'Journey',
    contactDescription: 'Let us curate the perfect electric mobility solution for your exclusive destination.',
    siteLogo: '/logo.png'
};

export function useSiteContent() {
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/site-content`)
            .then(res => res.json())
            .then(data => {
                setContent({ ...defaultContent, ...data });
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch site content:', err);
                setLoading(false);
            });
    }, []);

    return { content, loading };
}

