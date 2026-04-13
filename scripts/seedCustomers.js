const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Customer = require('../models/Customer');

dotenv.config({ path: path.join(__dirname, '../.env') });

const names = [
    'Arun Kumar', 'Priya Mani', 'Vignesh Rao', 'Sangeetha S', 'Karthick Raja',
    'Deepa Lakshmi', 'Ramesh Babu', 'Anitha Devi', 'Suresh Kumar', 'Meena Kumari',
    'Vijay Sethu', 'Nandhini R', 'Prakash J', 'Divya Bharathi', 'Saravanan P',
    'Bala Murugan', 'Keerthana V', 'Senthil Nathan', 'Yamuna S', 'Ganesh Moorthy',
    'Chitra G', 'Manoj Balaji', 'Revathi K', 'Hari Prasad', 'Indhumathi M',
    'Prabhu Deva', 'Lakshmi Narayanan', 'Sindhu J', 'Mohan Raj', 'Gayathri T',
    'Sanjai Dutt', 'Nisha Agarwal', 'Gokul Krishna', 'Pavithra S', 'Ajith Kumar',
    'Sneha Latha', 'Dinesh Karthik', 'Swathi Reddy', 'Kamal Hassan', 'Aswini K',
    'Rajesh Khanna', 'Geetha Rani', 'Surya Prakash', 'Malathi S', 'Bharath R',
    'Usha Rani', 'Naveen Kumar', 'Sofia B', 'Jegadeesh T', 'Preethi V'
];

const areas = ['Velachery', 'Adyar', 'T. Nagar', 'Anna Nagar', 'Madipakkam', 'Medavakkam', 'Tambaram', 'Porur', 'Mylapore', 'Saidapet'];
const streets = ['Main Road', 'Gandhi Street', 'Nehru Street', 'Anna Salai', 'Temple Street', 'Lake View Road', 'Park Avenue', 'Station Road'];
const products = ['Energy Aqua Dolphin', 'Energy Aqua Natural', 'Energy Aqua Delphino', 'Energy Aqua Clean Water'];
const occupations = ['IT Professional', 'Teacher', 'Doctor', 'Engineer', 'Business', 'Homemaker', 'Banker', 'Artist'];
const visitTypes = ['Mandatory Service', 'Complaint', 'ACMC Service', 'Breakdown'];
const serviceActions = ['General Service', 'Filter Replacement', 'Membrane Cleaning', 'Pump Repair', 'SMPS Replacement', 'TDS Adjustment'];
const partsList = ['Pre-filter', 'Sediment Filter', 'Carbon Filter', 'RO Membrane', 'Solenoid Valve', 'SMPS', 'Float Valve'];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing dummy data based on our name list to avoid clutter
        console.log('Cleaning up previous dummy records...');
        await Customer.deleteMany({ userName: { $in: names } });

        const dummyCustomers = [];
        const currentYear = new Date().getFullYear(); // 2026
        const startOfYear = new Date(currentYear, 0, 1);
        const today = new Date(); // April 11, 2026
        const timeDiff = today.getTime() - startOfYear.getTime();

        for (let i = 0; i < 50; i++) {
            const name = names[i % names.length];
            const area = areas[Math.floor(Math.random() * areas.length)];
            const street = streets[Math.floor(Math.random() * streets.length)];
            const doorNo = `${Math.floor(Math.random() * 100) + 1}/${Math.floor(Math.random() * 10) + 1}A`;
            const pincode = `600${Math.floor(100 + Math.random() * 900)}`;
            const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
            
            // Random date since Jan 1, 2026
            const randomDate = new Date(startOfYear.getTime() + Math.random() * timeDiff);

            const dob = new Date();
            dob.setFullYear(dob.getFullYear() - (25 + Math.floor(Math.random() * 30)));
            dob.setMonth(Math.floor(Math.random() * 12));
            dob.setDate(Math.floor(Math.random() * 28));

            // Generate 1-2 random service reports
            const serviceReports = [];
            const numServices = Math.floor(Math.random() * 2) + 1; // 1-2 services
            
            for (let j = 0; j < numServices; j++) {
                const serviceDate = new Date(randomDate);
                // Service happened 1-3 months after installation or previous service
                serviceDate.setDate(serviceDate.getDate() + (j + 1) * (30 + Math.floor(Math.random() * 60)));
                
                if (serviceDate < today) {
                    serviceReports.push({
                        visitDate: serviceDate,
                        visitType: j === 0 ? 'Mandatory Service' : visitTypes[Math.floor(Math.random() * visitTypes.length)],
                        tdsRaw: `${400 + Math.floor(Math.random() * 300)}`,
                        tdsTreated: `${30 + Math.floor(Math.random() * 50)}`,
                        workDetails: serviceActions[Math.floor(Math.random() * serviceActions.length)],
                        partsReplaced: Math.random() > 0.4 ? partsList[Math.floor(Math.random() * partsList.length)] : 'None',
                        invoiceNo: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
                        amount: `${Math.floor(500 + Math.random() * 2000)}`,
                        remarks: 'System performing within parameters.'
                    });
                }
            }

            const isACMC = Math.random() > 0.8; // 20% chance for ACMC
            const acmcServiceReports = [];
            if (isACMC) {
                const acmcDate = new Date(randomDate);
                acmcDate.setDate(acmcDate.getDate() + 15); // Start ACMC shortly after install
                
                if (acmcDate < today) {
                    acmcServiceReports.push({
                        visitDate: acmcDate,
                        visitType: 'ACMC Service',
                        tdsRaw: '450',
                        tdsTreated: '45',
                        workDetails: 'Routine ACMC Checkup',
                        partsReplaced: 'None',
                        invoiceNo: `ACMC-${Math.floor(1000 + Math.random() * 9000)}`,
                        amount: '0',
                        remarks: 'Regular contract maintenance.'
                    });
                }
            }

            dummyCustomers.push({
                userName: name,
                mobileNumber: phone,
                email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
                doorNo: doorNo,
                street: street,
                area: area,
                pincode: pincode,
                address: 'PENDING',
                dateOfInstallationOrService: randomDate,
                productNameAndModel: products[Math.floor(Math.random() * products.length)],
                cardNumber: `EC-${202600 + i}`,
                orderNo: `${Math.floor(100000 + Math.random() * 900000)}`,
                type: 'Installation',
                unitSerialNumber: `UNIT-${Math.floor(10000 + Math.random() * 90000)}`,
                occupation: occupations[Math.floor(Math.random() * occupations.length)],
                dob: dob,
                weddingAnniversary: Math.random() > 0.5 ? randomDate : undefined,
                locationLink: `https://maps.google.com/?q=${area}`,
                serviceReports: serviceReports,
                isACMC: isACMC,
                acmcServiceReports: acmcServiceReports
            });
        }

        await Customer.insertMany(dummyCustomers);
        console.log('Successfully seeded 50 dummy customers!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
