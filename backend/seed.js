const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// ========== MODELS ==========
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, role: String }, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', userSchema);

const candidateSchema = new mongoose.Schema({
    fullName: String, email: { type: String, unique: true }, phoneNumber: String, whatsappNumber: String,
    technology: String, experience: Number, resumeUrl: String, linkedinProfile: String,
    location: String, drivingLicense: [String]
}, { timestamps: true });
const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);

const trainingSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    batchName: String, firstSession: Date, secondSession: Date,
    mockGiven: Boolean, movedToCallTraining: Boolean, finalMock: Boolean,
    marks: String, notes: String
}, { timestamps: true });
const Training = mongoose.models.Training || mongoose.model('Training', trainingSchema);

const mockSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    mockType: String, score: Number, feedback: String, date: Date, status: String
}, { timestamps: true });
const MockInterview = mongoose.models.MockInterview || mongoose.model('MockInterview', mockSchema);

const marketingSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    marketingStartDate: Date, marketingEmailId: String,
    vendorSubmissionCount: Number, notes: String
}, { timestamps: true });
const Marketing = mongoose.models.Marketing || mongoose.model('Marketing', marketingSchema);

const vendorSchema = new mongoose.Schema({
    vendorName: String, technology: String, location: String, rate: String,
    vendorCompany: String, email: String, client: String
}, { timestamps: true });
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

const submissionSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    clientName: String, submissionDate: Date, rate: Number, status: String
}, { timestamps: true });
const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

// ========== SEED ==========
const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...\n');

    // --- Users ---
    const adminExists = await User.findOne({ email: 'admin@crm.com' });
    if (!adminExists) {
        await User.create({ name: 'Super Admin', email: 'admin@crm.com', password: await bcrypt.hash('Admin@123', 10), role: 'Admin' });
    }
    await User.findOneAndUpdate({ email: 'trainer@crm.com' }, { name: 'Alice Trainer', email: 'trainer@crm.com', password: await bcrypt.hash('Trainer@123', 10), role: 'Training Team' }, { upsert: true });
    await User.findOneAndUpdate({ email: 'marketing@crm.com' }, { name: 'Bob Marketer', email: 'marketing@crm.com', password: await bcrypt.hash('Marketing@123', 10), role: 'Marketing Team' }, { upsert: true });
    console.log('✅ Users seeded');

    // --- Candidates ---
    await Candidate.deleteMany({});
    const candidateData = [
        { fullName: 'Ravi Kumar',   email: 'ravi.kumar@email.com',   phoneNumber: '+1-555-101-0001', whatsappNumber: '+15551010001', technology: 'Java',         experience: 3, location: 'NJ', drivingLicense: ['NJ', 'NY'], linkedinProfile: 'https://linkedin.com/in/ravikumar' },
        { fullName: 'Priya Sharma', email: 'priya.sharma@email.com', phoneNumber: '+1-555-101-0002', whatsappNumber: '+15551010002', technology: 'Python',       experience: 2, location: 'IL', drivingLicense: [],           linkedinProfile: 'https://linkedin.com/in/priyasharma' },
        { fullName: 'Arjun Patel',  email: 'arjun.patel@email.com',  phoneNumber: '+1-555-101-0003', whatsappNumber: '+15551010003', technology: 'React',        experience: 4, location: 'TX', drivingLicense: ['TX'],       linkedinProfile: 'https://linkedin.com/in/arjunpatel' },
        { fullName: 'Sneha Reddy',  email: 'sneha.reddy@email.com',  phoneNumber: '+1-555-101-0004', whatsappNumber: '+15551010004', technology: 'Java',         experience: 5, location: 'CA', drivingLicense: ['CA', 'OR'], linkedinProfile: 'https://linkedin.com/in/snehareddy' },
        { fullName: 'Kiran Verma',  email: 'kiran.verma@email.com',  phoneNumber: '+1-555-101-0005', whatsappNumber: '+15551010005', technology: '.NET',         experience: 3, location: 'TX', drivingLicense: ['FL', 'TX'], linkedinProfile: 'https://linkedin.com/in/kiranverma' },
        { fullName: 'Neha Singh',   email: 'neha.singh@email.com',   phoneNumber: '+1-555-101-0006', whatsappNumber: '+15551010006', technology: 'Python',       experience: 6, location: 'WA', drivingLicense: ['WA'],       linkedinProfile: 'https://linkedin.com/in/nehasingh' },
        { fullName: 'Rahul Gupta',  email: 'rahul.gupta@email.com',  phoneNumber: '+1-555-101-0007', whatsappNumber: '+15551010007', technology: 'DevOps',       experience: 4, location: 'NY', drivingLicense: [],           linkedinProfile: 'https://linkedin.com/in/rahulgupta' },
        { fullName: 'Ananya Bose',  email: 'ananya.bose@email.com',  phoneNumber: '+1-555-101-0008', whatsappNumber: '+15551010008', technology: 'Data Science', experience: 2, location: 'MA', drivingLicense: ['MA', 'NH'], linkedinProfile: 'https://linkedin.com/in/ananyabose' },
        { fullName: 'Vikram Nair',  email: 'vikram.nair@email.com',  phoneNumber: '+1-555-101-0009', whatsappNumber: '+15551010009', technology: 'React',        experience: 3, location: 'GA', drivingLicense: [],           linkedinProfile: 'https://linkedin.com/in/vikramnair' },
        { fullName: 'Tanvi Mehta',  email: 'tanvi.mehta@email.com',  phoneNumber: '+1-555-101-0010', whatsappNumber: '+15551010010', technology: 'Angular',      experience: 2, location: 'AZ', drivingLicense: ['MO', 'KS'], linkedinProfile: 'https://linkedin.com/in/tanvimehta' },
        { fullName: 'Suresh Das',   email: 'suresh.das@email.com',   phoneNumber: '+1-555-101-0011', whatsappNumber: '+15551010011', technology: 'Java',         experience: 7, location: 'NC', drivingLicense: ['NC', 'SC'], linkedinProfile: 'https://linkedin.com/in/sureshdas' },
        { fullName: 'Meena Pillai', email: 'meena.pillai@email.com', phoneNumber: '+1-555-101-0012', whatsappNumber: '+15551010012', technology: 'QA',           experience: 3, location: 'TX', drivingLicense: ['MS'],       linkedinProfile: 'https://linkedin.com/in/meenapillai' },
    ];
    const candidates = await Candidate.insertMany(candidateData);
    console.log(`✅ ${candidates.length} Candidates seeded`);

    // --- Vendors ---
    await Vendor.deleteMany({});
    const vendorData = [
        { vendorName: 'James Wilson', vendorCompany: 'TechBridge Solutions', email: 'james@techbridge.com', technology: 'Java', location: 'New York, NY', rate: '$55/hr', client: 'Bank of America' },
        { vendorName: 'Sarah Connor', vendorCompany: 'Apex Staffing LLC', email: 'sarah@apexstaff.com', technology: 'React', location: 'Austin, TX', rate: '$60/hr', client: 'Walmart Labs' },
        { vendorName: 'Michael Davis', vendorCompany: 'DataForce Inc.', email: 'michael@dataforce.com', technology: 'Data Science', location: 'San Jose, CA', rate: '$65/hr', client: 'Apple' },
        { vendorName: 'Preethi Rao', vendorCompany: 'CloudLink Corp', email: 'preethi@cloudlink.com', technology: 'DevOps', location: 'Seattle, WA', rate: '$70/hr', client: 'Microsoft' },
        { vendorName: 'QualityFirst Staffing', vendorCompany: 'QualityFirst Staffing', email: 'tony@qualityfirst.com', technology: 'QA', location: 'Chicago, IL', rate: '$45/hr', client: 'United Airlines' },
    ];
    const vendors = await Vendor.insertMany(vendorData);
    console.log(`✅ ${vendors.length} Vendors seeded`);

    // --- Training ---
    await Training.deleteMany({});
    const trainingData = [
        { candidate: candidates[0]._id, batchName: 'Java Batch A - Q1 2025', firstSession: new Date('2025-01-06'), secondSession: new Date('2025-01-20'), mockGiven: true, movedToCallTraining: true, finalMock: false, marks: '85/100', notes: 'Quick learner.' },
        { candidate: candidates[1]._id, batchName: 'Python Batch B - Q1 2025', firstSession: new Date('2025-01-13'), secondSession: null, mockGiven: false, movedToCallTraining: false, finalMock: false, marks: 'Pending', notes: 'Needs more work.' },
        { candidate: candidates[2]._id, batchName: 'React Batch A - Q1 2025', firstSession: new Date('2025-01-20'), secondSession: new Date('2025-02-14'), mockGiven: true, movedToCallTraining: true, finalMock: true, marks: '92/100', notes: 'Excellent frontend skills.' },
        { candidate: candidates[3]._id, batchName: 'Java Batch A - Q1 2025', firstSession: new Date('2025-01-06'), secondSession: new Date('2025-01-20'), mockGiven: true, movedToCallTraining: true, finalMock: true, marks: '95/100', notes: 'Top performer in the batch.' },
        { candidate: candidates[9]._id, batchName: 'Angular Batch C - Q2 2025', firstSession: new Date('2025-04-01'), secondSession: null, mockGiven: false, movedToCallTraining: false, finalMock: false, marks: '', notes: 'Currently in progress.' },
        { candidate: candidates[10]._id, batchName: 'Java Batch B - Q2 2025', firstSession: new Date('2025-03-03'), secondSession: new Date('2025-03-15'), mockGiven: true, movedToCallTraining: false, finalMock: false, marks: '88/100', notes: 'Senior profile.' },
    ];
    await Training.insertMany(trainingData);
    console.log(`✅ ${trainingData.length} Training records seeded`);

    // --- Mock Interviews ---
    await MockInterview.deleteMany({});
    const mockData = [
        { candidate: candidates[2]._id, mockType: 'Technical', score: 8, feedback: 'Strong React knowledge. Handle edge cases better in hooks. Redux implementation was solid.', date: new Date('2025-03-20'), status: 'Pass' },
        { candidate: candidates[3]._id, mockType: 'Technical', score: 9, feedback: 'Excellent Java and Spring Boot knowledge. Microservices design was impressive.', date: new Date('2025-03-10'), status: 'Pass' },
        { candidate: candidates[3]._id, mockType: 'Final', score: 9, feedback: 'Outstanding communication and problem-solving. Ready for client interviews.', date: new Date('2025-03-25'), status: 'Pass' },
        { candidate: candidates[1]._id, mockType: 'Technical', score: 6, feedback: 'Good Python fundamentals but struggled with async and concurrency. Needs more practice.', date: new Date('2025-03-15'), status: 'Fail' },
        { candidate: candidates[4]._id, mockType: 'Technical', score: 7, feedback: 'Solid .NET background. Need to improve on Azure cloud concepts.', date: new Date('2025-03-12'), status: 'Pass' },
        { candidate: candidates[4]._id, mockType: 'Final', score: 8, feedback: 'Good communication, handles pressure well. Ready for marketing.', date: new Date('2025-03-28'), status: 'Pass' },
        { candidate: candidates[6]._id, mockType: 'Technical', score: 9, feedback: 'DevOps expertise is top-notch. CI/CD, Kubernetes, and Docker all excellent.', date: new Date('2025-03-05'), status: 'Pass' },
        { candidate: candidates[6]._id, mockType: 'Final', score: 8, feedback: 'Articulate and confident. Vendor interview performance will be strong.', date: new Date('2025-03-22'), status: 'Pass' },
        { candidate: candidates[8]._id, mockType: 'Technical', score: 5, feedback: 'React knowledge is surface-level. Rejected after technical round.', date: new Date('2025-02-28'), status: 'Fail' },
        { candidate: candidates[11]._id, mockType: 'Technical', score: 7, feedback: 'Good automation skills with Selenium. Strengthen API testing knowledge.', date: new Date('2025-04-02'), status: 'Pass' },
    ];
    await MockInterview.insertMany(mockData);
    console.log(`✅ ${mockData.length} Mock Interview records seeded`);

    // --- Marketing ---
    await Marketing.deleteMany({});
    const marketingData = [
        { candidate: candidates[4]._id, marketingStartDate: new Date('2025-04-01'), marketingEmailId: 'mkt.kiran@crm-agency.com', vendorSubmissionCount: 12, notes: 'Active submissions. Strong .NET profile. Multiple interview calls received.' },
        { candidate: candidates[5]._id, marketingStartDate: new Date('2025-03-15'), marketingEmailId: 'mkt.neha@crm-agency.com', vendorSubmissionCount: 20, notes: 'High demand Python profile. Received 3 interview calls this week.' },
        { candidate: candidates[10]._id, marketingStartDate: new Date('2025-05-01'), marketingEmailId: 'mkt.suresh@crm-agency.com', vendorSubmissionCount: 8, notes: 'Senior Java profile. Targeting $75/hr+ contracts.' },
        { candidate: candidates[11]._id, marketingStartDate: new Date('2025-04-15'), marketingEmailId: 'mkt.meena@crm-agency.com', vendorSubmissionCount: 6, notes: 'QA automation candidate. Targeting healthcare clients.' },
    ];
    await Marketing.insertMany(marketingData);
    console.log(`✅ ${marketingData.length} Marketing records seeded`);

    // --- Submissions ---
    await Submission.deleteMany({});
    const submissionData = [
        { candidate: candidates[5]._id, vendor: vendors[0]._id, clientName: 'JP Morgan Chase', submissionDate: new Date('2025-04-05'), rate: 70, status: 'Interview Scheduled' },
        { candidate: candidates[5]._id, vendor: vendors[2]._id, clientName: 'Amazon Web Services', submissionDate: new Date('2025-04-10'), rate: 75, status: 'Submitted' },
        { candidate: candidates[6]._id, vendor: vendors[3]._id, clientName: 'Microsoft Azure Team', submissionDate: new Date('2025-04-08'), rate: 85, status: 'Interview Scheduled' },
        { candidate: candidates[7]._id, vendor: vendors[2]._id, clientName: 'Google DeepMind', submissionDate: new Date('2025-03-28'), rate: 90, status: 'Selected' },
        { candidate: candidates[8]._id, vendor: vendors[1]._id, clientName: 'Infosys BPO', submissionDate: new Date('2025-03-20'), rate: 55, status: 'Rejected' },
        { candidate: candidates[4]._id, vendor: vendors[3]._id, clientName: 'Wells Fargo', submissionDate: new Date('2025-04-12'), rate: 72, status: 'Submitted' },
        { candidate: candidates[10]._id, vendor: vendors[0]._id, clientName: 'Citi Bank', submissionDate: new Date('2025-05-03'), rate: 80, status: 'Submitted' },
        { candidate: candidates[11]._id, vendor: vendors[4]._id, clientName: 'UnitedHealth Group', submissionDate: new Date('2025-04-18'), rate: 65, status: 'Interview Scheduled' },
    ];
    await Submission.insertMany(submissionData);
    console.log(`✅ ${submissionData.length} Submissions seeded`);

    console.log('\n========================================');
    console.log('🎉 All mock data seeded successfully!');
    console.log('========================================');
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin     → admin@crm.com       / Admin@123');
    console.log('   Training  → trainer@crm.com     / Trainer@123');
    console.log('   Marketing → marketing@crm.com   / Marketing@123');
    console.log('========================================\n');

    await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
