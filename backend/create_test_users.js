const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to create users...');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const createUsers = async () => {
    await connectDB();

    const users = [
        {
            name: 'Admin User',
            email: 'admin@crm.com',
            password: 'password123',
            role: 'Admin'
        },
        {
            name: 'Training User',
            email: 'training@crm.com',
            password: 'password123',
            role: 'Training Team'
        },
        {
            name: 'Marketing User',
            email: 'marketing@crm.com',
            password: 'password123',
            role: 'Marketing Team'
        }
    ];

    try {
        // Delete existing users if they exist to avoid unique constraint errors
        await User.deleteMany({ email: { $in: users.map(u => u.email) } });

        // Insert new users
        // Note: The pre-save hook in User model will hash the passwords
        await User.create(users);

        console.log('✅ 3 Users created successfully with their respective roles:');
        users.forEach(u => console.log(`- ${u.name} (${u.role}): ${u.email} / ${u.password}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating users:', error.message);
        process.exit(1);
    }
};

createUsers();
