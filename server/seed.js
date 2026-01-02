require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Inquiry = require('./models/Inquiry');
const Employee = require('./models/Employee');

const products = [
    {
        name: 'Compact',
        seating: 2,
        tagline: 'Perfect for personal use and quick rounds. Agile, efficient, and elegant.',
        image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?q=80&w=1200',
        speed: '25 km/h',
        range: '60-80 km',
        batteryType: 'Lithium-ion',
        batteryCapacity: '48V 100Ah',
        motorPower: '3 kW',
        chargingTime: '6-8 hours',
        dimensions: '2400 × 1200 × 1800 mm',
        groundClearance: '150 mm',
        features: ['Regenerative braking system', 'LED headlights & taillights', 'Digital instrument cluster', 'Comfortable bucket seats', 'Rear storage compartment', 'USB charging port']
    },
    {
        name: 'Classic',
        seating: 4,
        tagline: 'The perfect balance of comfort and capacity. Ideal for golf courses and resorts.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200',
        speed: '25 km/h',
        range: '70-90 km',
        batteryType: 'Lithium-ion',
        batteryCapacity: '48V 150Ah',
        motorPower: '4 kW',
        chargingTime: '6-8 hours',
        dimensions: '2800 × 1300 × 1900 mm',
        groundClearance: '160 mm',
        features: ['Regenerative braking system', 'LED headlights & taillights', 'Digital instrument cluster', 'Premium cushioned seating', 'Golf bag holder', 'Rain canopy included', 'USB charging ports']
    },
    {
        name: 'Executive',
        seating: 6,
        tagline: 'Spacious luxury for group transport. Perfect for communities and campuses.',
        image: 'https://images.unsplash.com/photo-1593786267440-e3d8b4d71c00?q=80&w=1200',
        speed: '25 km/h',
        range: '60-80 km',
        batteryType: 'Lithium-ion',
        batteryCapacity: '48V 200Ah',
        motorPower: '5 kW',
        chargingTime: '8-10 hours',
        dimensions: '3600 × 1400 × 2000 mm',
        groundClearance: '170 mm',
        features: ['Regenerative braking system', 'LED headlights & taillights', 'Digital instrument cluster', 'Premium bench seating', 'Extended roof coverage', 'Multiple USB ports', 'Rear-facing seats with grab handles', 'Enhanced suspension system']
    }
];

const blogs = [
    {
        title: 'The Future of Green Mobility in India',
        content: 'As India moves towards a more sustainable future, electric personal transport like golf carts are becoming a staple in gated communities and luxury resorts. Our MISSION at EVFARM is to lead this transition with style and performance.',
        author: 'Marketing Team',
        isPublished: true
    },
    {
        title: 'Maintaining Your Lithium-Ion Battery',
        content: 'Lithium-ion batteries are the heart of your EVFARM cart. To maximize longevity, we recommend keeping the charge between 20% and 80% and avoiding extreme temperatures when possible.',
        author: 'Technical Team',
        isPublished: true
    },
    {
        title: 'New Showroom Opening in Bengaluru',
        content: 'We are excited to announce the opening of our flagship experience center in the heart of Bengaluru. Come visit us to test drive the entire fleet and experience sustainable luxury first-hand.',
        author: 'Operations Team',
        isPublished: true
    }
];

const employees = [
    { name: 'Rahul Sharma', role: 'Sales' },
    { name: 'Priya Patel', role: 'Sales' },
    { name: 'Amit Kumar', role: 'Support' }
];

const inquiries = [
    {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        model: 'Executive',
        message: 'Interested in bulk order for our resort. Need 5 units.',
        status: 'new',
        assignedTo: ''
    },
    {
        name: 'Anjali Reddy',
        email: 'anjali@example.com',
        phone: '+91 87654 32109',
        city: 'Bengaluru',
        model: 'Classic',
        message: 'Looking for 2 carts for our farmhouse. What is the delivery timeline?',
        status: 'contacted',
        assignedTo: 'Rahul Sharma'
    },
    {
        name: 'Suresh Menon',
        email: 'suresh@example.com',
        phone: '+91 76543 21098',
        city: 'Chennai',
        model: 'Compact',
        message: 'Want to know about warranty and service options.',
        status: 'new',
        assignedTo: ''
    },
    {
        name: 'Neha Gupta',
        email: 'neha@example.com',
        phone: '+91 65432 10987',
        city: 'Delhi',
        model: 'Executive',
        message: 'Please send pricing details for 8-seater model.',
        status: 'converted',
        assignedTo: 'Priya Patel',
        notes: [{ text: 'Payment received, delivery scheduled for Jan 5', createdAt: new Date() }]
    },
    {
        name: 'Rajesh Iyer',
        email: 'rajesh@example.com',
        phone: '+91 54321 09876',
        city: 'Hyderabad',
        model: 'Classic',
        message: 'Can you arrange a test drive at our location?',
        status: 'contacted',
        assignedTo: 'Amit Kumar'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
        console.log('Connected to MongoDB for seeding...');

        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('✓ Products seeded');

        await Blog.deleteMany({});
        await Blog.insertMany(blogs);
        console.log('✓ Blogs seeded');

        await Employee.deleteMany({});
        await Employee.insertMany(employees);
        console.log('✓ Employees seeded');

        await Inquiry.deleteMany({});
        await Inquiry.insertMany(inquiries);
        console.log('✓ Inquiries seeded');

        console.log('\n✅ All data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
