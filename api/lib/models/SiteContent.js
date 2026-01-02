const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
    heroTitle: { type: String, default: 'Redefining' },
    heroTitleHighlight: { type: String, default: 'Prestige' },
    heroSubtitle: { type: String, default: "Experience the pinnacle of electric mobility. Handcrafted brilliance meets sustainable innovation for India's most exclusive destinations." },
    heroCta1: { type: String, default: 'EXPLORE THE FLEET' },
    heroCta2: { type: String, default: 'REQUEST PRIVATE CONSULTATION' },
    heroTagline: { type: String, default: 'Elite Transport by EVFARM' },
    // About Section
    aboutTagline: { type: String, default: 'Heritage & Innovation' },
    aboutTitle: { type: String, default: 'Crafted with' },
    aboutTitleHighlight: { type: String, default: 'Excellence' },
    aboutDescription: { type: String, default: 'As a sub-brand of EVFARM India, we bring decades of electric vehicle expertise to the luxury golf cart industry.' },
    aboutStat1Value: { type: String, default: '10+' },
    aboutStat1Label: { type: String, default: 'Years Exp' },
    aboutStat2Value: { type: String, default: '5k+' },
    aboutStat2Label: { type: String, default: 'Vehicles' },
    // Benefits
    benefit1Title: { type: String, default: 'Premium Reliability' },
    benefit1Desc: { type: String, default: 'Engineered for consistent performance across demanding environments.' },
    benefit2Title: { type: String, default: 'Zero Emissions' },
    benefit2Desc: { type: String, default: 'Sustainable luxury that preserves the tranquility of your surroundings.' },
    benefit3Title: { type: String, default: 'Minimal Upkeep' },
    benefit3Desc: { type: String, default: 'Advanced electric powertrains requiring significantly less maintenance.' },
    benefit4Title: { type: String, default: 'Swift Support' },
    benefit4Desc: { type: String, default: 'India-wide service network for specialized on-site technical assistance.' },
    // Use Cases
    useCase1: { type: String, default: 'Gated Communities' },
    useCase2: { type: String, default: 'Eco Resorts' },
    useCase3: { type: String, default: 'Luxury Hotels' },
    useCase4: { type: String, default: 'Elite Campuses' },
    // Models Section
    modelsTagline: { type: String, default: 'The Collection' },
    modelsTitle: { type: String, default: 'Curated' },
    modelsTitleHighlight: { type: String, default: 'Fleet' },
    // Products Page
    productsTitle: { type: String, default: 'Our Premium' },
    productsTitleHighlight: { type: String, default: 'Fleet' },
    productsTagline: { type: String, default: 'The Collection' },
    productsDescription: { type: String, default: 'Discover our curated selection of luxury electric golf carts, each designed to elevate your destination experience.' },
    productsCtaTitle: { type: String, default: "Can't find what you're looking for?" },
    productsCtaDesc: { type: String, default: 'Contact us for custom configurations and bespoke solutions tailored to your needs.' },
    // Blogs Page
    blogsTitle: { type: String, default: 'Latest' },
    blogsTitleHighlight: { type: String, default: 'Insights' },
    blogsDescription: { type: String, default: 'Discover the future of mobility, technical excellence, and sustainable luxury in the world of electric vehicles.' },
    // Get Quote Page
    quoteTitle: { type: String, default: 'Request a' },
    quoteTitleHighlight: { type: String, default: 'Quote' },
    quoteTagline: { type: String, default: "Let's Connect" },
    quoteDescription: { type: String, default: "Tell us about your requirements and we'll craft a personalized solution for your premium transport needs." },
    quoteSuccessTitle: { type: String, default: 'Thank You!' },
    quoteSuccessDesc: { type: String, default: 'Your inquiry has been submitted successfully. Our team will get back to you within 24 hours.' },
    // Footer
    footerTagline: { type: String, default: 'Pioneering Sustainable Mobility for Premium Destinations' },
    footerAddress: { type: String, default: 'Premium Headquarters, Business District, City 400001' },
    footerEmail: { type: String, default: 'contact@evfarm.in' },
    footerPhone: { type: String, default: '+91 98765 43210' },
    footerCopyright: { type: String, default: '© 2024 EVFARM. All rights reserved.' },
    // Social Links
    socialInstagram: { type: String, default: '' },
    socialFacebook: { type: String, default: '' },
    socialLinkedin: { type: String, default: '' },
    socialTwitter: { type: String, default: '' },
    socialYoutube: { type: String, default: '' },
    // Contact
    contactTitle: { type: String, default: 'Begin Your' },
    contactTitleHighlight: { type: String, default: 'Journey' },
    contactDescription: { type: String, default: 'Let us curate the perfect electric mobility solution for your exclusive destination.' },
    // Logo
    siteLogo: { type: String, default: '/logo.png' }
}, { timestamps: true });

siteContentSchema.statics.getContents = async function () {
    let content = await this.findOne();
    if (!content) {
        content = await this.create({});
    }
    return content;
};

module.exports = mongoose.model('SiteContent', siteContentSchema);
