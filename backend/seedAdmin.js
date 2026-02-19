require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const { hashPassword } = require('./utils/auth');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'sandhya';
        const password = 'admin';

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await hashPassword(password);
        await Admin.create({
            name: 'Dhiru Mandal',
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedAdmin();
