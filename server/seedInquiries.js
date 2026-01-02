require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Inquiry = require('./models/Inquiry');

// Indian first names
const firstNames = [
    'Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Anjali', 'Suresh', 'Kavita',
    'Deepak', 'Pooja', 'Rajesh', 'Sunita', 'Manoj', 'Neha', 'Arun', 'Divya',
    'Sanjay', 'Meera', 'Vijay', 'Rashmi', 'Ashok', 'Swati', 'Kiran', 'Rekha',
    'Mohan', 'Shweta', 'Ramesh', 'Preeti', 'Prakash', 'Anita', 'Sunil', 'Ritu',
    'Ajay', 'Jyoti', 'Naresh', 'Seema', 'Dinesh', 'Aarti', 'Mukesh', 'Nisha',
    'Rohit', 'Vandana', 'Sandeep', 'Komal', 'Gaurav', 'Mamta', 'Nitin', 'Suman',
    'Pankaj', 'Bhavna', 'Rakesh', 'Geeta', 'Yogesh', 'Pallavi', 'Vivek', 'Renu',
    'Anand', 'Shilpa', 'Sachin', 'Archana', 'Hemant', 'Manisha', 'Naveen', 'Sarita'
];

const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Joshi', 'Agarwal',
    'Mishra', 'Reddy', 'Nair', 'Mehta', 'Shah', 'Rao', 'Iyer', 'Pillai',
    'Desai', 'Patil', 'Kulkarni', 'Jain', 'Chaudhary', 'Yadav', 'Thakur', 'Saxena',
    'Tiwari', 'Pandey', 'Dubey', 'Srivastava', 'Kapoor', 'Malhotra', 'Bhatia', 'Chopra'
];

// Indian cities
const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad',
    'Kolkata', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Nagpur', 'Bhopal',
    'Surat', 'Vadodara', 'Kochi', 'Coimbatore', 'Visakhapatnam', 'Gurgaon',
    'Noida', 'Ghaziabad', 'Faridabad', 'Ludhiana', 'Kanpur', 'Nashik', 'Patna',
    'Ranchi', 'Bhubaneswar', 'Thiruvananthapuram', 'Mysore', 'Mangalore'
];

// Golf cart models
const models = [
    'Classic 2-Seater', 'Elite 4-Seater', 'Premium 6-Seater',
    'Sport Edition', 'Luxury Cruiser', 'Compact Mini'
];

// Sample messages
const messages = [
    'Interested in buying for my farmhouse. Please share pricing.',
    'Need a golf cart for our resort. What models do you have?',
    'Looking for a reliable electric vehicle for campus transport.',
    'Saw your ad online. Want to know more about financing options.',
    'We run a hotel and need 3-4 carts. Please send quotation.',
    'Interested in the eco-friendly features. Call me to discuss.',
    'Need a cart for my elderly parents. Easy to operate preferred.',
    'Looking for bulk purchase for our society. 5+ units.',
    'Want to compare with other brands. Share specifications.',
    'Need demo before purchase. When can you arrange?',
    'Urgent requirement for wedding venue. Fast delivery needed.',
    'Interested in custom color options. Is that possible?',
    'Looking for after-sales service guarantee before purchase.',
    'Want EMI options. What banks do you partner with?',
    'Need cart for daily use in gated community. Battery life important.',
    'Saw at exhibition. Following up for detailed quotation.',
    'Referred by friend. Need same model they bought.',
    'Export inquiry - shipping to UAE possible?',
    'Government tender inquiry. Need official documentation.',
    'Temple trust requirement. Special discount for religious org?',
    '',
    'Please call me',
    'Send brochure',
    'Want test drive'
];

// Sales team members (only those with Sales role should be assigned)
const salesTeam = ['Dhananjay', 'Jatin', 'Riya', 'Sangeeta'];

// Note templates
const noteTemplates = [
    'Called customer, no response. Will try again.',
    'Customer interested, requesting brochure via email.',
    'Sent quotation. Follow up in 2 days.',
    'Customer asked for EMI options. Shared finance details.',
    'Scheduled site visit for demo.',
    'Customer comparing with competitors. Price conscious.',
    'Very interested. Decision expected this week.',
    'Customer requested callback after 5 PM.',
    'Sent model comparison sheet.',
    'Customer confirmed purchase. Processing order.',
    'Customer postponed to next month.',
    'Budget constraint. Offered entry-level model.',
    'Customer from reference. Hot lead.',
    'Bulk order discussion initiated.',
    'Test drive completed. Customer satisfied.'
];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
    const prefixes = ['98', '97', '96', '95', '94', '93', '91', '90', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '70'];
    return randomItem(prefixes) + Math.floor(10000000 + Math.random() * 90000000).toString();
}

function randomEmail(firstName, lastName) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];
    const rand = Math.floor(Math.random() * 100);
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${rand}@${randomItem(domains)}`;
}

function randomDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    date.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
}

function generateNotes(count, baseDate) {
    const notes = [];
    let noteDate = new Date(baseDate);
    for (let i = 0; i < count; i++) {
        noteDate = new Date(noteDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000); // 0-2 days after
        if (noteDate > new Date()) noteDate = new Date();
        notes.push({
            text: randomItem(noteTemplates),
            createdAt: noteDate
        });
    }
    return notes;
}

async function seedInquiries() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Clear existing inquiries (optional - comment out to keep existing)
        await Inquiry.deleteMany({});
        console.log('Cleared existing inquiries');

        const inquiries = [];

        for (let i = 0; i < 200; i++) {
            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);
            const createdAt = randomDate(90); // Last 90 days

            // Distribution: 30% new, 35% contacted, 25% converted, 10% rejected
            let status, assignedTo, notes;
            const rand = Math.random();

            if (rand < 0.30) {
                // New inquiries - mostly unassigned
                status = 'new';
                assignedTo = Math.random() < 0.3 ? randomItem(salesTeam) : ''; // 30% claimed
                notes = [];
            } else if (rand < 0.65) {
                // Contacted - all assigned with notes
                status = 'contacted';
                assignedTo = randomItem(salesTeam);
                notes = generateNotes(Math.floor(Math.random() * 3) + 1, createdAt);
            } else if (rand < 0.90) {
                // Converted - successful deals
                status = 'converted';
                assignedTo = randomItem(salesTeam);
                notes = generateNotes(Math.floor(Math.random() * 4) + 2, createdAt);
            } else {
                // Rejected - lost leads
                status = 'rejected';
                assignedTo = randomItem(salesTeam);
                notes = generateNotes(Math.floor(Math.random() * 2) + 1, createdAt);
            }

            inquiries.push({
                name: `${firstName} ${lastName}`,
                email: Math.random() < 0.85 ? randomEmail(firstName, lastName) : '', // 85% have email
                phone: randomPhone(),
                city: randomItem(cities),
                model: Math.random() < 0.75 ? randomItem(models) : '', // 75% specify model
                message: randomItem(messages),
                status,
                assignedTo,
                notes,
                createdAt,
                updatedAt: notes.length > 0 ? notes[notes.length - 1].createdAt : createdAt
            });
        }

        await Inquiry.insertMany(inquiries);
        console.log(`✅ Successfully seeded ${inquiries.length} inquiries`);

        // Summary
        const summary = {
            total: inquiries.length,
            new: inquiries.filter(i => i.status === 'new').length,
            contacted: inquiries.filter(i => i.status === 'contacted').length,
            converted: inquiries.filter(i => i.status === 'converted').length,
            rejected: inquiries.filter(i => i.status === 'rejected').length,
            unassigned: inquiries.filter(i => !i.assignedTo).length,
            byEmployee: {}
        };

        salesTeam.forEach(emp => {
            summary.byEmployee[emp] = inquiries.filter(i => i.assignedTo === emp).length;
        });

        console.log('\n📊 Summary:');
        console.log(`   New: ${summary.new}`);
        console.log(`   Contacted: ${summary.contacted}`);
        console.log(`   Converted: ${summary.converted}`);
        console.log(`   Rejected: ${summary.rejected}`);
        console.log(`   Unassigned: ${summary.unassigned}`);
        console.log('\n👥 By Employee:');
        Object.entries(summary.byEmployee).forEach(([name, count]) => {
            console.log(`   ${name}: ${count}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding inquiries:', error);
        process.exit(1);
    }
}

seedInquiries();
