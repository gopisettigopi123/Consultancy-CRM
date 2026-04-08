const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Role = require('../models/Role');

// Inject env
dotenv.config({ path: path.join(__dirname, '../.env') });

const restoreAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Find or Create Admin Role
        let adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            console.log('Admin role not found. Creating it...');
            adminRole = await Role.create({
                name: 'Admin',
                description: 'Super Administrator with full access'
            });
        }

        // 2. Find or Create Admin User
        const adminEmail = 'admin@crm.com';
        let adminUser = await User.findOne({ email: adminEmail });

        if (adminUser) {
            console.log(`Admin user ${adminEmail} already exists. Updating role...`);
            adminUser.role = adminRole._id;
            await adminUser.save();
        } else {
            console.log(`Creating fresh Admin user: ${adminEmail}`);
            adminUser = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: 'password123', // User should change this immediately
                role: adminRole._id
            });
        }

        console.log('✅ Admin user restored successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log('Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Restoration failed:', error);
        process.exit(1);
    }
};

restoreAdmin();
