const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

dotenv.config({ path: path.join(__dirname, '../.env') });

const permissionsData = [
    // Dashboard
    { name: 'View Dashboard', slug: 'view_dashboard', module: 'Dashboard' },
    
    // Candidates
    { name: 'View Candidates', slug: 'view_candidates', module: 'Marketing' },
    { name: 'Manage Candidates', slug: 'manage_candidates', module: 'Marketing' },
    
    // Vendors
    { name: 'View Vendors', slug: 'view_vendors', module: 'Marketing' },
    { name: 'Manage Vendors', slug: 'manage_vendors', module: 'Marketing' },
    
    // Marketing
    { name: 'View Marketing', slug: 'view_marketing', module: 'Marketing' },
    { name: 'Manage Marketing', slug: 'manage_marketing', module: 'Marketing' },
    
    // Submissions
    { name: 'View Submissions', slug: 'view_submissions', module: 'Marketing' },
    { name: 'Manage Submissions', slug: 'manage_submissions', module: 'Marketing' },
    
    // Training
    { name: 'View Training', slug: 'view_training', module: 'Training' },
    { name: 'Manage Training', slug: 'manage_training', module: 'Training' },
    
    // Mocks
    { name: 'View Mocks', slug: 'view_mocks', module: 'Training' },
    { name: 'Manage Mocks', slug: 'manage_mocks', module: 'Training' },

    // User Management
    { name: 'Manage Users', slug: 'manage_users', module: 'Admin' },
    { name: 'Manage Roles', slug: 'manage_roles', module: 'Admin' },
];

const initDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Initialization...');

        // 1. Create Permissions
        console.log('Creating Permissions...');
        const createdPermissions = [];
        for (const p of permissionsData) {
            let permission = await Permission.findOne({ slug: p.slug });
            if (!permission) {
                permission = await Permission.create(p);
            }
            createdPermissions.push(permission);
        }

        // Helper to get permission IDs by slugs
        const getPIds = (slugManager) => {
            return createdPermissions
                .filter(p => slugManager.includes(p.slug))
                .map(p => p._id);
        };

        // 2. Create Roles
        console.log('Creating Roles...');
        
        // Admin Role
        console.log('Checking Admin Role...');
        let adminRole = await Role.findOne({ name: 'Admin' });
        if (!adminRole) {
            console.log('Creating Admin Role...');
            adminRole = await Role.create({
                name: 'Admin',
                description: 'Full system access',
                permissions: createdPermissions.map(p => p._id)
            });
        }
        console.log('Admin Role Ready.');

        // Training Team Role
        let trainingRole = await Role.findOne({ name: 'Training Team' });
        if (!trainingRole) {
            trainingRole = await Role.create({
                name: 'Training Team',
                description: 'Access to Training and Mocks',
                permissions: getPIds(['view_dashboard', 'view_training', 'manage_training', 'view_mocks', 'manage_mocks'])
            });
        }

        // Marketing Team Role
        let marketingRole = await Role.findOne({ name: 'Marketing Team' });
        if (!marketingRole) {
            marketingRole = await Role.create({
                name: 'Marketing Team',
                description: 'Access to Marketing, Candidates, Vendors, and Submissions',
                permissions: getPIds(['view_dashboard', 'view_candidates', 'manage_candidates', 'view_vendors', 'manage_vendors', 'view_marketing', 'manage_marketing', 'view_submissions', 'manage_submissions'])
            });
        }

        // 3. Migrate Users
        console.log('Migrating Users...');
        // Use direct collection to avoid Mongoose casting errors if role is still a string
        const usersCollection = mongoose.connection.db.collection('users');
        const users = await usersCollection.find({}).toArray();
        
        for (const user of users) {
             // If role is still a string (old system) or invalid ObjectId
             if (typeof user.role === 'string' || !mongoose.Types.ObjectId.isValid(user.role)) {
                let targetRole;
                if (user.role === 'Admin') targetRole = adminRole;
                else if (user.role === 'Training Team') targetRole = trainingRole;
                else targetRole = marketingRole; // Default

                await usersCollection.updateOne(
                    { _id: user._id },
                    { $set: { role: targetRole._id } }
                );
                console.log(`Migrated user ${user.email} to ${targetRole.name} role.`);
             }
        }

        console.log('✅ Initialization and Migration Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during initialization:', error.stack || error);
        process.exit(1);
    }
};

initDB();
